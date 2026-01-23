import LeadMagnetForm from '@/components/LeadMagnetForm'

export default function LeadMagnetPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            📋 Checklist Gratuito
          </h1>
          <p className="text-xl text-gray-600">
            CPF Irregular Morando Fora: O Que Fazer
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div>
            <LeadMagnetForm />
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              O que você vai receber:
            </h2>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✅</span>
                <span>
                  Como verificar a situação do seu CPF
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✅</span>
                <span>
                  Passos para regularizar sua situação fiscal
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✅</span>
                <span>
                  Documentos necessários para cada tipo de regularização
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✅</span>
                <span>
                  Prazos importantes da Receita Federal
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✅</span>
                <span>
                  O que fazer em caso de Saída Definitiva
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✅</span>
                <span>
                  Como evitar bloqueios e restrições
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✅</span>
                <span>
                  Dicas para manter sua situação fiscal em dia
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
          <p className="text-gray-700 mb-4">
            <strong>Quer saber exatamente qual é sua situação?</strong>
          </p>
          <a
            href="/#pre-diagnostico"
            className="inline-block bg-yellow-400 text-blue-900 font-bold py-3 px-8 rounded-lg hover:bg-yellow-300 transition duration-300"
          >
            🎯 Fazer Meu Pré-Diagnóstico Gratuito
          </a>
        </div>
      </div>
    </div>
  )
}

