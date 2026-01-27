import { NextRequest, NextResponse } from 'next/server'
import { EmailService } from '@/services/EmailService'
import { asyncHandler } from '@/middleware/errorHandler'
import { ValidationError } from '@/lib/errors'

export const POST = asyncHandler(async (request: NextRequest) => {
  const body = await request.json()
  const { clienteId, delayDias } = body

  if (!clienteId) {
    throw new ValidationError('clienteId é obrigatório')
  }

  await EmailService.dispararSequenciaEmails(
    clienteId,
    delayDias || [0, 2, 4, 6, 8]
  )

  return NextResponse.json({
    success: true,
    message: 'Sequência de emails agendada',
  })
})



