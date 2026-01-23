import { prisma } from '@/lib/prisma'
import { NotFoundError, ValidationError } from '@/lib/errors'
// DiagnosticoAutomaticoService não é usado neste arquivo
import { EmailService } from './EmailService'
import { WhatsAppService } from './WhatsAppService'

export interface CreatePropostaData {
  clienteId: string
  tipo: 'diagnostico' | 'regularizacao' | 'rotina-anual'
  descricao: string
  valor: number
  classificacaoCaso?: string
}

export interface UpdatePropostaData {
  status?: string
  descricao?: string
  valor?: number
}

export interface PropostaTemplate {
  titulo: string
  descricao: string
  servicos: string[]
  valor: number
  prazo: string
  garantias?: string[]
}

export class PropostaService {
  /**
   * Gera proposta baseada no tipo de caso
   */
  static async gerarProposta(
    clienteId: string,
    tipoCaso: string
  ): Promise<PropostaTemplate> {
    const templates: Record<string, PropostaTemplate> = {
      'cpf-irregular': {
        titulo: 'Regularização de CPF',
        descricao:
          'Pacote completo para regularização cadastral do CPF junto à Receita Federal',
        servicos: [
          'Diagnóstico completo da situação',
          'Verificação na Receita Federal',
          'Preparação de documentação',
          'Envio e acompanhamento na RFB',
          'Documentação comprobatória',
        ],
        valor: 1500.0,
        prazo: '4-8 semanas',
        garantias: [
          'Acompanhamento até regularização',
          'Suporte durante todo o processo',
        ],
      },
      'ir-atrasado': {
        titulo: 'Regularização de IRPF',
        descricao:
          'Entrega e/ou retificação dos últimos 5 exercícios de Imposto de Renda',
        servicos: [
          'Análise dos exercícios pendentes',
          'Preparação das declarações',
          'Revisão de cálculos',
          'Entrega à Receita Federal',
          'Acompanhamento e retificações (se necessário)',
        ],
        valor: 2000.0,
        prazo: '6-12 semanas',
        garantias: [
          'Revisão incluída',
          'Retificações sem custo adicional (se necessário)',
        ],
      },
      'saida-definitiva': {
        titulo: 'Comunicação de Saída Definitiva',
        descricao:
          'Orientação e comunicação de Saída Definitiva do Brasil à Receita Federal',
        servicos: [
          'Avaliação da necessidade',
          'Preparação de documentação',
          'Comunicação à Receita Federal',
          'Acompanhamento do processamento',
          'Orientação sobre implicações fiscais',
        ],
        valor: 1200.0,
        prazo: '3-6 semanas',
        garantias: [
          'Orientação completa',
          'Acompanhamento até conclusão',
        ],
      },
      geral: {
        titulo: 'Pacote Completo de Regularização',
        descricao:
          'Solução completa para regularização fiscal incluindo CPF, IRPF e orientações',
        servicos: [
          'Diagnóstico completo',
          'Regularização de CPF',
          'Entrega de IRPF (últimos 5 anos)',
          'Orientação sobre Saída Definitiva',
          'Acompanhamento completo',
        ],
        valor: 3500.0,
        prazo: '8-16 semanas',
        garantias: [
          'Acompanhamento completo',
          'Suporte durante todo o processo',
        ],
      },
    }

    return templates[tipoCaso] || templates.geral
  }

  /**
   * Cria uma nova proposta
   */
  static async criar(data: CreatePropostaData) {
    // Verificar se cliente existe
    const cliente = await prisma.cliente.findUnique({
      where: { id: data.clienteId },
    })

    if (!cliente) {
      throw new NotFoundError('Cliente')
    }

    // Se não especificou valor, gerar baseado no tipo
    let valor = data.valor
    if (!valor && data.classificacaoCaso) {
      const template = await this.gerarProposta(
        data.clienteId,
        data.classificacaoCaso
      )
      valor = template.valor
    }

    if (!valor) {
      throw new ValidationError('Valor é obrigatório')
    }

    return await prisma.proposta.create({
      data: {
        clienteId: data.clienteId,
        tipo: data.tipo,
        descricao: data.descricao,
        valor,
        status: 'pendente',
      },
    })
  }

  /**
   * Busca proposta por ID
   */
  static async buscarPorId(id: string) {
    const proposta = await prisma.proposta.findUnique({
      where: { id },
      include: {
        cliente: {
          select: {
            id: true,
            nomeCompleto: true,
            email: true,
            whatsapp: true,
          },
        },
        pagamentos: {
          orderBy: { createdAt: 'desc' },
        },
      },
    })

    if (!proposta) {
      throw new NotFoundError('Proposta')
    }

    return proposta
  }

