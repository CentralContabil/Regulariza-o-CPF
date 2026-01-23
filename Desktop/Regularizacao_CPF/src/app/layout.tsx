import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Brazilian Relax - Regularize seu CPF e IRPF no Brasil',
  description:
    'Regularize seu CPF e seu Imposto de Renda no Brasil, mesmo morando nos EUA. Atendimento online especializado para brasileiros no exterior.',
  keywords: [
    'regularização CPF',
    'IRPF exterior',
    'CPF irregular',
    'brasileiros EUA',
    'saída definitiva',
    'receita federal',
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>{children}</body>
    </html>
  )
}

