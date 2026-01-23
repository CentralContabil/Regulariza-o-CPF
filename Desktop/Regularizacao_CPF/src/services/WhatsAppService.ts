import axios, { AxiosInstance } from 'axios'
import * as crypto from 'crypto'
import { prisma } from '@/lib/prisma'
import { InteracaoService } from './InteracaoService'

export interface WhatsAppMessage {
  to: string
  type: 'text' | 'template' | 'interactive'
  text?: { body: string }
  template?: {
    name: string
    language: { code: string }
    components?: any[]
  }
  interactive?: any
}

export interface WhatsAppWebhook {
  object: string
  entry: Array<{
    id: string
    changes: Array<{
      value: {
        messaging_product: string
        metadata: {
          display_phone_number: string
          phone_number_id: string
        }
        contacts?: Array<{
          profile: { name: string }
          wa_id: string
        }>
        messages?: Array<{
          from: string
          id: string
          timestamp: string
          type: string
          text?: { body: string }
        }>
        statuses?: Array<{
          id: string
          status: string
          timestamp: string
          recipient_id: string
        }>
      }
      field: string
    }>
  }>
}

export class WhatsAppService {
  private static apiClient: AxiosInstance
  private static phoneNumberId: string
  private static accessToken: string
  private static verifyToken: string

