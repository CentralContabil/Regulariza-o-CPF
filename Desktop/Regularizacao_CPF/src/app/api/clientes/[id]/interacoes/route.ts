import { NextRequest, NextResponse } from 'next/server'
import { InteracaoService } from '@/services/InteracaoService'
import { asyncHandler } from '@/middleware/errorHandler'

export const GET = asyncHandler(
  async (
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
  ) => {
    const params = await context.params
    const searchParams = request.nextUrl.searchParams
    const limit = parseInt(searchParams.get('limit') || '50')

    const interacoes = await InteracaoService.listarPorCliente(
      params.id,
      limit
    )

    return NextResponse.json(interacoes)
  }
)

export const POST = asyncHandler(
  async (
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
  ) => {
    const params = await context.params
    const body = await request.json()

    const interacao = await InteracaoService.criar({
      ...body,
      clienteId: params.id,
    })

    return NextResponse.json(interacao, { status: 201 })
  }
)



