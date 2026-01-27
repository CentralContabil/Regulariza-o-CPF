'use client'

import { motion } from 'framer-motion'

export default function SocialProofSection() {
  const testimonials = [
    {
      initials: 'M.S.',
      location: 'Florida, EUA',
      text: 'Consegui regularizar meu CPF sem precisar voltar ao Brasil. O processo foi muito mais simples do que eu imaginava.',
      type: 'exemplo de depoimento',
    },
    {
      initials: 'R.C.',
      location: 'Massachusetts, EUA',
      text: 'Estava com IRPF atrasado há 3 anos. Eles organizaram tudo e agora estou em dia. Recomendo!',
      type: 'exemplo de depoimento',
    },
    {
      initials: 'A.L.',
      location: 'New York, EUA',
      text: 'Atendimento excelente, sempre responderam minhas dúvidas rapidamente. Meu CPF está regular agora.',
      type: 'exemplo de depoimento',
    },
    {
      initials: 'P.M.',
      location: 'California, EUA',
      text: 'Não sabia nem por onde começar. Eles me guiaram em cada passo e tudo foi resolvido.',
      type: 'exemplo de depoimento',
    },
    {
      initials: 'L.F.',
      location: 'Texas, EUA',
      text: 'Precisava abrir conta no banco e meu CPF estava suspenso. Resolveram tudo em tempo hábil.',
      type: 'exemplo de depoimento',
    },
    {
      initials: 'C.D.',
      location: 'Georgia, EUA',
      text: 'Fiz Saída Definitiva com orientação deles. Processo muito mais tranquilo do que eu esperava.',
      type: 'exemplo de depoimento',
    },
  ]

  const cases = [
    {
      problem: 'CPF suspenso por falta de declarações de IRPF',
      action: 'Entrega e retificação dos últimos 5 exercícios',
      result: 'CPF regularizado e cliente pode movimentar investimentos novamente',
    },
    {
      problem: 'Dúvida sobre necessidade de Saída Definitiva',
      action: 'Análise da situação e orientação personalizada',
      result: 'Cliente esclarecido e processo de comunicação iniciado corretamente',
    },
    {
      problem: 'IRPF atrasado impedindo abertura de conta bancária',
      action: 'Regularização completa e acompanhamento',
      result: 'Conta aberta com sucesso e situação fiscal em dia',
    },
  ]

  return (
    <section className="py-20 bg-white">
      <div className="container-custom">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-6 text-gray-900">
            O que nossos clientes dizem
          </h2>
          <p className="text-xl text-center text-gray-600 mb-12">
            Brasileiros que já regularizaram sua situação fiscal conosco
          </p>

          {/* Depoimentos */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-lg p-6 border border-gray-200"
              >
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center font-semibold text-sm mr-3">
                    {testimonial.initials}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      {testimonial.initials}
                    </p>
                    <p className="text-sm text-gray-600">
                      {testimonial.location}
                    </p>
                  </div>
                </div>
                <p className="text-gray-700 mb-3 italic">
                  &quot;{testimonial.text}&quot;
                </p>
                <p className="text-xs text-gray-500">
                  {testimonial.type}
                </p>
              </div>
            ))}
          </div>

          {/* Casos de Sucesso */}
          <div>
            <h3 className="text-2xl font-semibold text-center mb-8 text-gray-900">
              Casos de sucesso
            </h3>
            <div className="space-y-6">
              {cases.map((caseItem, index) => (
                <div
                  key={index}
                  className="bg-primary-50 rounded-lg p-6 border-l-4 border-primary-500"
                >
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">
                        Problema
                      </h4>
                      <p className="text-gray-700 text-sm">{caseItem.problem}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">
                        Ação
                      </h4>
                      <p className="text-gray-700 text-sm">{caseItem.action}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">
                        Resultado
                      </h4>
                      <p className="text-gray-700 text-sm">{caseItem.result}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

