import { NextRequest, NextResponse } from 'next/server'
import { DiagnosticoAutomaticoService } from '@/services/DiagnosticoAutomaticoService'
import { asyncHandler } from '@/middleware/errorHandler'
import type { PreDiagnosticoForm } from '@/types/form'

export const POST = asyncHandler(async (request: NextRequest) => {
  const body: PreDiagnosticoForm = await request.json()
  const diagnosticoId = request.nextUrl.searchParams.get('diagnosticoId') || undefined

  const resultado = await DiagnosticoAutomaticoService.processarDiagnostico(
    body,
    diagnosticoId
  )

  return NextResponse.json({
    success: true,
    relatorio: resultado.relatorio,
    diagnosticoId: resultado.diagnostico.id,
    clienteId: resultado.cliente.id,
  })
})



