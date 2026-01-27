import { NextRequest, NextResponse } from 'next/server'
import { DocumentService } from '@/services/DocumentService'
import { asyncHandler } from '@/middleware/errorHandler'

export const GET = asyncHandler(
  async (
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
  ) => {
    const params = await context.params
    const documento = await DocumentService.buscarPorId(params.id)
    return NextResponse.json(documento)
  }
)

export const DELETE = asyncHandler(
  async (
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
  ) => {
    const params = await context.params
    await DocumentService.deletar(params.id)
    return NextResponse.json({ message: 'Documento deletado com sucesso' })
  }
)



