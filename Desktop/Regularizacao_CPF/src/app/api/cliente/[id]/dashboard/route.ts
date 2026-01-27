import { NextRequest, NextResponse } from 'next/server'
import { ClienteDashboardService } from '@/services/ClienteDashboardService'
import { asyncHandler } from '@/middleware/errorHandler'

export const GET = asyncHandler(
  async (
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
  ) => {
    const params = await context.params
    const dashboard = await ClienteDashboardService.buscarDashboard(params.id)
    return NextResponse.json(dashboard)
  }
)



