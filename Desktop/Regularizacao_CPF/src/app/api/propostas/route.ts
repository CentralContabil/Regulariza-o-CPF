import { NextRequest, NextResponse } from 'next/server'
import { PropostaService } from '@/services/PropostaService'
import { asyncHandler } from '@/middleware/errorHandler'

export const GET = asyncHandler(async (request: NextRequest) => {
  const searchParams = request.nextUrl.searchParams
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '20')
  const clienteId = searchParams.get('clienteId') || undefined
  const tipo = searchParams.get('tipo') || undefined
  const status = searchParams.get('status') || undefined

  const result = await PropostaService.listar({
    page,
    limit,
    clienteId,
    tipo,
    status,
  })

  return NextResponse.json(result)
})

export const POST = asyncHandler(async (request: NextRequest) => {
  const body = await request.json()

  // Se tem clienteId e diagnosticoId, gerar automaticamente
  if (body.clienteId && body.diagnosticoId) {
    const resultado = await PropostaService.gerarPropostaAutomatica(
      body.clienteId,
      body.diagnosticoId
    )
    return NextResponse.json(resultado, { status: 201 })
  }

  // Caso contrário, criar manualmente
  const proposta = await PropostaService.criar(body)
  return NextResponse.json(proposta, { status: 201 })
})



