import { NextRequest, NextResponse } from 'next/server'
import { AutomacaoService } from '@/services/AutomacaoService'
import { asyncHandler } from '@/middleware/errorHandler'

export const POST = asyncHandler(async (_request: NextRequest) => {
  const resultado = await AutomacaoService.enviarLembretesIRPF()
  return NextResponse.json(resultado)
})

