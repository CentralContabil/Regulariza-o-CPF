import { NextRequest, NextResponse } from 'next/server'
import { DashboardService } from '@/services/DashboardService'
import { asyncHandler } from '@/middleware/errorHandler'

export const GET = asyncHandler(async (_request: NextRequest) => {
  const receita = await DashboardService.buscarReceitaPorMes()
  return NextResponse.json(receita)
})

