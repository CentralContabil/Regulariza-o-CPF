import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import * as crypto from 'crypto'
import { prisma } from '@/lib/prisma'
import { NotFoundError, ValidationError } from '@/lib/errors'

export interface UploadDocumentData {
  clienteId: string
  processoId?: string
  nome: string
  tipo: string
  arquivo: Buffer
  mimeType: string
  tamanho: number
}

export interface DocumentMetadata {
  clienteId: string
  processoId?: string
  nome: string
  tipo: string
  versao: number
}

export class DocumentService {
  private static s3Client: S3Client
  private static bucketName: string
  private static encryptionKey: string

  /**
   * Inicializa cliente S3
   */
  private static getS3Client(): S3Client {
    if (!this.s3Client) {
      this.bucketName = process.env.S3_BUCKET_NAME || 'brazilian-relax-documents'
      this.encryptionKey = process.env.DOCUMENT_ENCRYPTION_KEY || ''

      this.s3Client = new S3Client({
        region: process.env.AWS_REGION || 'us-east-1',
        credentials: process.env.AWS_ACCESS_KEY_ID
          ? {
              accessKeyId: process.env.AWS_ACCESS_KEY_ID,
              secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
            }
          : undefined,
      })
    }
    return this.s3Client
  }

  /**
   * Criptografa buffer
   */
  private static encrypt(buffer: Buffer): Buffer {
    if (!this.encryptionKey) {
      // Em desenvolvimento, retorna sem criptografia
      // Em produção, sempre criptografar
      return buffer
    }

    const algorithm = 'aes-256-cbc'
    const key = crypto.scryptSync(this.encryptionKey, 'salt', 32)
    const iv = crypto.randomBytes(16)

    const cipher = crypto.createCipheriv(algorithm, key, iv)
    const encrypted = Buffer.concat([
      iv,
      cipher.update(buffer),
      cipher.final(),
    ])

    return encrypted
  }

  /**
   * Descriptografa buffer
   */
  private static decrypt(encrypted: Buffer): Buffer {
    if (!this.encryptionKey) {
      return encrypted
    }

    const algorithm = 'aes-256-cbc'
    const key = crypto.scryptSync(this.encryptionKey, 'salt', 32)
    const iv = encrypted.slice(0, 16)
    const data = encrypted.slice(16)

    const decipher = crypto.createDecipheriv(algorithm, key, iv)
    const decrypted = Buffer.concat([
      decipher.update(data),
      decipher.final(),
    ])

    return decrypted
  }

  /**
   * Gera chave S3 para documento
   */
  private static gerarChaveS3(
    clienteId: string,
    documentoId: string,
    versao: number
  ): string {
    return `clientes/${clienteId}/documentos/${documentoId}/v${versao}`
  }

  /**
   * Valida tipo de arquivo
   */
  private static validarTipoArquivo(mimeType: string): boolean {
    const tiposPermitidos = [
      'application/pdf',
      'image/jpeg',
      'image/png',
      'image/jpg',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ]

    return tiposPermitidos.includes(mimeType)
  }

  /**
   * Valida tamanho do arquivo (max 10MB)
   */
  private static validarTamanho(tamanho: number): boolean {
    const maxSize = 10 * 1024 * 1024 // 10MB
    return tamanho <= maxSize
  }

