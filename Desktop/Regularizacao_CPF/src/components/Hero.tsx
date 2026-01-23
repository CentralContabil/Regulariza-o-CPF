export default function Hero() {
  return (
    <section className="relative bg-gradient-to-br from-primary-600 to-primary-800 text-white py-20 lg:py-32">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto text-center">
          {/* Headline */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Regularize seu CPF e seu IRPF no Brasil morando nos EUA
          </h1>

          {/* Subheadline */}
          <p className="text-xl md:text-2xl mb-8 text-primary-100">
            Entrega/retificação dos últimos 5 exercícios, orientação de Saída
            Definitiva (quando aplicável) e rotina anual no prazo.
          </p>

          {/* 3 Bullets de Valor */}
          <div className="grid md:grid-cols-3 gap-6 mb-10 text-left max-w-3xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <div className="text-3xl mb-3">📋</div>
              <h3 className="font-semibold mb-2">Regularização Completa</h3>
              <p className="text-sm text-primary-100">
                CPF e IRPF dos últimos 5 exercícios regularizados
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <div className="text-3xl mb-3">🌎</div>
              <h3 className="font-semibold mb-2">Atendimento Remoto</h3>
              <p className="text-sm text-primary-100">
                Tudo online, sem precisar voltar ao Brasil
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <div className="text-3xl mb-3">🔒</div>
              <h3 className="font-semibold mb-2">Seguro e Confidencial</h3>
              <p className="text-sm text-primary-100">
                Seus dados protegidos com sigilo total
              </p>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">
            <a
              href="https://wa.me/1XXXXXXXXXX"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-primary-700 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-primary-50 transition-colors shadow-lg"
            >
              Quero meu pré-diagnóstico
            </a>
            <a
              href="#formulario"
              className="bg-primary-700 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-primary-600 transition-colors border-2 border-white/30"
            >
              Preencher formulário
            </a>
          </div>

          {/* Microcopy de Confiança */}
          <p className="text-sm text-primary-200">
            ✓ Atendimento online especializado • ✓ Sigilo e proteção de dados
            • ✓ Sem compromisso
          </p>

          {/* Slogan */}
          <p className="mt-8 text-lg text-primary-200 italic">
            P.S.: Regularize a sua vida com o Leão 🦁
          </p>
        </div>
      </div>
    </section>
  )
}

