export default function EducationSection() {
  const statuses = [
    {
      status: 'Regular',
      description:
        'CPF está em situação normal, sem pendências fiscais ou cadastrais.',
    },
    {
      status: 'Pendente de Regularização',
      description:
        'Existem pendências que precisam ser resolvidas (ex: declarações de IRPF em atraso).',
    },
    {
      status: 'Suspenso',
      description:
        'CPF foi suspenso pela Receita Federal, geralmente por falta de declarações ou pendências graves.',
    },
    {
      status: 'Cancelado',
      description:
        'CPF foi cancelado, geralmente por solicitação do próprio titular ou por determinação judicial.',
    },
    {
      status: 'Nulo',
      description:
        'CPF considerado nulo, geralmente por inconsistências cadastrais graves.',
    },
  ]

  return (
    <section className="py-20 bg-white">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-6 text-gray-900">
            O que é &quot;Situação Fiscal do CPF&quot;?
          </h2>
          <p className="text-xl text-center text-gray-600 mb-12">
            Entenda o que significa cada status e por que isso importa para
            você
          </p>

          <div className="bg-gray-50 rounded-lg p-8 mb-8">
            <p className="text-lg text-gray-700 mb-6">
              A <strong>Situação Fiscal do CPF</strong> é o status do seu
              Cadastro de Pessoa Física perante a Receita Federal do Brasil
              (RFB). Ela indica se há pendências fiscais, cadastrais ou
              obrigações não cumpridas que podem afetar suas operações
              financeiras no Brasil.
            </p>
          </div>

          <div className="space-y-4 mb-8">
            {statuses.map((item, index) => (
              <div
                key={index}
                className="bg-white border-2 border-gray-200 rounded-lg p-6 hover:border-primary-500 transition-colors"
              >
                <h3 className="text-xl font-semibold mb-2 text-gray-900">
                  {item.status}
                </h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>

          <div className="bg-primary-50 border-l-4 border-primary-500 p-6 rounded">
            <h3 className="font-semibold text-gray-900 mb-3">
              Por que isso acontece com quem mora no exterior?
            </h3>
            <ul className="space-y-2 text-gray-700">
              <li>
                • Falta de entrega de declarações de IRPF (mesmo sem renda
                tributável no Brasil)
              </li>
              <li>
                • Mudança de endereço não comunicada à Receita Federal
              </li>
              <li>
                • Não comunicação de Saída Definitiva quando aplicável
              </li>
              <li>
                • Pendências anteriores que se acumularam ao longo dos anos
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

