import { NextRequest, NextResponse } from 'next/server'
import { RelatorioService } from '@/services/RelatorioService'
import { asyncHandler } from '@/middleware/errorHandler'
import { ValidationError } from '@/lib/errors'

export const POST = asyncHandler(async (request: NextRequest) => {
  const body = await request.json()
  const { dataInicio, dataFim, agruparPor } = body

  if (!dataInicio || !dataFim) {
    throw new ValidationError('dataInicio e dataFim são obrigatórios')
  }

  const relatorio = await RelatorioService.gerarRelatorioFinanceiro({
    dataInicio: new Date(dataInicio),
    dataFim: new Date(dataFim),
    agruparPor: agruparPor || 'mes',
  })

  return NextResponse.json(relatorio)
})