  /**
   * Inicializa cliente HTTP para WhatsApp Business API
   */
  private static getClient(): AxiosInstance {
    if (!this.apiClient) {
      this.phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID || ''
      this.accessToken = process.env.WHATSAPP_ACCESS_TOKEN || ''
      this.verifyToken = process.env.WHATSAPP_VERIFY_TOKEN || 'brazilian-relax-verify-token'

      this.apiClient = axios.create({
        baseURL: `https://graph.facebook.com/v18.0/${this.phoneNumberId}`,
        timeout: 30000,
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        },
      })
    }
    return this.apiClient
  }

  /**
   * Verifica webhook do WhatsApp (para validação inicial)
   */
  static verificarWebhook(
    mode: string,
    token: string,
    challenge: string
  ): string | null {
    if (mode === 'subscribe' && token === this.verifyToken) {
      return challenge
    }
    return null
  }

  /**
   * Envia mensagem de texto
   */
  static async enviarMensagemTexto(
    to: string,
    mensagem: string
  ): Promise<any> {
    try {
      const client = this.getClient()

      const response = await client.post('/messages', {
        messaging_product: 'whatsapp',
        to: to.replace(/\D/g, ''),
        type: 'text',
        text: {
          body: mensagem,
        },
      })

      return response.data
    } catch (error: any) {
      console.error('Erro ao enviar mensagem WhatsApp:', error.response?.data || error.message)
      throw error
    }
  }

  /**
   * Envia template de mensagem
   */
  static async enviarTemplate(
    to: string,
    templateName: string,
    languageCode: string = 'pt_BR',
    parameters?: any[]
  ): Promise<any> {
    try {
      const client = this.getClient()

      const payload: any = {
        messaging_product: 'whatsapp',
        to: to.replace(/\D/g, ''),
        type: 'template',
        template: {
          name: templateName,
          language: {
            code: languageCode,
          },
        },
      }

      if (parameters && parameters.length > 0) {
        payload.template.components = [
          {
            type: 'body',
            parameters: parameters,
          },
        ]
      }

      const response = await client.post('/messages', payload)

      return response.data
    } catch (error: any) {
      console.error('Erro ao enviar template WhatsApp:', error.response?.data || error.message)
      throw error
    }
  }

  /**
   * Processa webhook do WhatsApp
   */
  static async processarWebhook(webhook: WhatsAppWebhook): Promise<void> {
    for (const entry of webhook.entry) {
      for (const change of entry.changes) {
        const value = change.value

        // Processar mensagens recebidas
        if (value.messages) {
          for (const message of value.messages) {
            await this.processarMensagemRecebida(message, value.contacts?.[0])
          }
        }

        // Processar status de mensagens enviadas
        if (value.statuses) {
          for (const status of value.statuses) {
            await this.processarStatusMensagem(status)
          }
        }
      }
    }
  }

  /**
   * Processa mensagem recebida
   */
  private static async processarMensagemRecebida(
    message: any,
    _contact?: any
  ): Promise<void> {
    const from = message.from
    const text = message.text?.body || ''

    // Buscar cliente por WhatsApp
    const cliente = await prisma.cliente.findFirst({
      where: {
        whatsapp: {
          contains: from,
        },
      },
    })

    if (cliente) {
      // Salvar interação
      await InteracaoService.criar({
        clienteId: cliente.id,
        tipo: 'whatsapp',
        assunto: 'Mensagem recebida',
        conteudo: text,
        direcao: 'inbound',
      })

      // Processar resposta automática baseada em palavras-chave
      await this.processarRespostaAutomatica(cliente.id, from, text)
    } else {
      // Cliente não encontrado - pode ser novo lead
      console.log(`Mensagem recebida de número desconhecido: ${from}`)
    }
  }

  /**
   * Processa resposta automática baseada em palavras-chave
   */
  private static async processarRespostaAutomatica(
    clienteId: string,
    from: string,
    mensagem: string
  ): Promise<void> {
    const mensagemLower = mensagem.toLowerCase()

    // Respostas automáticas baseadas em palavras-chave
    if (mensagemLower.includes('oi') || mensagemLower.includes('olá') || mensagemLower.includes('hello')) {
      await this.enviarMensagemTexto(
        from,
        'Olá! Obrigado por entrar em contato com a Brazilian Relax. Como posso ajudar você hoje?'
      )
    } else if (mensagemLower.includes('status') || mensagemLower.includes('situação')) {
      // Buscar processos do cliente
      const processos = await prisma.processo.findMany({
        where: { clienteId },
        orderBy: { createdAt: 'desc' },
        take: 1,
      })

      if (processos.length > 0) {
        const processo = processos[0]
        await this.enviarMensagemTexto(
          from,
          `Seu processo de ${processo.tipo} está com status: ${processo.status}. Em breve entraremos em contato com mais detalhes.`
        )
      } else {
        await this.enviarMensagemTexto(
          from,
          'Não encontramos processos em andamento. Gostaria de iniciar um diagnóstico?'
        )
      }
    } else if (mensagemLower.includes('documento') || mensagemLower.includes('documentos')) {
      await this.enviarMensagemTexto(
        from,
        'Para enviar documentos, acesse seu dashboard ou entre em contato conosco por email. Documentos sensíveis devem ser enviados de forma segura.'
      )
    } else {
      // Resposta padrão
      await this.enviarMensagemTexto(
        from,
        'Recebemos sua mensagem! Nossa equipe entrará em contato em breve. Para questões urgentes, envie um email para contato@brazilianrelax.com'
      )
    }
  }

  /**
   * Processa status de mensagem enviada
   */
  private static async processarStatusMensagem(status: any): Promise<void> {
    // Log do status (pode ser usado para analytics)
    console.log(`Status da mensagem ${status.id}: ${status.status}`)

    // Se mensagem foi entregue, pode atualizar interação
    if (status.status === 'delivered' || status.status === 'read') {
      // TODO: Atualizar status da interação no banco
    }
  }

  /**
   * Envia script de qualificação
   */
  static async enviarScriptQualificacao(to: string, nome: string): Promise<void> {
    const mensagem = `Olá ${nome}! 👋

Sou da equipe Brazilian Relax e gostaria de entender melhor sua situação fiscal.

Poderia me responder algumas perguntas rápidas?

1️⃣ Você sabe a situação do seu CPF? (Regular, Pendente, Suspenso, etc.)

2️⃣ Você tem declarações de IRPF em atraso?

3️⃣ Você fez Saída Definitiva do Brasil?

Responda com os números ou "não sei" para qualquer pergunta.`

    await this.enviarMensagemTexto(to, mensagem)
  }

  /**
   * Envia confirmação de recebimento de formulário
   */
  static async enviarConfirmacaoFormulario(to: string, nome: string): Promise<void> {
    const mensagem = `Olá ${nome}! ✅

Recebemos seu pré-diagnóstico com sucesso!

Nossa equipe está analisando suas informações e em breve entraremos em contato com:
• Diagnóstico completo da sua situação
• Próximos passos personalizados
• Checklist de documentos necessários

Enquanto isso, fique à vontade para nos enviar qualquer dúvida!

Atenciosamente,
Equipe Brazilian Relax`

    await this.enviarMensagemTexto(to, mensagem)
  }

  /**
   * Valida assinatura do webhook (segurança)
   */
  static validarAssinaturaWebhook(
    payload: string,
    signature: string
  ): boolean {
    const secret = process.env.WHATSAPP_WEBHOOK_SECRET || ''
    if (!secret) {
      console.warn('WHATSAPP_WEBHOOK_SECRET não configurado')
      return true // Em desenvolvimento, permite sem validação
    }

    const hash = crypto
      .createHmac('sha256', secret)
      .update(payload)
      .digest('hex')

    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(`sha256=${hash}`)
    )
  }
}

