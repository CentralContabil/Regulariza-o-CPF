# Script de Setup para Windows PowerShell

Write-Host "🚀 Iniciando setup do Brazilian Relax..." -ForegroundColor Cyan

# 1. Instalar dependências
Write-Host "📦 Instalando dependências..." -ForegroundColor Yellow
npm install

# 2. Gerar Prisma Client
Write-Host "🔧 Gerando Prisma Client..." -ForegroundColor Yellow
npx prisma generate

# 3. Verificar se .env existe
if (-not (Test-Path .env)) {
    Write-Host "⚠️  Arquivo .env não encontrado!" -ForegroundColor Yellow
    Write-Host "📝 Copiando env.example.txt para .env..." -ForegroundColor Yellow
    Copy-Item env.example.txt .env
    Write-Host "✅ Arquivo .env criado. Por favor, configure as variáveis de ambiente." -ForegroundColor Green
} else {
    Write-Host "✅ Arquivo .env encontrado." -ForegroundColor Green
}

# 4. Verificar TypeScript
Write-Host "🔍 Verificando TypeScript..." -ForegroundColor Yellow
npm run type-check

# 5. Mensagem final
Write-Host ""
Write-Host "✅ Setup concluído!" -ForegroundColor Green
Write-Host ""
Write-Host "Próximos passos:" -ForegroundColor Cyan
Write-Host "1. Configure o arquivo .env com suas credenciais"
Write-Host "2. Crie o banco de dados PostgreSQL"
Write-Host "3. Execute: npm run db:migrate"
Write-Host "4. Execute: npm run dev"
Write-Host ""

