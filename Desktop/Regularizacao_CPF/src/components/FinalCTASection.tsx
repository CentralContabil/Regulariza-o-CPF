'use client'

import AnimatedSection from './AnimatedSection'
import { motion } from 'framer-motion'

interface FinalCTASectionProps {
  onShowForm?: () => void
}

export default function FinalCTASection({ onShowForm }: FinalCTASectionProps) {
  return (
    <section className="py-20 lg:py-32 gradient-green relative overflow-hidden">
      {/* Background decorativo - Verde brasileiro com toques de amarelo */}
      <div className="absolute inset-0 opacity-15">
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary-400 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent-400 rounded-full blur-3xl animate-float" style={{ animationDelay: '1.5s' }}></div>
      </div>

      <div className="container-custom relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <AnimatedSection direction="down" delay={0.2}>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-6 text-white">
              Pronto para regularizar sua{' '}
              <span className="text-primary-200">situação fiscal?</span>
            </h2>
          </AnimatedSection>

          <AnimatedSection direction="up" delay={0.4}>
            <p className="text-xl md:text-2xl mb-8 text-primary-100 leading-relaxed">
              Comece agora com um pré-diagnóstico gratuito e descubra o caminho
              para regularizar seu CPF e IRPF
            </p>
          </AnimatedSection>

          <AnimatedSection direction="up" delay={0.6}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <motion.a
                href="https://wa.me/5527981111390"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Falar com especialista no WhatsApp
              </motion.a>
              <motion.button
                type="button"
                onClick={onShowForm}
                className="btn-secondary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Preencher formulário
              </motion.button>
            </div>
          </AnimatedSection>

          <AnimatedSection direction="fade" delay={0.8}>
            <motion.div
              className="bg-white/10 backdrop-blur-md rounded-2xl p-6 md:p-8 max-w-2xl mx-auto border border-white/20"
              whileHover={{ scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            >
              <h3 className="font-display font-semibold mb-3 text-lg text-white">
                Ainda não está pronto?
              </h3>
              <p className="text-primary-100 mb-4 text-lg">
                Baixe nosso guia gratuito: &quot;CPF irregular morando fora: o que
                fazer&quot;
              </p>
              <motion.a
                href="/lead-magnet/guia-regularizacao-cpf.pdf"
                download="Guia Prático Regularização CPF.pdf"
                className="inline-block btn-outline border-white text-white hover:bg-white hover:text-primary-700"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Baixar guia gratuito
              </motion.a>              
            </motion.div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  )
}
