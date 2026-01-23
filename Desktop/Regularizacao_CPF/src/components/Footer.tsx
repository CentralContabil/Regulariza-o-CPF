export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12">
      <div className="container-custom">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-white font-semibold mb-4">Brazilian Relax</h3>
              <p className="text-sm">
                Regularização fiscal para brasileiros no exterior. Atendimento
                online especializado.
              </p>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Contato</h3>
              <p className="text-sm mb-2">WhatsApp: +1 (XXX) XXX-XXXX</p>
              <p className="text-sm mb-2">E-mail: contato@brazilianrelax.com</p>
              <p className="text-sm">
                Horário: Segunda a Sexta, 9h às 18h (horário do Brasil)
              </p>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Informações</h3>
              <ul className="text-sm space-y-2">
                <li>
                  <a href="#formulario" className="hover:text-white">
                    Pré-diagnóstico
                  </a>
                </li>
                <li>
                  <a href="#como-funciona" className="hover:text-white">
                    Como funciona
                  </a>
                </li>
                <li>
                  <a href="#faq" className="hover:text-white">
                    FAQ
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-sm">
                <p className="mb-2">
                  <strong>Aviso de transparência:</strong> Este é um serviço
                  privado de consultoria e assessoria fiscal. Não somos órgão
                  público nem temos vínculo com a Receita Federal do Brasil.
                </p>
                <p className="mb-2">
                  <strong>Política de Privacidade:</strong> Seus dados pessoais
                  são tratados com sigilo total e em conformidade com a LGPD
                  (Lei Geral de Proteção de Dados - Lei 13.709/2018).
                </p>
                <p>
                  <strong>LGPD:</strong> Você tem direito de acessar, corrigir
                  ou excluir seus dados pessoais a qualquer momento. Entre em
                  contato conosco para exercer esses direitos.
                </p>
              </div>
            </div>
            <div className="mt-8 text-center text-sm">
              <p>
                © {new Date().getFullYear()} Brazilian Relax. Todos os direitos
                reservados.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

