import { prisma } from '@/lib/prisma'
import { NotFoundError, ValidationError } from '@/lib/errors'
import { validateCPF, validateEmail, sanitizeCPF } from '@/lib/validation'

export interface CreateClienteData {
  nomeCompleto: string
  email: string
  whatsapp: string
  cpf: string
  estado: string
  situacaoCpf?: string
  statusIrpf?: string
  dataResidenciaEua?: string
  saidaDefinitiva?: string
  endereco?: string
  observacoes?: string
}

export type UpdateClienteData = Partial<CreateClienteData>

export class ClienteService {
  /**
   * Cria um novo cliente
   */
  static async criar(data: CreateClienteData) {
    // Validações
    if (!validateEmail(data.email)) {
      throw new ValidationError('E-mail inválido')
    }

    if (!validateCPF(data.cpf)) {
      throw new ValidationError('CPF inválido')
    }

    const cpfSanitizado = sanitizeCPF(data.cpf)

    // Verificar se já existe
    const existe = await prisma.cliente.findUnique({
      where: { cpf: cpfSanitizado },
    })

    if (existe) {
      throw new ValidationError('Cliente com este CPF já cadastrado')
    }

    return await prisma.cliente.create({
      data: {
        ...data,
        cpf: cpfSanitizado,
      },
    })
  }

  /**
   * Busca cliente por ID
   */
  static async buscarPorId(id: string) {
    const cliente = await prisma.cliente.findUnique({
      where: { id },
      include: {
        processos: {
          orderBy: { createdAt: 'desc' },
        },
        documentos: {
          orderBy: { createdAt: 'desc' },
        },
        interacoes: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        propostas: {
          orderBy: { createdAt: 'desc' },
        },
      },
    })

    if (!cliente) {
      throw new NotFoundError('Cliente')
    }

    return cliente
  }

  /**
   * Busca cliente por CPF
   */
  static async buscarPorCPF(cpf: string) {
    const cpfSanitizado = sanitizeCPF(cpf)
    return await prisma.cliente.findUnique({
      where: { cpf: cpfSanitizado },
    })
  }

  /**
   * Busca cliente por email
   */
  static async buscarPorEmail(email: string) {
    return await prisma.cliente.findUnique({
      where: { email },
    })
  }

  /**
   * Lista clientes com paginação e filtros
   */
  static async listar(params: {
    page?: number
    limit?: number
    search?: string
    estado?: string
    situacaoCpf?: string
  }) {
    const page = params.page || 1
    const limit = params.limit || 20
    const skip = (page - 1) * limit

    const where: any = {}

    if (params.search) {
      where.OR = [
        { nomeCompleto: { contains: params.search, mode: 'insensitive' } },
        { email: { contains: params.search, mode: 'insensitive' } },
        { cpf: { contains: params.search } },
      ]
    }

    if (params.estado) {
      where.estado = params.estado
    }

    if (params.situacaoCpf) {
      where.situacaoCpf = params.situacaoCpf
    }

    const [clientes, total] = await Promise.all([
      prisma.cliente.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          processos: {
            select: {
              id: true,
              status: true,
            },
          },
        },
      }),
      prisma.cliente.count({ where }),
    ])

    return {
      clientes,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    }
  }

  /**
   * Atualiza um cliente
   */
  static async atualizar(id: string, data: UpdateClienteData) {
    const cliente = await prisma.cliente.findUnique({
      where: { id },
    })

    if (!cliente) {
      throw new NotFoundError('Cliente')
    }

    // Validações se campos estão sendo atualizados
    if (data.email && !validateEmail(data.email)) {
      throw new ValidationError('E-mail inválido')
    }

    if (data.cpf && !validateCPF(data.cpf)) {
      throw new ValidationError('CPF inválido')
    }

    const updateData: any = { ...data }

    if (data.cpf) {
      updateData.cpf = sanitizeCPF(data.cpf)
    }

    return await prisma.cliente.update({
      where: { id },
      data: updateData,
    })
  }

  /**
   * Deleta um cliente (soft delete ou hard delete)
   */
  static async deletar(id: string) {
    const cliente = await prisma.cliente.findUnique({
      where: { id },
    })

    if (!cliente) {
      throw new NotFoundError('Cliente')
    }

    // Hard delete (cascade já configurado no schema)
    return await prisma.cliente.delete({
      where: { id },
    })
  }
}

