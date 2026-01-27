'use client'

import AnimatedSection from './AnimatedSection'
import { motion } from 'framer-motion'
import ModernIcon from './ModernIcon'

export default function ProblemSection() {
  const consequences = [
    'Não consegue abrir ou reativar conta em banco brasileiro',
    'Bloqueio para movimentar investimentos no Brasil',
    'Dificuldade para enviar remessas para o Brasil',
    'Impossibilidade de comprar ou vender imóveis',
    'Problemas em processos consulares',
    'Dificuldade para obter financiamentos',
    'Risco de multas e juros por IRPF em atraso',
    'Insegurança sobre status de Saída Definitiva',
  ]

  return (
    <section className="py-20 lg:py-32 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
      {/* Background decorativo - Verde brasileiro */}
      <div className="absolute inset-0 opacity-8">
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary-300 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent-300 rounded-full blur-3xl animate-float" style={{ animationDelay: '0.5s' }}></div>
      </div>

      <div className="container-custom relative z-10">
        <div className="max-w-4xl mx-auto">
          <AnimatedSection direction="down" delay={0.2}>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-center mb-6 text-gray-900">
              Você mora nos EUA e descobriu que seu{' '}
              <span className="text-primary-600">CPF está irregular?</span>
            </h2>
          </AnimatedSection>

          <AnimatedSection direction="up" delay={0.4}>
            <p className="text-xl md:text-2xl text-center text-gray-600 mb-12 leading-relaxed">
              Muitos brasileiros que mudaram para os Estados Unidos descobrem,
              quando menos esperam, que têm pendências fiscais no Brasil. Isso
              pode travar sua vida financeira e criar dores de cabeça que você não
              precisa ter.
            </p>
          </AnimatedSection>

          <AnimatedSection direction="up" delay={0.6}>
            <div className="card-modern bg-white rounded-2xl shadow-xl p-8 md:p-10 border border-gray-100">
              <h3 className="text-2xl md:text-3xl font-display font-semibold mb-8 text-gray-900">
                Consequências comuns de CPF irregular:
              </h3>
              <ul className="space-y-4">
                {consequences.map((consequence, index) => (
                  <motion.li
                    key={index}
                    className="flex items-start group"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <ModernIcon 
                      name="x" 
                      size="md" 
                      color="primary" 
                      glow={false} 
                      animated={false}
                      className="mr-4 flex-shrink-0 group-hover:scale-110"
                    />
                    <span className="text-gray-700 text-lg leading-relaxed group-hover:text-gray-900 transition-colors">
                      {consequence}
                    </span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </AnimatedSection>

          <AnimatedSection direction="fade" delay={0.8}>
            <div className="mt-12 text-center">
              <p className="text-lg md:text-xl text-gray-700 mb-4 font-medium">
                <strong className="text-primary-700">Você não está sozinho.</strong>{' '}
                Milhares de brasileiros passam por isso todos os anos.
              </p>
              <p className="text-lg md:text-xl text-gray-600">
                A boa notícia é que existe uma solução, e você pode resolver tudo
                sem precisar voltar ao Brasil.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  )
}
