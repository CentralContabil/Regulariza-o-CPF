import { prisma } from '@/lib/prisma'
import { NotFoundError } from '@/lib/errors'

export interface CreateInteracaoData {
  clienteId: string
  tipo: string // email, whatsapp, call, meeting
  assunto: string
  conteudo: string
  direcao?: 'inbound' | 'outbound'
}

export class InteracaoService {
  /**
   * Cria uma nova interação
   */
  static async criar(data: CreateInteracaoData) {
    // Verificar se cliente existe
    const cliente = await prisma.cliente.findUnique({
      where: { id: data.clienteId },
    })

    if (!cliente) {
      throw new NotFoundError('Cliente')
    }

    return await prisma.interacao.create({
      data: {
        ...data,
        direcao: data.direcao || 'inbound',
      },
    })
  }

  /**
   * Lista interações de um cliente
   */
  static async listarPorCliente(clienteId: string, limit: number = 50) {
    return await prisma.interacao.findMany({
      where: { clienteId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    })
  }

  /**
   * Busca interação por ID
   */
  static async buscarPorId(id: string) {
    const interacao = await prisma.interacao.findUnique({
      where: { id },
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

    if (!interacao) {
      throw new NotFoundError('Interação')
    }

    return interacao
  }
}

