# 🔍 Diagnóstico de Rede - Next.js na Intranet

Se o servidor não aparece na rede, siga estes passos de diagnóstico:

## ✅ Verificações Básicas

### 1. Verificar IP Atual
```powershell
ipconfig
```
Procure pelo **IPv4** do adaptador ativo (Wi-Fi ou Ethernet).

### 2. Verificar se o Servidor Está Rodando
```powershell
netstat -ano | findstr :4000
```
Se aparecer algo, o servidor está rodando. Se não aparecer, o servidor não iniciou.

### 3. Verificar Firewall
```powershell
# Verificar regras do firewall
Get-NetFirewallRule | Where-Object {$_.DisplayName -like "*4000*" -or $_.DisplayName -like "*Next*"}
```

## 🔧 Soluções Comuns

### Problema 1: Servidor não inicia na rede

**Solução:**
```bash
# Use o script PowerShell
.\scripts\start-network.ps1

# Ou manualmente
npm run dev
```

**Verificar se aparece:**
```
- Local:        http://localhost:4000
- Network:      http://192.168.0.47:4000
```

### Problema 2: Firewall bloqueando

**Solução Windows:**
1. Abra **Windows Defender Firewall**
2. Clique em **Configurações Avançadas**
3. Clique em **Regras de Entrada** → **Nova Regra**
4. Selecione **Porta** → **TCP** → **Portas específicas: 4000**
5. Permita a conexão
6. Aplique para todos os perfis

**Ou via PowerShell (como Administrador):**
```powershell
New-NetFirewallRule -DisplayName "Next.js Dev Server" -Direction Inbound -LocalPort 4000 -Protocol TCP -Action Allow
```

### Problema 3: IP mudou

**Solução:**
1. Verifique o IP atual: `ipconfig`
2. Atualize o `.env`:
   ```env
   NEXT_PUBLIC_APP_URL=http://SEU_IP_ATUAL:4000
   ALLOWED_ORIGINS=http://localhost:4000,http://SEU_IP_ATUAL:4000
   ```
3. Reinicie o servidor

### Problema 4: Next.js não aceita conexões externas

**Solução:**
O script já está configurado com `-H 0.0.0.0`, mas se ainda não funcionar:

1. Verifique se está usando a versão correta:
   ```bash
   npm list next
   ```

2. Tente forçar o hostname:
   ```bash
   set HOSTNAME=0.0.0.0
   npm run dev
   ```

3. Ou use diretamente:
   ```bash
   npx next dev -p 4000 -H 0.0.0.0
   ```

## 🧪 Teste de Conectividade

### Do próprio computador:
```powershell
# Teste local
curl http://localhost:4000

# Teste pelo IP
curl http://192.168.0.47:4000
```

### De outro dispositivo na rede:
1. Abra o navegador
2. Acesse: `http://192.168.0.47:4000`
3. Se não carregar, verifique:
   - Firewall
   - IP correto
   - Mesma rede Wi-Fi/Ethernet

## 📋 Checklist de Diagnóstico

- [ ] Servidor inicia sem erros (`npm run dev`)
- [ ] Mensagem mostra "Network: http://192.168.0.47:4000"
- [ ] Porta 4000 está aberta no firewall
- [ ] IP está correto (verificar com `ipconfig`)
- [ ] `.env` tem `NEXT_PUBLIC_APP_URL` correto
- [ ] Dispositivos estão na mesma rede
- [ ] Teste local funciona (`http://localhost:4000`)
- [ ] Teste de rede funciona (`http://192.168.0.47:4000`)

## 🚨 Se Nada Funcionar

1. **Reinicie o servidor:**
   ```bash
   # Parar (Ctrl+C)
   # Depois iniciar novamente
   npm run dev
   ```

2. **Verifique logs:**
   - Procure por erros no console
   - Verifique se há mensagens sobre "bind" ou "EADDRINUSE"

3. **Tente outra porta:**
   ```bash
   npm run dev -- -p 4001 -H 0.0.0.0
   ```

4. **Verifique antivírus:**
   - Alguns antivírus bloqueiam servidores locais
   - Adicione exceção para Node.js

## 💡 Dica: IP Estático

Para evitar que o IP mude, configure um IP estático:
1. Configurações → Rede e Internet
2. Propriedades do adaptador
3. Configurar IPv4 com IP estático: `192.168.0.47`


