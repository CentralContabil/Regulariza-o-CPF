import { NextRequest, NextResponse } from 'next/server'
import { DashboardService } from '@/services/DashboardService'
import { asyncHandler } from '@/middleware/errorHandler'

export const GET = asyncHandler(async (_request: NextRequest) => {
  const tarefas = await DashboardService.buscarTarefasPendentes()
  return NextResponse.json(tarefas)
})

