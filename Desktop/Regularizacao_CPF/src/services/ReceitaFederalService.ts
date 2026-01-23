import axios, { AxiosInstance } from 'axios'
import NodeCache from 'node-cache'

// Cache de 1 hora para consultas
const cache = new NodeCache({ stdTTL: 3600 })

export interface SituacaoCPF {
  cpf: string
  situacao: 'regular' | 'pendente' | 'suspenso' | 'cancelado' | 'nulo' | 'indisponivel'
  motivo?: string
  dataConsulta?: string
}

export interface DeclaracaoIRPF {
  anoExercicio: number
  situacao: 'entregue' | 'nao-entregue' | 'retificacao-pendente' | 'indisponivel'
  dataEntrega?: string
  recibo?: string
}

export interface SaidaDefinitiva {
  cpf: string
  comunicada: boolean
  dataComunicacao?: string
  dataSaida?: string
  status?: string
}

export class ReceitaFederalService {
  private static apiClient: AxiosInstance

  /**
   * Inicializa cliente HTTP para APIs da Receita Federal
   */
  private static getClient(): AxiosInstance {
    if (!this.apiClient) {
      this.apiClient = axios.create({
        baseURL: process.env.RECEITA_FEDERAL_API_URL || 'https://api.receita.fazenda.gov.br',
        timeout: 30000,
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'BrazilianRelax/1.0',
        },
      })
    }
    return this.apiClient
  }

  /**
   * Consulta situação do CPF na Receita Federal
   * 
   * NOTA: A Receita Federal não oferece API pública oficial para consulta de CPF.
   * Este método deve ser adaptado para usar:
   * - Serviços terceiros autorizados (ex: Serpro, ReceitaWS)
   * - Web scraping (com cuidado legal)
   * - Integração com sistemas oficiais quando disponíveis
   */
  static async consultarSituacaoCPF(cpf: string): Promise<SituacaoCPF> {
    const cpfLimpo = cpf.replace(/\D/g, '')

    // Verificar cache
    const cacheKey = `cpf_${cpfLimpo}`
    const cached = cache.get<SituacaoCPF>(cacheKey)
    if (cached) {
      return cached
    }

    try {
      // TODO: Implementar integração real com API da Receita Federal
      // Por enquanto, retorna estrutura mockada
      // 
      // Exemplo de integração com serviço terceiro:
      // const response = await this.getClient().post('/cpf/consulta', {
      //   cpf: cpfLimpo,
      //   token: process.env.RECEITA_FEDERAL_TOKEN
      // })
      
      // Por enquanto, retorna resposta mockada
      const resultado: SituacaoCPF = {
        cpf: cpfLimpo,
        situacao: 'indisponivel',
        motivo: 'Integração com API da Receita Federal pendente de configuração',
        dataConsulta: new Date().toISOString(),
      }

      // Salvar no cache
      cache.set(cacheKey, resultado)

      return resultado
    } catch (error: any) {
      console.error('Erro ao consultar CPF:', error)
      
      // Retornar erro estruturado
      return {
        cpf: cpfLimpo,
        situacao: 'indisponivel',
        motivo: `Erro na consulta: ${error.message}`,
        dataConsulta: new Date().toISOString(),
      }
    }
  }

  /**
   * Verifica declarações de IRPF entregues
   * 
   * NOTA: Similar à consulta de CPF, não há API pública oficial.
   * Pode ser necessário usar serviços terceiros ou consulta manual.
   */
  static async verificarDeclaracoesIRPF(
    cpf: string,
    anos: number[] = []
  ): Promise<DeclaracaoIRPF[]> {
    const cpfLimpo = cpf.replace(/\D/g, '')

    // Se não especificou anos, verifica últimos 5 anos
    const anosParaVerificar = anos.length > 0 
      ? anos 
      : Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i)

    // Verificar cache
    const cacheKey = `irpf_${cpfLimpo}_${anosParaVerificar.join(',')}`
    const cached = cache.get<DeclaracaoIRPF[]>(cacheKey)
    if (cached) {
      return cached
    }

    try {
      // TODO: Implementar integração real
      // const response = await this.getClient().post('/irpf/consulta', {
      //   cpf: cpfLimpo,
      //   anos: anosParaVerificar,
      //   token: process.env.RECEITA_FEDERAL_TOKEN
      // })

      // Por enquanto, retorna resposta mockada
      const resultado: DeclaracaoIRPF[] = anosParaVerificar.map((ano) => ({
        anoExercicio: ano,
        situacao: 'indisponivel',
      }))

      // Salvar no cache
      cache.set(cacheKey, resultado)

      return resultado
    } catch (error: any) {
      console.error('Erro ao verificar IRPF:', error)
      return anosParaVerificar.map((ano) => ({
        anoExercicio: ano,
        situacao: 'indisponivel',
      }))
    }
  }

  /**
   * Consulta situação de Saída Definitiva
   */
  static async consultarSaidaDefinitiva(cpf: string): Promise<SaidaDefinitiva> {
    const cpfLimpo = cpf.replace(/\D/g, '')

    // Verificar cache
    const cacheKey = `saida_definitiva_${cpfLimpo}`
    const cached = cache.get<SaidaDefinitiva>(cacheKey)
    if (cached) {
      return cached
    }

    try {
      // TODO: Implementar integração real
      // const response = await this.getClient().post('/saida-definitiva/consulta', {
      //   cpf: cpfLimpo,
      //   token: process.env.RECEITA_FEDERAL_TOKEN
      // })

      // Por enquanto, retorna resposta mockada
      const resultado: SaidaDefinitiva = {
        cpf: cpfLimpo,
        comunicada: false,
        status: 'indisponivel',
      }

      // Salvar no cache
      cache.set(cacheKey, resultado)

      return resultado
    } catch (error: any) {
      console.error('Erro ao consultar Saída Definitiva:', error)
      return {
        cpf: cpfLimpo,
        comunicada: false,
        status: 'erro',
      }
    }
  }

  /**
   * Limpa cache de consultas
   */
  static limparCache(cpf?: string) {
    if (cpf) {
      const cpfLimpo = cpf.replace(/\D/g, '')
      cache.del(`cpf_${cpfLimpo}`)
      cache.del(`irpf_${cpfLimpo}_*`)
      cache.del(`saida_definitiva_${cpfLimpo}`)
    } else {
      cache.flushAll()
    }
  }

  /**
   * Valida se CPF está no formato correto
   */
  static validarCPF(cpf: string): boolean {
    const cpfLimpo = cpf.replace(/\D/g, '')
    if (cpfLimpo.length !== 11) return false

    // Verifica se todos os dígitos são iguais
    if (/^(\d)\1{10}$/.test(cpfLimpo)) return false

    // Validação dos dígitos verificadores
    let sum = 0
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cpfLimpo.charAt(i)) * (10 - i)
    }
    let digit = 11 - (sum % 11)
    if (digit >= 10) digit = 0
    if (digit !== parseInt(cpfLimpo.charAt(9))) return false

    sum = 0
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cpfLimpo.charAt(i)) * (11 - i)
    }
    digit = 11 - (sum % 11)
    if (digit >= 10) digit = 0
    if (digit !== parseInt(cpfLimpo.charAt(10))) return false

    return true
  }
}

