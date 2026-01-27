import { NextRequest, NextResponse } from 'next/server'
import { ClienteService } from '@/services/ClienteService'
import { asyncHandler } from '@/middleware/errorHandler'

export const GET = asyncHandler(async (request: NextRequest) => {
  const searchParams = request.nextUrl.searchParams
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '20')
  const search = searchParams.get('search') || undefined
  const estado = searchParams.get('estado') || undefined
  const situacaoCpf = searchParams.get('situacaoCpf') || undefined

  const result = await ClienteService.listar({
    page,
    limit,
    search,
    estado,
    situacaoCpf,
  })

  return NextResponse.json(result)
})

export const POST = asyncHandler(async (request: NextRequest) => {
  const body = await request.json()

  const cliente = await ClienteService.criar(body)

  return NextResponse.json(cliente, { status: 201 })
})



