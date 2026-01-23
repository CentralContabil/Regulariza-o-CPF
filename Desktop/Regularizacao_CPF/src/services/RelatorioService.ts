import { prisma } from '@/lib/prisma'

export interface RelatorioFinanceiroParams {
  dataInicio: Date
  dataFim: Date
  agruparPor?: 'dia' | 'semana' | 'mes'
}

export interface RelatorioConversaoParams {
  dataInicio: Date
  dataFim: Date
}

export interface RelatorioProcessosParams {
  dataInicio: Date
  dataFim: Date
  tipo?: string
  status?: string
}

export class RelatorioService {
  /**
   * Gera relatório financeiro
   */
  static async gerarRelatorioFinanceiro(params: RelatorioFinanceiroParams) {
    const { dataInicio, dataFim, agruparPor = 'mes' } = params

    // Total de receita no período
    const receitaTotal = await prisma.pagamento.aggregate({
      where: {
        status: 'aprovado',
        createdAt: {
          gte: dataInicio,
          lte: dataFim,
        },
      },
      _sum: { valor: true },
      _count: { id: true },
    })

    // Receita por método de pagamento
    const receitaPorMetodo = await prisma.pagamento.groupBy({
      by: ['metodo'],
      where: {
        status: 'aprovado',
        createdAt: {
          gte: dataInicio,
          lte: dataFim,
        },
      },
      _sum: { valor: true },
      _count: { id: true },
    })

    // Receita agrupada por período
    const receitaAgrupada = await this.agruparReceitaPorPeriodo(
      dataInicio,
      dataFim,
      agruparPor
    )

    // Propostas no período
    const propostas = await prisma.proposta.findMany({
      where: {
        createdAt: {
          gte: dataInicio,
          lte: dataFim,
        },
      },
      include: {
        cliente: {
          select: {
            nomeCompleto: true,
            email: true,
          },
        },
        pagamentos: {
          where: { status: 'aprovado' },
        },
      },
    })

    // Cálculo de inadimplência
    const propostasAprovadas = propostas.filter((p) => p.status === 'aprovada')
    const propostasPagas = propostasAprovadas.filter(
      (p) => p.pagamentos.length > 0
    )
    const taxaInadimplencia =
      propostasAprovadas.length > 0
        ? ((propostasAprovadas.length - propostasPagas.length) /
            propostasAprovadas.length) *
          100
        : 0

    return {
      periodo: {
        inicio: dataInicio,
        fim: dataFim,
      },
      resumo: {
        receitaTotal: Number(receitaTotal._sum.valor || 0),
        totalPagamentos: receitaTotal._count.id,
        valorMedioPagamento:
          receitaTotal._count.id > 0
            ? Number(receitaTotal._sum.valor || 0) / receitaTotal._count.id
            : 0,
        taxaInadimplencia,
      },
      receitaPorMetodo: receitaPorMetodo.map((r) => ({
        metodo: r.metodo || 'N/A',
        receita: Number(r._sum.valor || 0),
        quantidade: r._count.id,
      })),
      receitaAgrupada,
      propostas: propostas.map((p) => ({
        id: p.id,
        tipo: p.tipo,
        valor: Number(p.valor),
        status: p.status,
        cliente: p.cliente.nomeCompleto,
        email: p.cliente.email,
        pago: p.pagamentos.length > 0,
        createdAt: p.createdAt,
      })),
    }
  }

