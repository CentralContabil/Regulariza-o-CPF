import { NextRequest, NextResponse } from 'next/server'
import { DashboardService } from '@/services/DashboardService'
import { asyncHandler } from '@/middleware/errorHandler'

export const GET = asyncHandler(async (_request: NextRequest) => {
  const processos = await DashboardService.buscarProcessosPorTipo()
  return NextResponse.json(processos)
})

