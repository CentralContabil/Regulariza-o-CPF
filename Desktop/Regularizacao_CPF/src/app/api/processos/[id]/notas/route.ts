import { NextRequest, NextResponse } from 'next/server'
import { ProcessoService } from '@/services/ProcessoService'
import { asyncHandler } from '@/middleware/errorHandler'

export const POST = asyncHandler(
  async (
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
  ) => {
    const params = await context.params
    const body = await request.json()

    if (!body.nota) {
      return NextResponse.json(
        { error: 'nota é obrigatória' },
        { status: 400 }
      )
    }

    const processo = await ProcessoService.adicionarNota(
      params.id,
      body.nota
    )

    return NextResponse.json(processo)
  }
)

