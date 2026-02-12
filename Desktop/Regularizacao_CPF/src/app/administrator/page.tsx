'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Save, RefreshCw, ChevronRight, Layout, MessageSquare, ShieldCheck, HelpCircle } from 'lucide-react'

// Estrutura inicial do conteúdo (fallback)
const INITIAL_CONTENT: any = {
  hero: {
    title: 'Regularize seu CPF e seu IRPF no Brasil',
    highlight: 'morando nos EUA',
    subtitle: 'Entrega/retificação dos últimos 5 exercícios, orientação de Saída Definitiva (quando aplicável) e rotina anual no prazo.',
    ctaPrimary: 'Quero meu pré-diagnóstico',
    ctaSecondary: 'Preencher formulário',
    slogan: 'P.S.: Regularize a sua vida com o Leão',
  },
  benefits: {
    title: 'Benefícios e',
    highlight: 'diferenciais',
    subtitle: 'Por que escolher nosso serviço de regularização',
  },
  socialProof: {
    title: 'O que nossos clientes dizem',
    subtitle: 'Brasileiros que já regularizaram sua situação fiscal conosco',
  },
  faq: {
    title: 'Perguntas',
    highlight: 'frequentes',
    subtitle: 'Tire suas dúvidas sobre a regularização de CPF e IRPF',
  },
  finalCta: {
    title: 'Pronto para regularizar sua',
    highlight: 'situação fiscal?',
    subtitle: 'Comece agora com um pré-diagnóstico gratuito e descubra o caminho para regularizar seu CPF e IRPF',
    ctaPrimary: 'Falar com especialista no WhatsApp',
    ctaSecondary: 'Preencher formulário',
  }
}

const SECTIONS = [
  { id: 'hero', label: 'Hero / Início', icon: Layout },
  { id: 'benefits', label: 'Benefícios', icon: ShieldCheck },
  { id: 'socialProof', label: 'Depoimentos', icon: MessageSquare },
  { id: 'faq', label: 'FAQ', icon: HelpCircle },
  { id: 'finalCta', label: 'CTA Final', icon: Layout },
]

export default function AdministratorPage() {
  const [content, setContent] = useState<any>(INITIAL_CONTENT)
  const [activeSection, setActiveSection] = useState('hero')
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  useEffect(() => {
    fetchContent()
  }, [])

  const fetchContent = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/content')
      const data = await response.json()
      
      // Mesclar com o inicial caso falte alguma seção
      setContent({ ...INITIAL_CONTENT, ...data })
    } catch (error) {
      console.error('Erro ao buscar conteúdo:', error)
      setMessage({ type: 'error', text: 'Erro ao carregar conteúdo.' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      setIsSaving(true)
      setMessage({ type: '', text: '' })

      const response = await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          section: activeSection,
          content: content[activeSection],
        }),
      })

      if (response.ok) {
        setMessage({ type: 'success', text: 'Conteúdo salvo com sucesso!' })
      } else {
        throw new Error('Erro ao salvar')
      }
    } catch (error) {
      console.error('Erro ao salvar:', error)
      setMessage({ type: 'error', text: 'Erro ao salvar o conteúdo.' })
    } finally {
      setIsSaving(false)
    }
  }

  const updateField = (field: string, value: string) => {
    setContent((prev: any) => ({
      ...prev,
      [activeSection]: {
        ...prev[activeSection],
        [field]: value,
      }
    }))
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <RefreshCw className="w-8 h-8 text-primary-600 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Layout className="text-primary-600" /> Admin
          </h1>
          <p className="text-xs text-gray-500 mt-1">Editor de Landing Page</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          {SECTIONS.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activeSection === section.id
                  ? 'bg-primary-50 text-primary-700 shadow-sm'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <section.icon className={`w-5 h-5 ${activeSection === section.id ? 'text-primary-600' : 'text-gray-400'}`} />
              {section.label}
              {activeSection === section.id && <ChevronRight className="ml-auto w-4 h-4" />}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-200">
          <a
            href="/"
            target="_blank"
            className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-all"
          >
            Ver Site <Layout className="w-4 h-4" />
          </a>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-3xl mx-auto">
          <header className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {SECTIONS.find(s => s.id === activeSection)?.label}
              </h2>
              <p className="text-gray-500">Edite os textos desta seção</p>
            </div>
            
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl font-semibold shadow-lg shadow-primary-500/30 hover:bg-primary-700 transition-all disabled:opacity-50"
            >
              {isSaving ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
              Salvar Alterações
            </button>
          </header>

          {message.text && (
            <div className={`p-4 rounded-xl mb-6 ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
              {message.text}
            </div>
          )}

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 space-y-6">
            {Object.entries(content[activeSection]).map(([key, value]: [string, any]) => (
              <div key={key}>
                <label className="block text-sm font-semibold text-gray-700 mb-2 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </label>
                {key === 'subtitle' || key === 'description' ? (
                  <textarea
                    value={value}
                    onChange={(e) => updateField(key, e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all outline-none"
                  />
                ) : (
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => updateField(key, e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all outline-none"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
