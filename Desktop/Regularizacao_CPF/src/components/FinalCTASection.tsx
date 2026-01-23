export default function FinalCTASection() {
  return (
    <section className="py-20 bg-gradient-to-br from-primary-600 to-primary-800 text-white">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Pronto para regularizar sua situação fiscal?
          </h2>
          <p className="text-xl mb-8 text-primary-100">
            Comece agora com um pré-diagnóstico gratuito e descubra o caminho
            para regularizar seu CPF e IRPF
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <a
              href="https://wa.me/1XXXXXXXXXX"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-primary-700 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-primary-50 transition-colors shadow-lg"
            >
              Falar com especialista no WhatsApp
            </a>
            <a
              href="#formulario"
              className="bg-primary-700 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-primary-600 transition-colors border-2 border-white/30"
            >
              Preencher formulário
            </a>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 max-w-2xl mx-auto">
            <h3 className="font-semibold mb-3 text-lg">
              Ainda não está pronto?
            </h3>
            <p className="text-primary-100 mb-4">
              Baixe nosso guia gratuito: &quot;CPF irregular morando fora: o que
              fazer&quot;
            </p>
            <a
              href="#lead-magnet"
              className="inline-block bg-primary-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-600 transition-colors"
            >
              Baixar guia gratuito
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

