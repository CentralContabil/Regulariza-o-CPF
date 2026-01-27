import { NextRequest, NextResponse } from 'next/server'
import { WhatsAppService } from '@/services/WhatsAppService'
import { asyncHandler } from '@/middleware/errorHandler'
import { ValidationError } from '@/lib/errors'

export const POST = asyncHandler(async (request: NextRequest) => {
  const body = await request.json()
  const { to, mensagem, tipo, templateName, parameters } = body

  if (!to) {
    throw new ValidationError('Número de destino é obrigatório')
  }

  let resultado

  if (tipo === 'template' && templateName) {
    resultado = await WhatsAppService.enviarTemplate(
      to,
      templateName,
      body.languageCode || 'pt_BR',
      parameters
    )
  } else if (mensagem) {
    resultado = await WhatsAppService.enviarMensagemTexto(to, mensagem)
  } else {
    throw new ValidationError('Mensagem ou template é obrigatório')
  }

  return NextResponse.json({
    success: true,
    messageId: resultado.messages?.[0]?.id,
    resultado,
  })
})



