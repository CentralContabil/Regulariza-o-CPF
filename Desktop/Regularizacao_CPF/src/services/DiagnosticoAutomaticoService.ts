import { prisma } from '@/lib/prisma'
import type { PreDiagnosticoForm } from '@/types/form'

export interface ChecklistItem {
  id: string
  titulo: string
  descricao: string
  obrigatorio: boolean
  categoria: string
}

export interface RelatorioDiagnostico {
  tipoCaso: string
  classificacao: string
  prioridade: 'alta' | 'media' | 'baixa'
  resumo: string
  recomendacoes: string[]
  checklist: ChecklistItem[]
  estimativaTempo: string
  proximosPassos: string[]
}

export class DiagnosticoAutomaticoService {
  /**
   * Analisa o formulário e classifica o tipo de caso
   */
  static classificarCaso(formData: PreDiagnosticoForm): string {
    // Prioridade 1: CPF irregular
    if (
      formData.situacaoCpf === 'pendente' ||
      formData.situacaoCpf === 'suspenso' ||
      formData.situacaoCpf === 'cancelado'
    ) {
      return 'cpf-irregular'
    }

    // Prioridade 2: IRPF atrasado
    if (
      formData.statusIrpf === 'atrasado' ||
      formData.statusIrpf === 'preciso-retificar'
    ) {
      return 'ir-atrasado'
    }

    // Prioridade 3: Saída Definitiva
    if (formData.saidaDefinitiva === 'nao-sei' || formData.saidaDefinitiva === 'nao') {
      return 'saida-definitiva'
    }

    // Caso geral
    return 'geral'
  }

  /**
   * Gera checklist de documentos baseado no tipo de caso
   */
  static gerarChecklist(tipoCaso: string): ChecklistItem[] {
    const checklists: Record<string, ChecklistItem[]> = {
      'cpf-irregular': [
        {
          id: 'cpf-1',
          titulo: 'CPF (cópia)',
          descricao: 'Cópia do CPF atualizado',
          obrigatorio: true,
          categoria: 'identificacao',
        },
        {
          id: 'cpf-2',
          titulo: 'RG ou CNH (cópia)',
          descricao: 'Documento de identidade válido',
          obrigatorio: true,
          categoria: 'identificacao',
        },
        {
          id: 'cpf-3',
          titulo: 'Comprovante de Residência nos EUA',
          descricao: 'Conta de luz, água, internet ou contrato de aluguel',
          obrigatorio: true,
          categoria: 'residencia',
        },
        {
          id: 'cpf-4',
          titulo: 'Comprovante de Situação Cadastral',
          descricao: 'Consulta na Receita Federal (se disponível)',
          obrigatorio: false,
          categoria: 'fiscal',
        },
      ],
      'ir-atrasado': [
        {
          id: 'ir-1',
          titulo: 'CPF (cópia)',
          descricao: 'Cópia do CPF',
          obrigatorio: true,
          categoria: 'identificacao',
        },
        {
          id: 'ir-2',
          titulo: 'Declarações de IRPF Anteriores',
          descricao: 'Últimas declarações entregues (se houver)',
          obrigatorio: false,
          categoria: 'fiscal',
        },
        {
          id: 'ir-3',
          titulo: 'Comprovantes de Rendimentos',
          descricao: 'Rendimentos do Brasil dos anos em atraso',
          obrigatorio: true,
          categoria: 'fiscal',
        },
        {
          id: 'ir-4',
          titulo: 'Comprovantes de Despesas Dedutíveis',
          descricao: 'Despesas médicas, educacionais, etc. (se aplicável)',
          obrigatorio: false,
          categoria: 'fiscal',
        },
        {
          id: 'ir-5',
          titulo: 'Informe de Rendimentos',
          descricao: 'Informes de bancos, corretoras, etc.',
          obrigatorio: false,
          categoria: 'fiscal',
        },
      ],
      'saida-definitiva': [
        {
          id: 'sd-1',
          titulo: 'CPF (cópia)',
          descricao: 'Cópia do CPF',
          obrigatorio: true,
          categoria: 'identificacao',
        },
        {
          id: 'sd-2',
          titulo: 'Comprovante de Residência nos EUA',
          descricao: 'Comprovante de residência permanente',
          obrigatorio: true,
          categoria: 'residencia',
        },
        {
          id: 'sd-3',
          titulo: 'Visto de Residência Permanente',
          descricao: 'Green Card ou equivalente',
          obrigatorio: true,
          categoria: 'residencia',
        },
        {
          id: 'sd-4',
          titulo: 'Declarações de IRPF',
          descricao: 'Últimas declarações antes da saída',
          obrigatorio: false,
          categoria: 'fiscal',
        },
        {
          id: 'sd-5',
          titulo: 'Comprovante de Saída do Brasil',
          descricao: 'Passaporte com carimbo de saída ou equivalente',
          obrigatorio: false,
          categoria: 'residencia',
        },
      ],
      geral: [
        {
          id: 'geral-1',
          titulo: 'CPF (cópia)',
          descricao: 'Cópia do CPF',
          obrigatorio: true,
          categoria: 'identificacao',
        },
        {
          id: 'geral-2',
          titulo: 'RG ou CNH (cópia)',
          descricao: 'Documento de identidade',
          obrigatorio: true,
          categoria: 'identificacao',
        },
        {
          id: 'geral-3',
          titulo: 'Comprovante de Residência nos EUA',
          descricao: 'Comprovante de residência atual',
          obrigatorio: true,
          categoria: 'residencia',
        },
      ],
    }

    return checklists[tipoCaso] || checklists.geral
  }

