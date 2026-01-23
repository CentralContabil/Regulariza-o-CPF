export default function SolutionSection() {
  return (
    <section className="py-20 bg-gradient-to-br from-primary-50 to-white">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-6 text-gray-900">
            Como podemos ajudar você
          </h2>
          <p className="text-xl text-center text-gray-600 mb-12">
            Um serviço completo de regularização fiscal, feito especialmente
            para brasileiros que moram nos Estados Unidos
          </p>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h3 className="text-2xl font-semibold mb-4 text-gray-900">
                O que fazemos
              </h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="text-primary-600 mr-3 text-xl">✓</span>
                  <span>
                    Regularização cadastral do CPF junto à Receita Federal
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-600 mr-3 text-xl">✓</span>
                  <span>
                    Entrega e/ou retificação do IRPF dos últimos 5 exercícios
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-600 mr-3 text-xl">✓</span>
                  <span>
                    Orientação sobre residência fiscal e Saída Definitiva
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-600 mr-3 text-xl">✓</span>
                  <span>
                    Acompanhamento anual para manter tudo em dia
                  </span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-8">
              <h3 className="text-2xl font-semibold mb-4 text-gray-900">
                O que você recebe
              </h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="text-primary-600 mr-3 text-xl">✓</span>
                  <span>Diagnóstico completo da sua situação fiscal</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-600 mr-3 text-xl">✓</span>
                  <span>Checklist personalizado de documentos</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-600 mr-3 text-xl">✓</span>
                  <span>Orientação passo a passo do processo</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-600 mr-3 text-xl">✓</span>
                  <span>Suporte durante todo o processo</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-600 mr-3 text-xl">✓</span>
                  <span>Documentação completa e organizada</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-primary-600 text-white rounded-lg p-8 text-center">
            <h3 className="text-2xl font-semibold mb-4">
              Processo em etapas claras
            </h3>
            <p className="text-lg mb-6">
              Não garantimos prazos fixos (pois dependem da análise da Receita
              Federal), mas organizamos tudo em etapas claras para você
              acompanhar cada passo do processo.
            </p>
            <div className="grid md:grid-cols-3 gap-6 text-left">
              <div>
                <div className="text-3xl mb-2">1️⃣</div>
                <h4 className="font-semibold mb-2">Diagnóstico</h4>
                <p className="text-primary-100 text-sm">
                  Análise completa da sua situação
                </p>
              </div>
              <div>
                <div className="text-3xl mb-2">2️⃣</div>
                <h4 className="font-semibold mb-2">Organização</h4>
                <p className="text-primary-100 text-sm">
                  Coleta e organização de documentos
                </p>
              </div>
              <div>
                <div className="text-3xl mb-2">3️⃣</div>
                <h4 className="font-semibold mb-2">Regularização</h4>
                <p className="text-primary-100 text-sm">
                  Entrega e acompanhamento na RFB
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

