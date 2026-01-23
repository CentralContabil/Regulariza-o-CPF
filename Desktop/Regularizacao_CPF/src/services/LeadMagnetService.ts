import { prisma } from '@/lib/prisma'
import { EmailService } from './EmailService'
// NotFoundError e ValidationError não são usados neste arquivo

export class LeadMagnetService {
  /**
   * Registra download de lead magnet
   */
  static async registrarDownload(email: string, nome?: string) {
    // Verificar se já existe
    const existente = await prisma.leadMagnet.findUnique({
      where: { email },
    })

    if (existente) {
      // Atualizar data de download
      return await prisma.leadMagnet.update({
        where: { email },
        data: {
          dataDownload: new Date(),
        },
      })
    }

    // Criar novo registro
    const leadMagnet = await prisma.leadMagnet.create({
      data: {
        email,
        nome,
        material: 'Checklist CPF Irregular',
        downloadUrl: '/lead-magnet/checklist-cpf-irregular.pdf',
        dataDownload: new Date(),
      },
    })

    // Enviar email com o material
    await this.enviarMaterialPorEmail(email, nome)

    return leadMagnet
  }

  /**
   * Envia material do lead magnet por email
   */
  private static async enviarMaterialPorEmail(
    email: string,
    nome?: string
  ) {
    const assunto = 'Seu Checklist: CPF Irregular Morando Fora - O Que Fazer'
    const corpo = `
      <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #2563eb;">Olá${nome ? `, ${nome}` : ''}!</h1>
            
            <p>Obrigado por baixar nosso checklist exclusivo!</p>
            
            <p>Como prometido, aqui está o seu guia completo:</p>
            
            <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h2 style="color: #1e40af; margin-top: 0;">📋 Checklist: CPF Irregular Morando Fora - O Que Fazer</h2>
              
              <p><strong>Este guia inclui:</strong></p>
              <ul>
                <li>✅ Como verificar a situação do seu CPF</li>
                <li>✅ Passos para regularizar sua situação fiscal</li>
                <li>✅ Documentos necessários para cada tipo de regularização</li>
                <li>✅ Prazos importantes da Receita Federal</li>
                <li>✅ O que fazer em caso de Saída Definitiva</li>
                <li>✅ Como evitar bloqueios e restrições</li>
                <li>✅ Dicas para manter sua situação fiscal em dia</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/lead-magnet/checklist-cpf-irregular.pdf" 
                 style="background-color: #2563eb; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
                📥 Baixar Checklist Completo
              </a>
            </div>
            
            <p><strong>Próximos Passos:</strong></p>
            <p>Se você ainda não fez seu pré-diagnóstico gratuito, aproveite agora mesmo para descobrir exatamente qual é a sua situação fiscal e o que precisa ser feito.</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}#pre-diagnostico" 
                 style="background-color: #fbbf24; color: #1e40af; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
                🎯 Fazer Meu Pré-Diagnóstico Gratuito
              </a>
            </div>
            
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
            
            <p style="font-size: 14px; color: #6b7280;">
              Se você tiver alguma dúvida, não hesite em nos contatar. Estamos aqui para ajudar!
            </p>
            
            <p style="font-size: 14px; color: #6b7280;">
              Atenciosamente,<br>
              <strong>Equipe Brazilian Relax</strong>
            </p>
          </div>
        </body>
      </html>
    `

    await EmailService.enviarEmail(email, assunto, corpo)
  }

  /**
   * Lista downloads de lead magnet
   */
  static async listarDownloads(params: {
    page?: number
    limit?: number
    dataInicio?: Date
    dataFim?: Date
  }) {
    const page = params.page || 1
    const limit = params.limit || 20
    const skip = (page - 1) * limit

    const where: any = {}

    if (params.dataInicio || params.dataFim) {
      where.dataDownload = {}
      if (params.dataInicio) {
        where.dataDownload.gte = params.dataInicio
      }
      if (params.dataFim) {
        where.dataDownload.lte = params.dataFim
      }
    }

    const [downloads, total] = await Promise.all([
      prisma.leadMagnet.findMany({
        where,
        skip,
        take: limit,
        orderBy: { dataDownload: 'desc' },
      }),
      prisma.leadMagnet.count({ where }),
    ])

    return {
      downloads,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    }
  }

  /**
   * Busca download por email
   */
  static async buscarPorEmail(email: string) {
    return await prisma.leadMagnet.findUnique({
      where: { email },
    })
  }
}

