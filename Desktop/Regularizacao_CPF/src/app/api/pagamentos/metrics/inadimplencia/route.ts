import { NextRequest, NextResponse } from 'next/server'
import { PaymentService } from '@/services/PaymentService'
import { asyncHandler } from '@/middleware/errorHandler'

export const GET = asyncHandler(async (_request: NextRequest) => {
  const metrics = await PaymentService.calcularInadimplencia()
  return NextResponse.json(metrics)
})

