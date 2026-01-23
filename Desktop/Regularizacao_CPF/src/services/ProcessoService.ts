import { prisma } from '@/lib/prisma'
import { NotFoundError } from '@/lib/errors'

export interface CreateProcessoData {
  clienteId: string
  tipo: string // cpf, irpf, saida-definitiva
  descricao?: string
  checklist?: any[]
  etapas?: any[]
  notas?: string
}

export interface UpdateProcessoData {
  status?: string
  descricao?: string
  checklist?: any[]
  etapas?: any[]
  notas?: string
}

export interface Etapa {
  id: string
  titulo: string
  descricao?: string
  status: 'pendente' | 'em-andamento' | 'concluida'
  dataInicio?: string
  dataConclusao?: string
  observacoes?: string
}

export class ProcessoService {
  /**
   * Cria um novo processo
   */
  static async criar(data: CreateProcessoData) {
    // Verificar se cliente existe
    const cliente = await prisma.cliente.findUnique({
      where: { id: data.clienteId },
    })

    if (!cliente) {
      throw new NotFoundError('Cliente')
    }

    // Gerar checklist padrão baseado no tipo
    const checklist = data.checklist || this.gerarChecklistPadrao(data.tipo)
    
    // Gerar etapas padrão baseado no tipo
    const etapas = data.etapas || this.gerarEtapasPadrao(data.tipo)

    const processo = await prisma.processo.create({
      data: {
        clienteId: data.clienteId,
        tipo: data.tipo,
        descricao: data.descricao,
        status: 'pendente',
        checklist: checklist as any,
        etapas: etapas as any,
        notas: data.notas,
      },
    })

    // Criar evento inicial
    await prisma.evento.create({
      data: {
        processoId: processo.id,
        tipo: 'status-change',
        titulo: 'Processo criado',
        descricao: `Processo de ${data.tipo} criado para o cliente`,
        metadata: {
          statusAnterior: null,
          statusNovo: 'pendente',
        } as any,
      },
    })

    return processo
  }

  /**
   * Gera checklist padrão baseado no tipo de processo
   */
  static gerarChecklistPadrao(tipo: string): any[] {
    const checklists: Record<string, any[]> = {
      cpf: [
        { id: '1', item: 'CPF (cópia)', obrigatorio: true, concluido: false },
        { id: '2', item: 'RG ou CNH (cópia)', obrigatorio: true, concluido: false },
        { id: '3', item: 'Comprovante de Residência nos EUA', obrigatorio: true, concluido: false },
        { id: '4', item: 'Comprovante de Situação Cadastral', obrigatorio: false, concluido: false },
      ],
      irpf: [
        { id: '1', item: 'CPF (cópia)', obrigatorio: true, concluido: false },
        { id: '2', item: 'Declarações de IRPF Anteriores', obrigatorio: false, concluido: false },
        { id: '3', item: 'Comprovantes de Rendimentos', obrigatorio: true, concluido: false },
        { id: '4', item: 'Comprovantes de Despesas Dedutíveis', obrigatorio: false, concluido: false },
        { id: '5', item: 'Informe de Rendimentos', obrigatorio: false, concluido: false },
      ],
      'saida-definitiva': [
        { id: '1', item: 'CPF (cópia)', obrigatorio: true, concluido: false },
        { id: '2', item: 'Comprovante de Residência nos EUA', obrigatorio: true, concluido: false },
        { id: '3', item: 'Visto de Residência Permanente', obrigatorio: true, concluido: false },
        { id: '4', item: 'Declarações de IRPF', obrigatorio: false, concluido: false },
        { id: '5', item: 'Comprovante de Saída do Brasil', obrigatorio: false, concluido: false },
      ],
    }

    return checklists[tipo] || []
  }

  /**
   * Gera etapas padrão baseado no tipo de processo
   */
  static gerarEtapasPadrao(tipo: string): Etapa[] {
    const etapas: Record<string, Etapa[]> = {
      cpf: [
        {
          id: '1',
          titulo: 'Coleta de Documentos',
          descricao: 'Coletar todos os documentos necessários',
          status: 'pendente',
        },
        {
          id: '2',
          titulo: 'Verificação na Receita Federal',
          descricao: 'Verificar situação cadastral na RFB',
          status: 'pendente',
        },
        {
          id: '3',
          titulo: 'Preparação de Documentação',
          descricao: 'Organizar e preparar documentação para envio',
          status: 'pendente',
        },
        {
          id: '4',
          titulo: 'Envio à Receita Federal',
          descricao: 'Enviar documentação e solicitações',
          status: 'pendente',
        },
        {
          id: '5',
          titulo: 'Acompanhamento',
          descricao: 'Acompanhar processamento na RFB',
          status: 'pendente',
        },
        {
          id: '6',
          titulo: 'Conclusão',
          descricao: 'Verificar regularização e finalizar processo',
          status: 'pendente',
        },
      ],
      irpf: [
        {
          id: '1',
          titulo: 'Organização de Documentos',
          descricao: 'Organizar documentos dos exercícios pendentes',
          status: 'pendente',
        },
        {
          id: '2',
          titulo: 'Preparação das Declarações',
          descricao: 'Preparar declarações de IRPF',
          status: 'pendente',
        },
        {
          id: '3',
          titulo: 'Revisão',
          descricao: 'Revisar cálculos e informações',
          status: 'pendente',
        },
        {
          id: '4',
          titulo: 'Entrega das Declarações',
          descricao: 'Entregar declarações à Receita Federal',
          status: 'pendente',
        },
        {
          id: '5',
          titulo: 'Acompanhamento',
          descricao: 'Acompanhar processamento e possíveis retificações',
          status: 'pendente',
        },
      ],
      'saida-definitiva': [
        {
          id: '1',
          titulo: 'Avaliação da Necessidade',
          descricao: 'Avaliar se é necessário comunicar Saída Definitiva',
          status: 'pendente',
        },
        {
          id: '2',
          titulo: 'Preparação de Documentação',
          descricao: 'Preparar documentação comprobatória',
          status: 'pendente',
        },
        {
          id: '3',
          titulo: 'Comunicação à Receita Federal',
          descricao: 'Comunicar Saída Definitiva à RFB',
          status: 'pendente',
        },
        {
          id: '4',
          titulo: 'Acompanhamento',
          descricao: 'Acompanhar processamento',
          status: 'pendente',
        },
        {
          id: '5',
          titulo: 'Verificação',
          descricao: 'Verificar atualização cadastral',
          status: 'pendente',
        },
      ],
    }

    return etapas[tipo] || []
  }

