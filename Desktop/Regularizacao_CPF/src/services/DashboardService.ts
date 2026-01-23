import { prisma } from '@/lib/prisma'

export class DashboardService {
  /**
   * Busca métricas gerais do dashboard
   */
  static async buscarMetricasGerais() {
    const [
      totalClientes,
      clientesNovos,
      totalProcessos,
      processosPendentes,
      processosEmAndamento,
      processosConcluidos,
      totalPropostas,
      propostasPendentes,
      propostasAprovadas,
      totalPagamentos,
      receitaTotal,
      receitaMes,
    ] = await Promise.all([
      // Clientes
      prisma.cliente.count(),
      prisma.cliente.count({
        where: {
          createdAt: {
            gte: new Date(new Date().setDate(1)), // Primeiro dia do mês
          },
        },
      }),
      // Processos
      prisma.processo.count(),
      prisma.processo.count({
        where: { status: 'pendente' },
      }),
      prisma.processo.count({
        where: { status: 'em-andamento' },
      }),
      prisma.processo.count({
        where: { status: 'concluido' },
      }),
      // Propostas
      prisma.proposta.count(),
      prisma.proposta.count({
        where: { status: 'pendente' },
      }),
      prisma.proposta.count({
        where: { status: 'aprovada' },
      }),
      // Pagamentos
      prisma.pagamento.count({
        where: { status: 'aprovado' },
      }),
      prisma.pagamento.aggregate({
        where: { status: 'aprovado' },
        _sum: { valor: true },
      }),
      prisma.pagamento.aggregate({
        where: {
          status: 'aprovado',
          createdAt: {
            gte: new Date(new Date().setDate(1)),
          },
        },
        _sum: { valor: true },
      }),
    ])

    return {
      clientes: {
        total: totalClientes,
        novosEsteMes: clientesNovos,
      },
      processos: {
        total: totalProcessos,
        pendentes: processosPendentes,
        emAndamento: processosEmAndamento,
        concluidos: processosConcluidos,
      },
      propostas: {
        total: totalPropostas,
        pendentes: propostasPendentes,
        aprovadas: propostasAprovadas,
        taxaAprovacao:
          totalPropostas > 0
            ? (propostasAprovadas / totalPropostas) * 100
            : 0,
      },
      financeiro: {
        totalPagamentos,
        receitaTotal: receitaTotal._sum.valor || 0,
        receitaMes: receitaMes._sum.valor || 0,
      },
    }
  }

  /**
   * Busca funil de vendas
   */
  static async buscarFunilVendas() {
    const [
      diagnosticos,
      propostasEnviadas,
      propostasAprovadas,
      pagamentosAprovados,
    ] = await Promise.all([
      prisma.diagnostico.count(),
      prisma.proposta.count(),
      prisma.proposta.count({
        where: { status: 'aprovada' },
      }),
      prisma.pagamento.count({
        where: { status: 'aprovado' },
      }),
    ])

    return {
      diagnosticos,
      propostasEnviadas,
      propostasAprovadas,
      pagamentosAprovados,
      taxaConversaoDiagnostico:
        diagnosticos > 0 ? (propostasEnviadas / diagnosticos) * 100 : 0,
      taxaConversaoProposta:
        propostasEnviadas > 0
          ? (propostasAprovadas / propostasEnviadas) * 100
          : 0,
      taxaConversaoPagamento:
        propostasAprovadas > 0
          ? (pagamentosAprovados / propostasAprovadas) * 100
          : 0,
    }
  }

  /**
   * Busca processos por status
   */
  static async buscarProcessosPorStatus() {
    const processos = await prisma.processo.groupBy({
      by: ['status'],
      _count: {
        id: true,
      },
    })

    return processos.map((p) => ({
      status: p.status,
      quantidade: p._count.id,
    }))
  }

  /**
   * Busca processos por tipo
   */
  static async buscarProcessosPorTipo() {
    const processos = await prisma.processo.groupBy({
      by: ['tipo'],
      _count: {
        id: true,
      },
    })

    return processos.map((p) => ({
      tipo: p.tipo,
      quantidade: p._count.id,
    }))
  }

