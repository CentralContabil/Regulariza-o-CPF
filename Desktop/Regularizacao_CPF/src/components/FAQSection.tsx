'use client'

import { useState } from 'react'

interface FAQItem {
  question: string
  answer: string
}

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const faqs: FAQItem[] = [
    {
      question: 'Como funciona o atendimento remoto?',
      answer:
        'Todo o atendimento é feito online, via WhatsApp, Zoom ou e-mail. Você não precisa sair de casa ou voltar ao Brasil. Enviamos documentos, orientações e acompanhamos tudo remotamente.',
    },
    {
      question: 'Vocês atendem em qual fuso horário?',
      answer:
        'Nosso atendimento é adaptado para brasileiros nos EUA. Trabalhamos com horários flexíveis para atender você no seu fuso horário, facilitando a comunicação.',
    },
    {
      question: 'Quais documentos são necessários?',
      answer:
        'Os documentos variam conforme seu caso específico. Após o pré-diagnóstico, você recebe um checklist personalizado com todos os documentos necessários para sua situação.',
    },
    {
      question: 'Preciso de procuração?',
      answer:
        'Depende do seu caso. Alguns processos podem exigir procuração. Avaliamos isso no diagnóstico e, se necessário, te orientamos sobre como obter a procuração correta.',
    },
    {
      question: 'Como isso afeta minha conta bancária no Brasil?',
      answer:
        'CPF irregular pode bloquear abertura de contas, movimentação de investimentos e outras operações bancárias. Com a regularização, você recupera o acesso completo aos serviços bancários.',
    },
    {
      question: 'E se eu tiver dependentes?',
      answer:
        'Sim, podemos incluir dependentes nas declarações de IRPF quando aplicável. Avaliamos cada caso e incluímos todos os dependentes necessários nas declarações.',
    },
    {
      question: 'Quanto tempo leva para regularizar?',
      answer:
        'O tempo varia conforme a complexidade do caso e o processamento da Receita Federal. Não garantimos prazos fixos, mas organizamos tudo em etapas claras para você acompanhar o progresso.',
    },
    {
      question: 'E se eu já tentei resolver sozinho e não consegui?',
      answer:
        'Não tem problema. Analisamos sua situação atual e identificamos o que falta ou precisa ser corrigido. Muitos clientes chegam até nós após tentativas próprias.',
    },
    {
      question: 'Meus dados estão seguros?',
      answer:
        'Sim. Tratamos todos os dados com sigilo total e seguimos rigorosamente a LGPD (Lei Geral de Proteção de Dados). Seus documentos são armazenados de forma segura e criptografada.',
    },
    {
      question: 'Preciso estar presente no Brasil em algum momento?',
      answer:
        'Não. Todo o processo pode ser feito remotamente. Você não precisa voltar ao Brasil para regularizar seu CPF ou entregar declarações de IRPF.',
    },
    {
      question: 'E se eu não souber minha situação exata?',
      answer:
        'Não tem problema. O pré-diagnóstico ajuda a identificar sua situação. Mesmo que você não saiba todos os detalhes, podemos investigar e te orientar.',
    },
    {
      question: 'Vocês são da Receita Federal?',
      answer:
        'Não. Somos um serviço privado de consultoria e assessoria fiscal. Não temos vínculo com a Receita Federal ou qualquer órgão público. Oferecemos orientação e suporte para regularização.',
    },
    {
      question: 'Posso fazer o processo sozinho?',
      answer:
        'Teoricamente sim, mas pode ser complexo e demorado, especialmente morando no exterior. Nossa experiência ajuda a evitar erros, economizar tempo e garantir que tudo seja feito corretamente.',
    },
    {
      question: 'O que acontece se eu não regularizar?',
      answer:
        'As pendências podem se acumular, gerar multas e juros, e continuar bloqueando operações financeiras. Quanto antes regularizar, melhor para evitar complicações futuras.',
    },
    {
      question: 'Vocês oferecem acompanhamento após a regularização?',
      answer:
        'Sim. Oferecemos plano de rotina anual para manter seu CPF regular e entregar IRPF dentro dos prazos oficiais, evitando que novas pendências surjam.',
    },
    {
      question: 'Como funciona o pagamento?',
      answer:
        'Após o diagnóstico, apresentamos propostas claras com valores e formas de pagamento. Você escolhe o plano que melhor se adequa ao seu caso.',
    },
  ]

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section className="py-20 bg-gray-50">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-6 text-gray-900">
            Perguntas frequentes
          </h2>
          <p className="text-xl text-center text-gray-600 mb-12">
            Tire suas dúvidas sobre o processo de regularização
          </p>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-lg border border-gray-200 overflow-hidden"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full text-left p-6 flex justify-between items-center hover:bg-gray-50 transition-colors"
                >
                  <span className="font-semibold text-gray-900 pr-4">
                    {faq.question}
                  </span>
                  <span className="text-primary-600 text-2xl flex-shrink-0">
                    {openIndex === index ? '−' : '+'}
                  </span>
                </button>
                {openIndex === index && (
                  <div className="px-6 pb-6">
                    <p className="text-gray-700">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

