import { NextRequest, NextResponse } from 'next/server'
import { RelatorioService } from '@/services/RelatorioService'
import { asyncHandler } from '@/middleware/errorHandler'
import { ValidationError } from '@/lib/errors'

export const POST = asyncHandler(async (request: NextRequest) => {
  const body = await request.json()
  const { tipo, ...params } = body

  if (!tipo || !['financeiro', 'conversao', 'processos'].includes(tipo)) {
    throw new ValidationError(
      'tipo deve ser: financeiro, conversao ou processos'
    )
  }

  if (!params.dataInicio || !params.dataFim) {
    throw new ValidationError('dataInicio e dataFim são obrigatórios')
  }

  // Converter datas
  const paramsFormatados = {
    ...params,
    dataInicio: new Date(params.dataInicio),
    dataFim: new Date(params.dataFim),
  }

  const relatorio = await RelatorioService.exportarRelatorio(
    tipo as 'financeiro' | 'conversao' | 'processos',
    paramsFormatados
  )

  return NextResponse.json(relatorio)
})