  /**
   * Agrupa receita por período
   */
  private static async agruparReceitaPorPeriodo(
    dataInicio: Date,
    dataFim: Date,
    agruparPor: 'dia' | 'semana' | 'mes'
  ) {
    const pagamentos = await prisma.pagamento.findMany({
      where: {
        status: 'aprovado',
        createdAt: {
          gte: dataInicio,
          lte: dataFim,
        },
      },
      select: {
        valor: true,
        createdAt: true,
      },
    })

    const agrupado: Record<string, number> = {}

    pagamentos.forEach((pagamento) => {
      let chave: string

      if (agruparPor === 'dia') {
        chave = pagamento.createdAt.toISOString().split('T')[0]
      } else if (agruparPor === 'semana') {
        const semana = this.getSemanaAno(pagamento.createdAt)
        chave = `Semana ${semana.semana}/${semana.ano}`
      } else {
        // mes
        chave = pagamento.createdAt.toLocaleDateString('pt-BR', {
          month: 'short',
          year: 'numeric',
        })
      }

      if (!agrupado[chave]) {
        agrupado[chave] = 0
      }

      agrupado[chave] += Number(pagamento.valor)
    })

    return Object.entries(agrupado)
      .map(([periodo, receita]) => ({ periodo, receita }))
      .sort((a, b) => a.periodo.localeCompare(b.periodo))
  }

  /**
   * Calcula semana do ano
   */
  private static getSemanaAno(data: Date): { semana: number; ano: number } {
    const d = new Date(Date.UTC(data.getFullYear(), data.getMonth(), data.getDate()))
    const diaSemana = d.getUTCDay() || 7
    d.setUTCDate(d.getUTCDate() + 4 - diaSemana)
    const anoInicio = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
    const semana = Math.ceil(
      ((d.getTime() - anoInicio.getTime()) / 86400000 + 1) / 7
    )
    return { semana, ano: d.getUTCFullYear() }
  }

  /**
   * Gera relatório de conversão
   */
  static async gerarRelatorioConversao(params: RelatorioConversaoParams) {
    const { dataInicio, dataFim } = params

    // Diagnósticos
    const diagnosticos = await prisma.diagnostico.findMany({
      where: {
        createdAt: {
          gte: dataInicio,
          lte: dataFim,
        },
      },
    })

    // Propostas
    const propostas = await prisma.proposta.findMany({
      where: {
        createdAt: {
          gte: dataInicio,
          lte: dataFim,
        },
      },
    })

    // Pagamentos
    const pagamentos = await prisma.pagamento.findMany({
      where: {
        status: 'aprovado',
        createdAt: {
          gte: dataInicio,
          lte: dataFim,
        },
      },
      include: {
        proposta: {
          include: {
            cliente: {
              select: {
                nomeCompleto: true,
              },
            },
          },
        },
      },
    })

    // Funil de conversão
    const funil = {
      diagnosticos: diagnosticos.length,
      propostasEnviadas: propostas.length,
      propostasAprovadas: propostas.filter((p) => p.status === 'aprovada')
        .length,
      pagamentosAprovados: pagamentos.length,
    }

    // Taxas de conversão
    const taxas = {
      diagnosticoParaProposta:
        funil.diagnosticos > 0
          ? (funil.propostasEnviadas / funil.diagnosticos) * 100
          : 0,
      propostaParaAprovacao:
        funil.propostasEnviadas > 0
          ? (funil.propostasAprovadas / funil.propostasEnviadas) * 100
          : 0,
      aprovacaoParaPagamento:
        funil.propostasAprovadas > 0
          ? (funil.pagamentosAprovados / funil.propostasAprovadas) * 100
          : 0,
      diagnosticoParaPagamento:
        funil.diagnosticos > 0
          ? (funil.pagamentosAprovados / funil.diagnosticos) * 100
          : 0,
    }

    // Análise por tipo de proposta
    const propostasPorTipo = await prisma.proposta.groupBy({
      by: ['tipo'],
      where: {
        createdAt: {
          gte: dataInicio,
          lte: dataFim,
        },
      },
      _count: { id: true },
      _sum: { valor: true },
    })

    return {
      periodo: {
        inicio: dataInicio,
        fim: dataFim,
      },
      funil,
      taxas,
      propostasPorTipo: propostasPorTipo.map((p) => ({
        tipo: p.tipo,
        quantidade: p._count.id,
        valorTotal: Number(p._sum.valor || 0),
      })),
      detalhes: {
        diagnosticos: diagnosticos.map((d) => ({
          id: d.id,
          email: d.email,
          classificacao: d.classificacao,
          createdAt: d.createdAt,
        })),
        propostas: propostas.map((p) => ({
          id: p.id,
          tipo: p.tipo,
          valor: Number(p.valor),
          status: p.status,
          createdAt: p.createdAt,
        })),
        pagamentos: pagamentos.map((pag) => ({
          id: pag.id,
          valor: Number(pag.valor),
          cliente: pag.proposta.cliente.nomeCompleto,
          createdAt: pag.createdAt,
        })),
      },
    }
  }

