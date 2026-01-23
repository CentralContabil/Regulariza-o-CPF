'use client'

import AnimatedSection from './AnimatedSection'
import { motion } from 'framer-motion'

export default function HowItWorksSection() {
  const steps = [
    {
      step: 1,
      title: 'Pré-diagnóstico',
      description:
        'Você preenche um formulário rápido com informações básicas sobre sua situação.',
      clientNeeds: '5 minutos do seu tempo',
    },
    {
      step: 2,
      title: 'Análise e Direcionamento',
      description:
        'Analisamos seu caso e te direcionamos para o caminho correto (CPF, IRPF, Saída Definitiva).',
      clientNeeds: 'Aguardar nossa análise (24-48h)',
    },
    {
      step: 3,
      title: 'Checklist de Documentos',
      description:
        'Você recebe um checklist personalizado com todos os documentos necessários.',
      clientNeeds: 'Organizar e enviar documentos',
    },
    {
      step: 4,
      title: 'Revisão e Organização',
      description:
        'Revisamos todos os documentos e organizamos seu dossiê fiscal.',
      clientNeeds: 'Aguardar nossa revisão',
    },
    {
      step: 5,
      title: 'Execução',
      description:
        'Entregamos declarações, retificações e comunicações necessárias à Receita Federal.',
      clientNeeds: 'Aguardar processamento',
    },
    {
      step: 6,
      title: 'Acompanhamento',
      description:
        'Acompanhamos o processamento e te mantemos informado sobre cada atualização.',
      clientNeeds: 'Manter comunicação ativa',
    },
    {
      step: 7,
      title: 'Conclusão',
      description:
        'Seu CPF está regularizado e você recebe toda a documentação comprobatória.',
      clientNeeds: 'Confirmar recebimento',
    },
  ]

  return (
    <section className="py-20 lg:py-32 bg-white relative overflow-hidden">
      {/* Background decorativo */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-300 rounded-full blur-3xl"></div>
      </div>

      <div className="container-custom relative z-10">
        <div className="max-w-4xl mx-auto">
          <AnimatedSection direction="down" delay={0.2}>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-center mb-6 text-gray-900">
              Como funciona o{' '}
              <span className="text-primary-600">atendimento</span>
            </h2>
          </AnimatedSection>

          <AnimatedSection direction="up" delay={0.4}>
            <p className="text-xl md:text-2xl text-center text-gray-600 mb-12 leading-relaxed">
              Tudo feito remotamente, via WhatsApp, Zoom ou e-mail. Você não
              precisa sair de casa.
            </p>
          </AnimatedSection>

          <div className="space-y-6">
            {steps.map((item, index) => (
              <AnimatedSection key={item.step} direction="left" delay={0.1 * index}>
                <motion.div
                  className="card-modern bg-gradient-to-r from-white to-gray-50 rounded-2xl p-6 md:p-8 border-l-4 border-primary-500 shadow-lg"
                  whileHover={{ x: 10, scale: 1.02 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <div className="flex items-start gap-6">
                    <motion.div
                      className="flex-shrink-0 w-14 h-14 gradient-green text-white rounded-full flex items-center justify-center font-display font-bold text-xl shadow-lg"
                      whileHover={{ rotate: 360, scale: 1.1 }}
                      transition={{ duration: 0.5 }}
                    >
                      {item.step}
                    </motion.div>
                    <div className="flex-grow">
                      <h3 className="text-xl md:text-2xl font-display font-semibold mb-3 text-gray-900">
                        {item.title}
                      </h3>
                      <p className="text-gray-700 mb-4 text-lg leading-relaxed">
                        {item.description}
                      </p>
                      <p className="text-sm text-primary-700 bg-primary-50 px-4 py-2 rounded-lg inline-block font-medium border border-primary-200">
                        <strong>Você precisa:</strong> {item.clientNeeds}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
