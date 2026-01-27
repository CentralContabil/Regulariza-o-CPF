import { NextRequest, NextResponse } from 'next/server'
import { LGPDService } from '@/services/LGPDService'
import { asyncHandler } from '@/middleware/errorHandler'
import { ValidationError } from '@/lib/errors'

export const POST = asyncHandler(async (request: NextRequest) => {
  const body = await request.json()
  const { clienteId } = body

  if (!clienteId) {
    throw new ValidationError('clienteId é obrigatório')
  }

  const resultado = await LGPDService.anonimizarDados(clienteId)

  return NextResponse.json(resultado)
})



