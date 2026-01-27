import { NextRequest, NextResponse } from 'next/server'
import { DocumentService } from '@/services/DocumentService'
import { asyncHandler } from '@/middleware/errorHandler'

export const GET = asyncHandler(async (request: NextRequest) => {
  const searchParams = request.nextUrl.searchParams
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '20')
  const clienteId = searchParams.get('clienteId') || undefined
  const processoId = searchParams.get('processoId') || undefined
  const tipo = searchParams.get('tipo') || undefined

  const result = await DocumentService.listar({
    page,
    limit,
    clienteId,
    processoId,
    tipo,
  })

  return NextResponse.json(result)
})



