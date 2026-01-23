import { NextRequest, NextResponse } from 'next/server'
import { LeadMagnetService } from '@/services/LeadMagnetService'
import { asyncHandler } from '@/middleware/errorHandler'

export const GET = asyncHandler(async (request: NextRequest) => {
  const searchParams = request.nextUrl.searchParams
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '20')
  const dataInicio = searchParams.get('dataInicio')
    ? new Date(searchParams.get('dataInicio')!)
    : undefined
  const dataFim = searchParams.get('dataFim')
    ? new Date(searchParams.get('dataFim')!)
    : undefined

  const result = await LeadMagnetService.listarDownloads({
    page,
    limit,
    dataInicio,
    dataFim,
  })

  return NextResponse.json(result)
})

