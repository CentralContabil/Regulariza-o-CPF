import { NextRequest, NextResponse } from 'next/server'
import { DocumentService } from '@/services/DocumentService'
import { asyncHandler } from '@/middleware/errorHandler'

export const GET = asyncHandler(
  async (
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
  ) => {
    const params = await context.params
    const searchParams = request.nextUrl.searchParams
    const expiracao = parseInt(searchParams.get('expiracao') || '3600')

    const url = await DocumentService.gerarUrlDownload(params.id, expiracao)

    return NextResponse.json({
      success: true,
      downloadUrl: url,
      expiresIn: expiracao,
    })
  }
)

