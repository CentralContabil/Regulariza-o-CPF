import { NextRequest, NextResponse } from 'next/server'
import { PaymentService } from '@/services/PaymentService'

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('stripe-signature')

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing stripe-signature header' },
        { status: 400 }
      )
    }

    await PaymentService.processarWebhook(body, signature)

    return NextResponse.json({ received: true })
  } catch (error: any) {
    console.error('Erro no webhook do Stripe:', error)
    return NextResponse.json(
      { error: error.message || 'Webhook processing failed' },
      { status: 400 }
    )
  }
}



