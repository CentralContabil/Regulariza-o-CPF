import { NextRequest, NextResponse } from 'next/server'
import { PropostaService } from '@/services/PropostaService'
import { asyncHandler } from '@/middleware/errorHandler'
import { ValidationError } from '@/lib/errors'

export const POST = asyncHandler(
  async (
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
  ) => {
    const params = await context.params
    const body = await request.json()
    const { canal } = body

    if (!canal || !['email', 'whatsapp', 'ambos'].includes(canal)) {
      throw new ValidationError(
        'Canal é obrigatório e deve ser: email, whatsapp ou ambos'
      )
    }

    if (canal === 'email' || canal === 'ambos') {
      await PropostaService.enviarPorEmail(params.id)
    }

    if (canal === 'whatsapp' || canal === 'ambos') {
      await PropostaService.enviarPorWhatsApp(params.id)
    }

    return NextResponse.json({
      success: true,
      message: `Proposta enviada por ${canal}`,
    })
  }
)



