import { NextRequest, NextResponse } from 'next/server'
import { ClienteService } from '@/services/ClienteService'
import { asyncHandler } from '@/middleware/errorHandler'

export const GET = asyncHandler(
  async (
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
  ) => {
    const params = await context.params
    const cliente = await ClienteService.buscarPorId(params.id)
    return NextResponse.json(cliente)
  }
)

export const PUT = asyncHandler(
  async (
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
  ) => {
    const params = await context.params
    const body = await request.json()
    const cliente = await ClienteService.atualizar(params.id, body)
    return NextResponse.json(cliente)
  }
)

export const DELETE = asyncHandler(
  async (
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
  ) => {
    const params = await context.params
    await ClienteService.deletar(params.id)
    return NextResponse.json({ message: 'Cliente deletado com sucesso' })
  }
)
