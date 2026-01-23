import { NextRequest, NextResponse } from 'next/server'
import { AppError } from '@/lib/errors'

export function errorHandler(error: unknown) {
  console.error('Error:', error)

  if (error instanceof AppError) {
    return NextResponse.json(
      {
        error: error.message,
        code: error.code,
        ...(error instanceof Error && 'fields' in error
          ? { fields: (error as any).fields }
          : {}),
      },
      { status: error.statusCode }
    )
  }

  if (error instanceof Error) {
    return NextResponse.json(
      { error: error.message || 'Erro interno do servidor' },
      { status: 500 }
    )
  }

  return NextResponse.json(
    { error: 'Erro interno do servidor' },
    { status: 500 }
  )
}

export function asyncHandler(
  fn: (req: NextRequest, context?: any) => Promise<NextResponse>
) {
  return async (req: NextRequest, context?: any) => {
    try {
      return await fn(req, context)
    } catch (error) {
      return errorHandler(error)
    }
  }
}
