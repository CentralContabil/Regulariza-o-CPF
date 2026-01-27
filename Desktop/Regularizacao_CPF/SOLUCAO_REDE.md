# 🔧 Solução: Servidor não aparece na rede

## ✅ Configuração Atual

O servidor está configurado para aceitar conexões da rede:
- **Script**: `npm run dev` (já configurado com `-H 0.0.0.0`)
- **IP da máquina**: `192.168.0.47`
- **Porta**: `4000`

## 🔍 Diagnóstico Rápido

### 1. Verificar se o servidor está rodando
```powershell
netstat -ano | findstr :4000
```

**Se aparecer algo como:**
```
TCP    0.0.0.0:4000           0.0.0.0:0              LISTENING
```
✅ **Servidor está escutando em todas as interfaces (0.0.0.0)**

**Se aparecer:**
```
TCP    127.0.0.1:4000         0.0.0.0:0              LISTENING
```
❌ **Servidor está escutando APENAS em localhost**

### 2. Verificar mensagem no console

Quando você executa `npm run dev`, você DEVE ver:
```
▲ Next.js 14.2.0
- Local:        http://localhost:4000
- Network:      http://192.168.0.47:4000
```

**Se NÃO aparecer a linha "Network:", o servidor não está acessível na rede!**

## 🛠️ Soluções

### Solução 1: Forçar hostname via variável de ambiente

**Windows PowerShell:**
```powershell
$env:HOSTNAME="0.0.0.0"
npm run dev
```

**Windows CMD:**
```cmd
set HOSTNAME=0.0.0.0
npm run dev
```

### Solução 2: Usar script alternativo

**Opção A - PowerShell:**
```powershell
.\scripts\start-network.ps1
```

**Opção B - Batch:**
```cmd
.\scripts\dev-network.bat
```

### Solução 3: Verificar firewall

**Abrir porta no firewall (PowerShell como Administrador):**
```powershell
New-NetFirewallRule -DisplayName "Next.js Dev Server" -Direction Inbound -LocalPort 4000 -Protocol TCP -Action Allow
```

**Ou manualmente:**
1. Windows Defender Firewall → Configurações Avançadas
2. Regras de Entrada → Nova Regra
3. Porta → TCP → 4000 → Permitir conexão

### Solução 4: Verificar se Next.js está atualizado

```bash
npm list next
```

Se a versão for muito antiga, pode não suportar `-H 0.0.0.0` corretamente.

### Solução 5: Usar IP específico

Se `0.0.0.0` não funcionar, tente usar o IP diretamente:

```bash
npm run dev -- -H 192.168.0.47 -p 4000
```

## 🧪 Teste de Conectividade

### Do próprio computador:
```powershell
# Teste local (deve funcionar)
curl http://localhost:4000

# Teste pelo IP (deve funcionar se configurado corretamente)
curl http://192.168.0.47:4000
```

### De outro dispositivo:
1. Abra o navegador
2. Acesse: `http://192.168.0.47:4000`
3. Se não carregar:
   - Verifique firewall
   - Verifique se está na mesma rede
   - Verifique se o IP está correto

## 📋 Checklist

Execute este checklist na ordem:

- [ ] **1. Verificar IP atual**
  ```powershell
  ipconfig | findstr IPv4
  ```
  Deve mostrar: `192.168.0.47`

- [ ] **2. Verificar se porta está livre**
  ```powershell
  netstat -ano | findstr :4000
  ```
  Se aparecer algo, finalize o processo ou use outra porta

- [ ] **3. Iniciar servidor com hostname explícito**
  ```powershell
  $env:HOSTNAME="0.0.0.0"
  npm run dev
  ```

- [ ] **4. Verificar mensagem no console**
  Deve aparecer: `- Network: http://192.168.0.47:4000`

- [ ] **5. Verificar firewall**
  ```powershell
  .\scripts\verificar-rede.ps1
  ```

- [ ] **6. Testar acesso local**
  Abra: `http://localhost:4000`

- [ ] **7. Testar acesso pela rede**
  De outro dispositivo: `http://192.168.0.47:4000`

## 🚨 Se Ainda Não Funcionar

### Última solução: Usar servidor customizado

Crie `server.js` na raiz:

```javascript
const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')

const dev = process.env.NODE_ENV !== 'production'
const hostname = '0.0.0.0'
const port = 4000

const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true)
      await handle(req, res, parsedUrl)
    } catch (err) {
      console.error('Error occurred handling', req.url, err)
      res.statusCode = 500
      res.end('internal server error')
    }
  }).listen(port, hostname, (err) => {
    if (err) throw err
    console.log(`> Ready on http://${hostname}:${port}`)
    console.log(`> Network: http://192.168.0.47:${port}`)
  })
})
```

E use:
```bash
node server.js
```

## 💡 Dica Final

Se o problema persistir, pode ser que:
1. O antivírus está bloqueando
2. A rede tem restrições (rede corporativa)
3. O IP mudou (configure IP estático)

Verifique o arquivo `DIAGNOSTICO_REDE.md` para mais detalhes.


