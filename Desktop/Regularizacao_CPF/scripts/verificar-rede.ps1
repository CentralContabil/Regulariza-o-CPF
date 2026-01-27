# Script para verificar se o servidor está acessível na rede

Write-Host "🔍 Verificando configuração de rede..." -ForegroundColor Cyan
Write-Host ""

# Verificar IP
$ipAddress = (Get-NetIPAddress -AddressFamily IPv4 | Where-Object { $_.IPAddress -like "192.168.*" } | Select-Object -First 1).IPAddress

if ($ipAddress) {
    Write-Host "✅ IP da rede local: $ipAddress" -ForegroundColor Green
} else {
    Write-Host "❌ IP da rede local não encontrado" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "🔍 Verificando se o servidor está rodando..." -ForegroundColor Yellow

# Verificar porta 4000
$portCheck = Get-NetTCPConnection -LocalPort 4000 -State Listen -ErrorAction SilentlyContinue

if ($portCheck) {
    Write-Host "✅ Servidor está rodando na porta 4000" -ForegroundColor Green
    
    # Verificar em qual IP está escutando
    $listeningIP = $portCheck.LocalAddress
    
    if ($listeningIP -eq "0.0.0.0" -or $listeningIP -eq "::") {
        Write-Host "✅ Servidor está escutando em 0.0.0.0 (todas as interfaces)" -ForegroundColor Green
    } elseif ($listeningIP -eq "127.0.0.1" -or $listeningIP -eq "::1") {
        Write-Host "⚠️  Servidor está escutando APENAS em localhost!" -ForegroundColor Yellow
        Write-Host "   Execute: npm run dev" -ForegroundColor Yellow
    } else {
        Write-Host "ℹ️  Servidor está escutando em: $listeningIP" -ForegroundColor Cyan
    }
} else {
    Write-Host "❌ Servidor NÃO está rodando na porta 4000" -ForegroundColor Red
    Write-Host "   Execute: npm run dev" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "🔍 Verificando firewall..." -ForegroundColor Yellow

# Verificar regra de firewall
$firewallRule = Get-NetFirewallRule | Where-Object { 
    ($_.DisplayName -like "*4000*" -or $_.DisplayName -like "*Next*") -and 
    $_.Enabled -eq $true 
}

if ($firewallRule) {
    Write-Host "✅ Regra de firewall encontrada" -ForegroundColor Green
} else {
    Write-Host "⚠️  Nenhuma regra de firewall específica encontrada" -ForegroundColor Yellow
    Write-Host "   Pode ser necessário criar uma regra manualmente" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "🌐 URLs de acesso:" -ForegroundColor Cyan
Write-Host "   Local:    http://localhost:4000" -ForegroundColor White
Write-Host "   Network:  http://$ipAddress:4000" -ForegroundColor White
Write-Host ""
Write-Host "💡 Dica: Teste acessar de outro dispositivo na mesma rede usando:" -ForegroundColor Cyan
Write-Host "   http://$ipAddress:4000" -ForegroundColor White
Write-Host ""


