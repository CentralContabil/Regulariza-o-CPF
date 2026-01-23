import { prisma } from '@/lib/prisma'
import { EmailService } from './EmailService'
import { WhatsAppService } from './WhatsAppService'
import { PropostaService } from './PropostaService'

export class AutomacaoService {
  /**
   * Envia lembretes de prazo de IRPF
   * Executar em janeiro de cada ano
   */
  static async enviarLembretesIRPF() {
    const hoje = new Date()
    const mes = hoje.getMonth() + 1 // 1-12

    // Enviar lembretes em janeiro (mês 1)
    if (mes !== 1) {
      return { enviados: 0, mensagem: 'Fora do período de lembretes de IRPF' }
    }

    // Buscar clientes que precisam declarar IRPF
    const clientes = await prisma.cliente.findMany({
      where: {
        statusIrpf: {
          in: ['atrasado', 'preciso-retificar'],
        },
      },
    })

    let enviados = 0

    for (const cliente of clientes) {
      try {
        // Enviar email
        await EmailService.enviarEmail(
          cliente.email,
          'Lembrete: Prazo de Entrega do IRPF 2024',
          this.getTemplateLembreteIRPF(cliente.nomeCompleto)
        )

        // Enviar WhatsApp (se configurado)
        if (cliente.whatsapp) {
          await WhatsAppService.enviarMensagemTexto(
            cliente.whatsapp,
            `Olá ${cliente.nomeCompleto}! Lembrete: O prazo para entrega do IRPF 2024 é 31 de maio. Não deixe para a última hora!`
          )
        }

        enviados++
      } catch (error) {
        console.error(`Erro ao enviar lembrete para ${cliente.email}:`, error)
      }
    }

    return { enviados, total: clientes.length }
  }

  /**
   * Follow-up automático de processos
   * Enviar para processos sem atualização há mais de 7 dias
   */
  static async followUpProcessos() {
    const seteDiasAtras = new Date()
    seteDiasAtras.setDate(seteDiasAtras.getDate() - 7)

    const processos = await prisma.processo.findMany({
      where: {
        status: {
          in: ['pendente', 'em-andamento'],
        },
        updatedAt: {
          lt: seteDiasAtras,
        },
      },
      include: {
        cliente: true,
      },
    })

    let enviados = 0

    for (const processo of processos) {
      try {
        const diasSemAtualizacao = Math.floor(
          (Date.now() - processo.updatedAt.getTime()) / (1000 * 60 * 60 * 24)
        )

        await EmailService.enviarEmail(
          processo.cliente.email,
          `Atualização do seu processo de ${processo.tipo}`,
          this.getTemplateFollowUpProcesso(
            processo.cliente.nomeCompleto,
            processo.tipo,
            diasSemAtualizacao
          )
        )

        enviados++
      } catch (error) {
        console.error(
          `Erro ao enviar follow-up para processo ${processo.id}:`,
          error
        )
      }
    }

    return { enviados, total: processos.length }
  }

  /**
   * Renovação anual de contratos
   * Verificar contratos que expiram em 30 dias
   */
  static async verificarRenovacaoContratos() {
    const hoje = new Date()
    const trintaDias = new Date()
    trintaDias.setDate(trintaDias.getDate() + 30)

    // Buscar propostas de rotina anual que foram aprovadas há ~11 meses
    const propostas = await prisma.proposta.findMany({
      where: {
        tipo: 'rotina-anual',
        status: 'aprovada',
        aprovadaEm: {
          gte: new Date(hoje.getFullYear() - 1, hoje.getMonth(), hoje.getDate()),
          lte: trintaDias,
        },
      },
      include: {
        cliente: true,
      },
    })

    let notificacoes = 0

    for (const proposta of propostas) {
      try {
        if (!proposta.aprovadaEm) continue

        const diasParaRenovacao = Math.floor(
          (trintaDias.getTime() - proposta.aprovadaEm.getTime()) /
            (1000 * 60 * 60 * 24)
        )

        if (diasParaRenovacao <= 30 && diasParaRenovacao > 0) {
          // Criar nova proposta de renovação
          await PropostaService.criar({
            clienteId: proposta.clienteId,
            tipo: 'rotina-anual',
            valor: Number(proposta.valor),
            descricao: `Renovação anual - ${new Date().getFullYear()}`,
          })

          // Notificar cliente
          await EmailService.enviarEmail(
            proposta.cliente.email,
            'Renovação do seu contrato anual',
            this.getTemplateRenovacao(proposta.cliente.nomeCompleto, diasParaRenovacao)
          )

          notificacoes++
        }
      } catch (error) {
        console.error(
          `Erro ao processar renovação para proposta ${proposta.id}:`,
          error
        )
      }
    }

    return { notificacoes, total: propostas.length }
  }

