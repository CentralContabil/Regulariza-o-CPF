'use client'

import { useState, FormEvent } from 'react'
import type { PreDiagnosticoForm, FormErrors } from '@/types/form'

const ESTADOS_USA = [
  { value: 'FL', label: 'Florida (FL)' },
  { value: 'MA', label: 'Massachusetts (MA)' },
  { value: 'NY', label: 'New York (NY)' },
  { value: 'NJ', label: 'New Jersey (NJ)' },
  { value: 'CA', label: 'California (CA)' },
  { value: 'TX', label: 'Texas (TX)' },
  { value: 'GA', label: 'Georgia (GA)' },
  { value: 'CT', label: 'Connecticut (CT)' },
  { value: 'PA', label: 'Pennsylvania (PA)' },
  { value: 'IL', label: 'Illinois (IL)' },
  { value: 'outro', label: 'Outro' },
]

export default function PreDiagnosticoForm() {
  const [formData, setFormData] = useState<PreDiagnosticoForm>({
    nomeCompleto: '',
    whatsapp: '',
    email: '',
    estado: '',
    cpf: '',
    situacaoCpf: 'nao-sei',
    statusIrpf: 'nao-sei',
    dataResidenciaEua: '',
    saidaDefinitiva: 'nao-sei',
    consentimentoLgpd: false,
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const validateCPF = (cpf: string): boolean => {
    const cleanCPF = cpf.replace(/\D/g, '')
    return cleanCPF.length === 11
  }

  const validateWhatsApp = (whatsapp: string): boolean => {
    const clean = whatsapp.replace(/\D/g, '')
    return clean.length >= 10 && clean.length <= 15
  }

  const validateEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const validateDate = (date: string): boolean => {
    return /^(0[1-9]|1[0-2])\/\d{4}$/.test(date)
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target
    const checked =
      type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))

    // Limpar erro do campo quando usuário começar a digitar
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  const validate = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.nomeCompleto.trim()) {
      newErrors.nomeCompleto = 'Nome completo é obrigatório'
    }

    if (!formData.whatsapp.trim()) {
      newErrors.whatsapp = 'WhatsApp é obrigatório'
    } else if (!validateWhatsApp(formData.whatsapp)) {
      newErrors.whatsapp = 'WhatsApp inválido (formato: +1XXXXXXXXXX)'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'E-mail é obrigatório'
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'E-mail inválido'
    }

    if (!formData.estado) {
      newErrors.estado = 'Estado é obrigatório'
    }

    if (!formData.cpf.trim()) {
      newErrors.cpf = 'CPF é obrigatório'
    } else if (!validateCPF(formData.cpf)) {
      newErrors.cpf = 'CPF inválido (deve ter 11 dígitos)'
    }

    if (formData.dataResidenciaEua && !validateDate(formData.dataResidenciaEua)) {
      newErrors.dataResidenciaEua = 'Data inválida (formato: MM/YYYY)'
    }

    if (!formData.consentimentoLgpd) {
      newErrors.consentimentoLgpd = 'É necessário aceitar o consentimento LGPD'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, '')
    return numbers.slice(0, 11)
  }

  const formatWhatsApp = (value: string) => {
    const numbers = value.replace(/\D/g, '')
    if (numbers.startsWith('1')) {
      return `+1${numbers.slice(1)}`
    }
    return `+1${numbers}`
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (!validate()) {
      return
    }

    setIsSubmitting(true)

    try {
      // TODO: Integrar com API do backend
      const response = await fetch('/api/pre-diagnostico', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          cpf: formatCPF(formData.cpf),
          whatsapp: formatWhatsApp(formData.whatsapp),
        }),
      })

      if (response.ok) {
        setIsSuccess(true)
        // Reset form
        setFormData({
          nomeCompleto: '',
          whatsapp: '',
          email: '',
          estado: '',
          cpf: '',
          situacaoCpf: 'nao-sei',
          statusIrpf: 'nao-sei',
          dataResidenciaEua: '',
          saidaDefinitiva: 'nao-sei',
          consentimentoLgpd: false,
        })
      } else {
        throw new Error('Erro ao enviar formulário')
      }
    } catch (error) {
      console.error('Erro:', error)
      setErrors({
        submit: 'Erro ao enviar formulário. Tente novamente ou entre em contato via WhatsApp.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="bg-green-50 border-2 border-green-500 rounded-lg p-8 text-center">
        <div className="text-5xl mb-4">✅</div>
        <h3 className="text-2xl font-semibold text-gray-900 mb-4">
          Formulário enviado com sucesso!
        </h3>
        <p className="text-gray-700 mb-6">
          Recebemos suas informações. Em breve entraremos em contato via WhatsApp
          ou e-mail com o diagnóstico e próximos passos.
        </p>
        <p className="text-sm text-gray-600">
          Enviando isso, você recebe um retorno com o caminho provável do seu
          caso e próximos passos.
        </p>
      </div>
    )
  }

  return (
    <section id="formulario" className="py-20 bg-gray-50">
      <div className="container-custom">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-center mb-4 text-gray-900">
            Faça seu <span className="text-primary-600">pré-diagnóstico gratuito</span>
          </h2>
          <p className="text-center text-gray-600 mb-8 text-lg leading-relaxed">
            Preencha o formulário abaixo e receba um diagnóstico inicial da sua
            situação fiscal
          </p>

          <form onSubmit={handleSubmit} className="card-modern bg-white rounded-2xl shadow-xl p-8 md:p-10 border border-gray-100">
            {/* Nome Completo */}
            <div className="mb-6">
              <label htmlFor="nomeCompleto" className="block text-sm font-medium text-gray-700 mb-2">
                Nome completo *
              </label>
              <input
                type="text"
                id="nomeCompleto"
                name="nomeCompleto"
                value={formData.nomeCompleto}
                onChange={handleChange}
                className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all ${
                  errors.nomeCompleto ? 'border-red-500' : 'border-gray-300'
                }`}
                required
              />
              {errors.nomeCompleto && (
                <p className="mt-1 text-sm text-red-600">{errors.nomeCompleto}</p>
              )}
            </div>

            {/* WhatsApp */}
            <div className="mb-6">
              <label htmlFor="whatsapp" className="block text-sm font-medium text-gray-700 mb-2">
                WhatsApp (com DDI +1) *
              </label>
              <input
                type="tel"
                id="whatsapp"
                name="whatsapp"
                value={formData.whatsapp}
                onChange={handleChange}
                placeholder="+1 (555) 123-4567"
                className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all ${
                  errors.whatsapp ? 'border-red-500' : 'border-gray-300'
                }`}
                required
              />
              {errors.whatsapp && (
                <p className="mt-1 text-sm text-red-600">{errors.whatsapp}</p>
              )}
            </div>

            {/* Email */}
            <div className="mb-6">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                E-mail *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
                required
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Estado */}
            <div className="mb-6">
              <label htmlFor="estado" className="block text-sm font-medium text-gray-700 mb-2">
                Onde você mora nos EUA? (Estado) *
              </label>
              <select
                id="estado"
                name="estado"
                value={formData.estado}
                onChange={handleChange}
                className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all ${
                  errors.estado ? 'border-red-500' : 'border-gray-300'
                }`}
                required
              >
                <option value="">Selecione um estado</option>
                {ESTADOS_USA.map((estado) => (
                  <option key={estado.value} value={estado.value}>
                    {estado.label}
                  </option>
                ))}
              </select>
              {errors.estado && (
                <p className="mt-1 text-sm text-red-600">{errors.estado}</p>
              )}
            </div>

            {/* CPF */}
            <div className="mb-6">
              <label htmlFor="cpf" className="block text-sm font-medium text-gray-700 mb-2">
                CPF (apenas números) *
              </label>
              <input
                type="text"
                id="cpf"
                name="cpf"
                value={formData.cpf}
                onChange={(e) => {
                  const formatted = formatCPF(e.target.value)
                  setFormData((prev) => ({ ...prev, cpf: formatted }))
                }}
                placeholder="00000000000"
                maxLength={11}
                className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all ${
                  errors.cpf ? 'border-red-500' : 'border-gray-300'
                }`}
                required
              />
              {errors.cpf && (
                <p className="mt-1 text-sm text-red-600">{errors.cpf}</p>
              )}
            </div>

            {/* Situação CPF */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Você sabe a situação do seu CPF? *
              </label>
              <div className="space-y-2">
                {[
                  { value: 'regular', label: 'Regular' },
                  { value: 'pendente', label: 'Pendente' },
                  { value: 'suspenso', label: 'Suspenso' },
                  { value: 'cancelado', label: 'Cancelado' },
                  { value: 'nao-sei', label: 'Não sei' },
                ].map((option) => (
                  <label key={option.value} className="flex items-center">
                    <input
                      type="radio"
                      name="situacaoCpf"
                      value={option.value}
                      checked={formData.situacaoCpf === option.value}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    <span className="text-gray-700">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Status IRPF */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Imposto de Renda: como está? *
              </label>
              <div className="space-y-2">
                {[
                  { value: 'em-dia', label: 'Em dia' },
                  { value: 'atrasado', label: 'Atrasado' },
                  { value: 'preciso-retificar', label: 'Preciso retificar' },
                  { value: 'nao-sei', label: 'Não sei' },
                ].map((option) => (
                  <label key={option.value} className="flex items-center">
                    <input
                      type="radio"
                      name="statusIrpf"
                      value={option.value}
                      checked={formData.statusIrpf === option.value}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    <span className="text-gray-700">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Data Residência EUA */}
            <div className="mb-6">
              <label htmlFor="dataResidenciaEua" className="block text-sm font-medium text-gray-700 mb-2">
                Desde quando você mora nos EUA? (mês/ano)
              </label>
              <input
                type="text"
                id="dataResidenciaEua"
                name="dataResidenciaEua"
                value={formData.dataResidenciaEua}
                onChange={handleChange}
                placeholder="MM/YYYY (ex: 01/2020)"
                className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all ${
                  errors.dataResidenciaEua ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.dataResidenciaEua && (
                <p className="mt-1 text-sm text-red-600">{errors.dataResidenciaEua}</p>
              )}
            </div>

            {/* Saída Definitiva */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Você fez Saída Definitiva do Brasil? *
              </label>
              <div className="space-y-2">
                {[
                  { value: 'sim', label: 'Sim' },
                  { value: 'nao', label: 'Não' },
                  { value: 'nao-sei', label: 'Não sei' },
                ].map((option) => (
                  <label key={option.value} className="flex items-center">
                    <input
                      type="radio"
                      name="saidaDefinitiva"
                      value={option.value}
                      checked={formData.saidaDefinitiva === option.value}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    <span className="text-gray-700">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Consentimento LGPD */}
            <div className="mb-6">
              <label className="flex items-start">
                <input
                  type="checkbox"
                  name="consentimentoLgpd"
                  checked={formData.consentimentoLgpd}
                  onChange={handleChange}
                  className="mt-1 mr-2"
                  required
                />
                <span className="text-sm text-gray-700">
                  Concordo com o tratamento dos meus dados pessoais conforme a
                  LGPD (Lei Geral de Proteção de Dados). *
                </span>
              </label>
              {errors.consentimentoLgpd && (
                <p className="mt-1 text-sm text-red-600">{errors.consentimentoLgpd}</p>
              )}
            </div>

            {errors.submit && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{errors.submit}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full btn-primary py-4 px-6 font-display font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isSubmitting ? 'Enviando...' : 'Enviar pré-diagnóstico'}
            </button>

            <p className="mt-4 text-sm text-center text-gray-600">
              Enviando isso, você recebe um retorno com o caminho provável do
              seu caso e próximos passos.
            </p>
          </form>
        </div>
      </div>
    </section>
  )
}

