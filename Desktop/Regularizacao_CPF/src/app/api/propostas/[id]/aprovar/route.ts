import { NextRequest, NextResponse } from 'next/server'
import { PropostaService } from '@/services/PropostaService'
import { asyncHandler } from '@/middleware/errorHandler'

export const POST = asyncHandler(
  async (
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
  ) => {
    const params = await context.params
    const proposta = await PropostaService.aprovar(params.id)
    return NextResponse.json(proposta)
  }
)



