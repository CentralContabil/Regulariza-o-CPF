import Stripe from 'stripe'
import { prisma } from '@/lib/prisma'
import { NotFoundError, ValidationError } from '@/lib/errors'

export class PaymentService {
  private static stripe: Stripe

  /**
   * Inicializa cliente Stripe
   */
  private static getStripe(): Stripe {
    if (!this.stripe) {
      const secretKey = process.env.STRIPE_SECRET_KEY
      if (!secretKey) {
        throw new Error('STRIPE_SECRET_KEY não configurada')
      }
      this.stripe = new Stripe(secretKey, {
        apiVersion: '2025-12-15.clover',
      })
    }
    return this.stripe
  }

  /**
   * Cria sessão de checkout para uma proposta
   */
  static async criarCheckoutSession(propostaId: string): Promise<string> {
    const proposta = await prisma.proposta.findUnique({
      where: { id: propostaId },
      include: {
        cliente: true,
      },
    })

    if (!proposta) {
      throw new NotFoundError('Proposta')
    }

    if (proposta.status !== 'aprovada') {
      throw new ValidationError('Proposta deve estar aprovada para pagamento')
    }

    const stripe = this.getStripe()

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'brl',
            product_data: {
              name: `Proposta - ${proposta.tipo}`,
              description: proposta.descricao,
            },
            unit_amount: Math.round(proposta.valor.toNumber() * 100), // Converter para centavos
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/pagamento/sucesso?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/pagamento/cancelado`,
      customer_email: proposta.cliente.email,
      metadata: {
        propostaId: proposta.id,
        clienteId: proposta.clienteId,
      },
    })

    return session.url || ''
  }

  /**
   * Processa webhook do Stripe
   */
  static async processarWebhook(
    payload: string,
    signature: string
  ): Promise<void> {
    const stripe = this.getStripe()
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

    if (!webhookSecret) {
      throw new Error('STRIPE_WEBHOOK_SECRET não configurada')
    }

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(payload, signature, webhookSecret)
    } catch (err: any) {
      console.error('Erro ao verificar webhook:', err.message)
      throw new Error(`Webhook signature verification failed: ${err.message}`)
    }

    // Processar diferentes tipos de eventos
    switch (event.type) {
      case 'checkout.session.completed':
        await this.handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session)
        break

      case 'payment_intent.succeeded':
        await this.handlePaymentSucceeded(event.data.object as Stripe.PaymentIntent)
        break

      case 'payment_intent.payment_failed':
        await this.handlePaymentFailed(event.data.object as Stripe.PaymentIntent)
        break

      case 'charge.refunded':
        await this.handleChargeRefunded(event.data.object as Stripe.Charge)
        break

      default:
        console.log(`Evento não tratado: ${event.type}`)
    }
  }

  /**
   * Processa checkout completado
   */
  private static async handleCheckoutCompleted(
    session: Stripe.Checkout.Session
  ): Promise<void> {
    const propostaId = session.metadata?.propostaId

    if (!propostaId) {
      console.error('PropostaId não encontrado no metadata da sessão')
      return
    }

    const proposta = await prisma.proposta.findUnique({
      where: { id: propostaId },
    })

    if (!proposta) {
      console.error(`Proposta ${propostaId} não encontrada`)
      return
    }

    // Criar registro de pagamento
    await prisma.pagamento.create({
      data: {
        propostaId,
        valor: session.amount_total ? session.amount_total / 100 : proposta.valor,
        status: 'aprovado',
        metodo: 'stripe',
        transactionId: session.id,
        metadata: {
          sessionId: session.id,
          customerEmail: session.customer_email,
        } as any,
      },
    })

    // Atualizar proposta
    await prisma.proposta.update({
      where: { id: propostaId },
      data: {
        status: 'aprovada',
        aprovadaEm: new Date(),
      },
    })
  }

  /**
   * Processa pagamento bem-sucedido
   */
  private static async handlePaymentSucceeded(
    paymentIntent: Stripe.PaymentIntent
  ): Promise<void> {
    // Buscar pagamento existente ou criar novo
    const pagamento = await prisma.pagamento.findFirst({
      where: { transactionId: paymentIntent.id },
    })

    if (pagamento) {
      await prisma.pagamento.update({
        where: { id: pagamento.id },
        data: {
          status: 'aprovado',
        },
      })
    }
  }

  /**
   * Processa pagamento falhado
   */
  private static async handlePaymentFailed(
    paymentIntent: Stripe.PaymentIntent
  ): Promise<void> {
    const pagamento = await prisma.pagamento.findFirst({
      where: { transactionId: paymentIntent.id },
    })

    if (pagamento) {
      await prisma.pagamento.update({
        where: { id: pagamento.id },
        data: {
          status: 'recusado',
        },
      })
    }
  }

  /**
   * Processa reembolso
   */
  private static async handleChargeRefunded(
    charge: Stripe.Charge
  ): Promise<void> {
    const pagamento = await prisma.pagamento.findFirst({
      where: { transactionId: charge.payment_intent as string },
    })

    if (pagamento) {
      await prisma.pagamento.update({
        where: { id: pagamento.id },
        data: {
          status: 'reembolsado',
        },
      })
    }
  }

  /**
   * Busca pagamento por ID
   */
  static async buscarPagamentoPorId(id: string) {
    const pagamento = await prisma.pagamento.findUnique({
      where: { id },
      include: {
        proposta: {
          include: {
            cliente: {
              select: {
                id: true,
                nomeCompleto: true,
                email: true,
              },
            },
          },
        },
      },
    })

    if (!pagamento) {
      throw new NotFoundError('Pagamento')
    }

    return pagamento
  }

  /**
   * Lista pagamentos com filtros
   */
  static async listarPagamentos(params: {
    page?: number
    limit?: number
    propostaId?: string
    status?: string
  }) {
    const page = params.page || 1
    const limit = params.limit || 20
    const skip = (page - 1) * limit

    const where: any = {}

    if (params.propostaId) {
      where.propostaId = params.propostaId
    }

    if (params.status) {
      where.status = params.status
    }

    const [pagamentos, total] = await Promise.all([
      prisma.pagamento.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          proposta: {
            select: {
              id: true,
              tipo: true,
              cliente: {
                select: {
                  id: true,
                  nomeCompleto: true,
                },
              },
            },
          },
        },
      }),
      prisma.pagamento.count({ where }),
    ])

    return {
      pagamentos,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    }
  }

  /**
   * Cria reembolso
   */
  static async criarReembolso(pagamentoId: string, valor?: number) {
    const pagamento = await prisma.pagamento.findUnique({
      where: { id: pagamentoId },
    })

    if (!pagamento) {
      throw new NotFoundError('Pagamento')
    }

    if (!pagamento.transactionId) {
      throw new ValidationError('Pagamento não possui transactionId')
    }

    const stripe = this.getStripe()

    try {
      // Buscar charge do Stripe
      const charges = await stripe.charges.list({
        payment_intent: pagamento.transactionId,
        limit: 1,
      })

      if (charges.data.length === 0) {
        throw new ValidationError('Charge não encontrado no Stripe')
      }

      const charge = charges.data[0]

      // Criar reembolso
      const refund = await stripe.refunds.create({
        charge: charge.id,
        amount: valor ? Math.round(valor * 100) : undefined, // Reembolso parcial ou total
      })

      // Atualizar pagamento
      await prisma.pagamento.update({
        where: { id: pagamentoId },
        data: {
          status: 'reembolsado',
          metadata: {
            ...(pagamento.metadata as any),
            refundId: refund.id,
          } as any,
        },
      })

      return refund
    } catch (error: any) {
      console.error('Erro ao criar reembolso:', error)
      throw error
    }
  }

  /**
   * Calcula métricas de inadimplência
   */
  static async calcularInadimplencia() {
    const totalPropostas = await prisma.proposta.count({
      where: { status: 'aprovada' },
    })

    const pagamentosPendentes = await prisma.pagamento.count({
      where: {
        status: 'pendente',
        createdAt: {
          lt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Mais de 7 dias
        },
      },
    })

    const pagamentosRecusados = await prisma.pagamento.count({
      where: { status: 'recusado' },
    })

    const totalReceita = await prisma.pagamento.aggregate({
      where: { status: 'aprovado' },
      _sum: { valor: true },
    })

    return {
      totalPropostas,
      pagamentosPendentes,
      pagamentosRecusados,
      taxaInadimplencia: totalPropostas > 0 
        ? ((pagamentosPendentes + pagamentosRecusados) / totalPropostas) * 100 
        : 0,
      totalReceita: totalReceita._sum.valor || 0,
    }
  }
}

