import { NextRequest, NextResponse } from 'next/server'
import { ProcessoService } from '@/services/ProcessoService'
import { asyncHandler } from '@/middleware/errorHandler'

export const GET = asyncHandler(
  async (
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
  ) => {
    const params = await context.params
    const processo = await ProcessoService.buscarPorId(params.id)
    return NextResponse.json(processo)
  }
)

export const PUT = asyncHandler(
  async (
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
  ) => {
    const params = await context.params
    const body = await request.json()
    const processo = await ProcessoService.atualizar(params.id, body)
    return NextResponse.json(processo)
  }
)

export const DELETE = asyncHandler(
  async (
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
  ) => {
    const params = await context.params
    await ProcessoService.deletar(params.id)
    return NextResponse.json({ message: 'Processo deletado com sucesso' })
  }
)

