import { NextRequest, NextResponse } from 'next/server'
import { DocumentService } from '@/services/DocumentService'
import { asyncHandler } from '@/middleware/errorHandler'
import { ValidationError } from '@/lib/errors'

export const GET = asyncHandler(async (request: NextRequest) => {
  const searchParams = request.nextUrl.searchParams
  const clienteId = searchParams.get('clienteId')
  const nome = searchParams.get('nome')
  const tipo = searchParams.get('tipo')

  if (!clienteId || !nome || !tipo) {
    throw new ValidationError('clienteId, nome e tipo são obrigatórios')
  }

  const versoes = await DocumentService.listarVersoes(clienteId, nome, tipo)

  return NextResponse.json(versoes)
})

