import { NextRequest, NextResponse } from 'next/server'
import { PropostaService } from '@/services/PropostaService'
import { asyncHandler } from '@/middleware/errorHandler'

export const GET = asyncHandler(
  async (
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
  ) => {
    const params = await context.params
    const proposta = await PropostaService.buscarPorId(params.id)
    return NextResponse.json(proposta)
  }
)

export const PUT = asyncHandler(
  async (
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
  ) => {
    const params = await context.params
    const body = await request.json()
    const proposta = await PropostaService.atualizar(params.id, body)
    return NextResponse.json(proposta)
  }
)



