import { NextRequest, NextResponse } from 'next/server'
import { ClienteDashboardService } from '@/services/ClienteDashboardService'
import { asyncHandler } from '@/middleware/errorHandler'

export const GET = asyncHandler(
  async (
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
  ) => {
    const params = await context.params
    const searchParams = request.nextUrl.searchParams
    const limit = parseInt(searchParams.get('limit') || '20')

    const comunicacoes = await ClienteDashboardService.buscarComunicacoes(
      params.id,
      limit
    )
    return NextResponse.json(comunicacoes)
  }
)



