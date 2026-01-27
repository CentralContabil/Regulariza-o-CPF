# Script para iniciar o servidor Next.js na rede local
# Este script garante que o servidor esteja acessível na intranet

Write-Host "🌐 Iniciando servidor Next.js na rede local..." -ForegroundColor Cyan
Write-Host ""

# Verificar IP atual
Write-Host "📡 Verificando IP da máquina..." -ForegroundColor Yellow
$ipAddress = (Get-NetIPAddress -AddressFamily IPv4 | Where-Object { $_.IPAddress -like "192.168.*" -or $_.IPAddress -like "10.*" -or $_.IPAddress -like "172.*" } | Select-Object -First 1).IPAddress

if ($ipAddress) {
    Write-Host "✅ IP encontrado: $ipAddress" -ForegroundColor Green
    Write-Host ""
    Write-Host "🌐 Servidor estará disponível em:" -ForegroundColor Cyan
    Write-Host "   Local:    http://localhost:4000" -ForegroundColor White
    Write-Host "   Network:  http://$ipAddress:4000" -ForegroundColor White
    Write-Host ""
} else {
    Write-Host "⚠️  Não foi possível detectar IP da rede local" -ForegroundColor Yellow
    Write-Host "   Verifique manualmente com: ipconfig" -ForegroundColor Yellow
    Write-Host ""
}

# Verificar se a porta está em uso
Write-Host "🔍 Verificando porta 4000..." -ForegroundColor Yellow
$portInUse = Get-NetTCPConnection -LocalPort 4000 -ErrorAction SilentlyContinue

if ($portInUse) {
    Write-Host "⚠️  Porta 4000 já está em uso!" -ForegroundColor Yellow
    Write-Host "   Finalize o processo ou use outra porta" -ForegroundColor Yellow
    Write-Host ""
    $response = Read-Host "Deseja continuar mesmo assim? (s/n)"
    if ($response -ne "s") {
        Write-Host "❌ Operação cancelada" -ForegroundColor Red
        exit
    }
} else {
    Write-Host "✅ Porta 4000 está livre" -ForegroundColor Green
    Write-Host ""
}

Write-Host "🚀 Iniciando servidor Next.js..." -ForegroundColor Cyan
Write-Host "   Pressione Ctrl+C para parar" -ForegroundColor Gray
Write-Host ""

# Iniciar servidor
npm run dev


