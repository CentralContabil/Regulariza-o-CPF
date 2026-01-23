import { NextRequest, NextResponse } from 'next/server'
import {
  validateCPF,
  validateEmail,
  validateWhatsApp,
  sanitizeCPF,
  sanitizeWhatsApp,
} from '@/lib/validation'
import { ValidationError } from '@/lib/errors'
import { DiagnosticoService } from '@/services/DiagnosticoService'
import { asyncHandler } from '@/middleware/errorHandler'
import type { PreDiagnosticoForm } from '@/types/form'

export const POST = asyncHandler(async (request: NextRequest) => {
  const body: PreDiagnosticoForm = await request.json()

  // Validações
  if (!body.nomeCompleto?.trim()) {
    throw new ValidationError('Nome completo é obrigatório')
  }

  if (!body.email?.trim() || !validateEmail(body.email)) {
    throw new ValidationError('E-mail inválido')
  }

  if (!body.whatsapp?.trim() || !validateWhatsApp(body.whatsapp)) {
    throw new ValidationError('WhatsApp inválido')
  }

  if (!body.cpf?.trim() || !validateCPF(body.cpf)) {
    throw new ValidationError('CPF inválido')
  }

  if (!body.estado) {
    throw new ValidationError('Estado é obrigatório')
  }

  if (!body.consentimentoLgpd) {
    throw new ValidationError('É necessário aceitar o consentimento LGPD')
  }

  // Sanitizar dados
  const formDataSanitizado: PreDiagnosticoForm = {
    ...body,
    cpf: sanitizeCPF(body.cpf),
    whatsapp: sanitizeWhatsApp(body.whatsapp),
  }

  // Criar diagnóstico inicial
  const diagnostico = await DiagnosticoService.criarDiagnostico(
    formDataSanitizado
  )

  // Processar diagnóstico automático em background
  // (Não bloqueia a resposta)
  import('@/services/DiagnosticoAutomaticoService').then(({ DiagnosticoAutomaticoService }) => {
    DiagnosticoAutomaticoService.processarDiagnostico(
      formDataSanitizado,
      diagnostico.id
    ).catch((error) => {
      console.error('Erro ao processar diagnóstico automático:', error)
    })
  })

  // TODO: Enviar email de confirmação
  // TODO: Enviar notificação para equipe

  return NextResponse.json(
    {
      success: true,
      message: 'Formulário recebido com sucesso',
      diagnosticoId: diagnostico.id,
      classificacao: diagnostico.classificacao,
    },
    { status: 200 }
  )
})
