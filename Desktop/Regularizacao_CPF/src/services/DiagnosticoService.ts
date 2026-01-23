import { prisma } from '@/lib/prisma'
import type { PreDiagnosticoForm } from '@/types/form'

export class DiagnosticoService {
  /**
   * Classifica o tipo de caso baseado no formulário
   */
  static classificarCaso(formData: PreDiagnosticoForm): string {
    if (formData.situacaoCpf !== 'regular' && formData.situacaoCpf !== 'nao-sei') {
      return 'cpf-irregular'
    }
    if (formData.statusIrpf === 'atrasado' || formData.statusIrpf === 'preciso-retificar') {
      return 'ir-atrasado'
    }
    if (formData.saidaDefinitiva === 'nao-sei' || formData.saidaDefinitiva === 'nao') {
      return 'saida-definitiva'
    }
    return 'geral'
  }

  /**
   * Gera recomendações baseadas na classificação
   */
  static gerarRecomendacoes(classificacao: string): string[] {
    const recomendacoes: Record<string, string[]> = {
      'cpf-irregular': [
        'Verificar situação cadastral na Receita Federal',
        'Identificar pendências fiscais',
        'Preparar documentos para regularização',
      ],
      'ir-atrasado': [
        'Entregar declarações de IRPF em atraso',
        'Verificar necessidade de retificações',
        'Organizar documentos dos exercícios pendentes',
      ],
      'saida-definitiva': [
        'Avaliar necessidade de comunicação de Saída Definitiva',
        'Verificar impactos fiscais',
        'Preparar documentação necessária',
      ],
      geral: [
        'Realizar diagnóstico completo',
        'Verificar situação cadastral',
        'Avaliar pendências fiscais',
      ],
    }

    return recomendacoes[classificacao] || recomendacoes.geral
  }

  /**
   * Cria um novo diagnóstico
   */
  static async criarDiagnostico(formData: PreDiagnosticoForm) {
    const classificacao = this.classificarCaso(formData)
    const recomendacoes = this.gerarRecomendacoes(classificacao)

    return await prisma.diagnostico.create({
      data: {
        email: formData.email,
        nome: formData.nomeCompleto,
        whatsapp: formData.whatsapp,
        estado: formData.estado,
        cpf: formData.cpf,
        situacaoCpf: formData.situacaoCpf,
        statusIrpf: formData.statusIrpf,
        dataResidenciaEua: formData.dataResidenciaEua,
        saidaDefinitiva: formData.saidaDefinitiva,
        classificacao,
        resultado: {
          tipoCaso: classificacao,
          recomendacoes,
        },
      },
    })
  }

  /**
   * Busca diagnóstico por ID
   */
  static async buscarPorId(id: string) {
    return await prisma.diagnostico.findUnique({
      where: { id },
    })
  }

  /**
   * Busca diagnóstico por email
   */
  static async buscarPorEmail(email: string) {
    return await prisma.diagnostico.findFirst({
      where: { email },
      orderBy: { createdAt: 'desc' },
    })
  }
}

