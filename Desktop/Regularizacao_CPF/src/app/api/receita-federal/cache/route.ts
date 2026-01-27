import { NextRequest, NextResponse } from 'next/server'
import { ReceitaFederalService } from '@/services/ReceitaFederalService'
import { asyncHandler } from '@/middleware/errorHandler'

export const DELETE = asyncHandler(async (request: NextRequest) => {
  const searchParams = request.nextUrl.searchParams
  const cpf = searchParams.get('cpf')

  if (cpf) {
    ReceitaFederalService.limparCache(cpf)
    return NextResponse.json({ message: `Cache limpo para CPF ${cpf}` })
  } else {
    ReceitaFederalService.limparCache()
    return NextResponse.json({ message: 'Todo o cache foi limpo' })
  }
})



