'use client'

import AnimatedSection from './AnimatedSection'
import { motion } from 'framer-motion'

export default function BenefitsSection() {
  const benefits = [
    {
      title: 'Clareza total',
      description:
        'Você sabe exatamente o que precisa fazer e em que etapa está o processo.',
      icon: '🎯',
    },
    {
      title: 'Rastreabilidade',
      description:
        'Acompanhe cada passo do processo com atualizações regulares e documentação completa.',
      icon: '📊',
    },
    {
      title: 'Documentação organizada',
      description:
        'Todos os documentos são organizados e arquivados de forma segura e acessível.',
      icon: '📁',
    },
    {
      title: 'Orientação especializada',
      description:
        'Receba orientação técnica de quem entende as regras da Receita Federal.',
      icon: '👨‍💼',
    },
    {
      title: 'Segurança de dados',
      description:
        'Seus dados são tratados com sigilo total e conformidade com LGPD.',
      icon: '🔒',
    },
    {
      title: 'Atendimento em seu fuso',
      description:
        'Atendimento adaptado ao seu horário, considerando a diferença de fuso.',
      icon: '🌐',
    },
    {
      title: 'Processo passo a passo',
      description:
        'Não precisa entender tudo sozinho. Te guiamos em cada etapa.',
      icon: '👣',
    },
    {
      title: 'Suporte contínuo',
      description:
        'Não te abandonamos após a regularização. Acompanhamento anual disponível.',
      icon: '🤝',
    },
  ]

  const commonErrors = [
    'Tentar resolver sozinho e cometer erros que geram mais pendências',
    'Não comunicar Saída Definitiva quando necessário',
    'Deixar declarações de IRPF em atraso se acumularem',
    'Não manter documentação organizada',
    'Ignorar prazos e perder oportunidades',
  ]

  return (
    <section className="py-20 lg:py-32 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
      {/* Background decorativo */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-96 h-96 bg-accent-200 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary-200 rounded-full blur-3xl"></div>
      </div>

      <div className="container-custom relative z-10">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection direction="down" delay={0.2}>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-center mb-6 text-gray-900">
              Benefícios e{' '}
              <span className="text-primary-600">diferenciais</span>
            </h2>
          </AnimatedSection>

          <AnimatedSection direction="up" delay={0.4}>
            <p className="text-xl md:text-2xl text-center text-gray-600 mb-12 leading-relaxed">
              Por que escolher nosso serviço de regularização
            </p>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {benefits.map((benefit, index) => (
              <AnimatedSection
                key={index}
                direction="up"
                delay={0.1 * index}
                className="h-full"
              >
                <motion.div
                  className="card-modern bg-white rounded-2xl p-6 border border-gray-100 h-full flex flex-col"
                  whileHover={{ y: -8, scale: 1.03 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <div className="text-4xl mb-4 animate-float" style={{ animationDelay: `${index * 0.2}s` }}>
                    {benefit.icon}
                  </div>
                  <h3 className="text-lg md:text-xl font-display font-semibold mb-3 text-gray-900">
                    {benefit.title}
                  </h3>
                  <p className="text-sm md:text-base text-gray-600 leading-relaxed flex-grow">
                    {benefit.description}
                  </p>
                </motion.div>
              </AnimatedSection>
            ))}
          </div>

          <AnimatedSection direction="up" delay={0.8}>
            <motion.div
              className="bg-gradient-to-r from-red-50 to-orange-50 border-l-4 border-red-500 rounded-2xl p-8 md:p-10 shadow-lg"
              whileHover={{ scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <h3 className="text-2xl md:text-3xl font-display font-semibold mb-6 text-gray-900">
                Evite erros comuns
              </h3>
              <ul className="space-y-4 mb-6">
                {commonErrors.map((error, index) => (
                  <motion.li
                    key={index}
                    className="flex items-start"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <span className="text-red-500 mr-4 text-2xl font-bold flex-shrink-0">
                      ⚠
                    </span>
                    <span className="text-gray-700 text-lg leading-relaxed">{error}</span>
                  </motion.li>
                ))}
              </ul>
              <p className="text-lg text-gray-700 font-medium">
                <strong className="text-primary-700">Nossa orientação especializada</strong>{' '}
                ajuda você a evitar esses erros e garantir que tudo seja feito corretamente da
                primeira vez.
              </p>
            </motion.div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  )
}
