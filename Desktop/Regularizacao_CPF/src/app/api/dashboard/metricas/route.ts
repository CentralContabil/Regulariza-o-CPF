import { NextRequest, NextResponse } from 'next/server'
import { DashboardService } from '@/services/DashboardService'
import { asyncHandler } from '@/middleware/errorHandler'

export const GET = asyncHandler(async (_request: NextRequest) => {
  const metricas = await DashboardService.buscarMetricasGerais()
  return NextResponse.json(metricas)
})

