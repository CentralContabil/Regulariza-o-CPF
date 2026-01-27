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
    const diagnostico = await prisma.diagnostico.findUnique({
      where: { id: params.id },
    })

    if (!diagnostico) {
      throw new NotFoundError('Diagnóstico')
    }

    return NextResponse.json({
      diagnostico,
      relatorio: diagnostico.resultado,
    })
  }
)