  /**
   * Gera recomendações baseadas na classificação
   */
  static gerarRecomendacoes(tipoCaso: string): string[] {
    const recomendacoes: Record<string, string[]> = {
      'cpf-irregular': [
        'Verificar situação cadastral na Receita Federal',
        'Identificar pendências fiscais específicas',
        'Preparar documentos para regularização cadastral',
        'Verificar necessidade de entrega de declarações em atraso',
        'Avaliar impacto em operações bancárias',
      ],
      'ir-atrasado': [
        'Entregar declarações de IRPF em atraso',
        'Verificar necessidade de retificações',
        'Organizar documentos dos exercícios pendentes',
        'Calcular multas e juros (se aplicável)',
        'Planejar entrega de forma estratégica',
      ],
      'saida-definitiva': [
        'Avaliar necessidade de comunicação de Saída Definitiva',
        'Verificar impactos fiscais da saída',
        'Preparar documentação necessária',
        'Avaliar implicações em investimentos no Brasil',
        'Planejar estratégia de comunicação',
      ],
      geral: [
        'Realizar diagnóstico completo da situação fiscal',
        'Verificar situação cadastral na Receita Federal',
        'Avaliar pendências fiscais',
        'Planejar estratégia de regularização',
      ],
    }

    return recomendacoes[tipoCaso] || recomendacoes.geral
  }

  /**
   * Determina a prioridade do caso
   */
  static determinarPrioridade(tipoCaso: string, formData: PreDiagnosticoForm): 'alta' | 'media' | 'baixa' {
    // Alta prioridade: CPF suspenso ou cancelado
    if (
      formData.situacaoCpf === 'suspenso' ||
      formData.situacaoCpf === 'cancelado'
    ) {
      return 'alta'
    }

    // Alta prioridade: IRPF muito atrasado (mais de 3 anos)
    if (formData.statusIrpf === 'atrasado') {
      return 'alta'
    }

    // Média prioridade: CPF pendente ou IRPF precisa retificar
    if (
      formData.situacaoCpf === 'pendente' ||
      formData.statusIrpf === 'preciso-retificar'
    ) {
      return 'media'
    }

    // Baixa prioridade: casos preventivos ou dúvidas
    return 'baixa'
  }

  /**
   * Gera estimativa de tempo baseada no tipo de caso
   */
  static gerarEstimativaTempo(tipoCaso: string, prioridade: string): string {
    const estimativas: Record<string, Record<string, string>> = {
      'cpf-irregular': {
        alta: '2-4 semanas',
        media: '3-6 semanas',
        baixa: '4-8 semanas',
      },
      'ir-atrasado': {
        alta: '4-8 semanas',
        media: '6-10 semanas',
        baixa: '8-12 semanas',
      },
      'saida-definitiva': {
        alta: '3-6 semanas',
        media: '4-8 semanas',
        baixa: '6-10 semanas',
      },
      geral: {
        alta: '2-4 semanas',
        media: '3-6 semanas',
        baixa: '4-8 semanas',
      },
    }

    return (
      estimativas[tipoCaso]?.[prioridade] ||
      estimativas.geral[prioridade] ||
      '4-8 semanas'
    )
  }

