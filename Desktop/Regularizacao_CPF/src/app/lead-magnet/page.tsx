import LeadMagnetForm from '@/components/LeadMagnetForm'
import ModernIcon from '@/components/ModernIcon'

export default function LeadMagnetPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-accent-50 to-primary-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex flex-col items-center mb-4">
            <ModernIcon name="document" size="xl" color="primary" glow={true} gradient={true} className="mb-4" />
            <h1 className="text-4xl font-bold text-gray-800">
              Checklist Gratuito
            </h1>
          </div>
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
                <ModernIcon name="check" size="sm" color="primary" glow={false} animated={false} className="mr-2 flex-shrink-0 mt-1" />
                <span>
                  Como verificar a situação do seu CPF
                </span>
              </li>
              <li className="flex items-start">
                <ModernIcon name="check" size="sm" color="primary" glow={false} animated={false} className="mr-2 flex-shrink-0 mt-1" />
                <span>
                  Passos para regularizar sua situação fiscal
                </span>
              </li>
              <li className="flex items-start">
                <ModernIcon name="check" size="sm" color="primary" glow={false} animated={false} className="mr-2 flex-shrink-0 mt-1" />
                <span>
                  Documentos necessários para cada tipo de regularização
                </span>
              </li>
              <li className="flex items-start">
                <ModernIcon name="check" size="sm" color="primary" glow={false} animated={false} className="mr-2 flex-shrink-0 mt-1" />
                <span>
                  Prazos importantes da Receita Federal
                </span>
              </li>
              <li className="flex items-start">
                <ModernIcon name="check" size="sm" color="primary" glow={false} animated={false} className="mr-2 flex-shrink-0 mt-1" />
                <span>
                  O que fazer em caso de Saída Definitiva
                </span>
              </li>
              <li className="flex items-start">
                <ModernIcon name="check" size="sm" color="primary" glow={false} animated={false} className="mr-2 flex-shrink-0 mt-1" />
                <span>
                  Como evitar bloqueios e restrições
                </span>
              </li>
              <li className="flex items-start">
                <ModernIcon name="check" size="sm" color="primary" glow={false} animated={false} className="mr-2 flex-shrink-0 mt-1" />
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
            className="inline-block bg-accent-400 text-primary-900 font-bold py-3 px-8 rounded-lg hover:bg-accent-500 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            <span className="flex items-center gap-2">
              <ModernIcon name="target" size="sm" color="primary" glow={false} animated={false} className="inline" />
              Fazer Meu Pré-Diagnóstico Gratuito
            </span>
          </a>
        </div>
      </div>
    </div>
  )
}

