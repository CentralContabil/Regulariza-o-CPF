import { NextRequest, NextResponse } from 'next/server'
import { PaymentService } from '@/services/PaymentService'
import { asyncHandler } from '@/middleware/errorHandler'

export const POST = asyncHandler(
  async (
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
  ) => {
    const params = await context.params
    const body = await request.json()
    const { valor } = body

    const refund = await PaymentService.criarReembolso(
      params.id,
      valor ? parseFloat(valor) : undefined
    )

    return NextResponse.json({
      success: true,
      refund,
    })
  }
)



