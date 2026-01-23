import { NextRequest, NextResponse } from 'next/server'
import { PaymentService } from '@/services/PaymentService'
import { asyncHandler } from '@/middleware/errorHandler'
import { ValidationError } from '@/lib/errors'

export const POST = asyncHandler(async (request: NextRequest) => {
  const body = await request.json()
  const { propostaId } = body

  if (!propostaId) {
    throw new ValidationError('propostaId é obrigatório')
  }

  const checkoutUrl = await PaymentService.criarCheckoutSession(propostaId)

  return NextResponse.json({
    success: true,
    checkoutUrl,
  })
})

