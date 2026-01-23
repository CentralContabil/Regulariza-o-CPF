import { NextRequest, NextResponse } from 'next/server'
import { ClienteDashboardService } from '@/services/ClienteDashboardService'
import { asyncHandler } from '@/middleware/errorHandler'

export const GET = asyncHandler(
  async (
    request: NextRequest,
    context: {
      params: Promise<{ id: string; processoId: string }>
    }
  ) => {
    const params = await context.params
    const timeline = await ClienteDashboardService.buscarTimeline(
      params.processoId,
      params.id
    )
    return NextResponse.json(timeline)
  }
)

