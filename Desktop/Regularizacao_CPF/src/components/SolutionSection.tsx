'use client'

import AnimatedSection from './AnimatedSection'
import { motion } from 'framer-motion'

export default function SolutionSection() {
  return (
    <section className="py-20 lg:py-32 gradient-green-light relative overflow-hidden">
      {/* Background decorativo */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-300 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent-300 rounded-full blur-3xl"></div>
      </div>

      <div className="container-custom relative z-10">
        <div className="max-w-4xl mx-auto">
          <AnimatedSection direction="down" delay={0.2}>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-center mb-6 text-gray-900">
              Como podemos{' '}
              <span className="text-primary-600">ajudar você</span>
            </h2>
          </AnimatedSection>

          <AnimatedSection direction="up" delay={0.4}>
            <p className="text-xl md:text-2xl text-center text-gray-600 mb-12 leading-relaxed">
              Um serviço completo de regularização fiscal, feito especialmente
              para brasileiros que moram nos Estados Unidos
            </p>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <AnimatedSection direction="left" delay={0.6}>
              <motion.div
                className="card-modern bg-white rounded-2xl shadow-xl p-8 border border-gray-100"
                whileHover={{ y: -5 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <h3 className="text-2xl md:text-3xl font-display font-semibold mb-6 text-gray-900">
                  O que fazemos
                </h3>
                <ul className="space-y-4">
                  {[
                    'Regularização cadastral do CPF junto à Receita Federal',
                    'Entrega e/ou retificação do IRPF dos últimos 5 exercícios',
                    'Orientação sobre residência fiscal e Saída Definitiva',
                    'Acompanhamento anual para manter tudo em dia',
                  ].map((item, index) => (
                    <motion.li
                      key={index}
                      className="flex items-start"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <span className="text-primary-600 mr-4 text-2xl font-bold flex-shrink-0">
                        ✓
                      </span>
                      <span className="text-gray-700 text-lg leading-relaxed">{item}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            </AnimatedSection>

            <AnimatedSection direction="right" delay={0.6}>
              <motion.div
                className="card-modern bg-white rounded-2xl shadow-xl p-8 border border-gray-100"
                whileHover={{ y: -5 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <h3 className="text-2xl md:text-3xl font-display font-semibold mb-6 text-gray-900">
                  O que você recebe
                </h3>
                <ul className="space-y-4">
                  {[
                    'Diagnóstico completo da sua situação fiscal',
                    'Checklist personalizado de documentos',
                    'Orientação passo a passo do processo',
                    'Suporte durante todo o processo',
                    'Documentação completa e organizada',
                  ].map((item, index) => (
                    <motion.li
                      key={index}
                      className="flex items-start"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <span className="text-primary-600 mr-4 text-2xl font-bold flex-shrink-0">
                        ✓
                      </span>
                      <span className="text-gray-700 text-lg leading-relaxed">{item}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            </AnimatedSection>
          </div>

          <AnimatedSection direction="up" delay={0.8}>
            <motion.div
              className="gradient-green text-white rounded-3xl p-8 md:p-12 text-center shadow-2xl"
              whileHover={{ scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <h3 className="text-2xl md:text-3xl font-display font-semibold mb-6">
                Processo em etapas claras
              </h3>
              <p className="text-lg md:text-xl mb-8 text-primary-100 leading-relaxed">
                Não garantimos prazos fixos (pois dependem da análise da Receita
                Federal), mas organizamos tudo em etapas claras para você
                acompanhar cada passo do processo.
              </p>
              <div className="grid md:grid-cols-3 gap-6 text-left">
                {[
                  { icon: '1️⃣', title: 'Diagnóstico', desc: 'Análise completa da sua situação' },
                  { icon: '2️⃣', title: 'Organização', desc: 'Coleta e organização de documentos' },
                  { icon: '3️⃣', title: 'Regularização', desc: 'Entrega e acompanhamento na RFB' },
                ].map((step, index) => (
                  <motion.div
                    key={index}
                    className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20"
                    whileHover={{ scale: 1.05, y: -5 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <div className="text-4xl mb-3">{step.icon}</div>
                    <h4 className="font-display font-semibold mb-2 text-lg">{step.title}</h4>
                    <p className="text-primary-100 text-sm leading-relaxed">{step.desc}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  )
}
