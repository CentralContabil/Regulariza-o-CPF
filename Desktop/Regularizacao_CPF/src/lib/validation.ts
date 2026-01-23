// ValidationError não é usado neste arquivo, mas pode ser usado no futuro

export function validateCPF(cpf: string): boolean {
  const cleanCPF = cpf.replace(/\D/g, '')
  if (cleanCPF.length !== 11) return false

  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1{10}$/.test(cleanCPF)) return false

  // Validação dos dígitos verificadores
  let sum = 0
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (10 - i)
  }
  let digit = 11 - (sum % 11)
  if (digit >= 10) digit = 0
  if (digit !== parseInt(cleanCPF.charAt(9))) return false

  sum = 0
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (11 - i)
  }
  digit = 11 - (sum % 11)
  if (digit >= 10) digit = 0
  if (digit !== parseInt(cleanCPF.charAt(10))) return false

  return true
}

export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export function validateWhatsApp(whatsapp: string): boolean {
  const clean = whatsapp.replace(/\D/g, '')
  return clean.length >= 10 && clean.length <= 15
}

export function validateDate(date: string): boolean {
  return /^(0[1-9]|1[0-2])\/\d{4}$/.test(date)
}

export function sanitizeCPF(cpf: string): string {
  return cpf.replace(/\D/g, '').slice(0, 11)
}

export function sanitizeWhatsApp(whatsapp: string): string {
  const numbers = whatsapp.replace(/\D/g, '')
  if (numbers.startsWith('1')) {
    return `+1${numbers.slice(1)}`
  }
  return `+1${numbers}`
}

