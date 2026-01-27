#!/bin/bash

echo "🚀 Iniciando setup do Brazilian Relax..."

# 1. Instalar dependências
echo "📦 Instalando dependências..."
npm install

# 2. Gerar Prisma Client
echo "🔧 Gerando Prisma Client..."
npx prisma generate

# 3. Verificar se .env existe
if [ ! -f .env ]; then
    echo "⚠️  Arquivo .env não encontrado!"
    echo "📝 Copiando env.example.txt para .env..."
    cp env.example.txt .env
    echo "✅ Arquivo .env criado. Por favor, configure as variáveis de ambiente."
else
    echo "✅ Arquivo .env encontrado."
fi

# 4. Verificar TypeScript
echo "🔍 Verificando TypeScript..."
npm run type-check

# 5. Mensagem final
echo ""
echo "✅ Setup concluído!"
echo ""
echo "Próximos passos:"
echo "1. Configure o arquivo .env com suas credenciais"
echo "2. Crie o banco de dados PostgreSQL"
echo "3. Execute: npm run db:migrate"
echo "4. Execute: npm run dev"
echo ""



