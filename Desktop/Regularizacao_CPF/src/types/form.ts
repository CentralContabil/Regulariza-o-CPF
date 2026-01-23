export interface PreDiagnosticoForm {
  nomeCompleto: string
  whatsapp: string
  email: string
  estado: string
  cpf: string
  situacaoCpf: 'regular' | 'pendente' | 'suspenso' | 'cancelado' | 'nao-sei'
  statusIrpf: 'em-dia' | 'atrasado' | 'preciso-retificar' | 'nao-sei'
  dataResidenciaEua: string // formato MM/YYYY
  saidaDefinitiva: 'sim' | 'nao' | 'nao-sei'
  consentimentoLgpd: boolean
}

export interface FormErrors {
  [key: string]: string | undefined
}

