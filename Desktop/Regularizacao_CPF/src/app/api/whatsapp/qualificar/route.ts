import { NextRequest, NextResponse } from 'next/server'
import { WhatsAppService } from '@/services/WhatsAppService'
import { asyncHandler } from '@/middleware/errorHandler'
import { ValidationError } from '@/lib/errors'

export const POST = asyncHandler(async (request: NextRequest) => {
  const body = await request.json()
  const { to, nome } = body

  if (!to) {
    throw new ValidationError('Número de destino é obrigatório')
  }

  if (!nome) {
    throw new ValidationError('Nome é obrigatório')
  }

  await WhatsAppService.enviarScriptQualificacao(to, nome)

  return NextResponse.json({
    success: true,
    message: 'Script de qualificação enviado',
  })
})



