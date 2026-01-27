import { NextRequest, NextResponse } from 'next/server'
import { EmailService } from '@/services/EmailService'
import { asyncHandler } from '@/middleware/errorHandler'
import { ValidationError } from '@/lib/errors'

export const POST = asyncHandler(async (request: NextRequest) => {
  const body = await request.json()
  const { to, nome, tipo } = body

  if (!to || !nome) {
    throw new ValidationError('Email e nome são obrigatórios')
  }

  const emailData = { to, nome, ...body }

  switch (tipo) {
    case '1':
    case 'email1':
      await EmailService.enviarEmail1(emailData)
      break
    case '2':
    case 'email2':
      await EmailService.enviarEmail2(emailData)
      break
    case '3':
    case 'email3':
      await EmailService.enviarEmail3(emailData)
      break
    case '4':
    case 'email4':
      await EmailService.enviarEmail4(emailData)
      break
    case '5':
    case 'email5':
      await EmailService.enviarEmail5(emailData)
      break
    default:
      throw new ValidationError('Tipo de email inválido (use 1-5)')
  }

  return NextResponse.json({
    success: true,
    message: `Email ${tipo} enviado com sucesso`,
  })
})



