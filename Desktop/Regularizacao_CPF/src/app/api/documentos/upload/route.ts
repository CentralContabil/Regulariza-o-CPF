import { NextRequest, NextResponse } from 'next/server'
import { DocumentService } from '@/services/DocumentService'
import { asyncHandler } from '@/middleware/errorHandler'
import { ValidationError } from '@/lib/errors'

export const POST = asyncHandler(async (request: NextRequest) => {
  const formData = await request.formData()

  const clienteId = formData.get('clienteId') as string
  const processoId = formData.get('processoId') as string | null
  const nome = formData.get('nome') as string
  const tipo = formData.get('tipo') as string
  const arquivo = formData.get('arquivo') as File

  if (!clienteId || !nome || !tipo || !arquivo) {
    throw new ValidationError('Campos obrigatórios: clienteId, nome, tipo, arquivo')
  }

  const buffer = Buffer.from(await arquivo.arrayBuffer())

  const documento = await DocumentService.uploadDocument({
    clienteId,
    processoId: processoId || undefined,
    nome,
    tipo,
    arquivo: buffer,
    mimeType: arquivo.type,
    tamanho: arquivo.size,
  })

  return NextResponse.json(documento, { status: 201 })
})



