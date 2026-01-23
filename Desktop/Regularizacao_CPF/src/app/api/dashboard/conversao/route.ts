import { NextRequest, NextResponse } from 'next/server'
import { DashboardService } from '@/services/DashboardService'
import { asyncHandler } from '@/middleware/errorHandler'

export const GET = asyncHandler(async (_request: NextRequest) => {
  const estatisticas = await DashboardService.buscarEstatisticasConversao()
  return NextResponse.json(estatisticas)
})

