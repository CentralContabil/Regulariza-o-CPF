import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { NotFoundError } from '@/lib/errors'
import { asyncHandler } from '@/middleware/errorHandler'

export const GET = asyncHandler(
  async (
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
  ) => {
    const params = await context.params

    // Verificar se processo existe
    const processo = await prisma.processo.findUnique({
      where: { id: params.id },
    })

    if (!processo) {
      throw new NotFoundError('Processo')
    }

    const eventos = await prisma.evento.findMany({
      where: { processoId: params.id },
      orderBy: { data: 'desc' },
    })

    return NextResponse.json(eventos)
  }
)

export const POST = asyncHandler(
  async (
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
  ) => {
    const params = await context.params
    const body = await request.json()

    // Verificar se processo existe
    const processo = await prisma.processo.findUnique({
      where: { id: params.id },
    })

    if (!processo) {
      throw new NotFoundError('Processo')
    }

    const evento = await prisma.evento.create({
      data: {
        processoId: params.id,
        tipo: body.tipo || 'note',
        titulo: body.titulo,
        descricao: body.descricao,
        metadata: body.metadata || {},
      },
    })

    return NextResponse.json(evento, { status: 201 })
  }
)

