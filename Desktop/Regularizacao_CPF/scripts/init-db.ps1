# Script para inicializar banco de dados

Write-Host "🗄️  Inicializando banco de dados..." -ForegroundColor Cyan

# Verificar se DATABASE_URL está configurada
if (-not $env:DATABASE_URL) {
    Write-Host "❌ Erro: DATABASE_URL não está configurada no .env" -ForegroundColor Red
    Write-Host "Por favor, configure a variável DATABASE_URL no arquivo .env" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ DATABASE_URL configurada" -ForegroundColor Green

# Gerar Prisma Client
Write-Host "🔧 Gerando Prisma Client..." -ForegroundColor Yellow
npx prisma generate

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erro ao gerar Prisma Client" -ForegroundColor Red
    exit 1
}

# Executar migrações
Write-Host "📊 Executando migrações..." -ForegroundColor Yellow
npx prisma migrate dev --name init

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erro ao executar migrações" -ForegroundColor Red
    Write-Host "Verifique se o banco de dados está rodando e acessível" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "✅ Banco de dados inicializado com sucesso!" -ForegroundColor Green
Write-Host ""
Write-Host "Para visualizar o banco de dados, execute:" -ForegroundColor Cyan
Write-Host "npm run db:studio" -ForegroundColor White
Write-Host ""