  /**
   * Campanhas de retenção automáticas
   * Para clientes inativos há mais de 90 dias
   */
  static async campanhaRetencao() {
    const noventaDiasAtras = new Date()
    noventaDiasAtras.setDate(noventaDiasAtras.getDate() - 90)

    // Buscar clientes sem interações recentes
    const clientes = await prisma.cliente.findMany({
      where: {
        interacoes: {
          none: {
            createdAt: {
              gte: noventaDiasAtras,
            },
          },
        },
      },
      include: {
        processos: {
          where: {
            status: {
              not: 'concluido',
            },
          },
        },
      },
    })

    let enviados = 0

    for (const cliente of clientes) {
      try {
        // Só enviar se tiver processos pendentes
        if (cliente.processos.length === 0) continue

        await EmailService.enviarEmail(
          cliente.email,
          'Como está sua regularização fiscal?',
          this.getTemplateRetencao(cliente.nomeCompleto)
        )

        enviados++
      } catch (error) {
        console.error(
          `Erro ao enviar campanha de retenção para ${cliente.email}:`,
          error
        )
      }
    }

    return { enviados, total: clientes.length }
  }

  /**
   * Template de email para lembrete de IRPF
   */
  private static getTemplateLembreteIRPF(nome: string): string {
    return `
      <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #2563eb;">Olá, ${nome}!</h1>
            
            <p>Este é um lembrete importante sobre o prazo de entrega do IRPF 2024.</p>
            
            <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0;">
              <p style="margin: 0;"><strong>⚠️ Prazo:</strong> 31 de maio de 2024</p>
            </div>
            
            <p>Não deixe para a última hora! A entrega em dia evita multas e problemas futuros.</p>
            
            <p>Se você precisa de ajuda com sua declaração, estamos aqui para ajudar!</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/cliente/dashboard" 
                 style="background-color: #2563eb; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
                Acessar Meu Dashboard
              </a>
            </div>
          </div>
        </body>
      </html>
    `
  }

  /**
   * Template de email para follow-up de processo
   */
  private static getTemplateFollowUpProcesso(
    nome: string,
    tipo: string,
    dias: number
  ): string {
    return `
      <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #2563eb;">Olá, ${nome}!</h1>
            
            <p>Queremos manter você informado sobre o seu processo de ${tipo}.</p>
            
            <p>Fazem ${dias} dias desde a última atualização. Estamos trabalhando para manter tudo em dia!</p>
            
            <p>Se você tiver alguma dúvida ou precisar enviar documentos, acesse seu dashboard.</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/cliente/dashboard" 
                 style="background-color: #2563eb; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
                Ver Status do Processo
              </a>
            </div>
          </div>
        </body>
      </html>
    `
  }

  /**
   * Template de email para renovação
   */
  private static getTemplateRenovacao(
    nome: string,
    dias: number
  ): string {
    return `
      <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #2563eb;">Olá, ${nome}!</h1>
            
            <p>Seu contrato de rotina anual está próximo da renovação!</p>
            
            <p>Faltam ${dias} dias para a renovação. Já preparamos uma nova proposta para você.</p>
            
            <p>Renovando, você garante que sua situação fiscal continue em dia sem preocupações.</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/cliente/dashboard" 
                 style="background-color: #2563eb; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
                Ver Proposta de Renovação
              </a>
            </div>
          </div>
        </body>
      </html>
    `
  }

  /**
   * Template de email para retenção
   */
  private static getTemplateRetencao(nome: string): string {
    return `
      <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #2563eb;">Olá, ${nome}!</h1>
            
            <p>Faz um tempo que não falamos! Queremos saber como está sua regularização fiscal.</p>
            
            <p>Se você ainda tem processos em andamento, podemos ajudar a finalizá-los.</p>
            
            <p>Se precisar de algo ou tiver dúvidas, estamos aqui para ajudar!</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/cliente/dashboard" 
                 style="background-color: #2563eb; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
                Acessar Meu Dashboard
              </a>
            </div>
          </div>
        </body>
      </html>
    `
  }
}

