import nodemailer from 'nodemailer'
import { prisma } from '@/lib/prisma'

export interface EmailTemplate {
  subject: string
  html: string
  text?: string
}

export interface EmailData {
  to: string
  nome: string
  [key: string]: any
}

export class EmailService {
  private static transporter: nodemailer.Transporter

  /**
   * Inicializa transporter de email
   */
  private static getTransporter(): nodemailer.Transporter {
    if (!this.transporter) {
      this.transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.EMAIL_PORT || '587'),
        secure: process.env.EMAIL_SECURE === 'true',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD,
        },
      })
    }
    return this.transporter
  }

  /**
   * Envia email
   */
  static async enviarEmail(
    to: string,
    subject: string,
    html: string,
    text?: string
  ): Promise<void> {
    try {
      const transporter = this.getTransporter()

      await transporter.sendMail({
        from: process.env.EMAIL_FROM || 'contato@brazilianrelax.com',
        to,
        subject,
        html,
        text: text || this.htmlToText(html),
      })

      console.log(`Email enviado para ${to}: ${subject}`)
    } catch (error: any) {
      console.error('Erro ao enviar email:', error)
      throw error
    }
  }

  /**
   * Converte HTML para texto simples
   */
  private static htmlToText(html: string): string {
    return html
      .replace(/<[^>]*>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .trim()
  }

  /**
   * Personaliza template com dados
   */
  private static personalizarTemplate(
    template: string,
    data: EmailData
  ): string {
    let personalizado = template

    // Substituir variáveis {{variavel}}
    Object.keys(data).forEach((key) => {
      const regex = new RegExp(`{{${key}}}`, 'g')
      personalizado = personalizado.replace(regex, data[key])
    })

    return personalizado
  }

  /**
   * Email 1: CPF irregular e IR atrasado: por onde começar
   */
  static async enviarEmail1(data: EmailData): Promise<void> {
    const template = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #1a4d8c; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .button { display: inline-block; padding: 12px 24px; background: #1a4d8c; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Brazilian Relax</h1>
          </div>
          <div class="content">
            <h2>Olá {{nome}}!</h2>
            <p>Recebemos seu pré-diagnóstico e identificamos que você pode ter pendências fiscais no Brasil.</p>
            <p><strong>Por onde começar?</strong></p>
            <p>O primeiro passo é entender exatamente qual é a sua situação. Existem três cenários principais:</p>
            <ul>
              <li><strong>CPF Irregular:</strong> Seu CPF está pendente, suspenso ou cancelado</li>
              <li><strong>IRPF em Atraso:</strong> Você tem declarações de Imposto de Renda não entregues</li>
              <li><strong>Saída Definitiva:</strong> Você precisa comunicar sua saída do Brasil</li>
            </ul>
            <p>Não se preocupe - todos esses casos têm solução, e você pode resolver tudo remotamente, sem precisar voltar ao Brasil.</p>
            <a href="https://brazilianrelax.com/dashboard" class="button">Acessar meu diagnóstico</a>
            <p>Em breve entraremos em contato com mais detalhes sobre seu caso específico.</p>
            <p>Atenciosamente,<br>Equipe Brazilian Relax</p>
          </div>
          <div class="footer">
            <p>Este é um email automático. Por favor, não responda diretamente.</p>
            <p>Para dúvidas, entre em contato via WhatsApp ou email.</p>
          </div>
        </div>
      </body>
      </html>
    `

    const html = this.personalizarTemplate(template, data)
    await this.enviarEmail(
      data.to,
      'CPF irregular e IR atrasado: por onde começar',
      html
    )
  }

  /**
   * Email 2: Residente, não residente e Saída Definitiva: entenda o básico
   */
  static async enviarEmail2(data: EmailData): Promise<void> {
    const template = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #1a4d8c; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .highlight { background: #fff3cd; padding: 15px; border-left: 4px solid #ffc107; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Brazilian Relax</h1>
          </div>
          <div class="content">
            <h2>Olá {{nome}}!</h2>
            <p>Hoje vamos falar sobre um tema importante: <strong>Residência Fiscal e Saída Definitiva</strong>.</p>
            <div class="highlight">
              <h3>O que é Saída Definitiva?</h3>
              <p>É a comunicação à Receita Federal de que você deixou o Brasil de forma permanente. Isso tem implicações fiscais importantes.</p>
            </div>
            <h3>Quando você precisa comunicar?</h3>
            <ul>
              <li>Se você tem residência permanente nos EUA (Green Card)</li>
              <li>Se você não pretende mais retornar ao Brasil</li>
              <li>Se você quer evitar ser considerado residente fiscal no Brasil</li>
            </ul>
            <h3>Quando você NÃO precisa comunicar?</h3>
            <ul>
              <li>Se você está temporariamente nos EUA (visto de trabalho, estudante)</li>
              <li>Se você planeja retornar ao Brasil</li>
              <li>Se você mantém vínculos significativos com o Brasil</li>
            </ul>
            <p><strong>Importante:</strong> Cada caso é único. Recomendamos uma avaliação personalizada.</p>
            <p>Quer entender melhor seu caso? Entre em contato conosco!</p>
            <p>Atenciosamente,<br>Equipe Brazilian Relax</p>
          </div>
        </div>
      </body>
      </html>
    `

    const html = this.personalizarTemplate(template, data)
    await this.enviarEmail(
      data.to,
      'Residente, não residente e Saída Definitiva: entenda o básico',
      html
    )
  }

  /**
   * Email 3: Checklist de documentos: organize em 10 minutos
   */
  static async enviarEmail3(data: EmailData): Promise<void> {
    const template = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #1a4d8c; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .checklist { background: white; padding: 20px; border-radius: 5px; margin: 20px 0; }
          .item { padding: 10px; border-bottom: 1px solid #eee; }
          .item:last-child { border-bottom: none; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Brazilian Relax</h1>
          </div>
          <div class="content">
            <h2>Olá {{nome}}!</h2>
            <p>Organizar os documentos é mais simples do que parece. Aqui está seu checklist personalizado:</p>
            <div class="checklist">
              <h3>📋 Checklist de Documentos</h3>
              <div class="item">✓ CPF (cópia)</div>
              <div class="item">✓ RG ou CNH (cópia)</div>
              <div class="item">✓ Comprovante de Residência nos EUA</div>
              <div class="item">✓ Declarações de IRPF anteriores (se houver)</div>
              <div class="item">✓ Comprovantes de Rendimentos</div>
            </div>
            <p><strong>Dica:</strong> Você não precisa ter todos os documentos agora. Comece pelos que você já tem e vamos organizando o resto juntos.</p>
            <p>Quando estiver pronto, você pode enviar os documentos através do seu dashboard ou por email seguro.</p>
            <p>Precisa de ajuda? Estamos aqui para você!</p>
            <p>Atenciosamente,<br>Equipe Brazilian Relax</p>
          </div>
        </div>
      </body>
      </html>
    `

    const html = this.personalizarTemplate(template, data)
    await this.enviarEmail(
      data.to,
      'Checklist de documentos: organize em 10 minutos',
      html
    )
  }

  /**
   * Email 4: Quanto tempo leva e quais são os próximos passos
   */
  static async enviarEmail4(data: EmailData): Promise<void> {
    const template = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #1a4d8c; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .timeline { background: white; padding: 20px; border-radius: 5px; margin: 20px 0; }
          .step { padding: 10px 0; border-left: 3px solid #1a4d8c; padding-left: 15px; margin: 10px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Brazilian Relax</h1>
          </div>
          <div class="content">
            <h2>Olá {{nome}}!</h2>
            <p>Você deve estar se perguntando: <strong>"Quanto tempo isso vai levar?"</strong></p>
            <p>Vamos ser transparentes: não garantimos prazos fixos porque o processamento depende da Receita Federal. Mas organizamos tudo em etapas claras:</p>
            <div class="timeline">
              <div class="step">
                <strong>Etapa 1:</strong> Coleta e organização de documentos (1-2 semanas)
              </div>
              <div class="step">
                <strong>Etapa 2:</strong> Preparação e envio à Receita Federal (1 semana)
              </div>
              <div class="step">
                <strong>Etapa 3:</strong> Acompanhamento do processamento (2-8 semanas)
              </div>
              <div class="step">
                <strong>Etapa 4:</strong> Conclusão e documentação (1 semana)
              </div>
            </div>
            <p><strong>Próximos passos para você:</strong></p>
            <ol>
              <li>Organizar os documentos do checklist</li>
              <li>Enviar documentos através do dashboard</li>
              <li>Aguardar nossa análise e preparação</li>
            </ol>
            <p>Você será informado em cada etapa do processo. Não fique no escuro!</p>
            <p>Atenciosamente,<br>Equipe Brazilian Relax</p>
          </div>
        </div>
      </body>
      </html>
    `

    const html = this.personalizarTemplate(template, data)
    await this.enviarEmail(
      data.to,
      'Quanto tempo leva e quais são os próximos passos',
      html
    )
  }

  /**
   * Email 5: Rotina anual: nunca mais perder prazo
   */
  static async enviarEmail5(data: EmailData): Promise<void> {
    const template = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #1a4d8c; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .benefit { background: #d4edda; padding: 15px; border-left: 4px solid #28a745; margin: 15px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Brazilian Relax</h1>
          </div>
          <div class="content">
            <h2>Olá {{nome}}!</h2>
            <p>Parabéns! Você está no caminho certo para regularizar sua situação fiscal.</p>
            <p>Mas e depois? Como garantir que você nunca mais perca um prazo?</p>
            <div class="benefit">
              <h3>📅 Rotina Anual</h3>
              <p>Oferecemos um plano de <strong>acompanhamento anual</strong> que garante:</p>
              <ul>
                <li>Entrega de IRPF sempre no prazo</li>
                <li>Monitoramento da situação do seu CPF</li>
                <li>Lembretes automáticos de prazos importantes</li>
                <li>Suporte contínuo para suas dúvidas</li>
              </ul>
            </div>
            <p><strong>Calendário Fiscal Brasileiro:</strong></p>
            <ul>
              <li><strong>Março-Abril:</strong> Entrega de IRPF</li>
              <li><strong>Maio:</strong> Prazo final para retificações</li>
              <li><strong>Ano todo:</strong> Manter CPF regularizado</li>
            </ul>
            <p>Com nosso acompanhamento, você não precisa se preocupar com esses prazos. Nós cuidamos de tudo para você.</p>
            <p>Quer saber mais sobre o plano de rotina anual? Entre em contato!</p>
            <p>Atenciosamente,<br>Equipe Brazilian Relax</p>
            <p><em>P.S.: Regularize a sua vida com o Leão 🦁</em></p>
          </div>
        </div>
      </body>
      </html>
    `

    const html = this.personalizarTemplate(template, data)
    await this.enviarEmail(
      data.to,
      'Rotina anual: nunca mais perder prazo',
      html
    )
  }

  /**
   * Dispara sequência completa de emails
   */
  static async dispararSequenciaEmails(
    clienteId: string,
    delayDias: number[] = [0, 2, 4, 6, 8]
  ): Promise<void> {
    const cliente = await prisma.cliente.findUnique({
      where: { id: clienteId },
    })

    if (!cliente) {
      throw new Error('Cliente não encontrado')
    }

    const emailData: EmailData = {
      to: cliente.email,
      nome: cliente.nomeCompleto,
    }

    // Agendar emails (em produção, usar sistema de jobs/cron)
    // Por enquanto, apenas registra a intenção
    console.log(`Sequência de emails agendada para ${cliente.email}`)
    console.log(`Emails serão enviados nos dias: ${delayDias.join(', ')}`)

    // TODO: Implementar sistema de agendamento real (cron jobs, queue, etc.)
    // Por enquanto, apenas o primeiro email é enviado imediatamente
    await this.enviarEmail1(emailData)
  }
}



