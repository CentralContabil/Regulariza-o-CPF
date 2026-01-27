'use client'

import { useState } from 'react'
import ModernIcon from './ModernIcon'

export default function LeadMagnetForm() {
  const [email, setEmail] = useState('')
  const [nome, setNome] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/lead-magnet/download', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, nome }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Erro ao processar solicitação')
      }

      setSuccess(true)
      setEmail('')
      setNome('')
    } catch (err: any) {
      setError(err.message || 'Erro ao baixar material')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
        <div className="text-4xl mb-4">✅</div>
        <h3 className="text-xl font-bold text-green-800 mb-2">
          Material Enviado!
        </h3>
        <p className="text-green-700">
          Verifique sua caixa de entrada. Enviamos o checklist completo por
          email.
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 max-w-md mx-auto">
      <div className="text-center mb-6">
        <ModernIcon name="document" size="xl" color="primary" glow={true} gradient={true} className="mb-4 mx-auto" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Baixe Grátis!
        </h2>
        <p className="text-gray-600">
          Checklist: CPF Irregular Morando Fora - O Que Fazer
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="nome"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Nome (opcional)
          </label>
          <input
            type="text"
            id="nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="w-full px-4 py-2 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
            placeholder="Seu nome"
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Email *
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
            placeholder="seu@email.com"
          />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-accent-400 to-accent-500 text-primary-900 font-bold py-3 px-6 rounded-xl hover:from-accent-500 hover:to-accent-600 transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          {loading ? 'Enviando...' : '📥 Baixar Checklist Grátis'}
        </button>

        <p className="text-xs text-gray-500 text-center">
          Ao baixar, você concorda em receber emails com dicas e atualizações.
          Você pode cancelar a qualquer momento.
        </p>
      </form>
    </div>
  )
}