  /**
   * Busca processo por ID
   */
  static async buscarPorId(id: string) {
    const processo = await prisma.processo.findUnique({
      where: { id },
      include: {
        cliente: {
          select: {
            id: true,
            nomeCompleto: true,
            email: true,
            whatsapp: true,
          },
        },
        eventos: {
          orderBy: { data: 'desc' },
        },
      },
    })

    if (!processo) {
      throw new NotFoundError('Processo')
    }

    return processo
  }

  /**
   * Lista processos com filtros
   */
  static async listar(params: {
    page?: number
    limit?: number
    clienteId?: string
    tipo?: string
    status?: string
  }) {
    const page = params.page || 1
    const limit = params.limit || 20
    const skip = (page - 1) * limit

    const where: any = {}

    if (params.clienteId) {
      where.clienteId = params.clienteId
    }

    if (params.tipo) {
      where.tipo = params.tipo
    }

    if (params.status) {
      where.status = params.status
    }

    const [processos, total] = await Promise.all([
      prisma.processo.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          cliente: {
            select: {
              id: true,
              nomeCompleto: true,
              email: true,
            },
          },
          eventos: {
            take: 1,
            orderBy: { data: 'desc' },
          },
        },
      }),
      prisma.processo.count({ where }),
    ])

    return {
      processos,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    }
  }

  /**
   * Atualiza um processo
   */
  static async atualizar(id: string, data: UpdateProcessoData) {
    const processo = await prisma.processo.findUnique({
      where: { id },
    })

    if (!processo) {
      throw new NotFoundError('Processo')
    }

    const statusAnterior = processo.status
    const updateData: any = { ...data }

    // Se status mudou, criar evento
    if (data.status && data.status !== statusAnterior) {
      await prisma.evento.create({
        data: {
          processoId: id,
          tipo: 'status-change',
          titulo: `Status alterado para ${data.status}`,
          descricao: `Status do processo alterado de ${statusAnterior} para ${data.status}`,
          metadata: {
            statusAnterior,
            statusNovo: data.status,
          } as any,
        },
      })
    }

    return await prisma.processo.update({
      where: { id },
      data: updateData,
    })
  }

  /**
   * Atualiza etapa de um processo
   */
  static async atualizarEtapa(
    processoId: string,
    etapaId: string,
    dadosEtapa: Partial<Etapa>
  ) {
    const processo = await prisma.processo.findUnique({
      where: { id: processoId },
    })

    if (!processo) {
      throw new NotFoundError('Processo')
    }

    const etapas = (processo.etapas as any) || []
    const etapaIndex = etapas.findIndex((e: Etapa) => e.id === etapaId)

    if (etapaIndex === -1) {
      throw new NotFoundError('Etapa')
    }

    const etapaAnterior = etapas[etapaIndex]
    etapas[etapaIndex] = {
      ...etapaAnterior,
      ...dadosEtapa,
    }

    // Criar evento se status da etapa mudou
    if (dadosEtapa.status && dadosEtapa.status !== etapaAnterior.status) {
      await prisma.evento.create({
        data: {
          processoId,
          tipo: 'etapa-update',
          titulo: `Etapa "${etapas[etapaIndex].titulo}" atualizada`,
          descricao: `Status alterado para ${dadosEtapa.status}`,
          metadata: {
            etapaId,
            statusAnterior: etapaAnterior.status,
            statusNovo: dadosEtapa.status,
          } as any,
        },
      })
    }

    return await prisma.processo.update({
      where: { id: processoId },
      data: { etapas: etapas as any },
    })
  }

  /**
   * Adiciona nota a um processo
   */
  static async adicionarNota(processoId: string, nota: string) {
    const processo = await prisma.processo.findUnique({
      where: { id: processoId },
    })

    if (!processo) {
      throw new NotFoundError('Processo')
    }

    const notasAtuais = processo.notas || ''
    const novaNota = `${new Date().toISOString()}: ${nota}\n${notasAtuais}`

    await prisma.evento.create({
      data: {
        processoId,
        tipo: 'note',
        titulo: 'Nota adicionada',
        descricao: nota,
      },
    })

    return await prisma.processo.update({
      where: { id: processoId },
      data: { notas: novaNota },
    })
  }

  /**
   * Deleta um processo
   */
  static async deletar(id: string) {
    const processo = await prisma.processo.findUnique({
      where: { id },
    })

    if (!processo) {
      throw new NotFoundError('Processo')
    }

    return await prisma.processo.delete({
      where: { id },
    })
  }
}

