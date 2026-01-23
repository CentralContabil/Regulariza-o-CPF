'use client'

import { motion } from 'framer-motion'
import AnimatedSection from './AnimatedSection'
import ParallaxSection from './ParallaxSection'

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden gradient-green">
      {/* Background com parallax sutil */}
      <div className="absolute inset-0 opacity-10">
        <ParallaxSection speed={0.3}>
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
        </ParallaxSection>
      </div>

      {/* Gradiente animado */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 animate-gradient"></div>

      <div className="container-custom relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Headline com animação */}
          <AnimatedSection direction="down" delay={0.2}>
            <motion.h1
              className="text-4xl md:text-5xl lg:text-7xl font-display font-bold mb-6 leading-tight text-white drop-shadow-lg"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              Regularize seu CPF e seu IRPF no Brasil{' '}
              <span className="text-primary-200">morando nos EUA</span>
            </motion.h1>
          </AnimatedSection>

          {/* Subheadline */}
          <AnimatedSection direction="up" delay={0.4}>
            <p className="text-xl md:text-2xl mb-12 text-primary-100 font-light leading-relaxed">
              Entrega/retificação dos últimos 5 exercícios, orientação de Saída
              Definitiva (quando aplicável) e rotina anual no prazo.
            </p>
          </AnimatedSection>

          {/* 3 Bullets de Valor com animação */}
          <AnimatedSection direction="up" delay={0.6}>
            <div className="grid md:grid-cols-3 gap-6 mb-12 text-left max-w-3xl mx-auto">
              <motion.div
                className="card-modern bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20"
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <div className="text-4xl mb-4 animate-float">📋</div>
                <h3 className="font-display font-semibold mb-2 text-white text-lg">
                  Regularização Completa
                </h3>
                <p className="text-sm text-primary-100 leading-relaxed">
                  CPF e IRPF dos últimos 5 exercícios regularizados
                </p>
              </motion.div>

              <motion.div
                className="card-modern bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20"
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ type: 'spring', stiffness: 300, delay: 0.1 }}
              >
                <div className="text-4xl mb-4 animate-float" style={{ animationDelay: '0.5s' }}>
                  🌎
                </div>
                <h3 className="font-display font-semibold mb-2 text-white text-lg">
                  Atendimento Remoto
                </h3>
                <p className="text-sm text-primary-100 leading-relaxed">
                  Tudo online, sem precisar voltar ao Brasil
                </p>
              </motion.div>

              <motion.div
                className="card-modern bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20"
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ type: 'spring', stiffness: 300, delay: 0.2 }}
              >
                <div className="text-4xl mb-4 animate-float" style={{ animationDelay: '1s' }}>
                  🔒
                </div>
                <h3 className="font-display font-semibold mb-2 text-white text-lg">
                  Seguro e Confidencial
                </h3>
                <p className="text-sm text-primary-100 leading-relaxed">
                  Seus dados protegidos com sigilo total
                </p>
              </motion.div>
            </div>
          </AnimatedSection>

          {/* CTAs com botões destacados */}
          <AnimatedSection direction="up" delay={0.8}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <motion.a
                href="https://wa.me/1XXXXXXXXXX"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Quero meu pré-diagnóstico
              </motion.a>
              <motion.a
                href="#formulario"
                className="btn-secondary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Preencher formulário
              </motion.a>
            </div>
          </AnimatedSection>

          {/* Microcopy de Confiança */}
          <AnimatedSection direction="fade" delay={1}>
            <p className="text-sm text-primary-200 mb-4">
              ✓ Atendimento online especializado • ✓ Sigilo e proteção de dados
              • ✓ Sem compromisso
            </p>
          </AnimatedSection>

          {/* Slogan */}
          <AnimatedSection direction="fade" delay={1.2}>
            <motion.p
              className="mt-8 text-lg text-primary-200 italic font-display"
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              P.S.: Regularize a sua vida com o Leão 🦁
            </motion.p>
          </AnimatedSection>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
          <motion.div
            className="w-1 h-3 bg-white/50 rounded-full mt-2"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
      </motion.div>
    </section>
  )
}
