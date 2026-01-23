export default function ProblemSection() {
  const consequences = [
    'Não consegue abrir ou reativar conta em banco brasileiro',
    'Bloqueio para movimentar investimentos no Brasil',
    'Dificuldade para enviar remessas para o Brasil',
    'Impossibilidade de comprar ou vender imóveis',
    'Problemas em processos consulares',
    'Dificuldade para obter financiamentos',
    'Risco de multas e juros por IRPF em atraso',
    'Insegurança sobre status de Saída Definitiva',
  ]

  return (
    <section className="py-20 bg-gray-50">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-6 text-gray-900">
            Você mora nos EUA e descobriu que seu CPF está irregular?
          </h2>
          <p className="text-xl text-center text-gray-600 mb-12">
            Muitos brasileiros que mudaram para os Estados Unidos descobrem,
            quando menos esperam, que têm pendências fiscais no Brasil. Isso
            pode travar sua vida financeira e criar dores de cabeça que você não
            precisa ter.
          </p>

          <div className="bg-white rounded-lg shadow-lg p-8">
            <h3 className="text-2xl font-semibold mb-6 text-gray-900">
              Consequências comuns de CPF irregular:
            </h3>
            <ul className="space-y-4">
              {consequences.map((consequence, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-red-500 mr-3 text-xl">✗</span>
                  <span className="text-gray-700 text-lg">{consequence}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-12 text-center">
            <p className="text-lg text-gray-700 mb-4">
              <strong>Você não está sozinho.</strong> Milhares de brasileiros
              passam por isso todos os anos.
            </p>
            <p className="text-lg text-gray-600">
              A boa notícia é que existe uma solução, e você pode resolver tudo
              sem precisar voltar ao Brasil.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