  /**
   * Lista propostas com filtros
   */
  static async listar(params: {
    page?: number
    limit?: number
    clienteId?: string
    tipo?: string
    status?: string
  }) {
    const page = params.page || 1
    const limit = params.limit || 20
    const skip = (page - 1) * limit

    const where: any = {}

    if (params.clienteId) {
      where.clienteId = params.clienteId
    }

    if (params.tipo) {
      where.tipo = params.tipo
    }

    if (params.status) {
      where.status = params.status
    }

    const [propostas, total] = await Promise.all([
      prisma.proposta.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          cliente: {
            select: {
              id: true,
              nomeCompleto: true,
              email: true,
            },
          },
        },
      }),
      prisma.proposta.count({ where }),
    ])

    return {
      propostas,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    }
  }

  /**
   * Atualiza uma proposta
   */
  static async atualizar(id: string, data: UpdatePropostaData) {
    const proposta = await prisma.proposta.findUnique({
      where: { id },
    })

    if (!proposta) {
      throw new NotFoundError('Proposta')
    }

    return await prisma.proposta.update({
      where: { id },
      data,
    })
  }

  /**
   * Aprova uma proposta
   */
  static async aprovar(id: string) {
    const proposta = await prisma.proposta.findUnique({
      where: { id },
      include: {
        cliente: true,
      },
    })

    if (!proposta) {
      throw new NotFoundError('Proposta')
    }

    const propostaAtualizada = await prisma.proposta.update({
      where: { id },
      data: {
        status: 'aprovada',
        aprovadaEm: new Date(),
      },
    })

    // Notificar cliente
    try {
      await EmailService.enviarEmail(
        proposta.cliente.email,
        'Proposta Aprovada - Brazilian Relax',
        `
        <h2>Olá ${proposta.cliente.nomeCompleto}!</h2>
        <p>Sua proposta foi aprovada!</p>
        <p><strong>Tipo:</strong> ${proposta.tipo}</p>
        <p><strong>Valor:</strong> R$ ${proposta.valor.toFixed(2)}</p>
        <p>Em breve entraremos em contato para os próximos passos.</p>
        `
      )
    } catch (error) {
      console.error('Erro ao enviar email de aprovação:', error)
    }

    return propostaAtualizada
  }

  /**
   * Envia proposta por email
   */
  static async enviarPorEmail(propostaId: string): Promise<void> {
    const proposta = await this.buscarPorId(propostaId)
    const cliente = proposta.cliente

    const template = await this.gerarProposta(
      cliente.id,
      proposta.tipo
    )

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #1a4d8c; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .proposta-box { background: white; padding: 20px; border-radius: 5px; margin: 20px 0; }
          .valor { font-size: 24px; font-weight: bold; color: #1a4d8c; }
          .button { display: inline-block; padding: 12px 24px; background: #1a4d8c; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Brazilian Relax</h1>
          </div>
          <div class="content">
            <h2>Olá ${cliente.nomeCompleto}!</h2>
            <p>Preparamos uma proposta personalizada para você:</p>
            <div class="proposta-box">
              <h3>${template.titulo}</h3>
              <p>${template.descricao}</p>
              <h4>O que está incluído:</h4>
              <ul>
                ${template.servicos.map((s) => `<li>${s}</li>`).join('')}
              </ul>
              <p class="valor">Valor: R$ ${proposta.valor.toFixed(2)}</p>
              <p><strong>Prazo estimado:</strong> ${template.prazo}</p>
            </div>
            <a href="https://brazilianrelax.com/propostas/${propostaId}" class="button">Ver proposta completa</a>
            <p>Para aprovar esta proposta, acesse o link acima ou entre em contato conosco.</p>
            <p>Atenciosamente,<br>Equipe Brazilian Relax</p>
          </div>
        </div>
      </body>
      </html>
    `

    await EmailService.enviarEmail(
      cliente.email,
      `Proposta - ${template.titulo}`,
      html
    )
  }

  /**
   * Envia proposta por WhatsApp
   */
  static async enviarPorWhatsApp(propostaId: string): Promise<void> {
    const proposta = await this.buscarPorId(propostaId)
    const cliente = proposta.cliente

    const template = await this.gerarProposta(
      cliente.id,
      proposta.tipo
    )

    const mensagem = `Olá ${cliente.nomeCompleto}! 👋

Preparamos uma proposta personalizada para você:

📋 *${template.titulo}*
${template.descricao}

*O que está incluído:*
${template.servicos.map((s) => `✓ ${s}`).join('\n')}

💰 *Valor:* R$ ${proposta.valor.toFixed(2)}
⏱️ *Prazo estimado:* ${template.prazo}

Para ver a proposta completa e aprovar, acesse:
https://brazilianrelax.com/propostas/${propostaId}

Qualquer dúvida, estamos à disposição!`

    await WhatsAppService.enviarMensagemTexto(cliente.whatsapp, mensagem)
  }

  /**
   * Gera proposta automaticamente baseada no diagnóstico
   */
  static async gerarPropostaAutomatica(
    clienteId: string,
    diagnosticoId?: string
  ) {
    const cliente = await prisma.cliente.findUnique({
      where: { id: clienteId },
    })

    if (!cliente) {
      throw new NotFoundError('Cliente')
    }

    // Buscar diagnóstico mais recente
    let diagnostico = null
    if (diagnosticoId) {
      diagnostico = await prisma.diagnostico.findUnique({
        where: { id: diagnosticoId },
      })
    } else {
      diagnostico = await prisma.diagnostico.findFirst({
        where: { clienteId },
        orderBy: { createdAt: 'desc' },
      })
    }

    const tipoCaso = diagnostico?.classificacao || 'geral'
    const template = await this.gerarProposta(clienteId, tipoCaso)

    // Criar proposta
    const proposta = await this.criar({
      clienteId,
      tipo: this.mapearTipoCasoParaTipoProposta(tipoCaso),
      descricao: template.descricao,
      valor: template.valor,
      classificacaoCaso: tipoCaso,
    })

    return {
      proposta,
      template,
    }
  }

  /**
   * Mapeia tipo de caso para tipo de proposta
   */
  private static mapearTipoCasoParaTipoProposta(
    tipoCaso: string
  ): 'diagnostico' | 'regularizacao' | 'rotina-anual' {
    if (tipoCaso === 'cpf-irregular' || tipoCaso === 'ir-atrasado') {
      return 'regularizacao'
    }
    if (tipoCaso === 'saida-definitiva') {
      return 'regularizacao'
    }
    return 'diagnostico'
  }
}

