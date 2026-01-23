import { NextRequest, NextResponse } from 'next/server'
import { ReceitaFederalService } from '@/services/ReceitaFederalService'
import { asyncHandler } from '@/middleware/errorHandler'
import { ValidationError } from '@/lib/errors'

export const POST = asyncHandler(async (request: NextRequest) => {
  const body = await request.json()
  const { cpf } = body

  if (!cpf) {
    throw new ValidationError('CPF é obrigatório')
  }

  if (!ReceitaFederalService.validarCPF(cpf)) {
    throw new ValidationError('CPF inválido')
  }

  const resultado = await ReceitaFederalService.consultarSituacaoCPF(cpf)

  return NextResponse.json(resultado)
})

