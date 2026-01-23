import { prisma } from '@/lib/prisma'
import { NotFoundError } from '@/lib/errors'
import * as crypto from 'crypto'

export class LGPDService {
  /**
   * Registra consentimento LGPD
   */
  static async registrarConsentimento(
    clienteId: string,
    tipo: 'marketing' | 'comunicacao' | 'processamento',
    consentido: boolean
  ) {
    const cliente = await prisma.cliente.findUnique({
      where: { id: clienteId },
    })

    if (!cliente) {
      throw new NotFoundError('Cliente')
    }

    // Atualizar campo de consentimento no cliente
    const lgpdData = (cliente.lgpdConsent as any) || {}

    lgpdData[tipo] = {
      consentido,
      dataConsentimento: new Date().toISOString(),
    }

    await prisma.cliente.update({
      where: { id: clienteId },
      data: {
        lgpdConsent: lgpdData as any,
      },
    })

    return lgpdData
  }

  /**
   * Anonimiza dados pessoais
   */
  static async anonimizarDados(clienteId: string) {
    const cliente = await prisma.cliente.findUnique({
      where: { id: clienteId },
    })

    if (!cliente) {
      throw new NotFoundError('Cliente')
    }

    // Gerar hash para manter referências sem expor dados
    const hash = crypto
      .createHash('sha256')
      .update(clienteId + Date.now().toString())
      .digest('hex')
      .substring(0, 16)

    // Anonimizar dados pessoais
    await prisma.cliente.update({
      where: { id: clienteId },
      data: {
        nomeCompleto: `Cliente ${hash}`,
        email: `anonimo_${hash}@anonimizado.com`,
        cpf: hash,
        whatsapp: hash,
        endereco: null,
        observacoes: 'Dados anonimizados conforme LGPD',
      },
    })

    // Anonimizar diagnósticos relacionados
    await prisma.diagnostico.updateMany({
      where: { clienteId },
      data: {
        email: `anonimo_${hash}@anonimizado.com`,
        nome: `Cliente ${hash}`,
        cpf: hash,
        whatsapp: hash,
      },
    })

    return { hash, anonimizado: true }
  }

  /**
   * Exporta dados pessoais (portabilidade)
   */
  static async exportarDados(clienteId: string) {
    const cliente = await prisma.cliente.findUnique({
      where: { id: clienteId },
      include: {
        processos: true,
        documentos: {
          select: {
            id: true,
            nome: true,
            tipo: true,
            createdAt: true,
          },
        },
        interacoes: {
          select: {
            id: true,
            tipo: true,
            assunto: true,
            createdAt: true,
          },
        },
        propostas: {
          select: {
            id: true,
            tipo: true,
            valor: true,
            status: true,
            createdAt: true,
          },
        },
      },
    })

    if (!cliente) {
      throw new NotFoundError('Cliente')
    }

    // Buscar diagnósticos separadamente
    const diagnosticos = await prisma.diagnostico.findMany({
      where: { clienteId },
    })

    return {
      cliente: {
        id: cliente.id,
        nomeCompleto: cliente.nomeCompleto,
        email: cliente.email,
        whatsapp: cliente.whatsapp,
        cpf: cliente.cpf,
        estado: cliente.estado,
        situacaoCpf: cliente.situacaoCpf,
        statusIrpf: cliente.statusIrpf,
        dataResidenciaEua: cliente.dataResidenciaEua,
        saidaDefinitiva: cliente.saidaDefinitiva,
        endereco: cliente.endereco,
        createdAt: cliente.createdAt,
        updatedAt: cliente.updatedAt,
      },
      processos: cliente.processos,
      documentos: cliente.documentos,
      interacoes: cliente.interacoes,
      propostas: cliente.propostas,
      diagnosticos,
      exportadoEm: new Date().toISOString(),
    }
  }

  /**
   * Remove dados pessoais (direito ao esquecimento)
   */
  static async removerDados(clienteId: string) {
    const cliente = await prisma.cliente.findUnique({
      where: { id: clienteId },
    })

    if (!cliente) {
      throw new NotFoundError('Cliente')
    }

    // Deletar em cascata (configurado no schema)
    await prisma.cliente.delete({
      where: { id: clienteId },
    })

    return { removido: true }
  }

  /**
   * Verifica consentimento
   */
  static async verificarConsentimento(
    clienteId: string,
    tipo: 'marketing' | 'comunicacao' | 'processamento'
  ): Promise<boolean> {
    const cliente = await prisma.cliente.findUnique({
      where: { id: clienteId },
      select: { lgpdConsent: true },
    })

    if (!cliente) {
      return false
    }

    const lgpdData = (cliente.lgpdConsent as any) || {}
    return lgpdData[tipo]?.consentido === true
  }
}

