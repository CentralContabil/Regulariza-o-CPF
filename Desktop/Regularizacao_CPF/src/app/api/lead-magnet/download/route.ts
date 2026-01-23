import { NextRequest, NextResponse } from 'next/server'
import { LeadMagnetService } from '@/services/LeadMagnetService'
import { asyncHandler } from '@/middleware/errorHandler'
import { ValidationError } from '@/lib/errors'

export const POST = asyncHandler(async (request: NextRequest) => {
  const body = await request.json()
  const { email, nome } = body

  if (!email) {
    throw new ValidationError('email é obrigatório')
  }

  const leadMagnet = await LeadMagnetService.registrarDownload(email, nome)

  return NextResponse.json({
    success: true,
    message: 'Material enviado por email',
    leadMagnet,
  })
})

