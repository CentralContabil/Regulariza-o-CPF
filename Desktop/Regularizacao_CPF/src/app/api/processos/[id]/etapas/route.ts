import { NextRequest, NextResponse } from 'next/server'
import { ProcessoService } from '@/services/ProcessoService'
import { asyncHandler } from '@/middleware/errorHandler'

export const PUT = asyncHandler(
  async (
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
  ) => {
    const params = await context.params
    const body = await request.json()
    const { etapaId, ...dadosEtapa } = body

    if (!etapaId) {
      return NextResponse.json(
        { error: 'etapaId é obrigatório' },
        { status: 400 }
      )
    }

    const processo = await ProcessoService.atualizarEtapa(
      params.id,
      etapaId,
      dadosEtapa
    )

    return NextResponse.json(processo)
  }
)

