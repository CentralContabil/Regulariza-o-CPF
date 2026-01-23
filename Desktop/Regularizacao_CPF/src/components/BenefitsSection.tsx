export default function BenefitsSection() {
  const benefits = [
    {
      title: 'Clareza total',
      description:
        'Você sabe exatamente o que precisa fazer e em que etapa está o processo.',
    },
    {
      title: 'Rastreabilidade',
      description:
        'Acompanhe cada passo do processo com atualizações regulares e documentação completa.',
    },
    {
      title: 'Documentação organizada',
      description:
        'Todos os documentos são organizados e arquivados de forma segura e acessível.',
    },
    {
      title: 'Orientação especializada',
      description:
        'Receba orientação técnica de quem entende as regras da Receita Federal.',
    },
    {
      title: 'Segurança de dados',
      description:
        'Seus dados são tratados com sigilo total e conformidade com LGPD.',
    },
    {
      title: 'Atendimento em seu fuso',
      description:
        'Atendimento adaptado ao seu horário, considerando a diferença de fuso.',
    },
    {
      title: 'Processo passo a passo',
      description:
        'Não precisa entender tudo sozinho. Te guiamos em cada etapa.',
    },
    {
      title: 'Suporte contínuo',
      description:
        'Não te abandonamos após a regularização. Acompanhamento anual disponível.',
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
    <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="container-custom">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-6 text-gray-900">
            Benefícios e diferenciais
          </h2>
          <p className="text-xl text-center text-gray-600 mb-12">
            Por que escolher nosso serviço de regularização
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow border border-gray-200"
              >
                <div className="text-3xl mb-3">✓</div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900">
                  {benefit.title}
                </h3>
                <p className="text-sm text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>

          <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-8">
            <h3 className="text-2xl font-semibold mb-6 text-gray-900">
              Evite erros comuns
            </h3>
            <ul className="space-y-3">
              {commonErrors.map((error, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-red-500 mr-3 text-xl">⚠</span>
                  <span className="text-gray-700">{error}</span>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-gray-700">
              <strong>Nossa orientação especializada</strong> ajuda você a
              evitar esses erros e garantir que tudo seja feito corretamente da
              primeira vez.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

