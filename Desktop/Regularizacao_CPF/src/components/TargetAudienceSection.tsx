export default function TargetAudienceSection() {
  const profiles = [
    {
      title: 'Estudantes',
      description:
        'Você está estudando nos EUA e precisa manter seu CPF regular para receber remessas da família ou para quando voltar ao Brasil.',
    },
    {
      title: 'Trabalhadores',
      description:
        'Você trabalha nos EUA e precisa regularizar sua situação fiscal para movimentar investimentos, receber heranças ou fazer remessas.',
    },
    {
      title: 'Investidores',
      description:
        'Você tem investimentos no Brasil e precisa de CPF regular para movimentar seus ativos e declarar corretamente.',
    },
    {
      title: 'Quem vai voltar ao Brasil',
      description:
        'Você planeja retornar ao Brasil e precisa ter tudo em dia para não ter problemas ao voltar.',
    },
    {
      title: 'Quem precisa abrir conta',
      description:
        'Você precisa abrir ou reativar conta em banco brasileiro e descobriu que seu CPF está bloqueado.',
    },
    {
      title: 'Quem vendeu/comprou imóvel',
      description:
        'Você vendeu ou comprou imóvel no Brasil e precisa regularizar para finalizar a transação ou declarar corretamente.',
    },
  ]

  return (
    <section className="py-20 bg-white">
      <div className="container-custom">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-6 text-gray-900">
            Para quem é este serviço
          </h2>
          <p className="text-xl text-center text-gray-600 mb-12">
            Se você se identifica com alguma dessas situações, podemos ajudar
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {profiles.map((profile, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-lg p-6 border-2 border-gray-200 hover:border-primary-500 transition-colors"
              >
                <h3 className="text-xl font-semibold mb-3 text-gray-900">
                  {profile.title}
                </h3>
                <p className="text-gray-700">{profile.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}



