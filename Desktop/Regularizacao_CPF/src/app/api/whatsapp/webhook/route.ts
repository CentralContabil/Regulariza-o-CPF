import { NextRequest, NextResponse } from 'next/server'
import { WhatsAppService } from '@/services/WhatsAppService'
import type { WhatsAppWebhook } from '@/services/WhatsAppService'

// GET - Verificação do webhook (requerido pelo WhatsApp)
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const mode = searchParams.get('hub.mode')
  const token = searchParams.get('hub.verify_token')
  const challenge = searchParams.get('hub.challenge')

  if (mode && token && challenge) {
    const result = WhatsAppService.verificarWebhook(mode, token, challenge)
    if (result) {
      return new NextResponse(result, { status: 200 })
    }
  }

  return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
}

// POST - Receber webhooks do WhatsApp
export async function POST(request: NextRequest) {
  try {
    // Validar assinatura (se configurada)
    const signature = request.headers.get('x-hub-signature-256') || ''
    const body = await request.text()

    if (
      signature &&
      !WhatsAppService.validarAssinaturaWebhook(body, signature)
    ) {
      console.error('Assinatura do webhook inválida')
      return NextResponse.json({ error: 'Invalid signature' }, { status: 403 })
    }

    const webhook: WhatsAppWebhook = JSON.parse(body)

    // Processar webhook em background (não bloquear resposta)
    WhatsAppService.processarWebhook(webhook).catch((error) => {
      console.error('Erro ao processar webhook:', error)
    })

    // WhatsApp espera resposta 200 imediatamente
    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error: any) {
    console.error('Erro no webhook do WhatsApp:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}



