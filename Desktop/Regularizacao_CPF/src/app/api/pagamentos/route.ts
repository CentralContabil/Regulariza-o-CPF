import { NextRequest, NextResponse } from 'next/server'
import { PaymentService } from '@/services/PaymentService'
import { asyncHandler } from '@/middleware/errorHandler'

export const GET = asyncHandler(async (request: NextRequest) => {
  const searchParams = request.nextUrl.searchParams
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '20')
  const propostaId = searchParams.get('propostaId') || undefined
  const status = searchParams.get('status') || undefined

  const result = await PaymentService.listarPagamentos({
    page,
    limit,
    propostaId,
    status,
  })

  return NextResponse.json(result)
})



