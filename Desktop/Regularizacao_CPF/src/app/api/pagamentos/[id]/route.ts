import { NextRequest, NextResponse } from 'next/server'
import { PaymentService } from '@/services/PaymentService'
import { asyncHandler } from '@/middleware/errorHandler'

export const GET = asyncHandler(
  async (
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
  ) => {
    const params = await context.params
    const pagamento = await PaymentService.buscarPagamentoPorId(params.id)
    return NextResponse.json(pagamento)
  }
)

