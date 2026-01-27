import { NextRequest, NextResponse } from 'next/server'
import { ProcessoService } from '@/services/ProcessoService'
import { asyncHandler } from '@/middleware/errorHandler'

export const GET = asyncHandler(async (request: NextRequest) => {
  const searchParams = request.nextUrl.searchParams
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '20')
  const clienteId = searchParams.get('clienteId') || undefined
  const tipo = searchParams.get('tipo') || undefined
  const status = searchParams.get('status') || undefined

  const result = await ProcessoService.listar({
    page,
    limit,
    clienteId,
    tipo,
    status,
  })

  return NextResponse.json(result)
})

export const POST = asyncHandler(async (request: NextRequest) => {
  const body = await request.json()

  const processo = await ProcessoService.criar(body)

  return NextResponse.json(processo, { status: 201 })
})



