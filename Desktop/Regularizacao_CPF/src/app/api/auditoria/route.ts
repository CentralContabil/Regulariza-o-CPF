import { NextRequest, NextResponse } from 'next/server'
import { AuditService } from '@/services/AuditService'
import { asyncHandler } from '@/middleware/errorHandler'

export const GET = asyncHandler(async (request: NextRequest) => {
  const searchParams = request.nextUrl.searchParams
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '50')
  const usuarioId = searchParams.get('usuarioId') || undefined
  const entidade = searchParams.get('entidade') || undefined
  const acao = searchParams.get('acao') || undefined
  const dataInicio = searchParams.get('dataInicio')
    ? new Date(searchParams.get('dataInicio')!)
    : undefined
  const dataFim = searchParams.get('dataFim')
    ? new Date(searchParams.get('dataFim')!)
    : undefined

  const result = await AuditService.buscarLogs({
    page,
    limit,
    usuarioId,
    entidade,
    acao,
    dataInicio,
    dataFim,
  })

  return NextResponse.json(result)
})



