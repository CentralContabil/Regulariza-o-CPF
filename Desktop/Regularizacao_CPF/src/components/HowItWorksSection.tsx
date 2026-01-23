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
    <section className="py-20 bg-white">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-6 text-gray-900">
            Como funciona o atendimento
          </h2>
          <p className="text-xl text-center text-gray-600 mb-12">
            Tudo feito remotamente, via WhatsApp, Zoom ou e-mail. Você não
            precisa sair de casa.
          </p>

          <div className="space-y-6">
            {steps.map((item) => (
              <div
                key={item.step}
                className="bg-gray-50 rounded-lg p-6 border-l-4 border-primary-500"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                    {item.step}
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-xl font-semibold mb-2 text-gray-900">
                      {item.title}
                    </h3>
                    <p className="text-gray-700 mb-3">{item.description}</p>
                    <p className="text-sm text-gray-600 bg-white px-3 py-2 rounded inline-block">
                      <strong>Você precisa:</strong> {item.clientNeeds}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