  /**
   * Gera próximos passos
   */
  static gerarProximosPassos(tipoCaso: string): string[] {
    const passos: Record<string, string[]> = {
      'cpf-irregular': [
        'Coletar documentos necessários',
        'Verificar situação na Receita Federal',
        'Preparar documentação para regularização',
        'Entregar documentos e solicitações',
        'Acompanhar processamento',
      ],
      'ir-atrasado': [
        'Organizar documentos dos exercícios pendentes',
        'Preparar declarações de IRPF',
        'Revisar cálculos e deduções',
        'Entregar declarações',
        'Acompanhar processamento e possíveis retificações',
      ],
      'saida-definitiva': [
        'Avaliar necessidade de comunicação',
        'Preparar documentação comprobatória',
        'Comunicar Saída Definitiva à Receita Federal',
        'Acompanhar processamento',
        'Verificar atualização cadastral',
      ],
      geral: [
        'Realizar diagnóstico completo',
        'Coletar documentos necessários',
        'Planejar estratégia de regularização',
        'Iniciar processo de regularização',
        'Acompanhar progresso',
      ],
    }

    return passos[tipoCaso] || passos.geral
  }

  /**
   * Gera resumo do diagnóstico
   */
  static gerarResumo(tipoCaso: string, formData: PreDiagnosticoForm): string {
    const resumos: Record<string, string> = {
      'cpf-irregular': `Seu CPF está com situação ${formData.situacaoCpf}, o que pode impedir operações bancárias e outras transações no Brasil. É necessário regularizar a situação cadastral junto à Receita Federal.`,
      'ir-atrasado': `Você possui declarações de IRPF em atraso ou que precisam ser retificadas. É importante entregar essas declarações para evitar acúmulo de multas e juros, além de regularizar sua situação fiscal.`,
      'saida-definitiva': `Você precisa avaliar se deve comunicar sua Saída Definitiva do Brasil à Receita Federal. Isso tem implicações fiscais importantes e deve ser feito corretamente.`,
      geral: `Sua situação fiscal precisa ser avaliada com mais detalhes. Recomendamos um diagnóstico completo para identificar todas as pendências e planejar a regularização adequada.`,
    }

    return resumos[tipoCaso] || resumos.geral
  }

  /**
   * Gera relatório completo de diagnóstico
   */
  static async gerarRelatorio(
    formData: PreDiagnosticoForm
  ): Promise<RelatorioDiagnostico> {
    const tipoCaso = this.classificarCaso(formData)
    const prioridade = this.determinarPrioridade(tipoCaso, formData)
    const checklist = this.gerarChecklist(tipoCaso)
    const recomendacoes = this.gerarRecomendacoes(tipoCaso)
    const estimativaTempo = this.gerarEstimativaTempo(tipoCaso, prioridade)
    const proximosPassos = this.gerarProximosPassos(tipoCaso)
    const resumo = this.gerarResumo(tipoCaso, formData)

    return {
      tipoCaso,
      classificacao: tipoCaso,
      prioridade,
      resumo,
      recomendacoes,
      checklist,
      estimativaTempo,
      proximosPassos,
    }
  }

  /**
   * Salva diagnóstico no banco e cria cliente se necessário
   */
  static async processarDiagnostico(
    formData: PreDiagnosticoForm,
    diagnosticoId?: string
  ) {
    const relatorio = await this.gerarRelatorio(formData)

    // Verificar se já existe cliente com este CPF
    const cpfSanitizado = formData.cpf.replace(/\D/g, '').slice(0, 11)
    let cliente = await prisma.cliente.findUnique({
      where: { cpf: cpfSanitizado },
    })

    // Criar cliente se não existir
    if (!cliente) {
      cliente = await prisma.cliente.create({
        data: {
          nomeCompleto: formData.nomeCompleto,
          email: formData.email,
          whatsapp: formData.whatsapp,
          cpf: cpfSanitizado,
          estado: formData.estado,
          situacaoCpf: formData.situacaoCpf,
          statusIrpf: formData.statusIrpf,
          dataResidenciaEua: formData.dataResidenciaEua,
          saidaDefinitiva: formData.saidaDefinitiva,
        },
      })
    }

    // Atualizar ou criar diagnóstico
    let diagnostico
    if (diagnosticoId) {
      diagnostico = await prisma.diagnostico.update({
        where: { id: diagnosticoId },
        data: {
          clienteId: cliente.id,
          resultado: relatorio as any,
          classificacao: relatorio.classificacao,
        },
      })
    } else {
      diagnostico = await prisma.diagnostico.create({
        data: {
          clienteId: cliente.id,
          email: formData.email,
          nome: formData.nomeCompleto,
          whatsapp: formData.whatsapp,
          estado: formData.estado,
          cpf: cpfSanitizado,
          situacaoCpf: formData.situacaoCpf,
          statusIrpf: formData.statusIrpf,
          dataResidenciaEua: formData.dataResidenciaEua,
          saidaDefinitiva: formData.saidaDefinitiva,
          resultado: relatorio as any,
          classificacao: relatorio.classificacao,
        },
      })
    }

    return {
      diagnostico,
      relatorio,
      cliente,
    }
  }
}