  /**
   * Gera relatório de processos
   */
  static async gerarRelatorioProcessos(params: RelatorioProcessosParams) {
    const { dataInicio, dataFim, tipo, status } = params

    const where: any = {
      createdAt: {
        gte: dataInicio,
        lte: dataFim,
      },
    }

    if (tipo) {
      where.tipo = tipo
    }

    if (status) {
      where.status = status
    }

    // Processos
    const processos = await prisma.processo.findMany({
      where,
      include: {
        cliente: {
          select: {
            nomeCompleto: true,
            email: true,
          },
        },
        eventos: {
          orderBy: { data: 'desc' },
          take: 1,
        },
      },
    })

    // Estatísticas
    const processosPorStatus = await prisma.processo.groupBy({
      by: ['status'],
      where,
      _count: { id: true },
    })

    const processosPorTipo = await prisma.processo.groupBy({
      by: ['tipo'],
      where,
      _count: { id: true },
    })

    // Tempo médio de conclusão
    const processosConcluidos = processos.filter((p) => p.status === 'concluido')
    const tempoMedioConclusao =
      processosConcluidos.length > 0
        ? processosConcluidos.reduce((acc, p) => {
            const tempo =
              p.updatedAt.getTime() - p.createdAt.getTime()
            return acc + tempo
          }, 0) / processosConcluidos.length
        : 0

    // Processos em atraso (sem atualização há mais de 7 dias)
    const agora = Date.now()
    const processosEmAtraso = processos.filter((p) => {
      const diasSemAtualizacao =
        (agora - p.updatedAt.getTime()) / (1000 * 60 * 60 * 24)
      return diasSemAtualizacao > 7 && p.status !== 'concluido'
    })

    return {
      periodo: {
        inicio: dataInicio,
        fim: dataFim,
      },
      resumo: {
        total: processos.length,
        concluidos: processosConcluidos.length,
        emAtraso: processosEmAtraso.length,
        tempoMedioConclusaoDias: tempoMedioConclusao / (1000 * 60 * 60 * 24),
      },
      processosPorStatus: processosPorStatus.map((p) => ({
        status: p.status,
        quantidade: p._count.id,
      })),
      processosPorTipo: processosPorTipo.map((p) => ({
        tipo: p.tipo,
        quantidade: p._count.id,
      })),
      processos: processos.map((p) => ({
        id: p.id,
        tipo: p.tipo,
        status: p.status,
        cliente: p.cliente.nomeCompleto,
        email: p.cliente.email,
        diasAberto: Math.floor(
          (agora - p.createdAt.getTime()) / (1000 * 60 * 60 * 24)
        ),
        diasSemAtualizacao: Math.floor(
          (agora - p.updatedAt.getTime()) / (1000 * 60 * 60 * 24)
        ),
        emAtraso:
          Math.floor(
            (agora - p.updatedAt.getTime()) / (1000 * 60 * 60 * 24)
          ) > 7 && p.status !== 'concluido',
        createdAt: p.createdAt,
        updatedAt: p.updatedAt,
      })),
    }
  }

  /**
   * Exporta relatório para formato estruturado (JSON)
   */
  static async exportarRelatorio(
    tipo: 'financeiro' | 'conversao' | 'processos',
    params: any
  ) {
    let dados: any

    switch (tipo) {
      case 'financeiro':
        dados = await this.gerarRelatorioFinanceiro(params)
        break
      case 'conversao':
        dados = await this.gerarRelatorioConversao(params)
        break
      case 'processos':
        dados = await this.gerarRelatorioProcessos(params)
        break
    }

    return {
      tipo,
      geradoEm: new Date().toISOString(),
      dados,
    }
  }
}