  /**
   * Busca receita por mês (últimos 12 meses)
   */
  static async buscarReceitaPorMes() {
    const meses: { mes: string; receita: number }[] = []
    const hoje = new Date()

    for (let i = 11; i >= 0; i--) {
      const data = new Date(hoje.getFullYear(), hoje.getMonth() - i, 1)
      const proximoMes = new Date(
        hoje.getFullYear(),
        hoje.getMonth() - i + 1,
        1
      )

      const receita = await prisma.pagamento.aggregate({
        where: {
          status: 'aprovado',
          createdAt: {
            gte: data,
            lt: proximoMes,
          },
        },
        _sum: { valor: true },
      })

      meses.push({
        mes: data.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' }),
        receita: Number(receita._sum.valor || 0),
      })
    }

    return meses
  }

  /**
   * Busca clientes recentes
   */
  static async buscarClientesRecentes(limit: number = 10) {
    return await prisma.cliente.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        nomeCompleto: true,
        email: true,
        estado: true,
        createdAt: true,
        processos: {
          select: {
            id: true,
            tipo: true,
            status: true,
          },
        },
      },
    })
  }

  /**
   * Busca processos pendentes
   */
  static async buscarProcessosPendentes(limit: number = 10) {
    return await prisma.processo.findMany({
      where: {
        status: {
          in: ['pendente', 'em-andamento'],
        },
      },
      take: limit,
      orderBy: { updatedAt: 'desc' },
      include: {
        cliente: {
          select: {
            id: true,
            nomeCompleto: true,
            email: true,
          },
        },
      },
    })
  }

  /**
   * Busca tarefas pendentes (processos que precisam de atenção)
   */
  static async buscarTarefasPendentes() {
    const processos = await prisma.processo.findMany({
      where: {
        status: {
          in: ['pendente', 'em-andamento'],
        },
      },
      include: {
        cliente: {
          select: {
            nomeCompleto: true,
            email: true,
          },
        },
      },
    })

    const tarefas = processos.map((processo) => {
      const diasDesdeAtualizacao = Math.floor(
        (Date.now() - processo.updatedAt.getTime()) / (1000 * 60 * 60 * 24)
      )

      return {
        id: processo.id,
        tipo: processo.tipo,
        status: processo.status,
        cliente: processo.cliente.nomeCompleto,
        email: processo.cliente.email,
        diasSemAtualizacao: diasDesdeAtualizacao,
        prioridade:
          diasDesdeAtualizacao > 7
            ? 'alta'
            : diasDesdeAtualizacao > 3
            ? 'media'
            : 'baixa',
        updatedAt: processo.updatedAt,
      }
    })

    return tarefas.sort((a, b) => {
      // Ordenar por prioridade e depois por dias sem atualização
      const prioridadeOrder: Record<string, number> = { alta: 3, media: 2, baixa: 1 }
      if (prioridadeOrder[a.prioridade] !== prioridadeOrder[b.prioridade]) {
        return (
          prioridadeOrder[b.prioridade] - prioridadeOrder[a.prioridade]
        )
      }
      return b.diasSemAtualizacao - a.diasSemAtualizacao
    })
  }

  /**
   * Busca estatísticas de conversão
   */
  static async buscarEstatisticasConversao() {
    const [
      diagnosticosUltimos30Dias,
      propostasUltimos30Dias,
      pagamentosUltimos30Dias,
    ] = await Promise.all([
      prisma.diagnostico.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          },
        },
      }),
      prisma.proposta.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          },
        },
      }),
      prisma.pagamento.count({
        where: {
          status: 'aprovado',
          createdAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          },
        },
      }),
    ])

    return {
      periodo: '30 dias',
      diagnosticos: diagnosticosUltimos30Dias,
      propostas: propostasUltimos30Dias,
      pagamentos: pagamentosUltimos30Dias,
      taxaDiagnosticoParaProposta:
        diagnosticosUltimos30Dias > 0
          ? (propostasUltimos30Dias / diagnosticosUltimos30Dias) * 100
          : 0,
      taxaPropostaParaPagamento:
        propostasUltimos30Dias > 0
          ? (pagamentosUltimos30Dias / propostasUltimos30Dias) * 100
          : 0,
    }
  }
}

