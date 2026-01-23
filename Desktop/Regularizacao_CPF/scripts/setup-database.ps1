# Script para configurar DATABASE_URL e criar tabelas

Write-Host "Configurando DATABASE_URL..." -ForegroundColor Cyan

$envFile = Get-Content .env -Raw

# Verificar se DATABASE_URL ja existe
if ($envFile -match '^DATABASE_URL=') {
    Write-Host "DATABASE_URL ja existe no .env" -ForegroundColor Green
} else {
    Write-Host "Criando DATABASE_URL..." -ForegroundColor Yellow
    
    # Extrair valores do .env
    $mysqlHost = if ($envFile -match 'MYSQL_HOST=([^\r\n]+)') { $matches[1] } else { 'localhost' }
    $mysqlPort = if ($envFile -match 'MYSQL_PORT=([^\r\n]+)') { $matches[1] } else { '3306' }
    $mysqlUser = if ($envFile -match 'MYSQL_USER=([^\r\n]+)') { $matches[1] } else { 'root' }
    $mysqlPass = if ($envFile -match 'MYSQL_PASSWORD=([^\r\n]+)') { $matches[1] } else { '' }
    $mysqlDb = if ($envFile -match 'MYSQL_DATABASE=([^\r\n]+)') { $matches[1] } else { 'reg_cpf' }
    
    # Escapar senha para URL
    $mysqlPassEscaped = [System.Uri]::EscapeDataString($mysqlPass)
    
    # Criar DATABASE_URL
    $databaseUrl = "mysql://${mysqlUser}:${mysqlPassEscaped}@${mysqlHost}:${mysqlPort}/${mysqlDb}?schema=public"
    
    # Adicionar ao .env
    Add-Content .env ""
    Add-Content .env "# ============================================"
    Add-Content .env "# DATABASE_URL (gerada automaticamente)"
    Add-Content .env "# ============================================"
    Add-Content .env "DATABASE_URL=`"$databaseUrl`""
    
    Write-Host "DATABASE_URL criada!" -ForegroundColor Green
}

Write-Host ""
Write-Host "Criando tabelas no banco de dados..." -ForegroundColor Cyan
Write-Host ""

# Executar migracoes
npx prisma migrate dev --name init

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "Tabelas criadas com sucesso!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Para visualizar o banco de dados, execute:" -ForegroundColor Cyan
    Write-Host "npm run db:studio" -ForegroundColor White
} else {
    Write-Host ""
    Write-Host "Erro ao criar tabelas" -ForegroundColor Red
    Write-Host "Verifique se:" -ForegroundColor Yellow
    Write-Host "1. MySQL esta rodando" -ForegroundColor Yellow
    Write-Host "2. O banco de dados existe" -ForegroundColor Yellow
    Write-Host "3. As credenciais no .env estao corretas" -ForegroundColor Yellow
}