  /**
   * Faz upload de documento
   */
  static async uploadDocument(data: UploadDocumentData) {
    // Validações
    if (!this.validarTipoArquivo(data.mimeType)) {
      throw new ValidationError('Tipo de arquivo não permitido')
    }

    if (!this.validarTamanho(data.tamanho)) {
      throw new ValidationError('Arquivo muito grande (máximo 10MB)')
    }

    // Verificar se cliente existe
    const cliente = await prisma.cliente.findUnique({
      where: { id: data.clienteId },
    })

    if (!cliente) {
      throw new NotFoundError('Cliente')
    }

    // Verificar se processo existe (se fornecido)
    if (data.processoId) {
      const processo = await prisma.processo.findUnique({
        where: { id: data.processoId },
      })

      if (!processo) {
        throw new NotFoundError('Processo')
      }
    }

    // Buscar versão anterior do documento (se existir)
    const documentoAnterior = await prisma.documento.findFirst({
      where: {
        clienteId: data.clienteId,
        nome: data.nome,
        tipo: data.tipo,
      },
      orderBy: { versao: 'desc' },
    })

    const novaVersao = documentoAnterior ? documentoAnterior.versao + 1 : 1

    // Criar registro no banco
    const documento = await prisma.documento.create({
      data: {
        clienteId: data.clienteId,
        processoId: data.processoId,
        nome: data.nome,
        tipo: data.tipo,
        tamanho: data.tamanho,
        mimeType: data.mimeType,
        versao: novaVersao,
        url: '', // Será atualizado após upload
      },
    })

    // Criptografar arquivo
    const arquivoCriptografado = this.encrypt(data.arquivo)

    // Upload para S3
    const s3Client = this.getS3Client()
    const chaveS3 = this.gerarChaveS3(data.clienteId, documento.id, novaVersao)

    try {
      await s3Client.send(
        new PutObjectCommand({
          Bucket: this.bucketName,
          Key: chaveS3,
          Body: arquivoCriptografado,
          ContentType: data.mimeType,
          Metadata: {
            clienteId: data.clienteId,
            documentoId: documento.id,
            versao: novaVersao.toString(),
            tipo: data.tipo,
          },
          ServerSideEncryption: 'AES256',
        })
      )

      // Atualizar URL no banco
      await prisma.documento.update({
        where: { id: documento.id },
        data: {
          url: chaveS3,
        },
      })

      return documento
    } catch (error: any) {
      // Se upload falhar, deletar registro do banco
      await prisma.documento.delete({
        where: { id: documento.id },
      })
      throw new Error(`Erro ao fazer upload: ${error.message}`)
    }
  }

  /**
   * Gera URL assinada para download (válida por 1 hora)
   */
  static async gerarUrlDownload(
    documentoId: string,
    expiracaoSegundos: number = 3600
  ): Promise<string> {
    const documento = await prisma.documento.findUnique({
      where: { id: documentoId },
    })

    if (!documento) {
      throw new NotFoundError('Documento')
    }

    if (!documento.url) {
      throw new ValidationError('Documento não possui URL')
    }

    const s3Client = this.getS3Client()

    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: documento.url,
    })

    const url = await getSignedUrl(s3Client, command, {
      expiresIn: expiracaoSegundos,
    })

    return url
  }

  /**
   * Busca documento por ID
   */
  static async buscarPorId(id: string) {
    const documento = await prisma.documento.findUnique({
      where: { id },
      include: {
        cliente: {
          select: {
            id: true,
            nomeCompleto: true,
          },
        },
      },
    })

    if (!documento) {
      throw new NotFoundError('Documento')
    }

    return documento
  }

  /**
   * Lista documentos com filtros
   */
  static async listar(params: {
    page?: number
    limit?: number
    clienteId?: string
    processoId?: string
    tipo?: string
  }) {
    const page = params.page || 1
    const limit = params.limit || 20
    const skip = (page - 1) * limit

    const where: any = {}

    if (params.clienteId) {
      where.clienteId = params.clienteId
    }

    if (params.processoId) {
      where.processoId = params.processoId
    }

    if (params.tipo) {
      where.tipo = params.tipo
    }

    const [documentos, total] = await Promise.all([
      prisma.documento.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.documento.count({ where }),
    ])

    return {
      documentos,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    }
  }

  /**
   * Deleta documento
   */
  static async deletar(id: string) {
    const documento = await prisma.documento.findUnique({
      where: { id },
    })

    if (!documento) {
      throw new NotFoundError('Documento')
    }

    // Deletar do S3
    if (documento.url) {
      const s3Client = this.getS3Client()
      try {
        await s3Client.send(
          new DeleteObjectCommand({
            Bucket: this.bucketName,
            Key: documento.url,
          })
        )
      } catch (error) {
        console.error('Erro ao deletar do S3:', error)
        // Continua mesmo se falhar no S3
      }
    }

    // Deletar do banco
    return await prisma.documento.delete({
      where: { id },
    })
  }

  /**
   * Lista versões de um documento
   */
  static async listarVersoes(clienteId: string, nome: string, tipo: string) {
    return await prisma.documento.findMany({
      where: {
        clienteId,
        nome,
        tipo,
      },
      orderBy: { versao: 'desc' },
    })
  }
}



