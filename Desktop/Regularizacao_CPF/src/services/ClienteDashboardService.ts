import { prisma } from '@/lib/prisma'
import { NotFoundError } from '@/lib/errors'

export class ClienteDashboardService {
  /**
   * Busca dashboard completo do cliente
   */
  static async buscarDashboard(clienteId: string) {
    const cliente = await prisma.cliente.findUnique({
      where: { id: clienteId },
      include: {
        processos: {
          include: {
            eventos: {
              orderBy: { data: 'desc' },
              take: 5,
            },
            documentos: {
              select: {
                id: true,
                nome: true,
                tipo: true,
                createdAt: true,
              },
            },
          },
          orderBy: { updatedAt: 'desc' },
        },
        propostas: {
          where: {
            status: {
              in: ['pendente', 'aprovada'],
            },
          },
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
        interacoes: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        documentos: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    })

    if (!cliente) {
      throw new NotFoundError('Cliente')
    }

    // Processar processos para dashboard
    const processosFormatados = cliente.processos.map((processo) => {
      const checklist = (processo.checklist as any) || []
      const etapas = (processo.etapas as any) || []

      return {
        id: processo.id,
        tipo: processo.tipo,
        status: processo.status,
        descricao: processo.descricao,
        checklist: checklist.map((item: any) => ({
          ...item,
          concluido: item.concluido || false,
        })),
        etapas: etapas,
        proximosPassos: this.extrairProximosPassos(processo),
        progresso: this.calcularProgresso(processo),
        eventos: processo.eventos,
        documentos: processo.documentos,
        createdAt: processo.createdAt,
        updatedAt: processo.updatedAt,
      }
    })

    return {
      cliente: {
        id: cliente.id,
        nomeCompleto: cliente.nomeCompleto,
        email: cliente.email,
        situacaoCpf: cliente.situacaoCpf,
        statusIrpf: cliente.statusIrpf,
      },
      processos: processosFormatados,
      propostas: cliente.propostas,
      interacoes: cliente.interacoes,
      documentos: cliente.documentos,
      resumo: {
        totalProcessos: cliente.processos.length,
        processosPendentes: cliente.processos.filter(
          (p) => p.status === 'pendente'
        ).length,
        processosEmAndamento: cliente.processos.filter(
          (p) => p.status === 'em-andamento'
        ).length,
        processosConcluidos: cliente.processos.filter(
          (p) => p.status === 'concluido'
        ).length,
        totalDocumentos: cliente.documentos.length,
        propostasPendentes: cliente.propostas.filter(
          (p) => p.status === 'pendente'
        ).length,
      },
    }
  }

  /**
   * Extrai próximos passos do processo
   */
  private static extrairProximosPassos(processo: any): string[] {
    const proximosPassos: string[] = []
    const checklist = (processo.checklist as any) || []
    const etapas = (processo.etapas as any) || []

    // Próximos itens do checklist não concluídos
    const proximosChecklist = checklist
      .filter((item: any) => !item.concluido)
      .slice(0, 3)
      .map((item: any) => item.descricao || item.titulo)

    proximosPassos.push(...proximosChecklist)

    // Próxima etapa se houver
    if (etapas.length > 0) {
      const proximaEtapa = etapas.find((etapa: any) => !etapa.concluida)
      if (proximaEtapa) {
        proximosPassos.push(proximaEtapa.descricao || proximaEtapa.titulo)
      }
    }

    // Mensagens padrão baseadas no status
    if (processo.status === 'pendente' && proximosPassos.length === 0) {
      proximosPassos.push('Aguardando início do processo')
    }

    if (processo.status === 'em-andamento' && proximosPassos.length === 0) {
      proximosPassos.push('Processo em andamento - aguarde atualizações')
    }

    return proximosPassos.slice(0, 5) // Máximo 5 próximos passos
  }

  /**
   * Calcula progresso do processo (0-100)
   */
  private static calcularProgresso(processo: any): number {
    const checklist = (processo.checklist as any) || []
    const etapas = (processo.etapas as any) || []

    if (processo.status === 'concluido') {
      return 100
    }

    if (checklist.length === 0 && etapas.length === 0) {
      return processo.status === 'pendente' ? 0 : 50
    }

    // Calcular progresso do checklist
    let progressoChecklist = 0
    if (checklist.length > 0) {
      const concluidos = checklist.filter((item: any) => item.concluido).length
      progressoChecklist = (concluidos / checklist.length) * 50 // Checklist vale 50%
    }

    // Calcular progresso das etapas
    let progressoEtapas = 0
    if (etapas.length > 0) {
      const concluidas = etapas.filter((etapa: any) => etapa.concluida).length
      progressoEtapas = (concluidas / etapas.length) * 50 // Etapas valem 50%
    }

    return Math.round(progressoChecklist + progressoEtapas)
  }

  /**
   * Busca timeline de um processo
   */
  static async buscarTimeline(processoId: string, clienteId: string) {
    const processo = await prisma.processo.findFirst({
      where: {
        id: processoId,
        clienteId,
      },
      include: {
        eventos: {
          orderBy: { data: 'desc' },
        },
      },
    })

    if (!processo) {
      throw new NotFoundError('Processo')
    }

    // Criar timeline com eventos e mudanças de status
    const timeline = processo.eventos.map((evento) => ({
      id: evento.id,
      tipo: evento.tipo,
      titulo: evento.titulo,
      descricao: evento.descricao,
      data: evento.data,
      metadata: evento.metadata,
    }))

    // Adicionar criação do processo
    timeline.push({
      id: 'criacao',
      tipo: 'criacao',
      titulo: 'Processo criado',
      descricao: `Processo de ${processo.tipo} foi criado`,
      data: processo.createdAt,
      metadata: null,
    })

    return timeline.sort(
      (a, b) => b.data.getTime() - a.data.getTime()
    )
  }

  /**
   * Busca comunicacoes do cliente
   */
  static async buscarComunicacoes(clienteId: string, limit: number = 20) {
    const interacoes = await prisma.interacao.findMany({
      where: { clienteId },
      take: limit,
      orderBy: { createdAt: 'desc' },
    })

    return interacoes.map((interacao) => ({
      id: interacao.id,
      tipo: interacao.tipo,
      assunto: interacao.assunto,
      conteudo: interacao.conteudo,
      direcao: interacao.direcao,
      data: interacao.createdAt,
    }))
  }
}

