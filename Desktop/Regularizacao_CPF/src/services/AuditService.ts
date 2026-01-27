import { prisma } from '@/lib/prisma'

export interface AuditLogData {
  usuarioId?: string
  acao: string
  entidade: string
  entidadeId?: string
  detalhes?: Record<string, any>
  ip?: string
  userAgent?: string
}

export class AuditService {
  /**
   * Registra evento de auditoria
   */
  static async registrar(data: AuditLogData) {
    try {
      await prisma.auditoria.create({
        data: {
          usuarioId: data.usuarioId,
          acao: data.acao,
          entidade: data.entidade,
          entidadeId: data.entidadeId,
          detalhes: data.detalhes as any,
          ip: data.ip,
        },
      })
    } catch (error) {
      // Não falhar a requisição se auditoria falhar
      console.error('Erro ao registrar auditoria:', error)
    }
  }

  /**
   * Busca logs de auditoria
   */
  static async buscarLogs(params: {
    page?: number
    limit?: number
    usuarioId?: string
    entidade?: string
    acao?: string
    dataInicio?: Date
    dataFim?: Date
  }) {
    const page = params.page || 1
    const limit = params.limit || 50
    const skip = (page - 1) * limit

    const where: any = {}

    if (params.usuarioId) {
      where.usuarioId = params.usuarioId
    }

    if (params.entidade) {
      where.entidade = params.entidade
    }

    if (params.acao) {
      where.acao = params.acao
    }

    if (params.dataInicio || params.dataFim) {
      where.createdAt = {}
      if (params.dataInicio) {
        where.createdAt.gte = params.dataInicio
      }
      if (params.dataFim) {
        where.createdAt.lte = params.dataFim
      }
    }

    const [logs, total] = await Promise.all([
      prisma.auditoria.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.auditoria.count({ where }),
    ])

    return {
      logs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    }
  }

  /**
   * Registra acesso a dados sensíveis
   */
  static async registrarAcessoSensivel(
    usuarioId: string,
    entidade: string,
    entidadeId: string,
    ip?: string
  ) {
    await this.registrar({
      usuarioId,
      acao: 'acesso_dados_sensiveis',
      entidade,
      entidadeId,
      ip,
    })
  }

  /**
   * Registra modificação de dados
   */
  static async registrarModificacao(
    usuarioId: string,
    entidade: string,
    entidadeId: string,
    acao: 'criar' | 'atualizar' | 'deletar',
    detalhes?: Record<string, any>,
    ip?: string
  ) {
    await this.registrar({
      usuarioId,
      acao: `dados_${acao}`,
      entidade,
      entidadeId,
      detalhes,
      ip,
    })
  }
}



