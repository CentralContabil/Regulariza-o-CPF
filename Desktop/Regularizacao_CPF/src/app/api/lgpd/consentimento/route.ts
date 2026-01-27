import { NextRequest, NextResponse } from 'next/server'
import { LGPDService } from '@/services/LGPDService'
import { asyncHandler } from '@/middleware/errorHandler'
import { ValidationError } from '@/lib/errors'

export const POST = asyncHandler(async (request: NextRequest) => {
  const body = await request.json()
  const { clienteId, tipo, consentido } = body

  if (!clienteId || !tipo || typeof consentido !== 'boolean') {
    throw new ValidationError('clienteId, tipo e consentido são obrigatórios')
  }

  if (!['marketing', 'comunicacao', 'processamento'].includes(tipo)) {
    throw new ValidationError('tipo deve ser: marketing, comunicacao ou processamento')
  }

  const consentimento = await LGPDService.registrarConsentimento(
    clienteId,
    tipo as 'marketing' | 'comunicacao' | 'processamento',
    consentido
  )

  return NextResponse.json({ success: true, consentimento })
})

export const GET = asyncHandler(async (request: NextRequest) => {
  const searchParams = request.nextUrl.searchParams
  const clienteId = searchParams.get('clienteId')
  const tipo = searchParams.get('tipo')

  if (!clienteId || !tipo) {
    throw new ValidationError('clienteId e tipo são obrigatórios')
  }

  const consentido = await LGPDService.verificarConsentimento(
    clienteId,
    tipo as 'marketing' | 'comunicacao' | 'processamento'
  )

  return NextResponse.json({ consentido })
})



