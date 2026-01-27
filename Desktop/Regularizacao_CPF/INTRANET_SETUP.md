# 🌐 Configuração para Intranet

Este guia mostra como configurar a aplicação para funcionar na intranet no endereço `http://192.168.0.47:4000`.

## ✅ Configurações Realizadas

### 1. Script de Desenvolvimento
O script `dev` no `package.json` foi atualizado para aceitar conexões da rede local:
```json
"dev": "next dev -p 4000 -H 0.0.0.0"
```

O flag `-H 0.0.0.0` permite que o servidor aceite conexões de qualquer IP da rede local.

### 2. Variáveis de Ambiente
Atualize seu arquivo `.env` (ou crie um baseado no `env.example.txt`):

```env
NEXT_PUBLIC_APP_URL=http://192.168.0.47:4000
ALLOWED_ORIGINS=http://localhost:4000,http://192.168.0.47:4000,https://app.brazilianrelax.com
```

## 🚀 Como Usar

### 1. Verificar Configuração de Rede
```powershell
# Execute o script de verificação
.\scripts\verificar-rede.ps1
```

### 2. Iniciar o Servidor
```bash
npm run dev
```

**IMPORTANTE:** Ao iniciar, você DEVE ver no console:
```
- Local:        http://localhost:4000
- Network:      http://192.168.0.47:4000
```

Se não aparecer a linha "Network:", o servidor não está acessível na rede!

### 3. Acessar na Intranet
Após iniciar, a aplicação estará disponível em:
- **Local**: `http://localhost:4000`
- **Intranet**: `http://192.168.0.47:4000`

### 3. Acessar de Outros Dispositivos
Qualquer dispositivo na mesma rede local pode acessar usando:
```
http://192.168.0.47:4000
```

## ⚠️ Importante

### Firewall
Certifique-se de que:
- A porta 4000 está aberta no firewall do Windows
- O firewall permite conexões de entrada na porta 4000

### IP Estático (Recomendado)
Para garantir que o IP não mude, configure um IP estático no Windows:
1. Configurações → Rede e Internet → Wi-Fi/Ethernet
2. Propriedades do adaptador
3. Configurar IPv4 com IP estático: `192.168.0.47`

### Verificar IP Atual
Para verificar seu IP atual:
```powershell
ipconfig
```
Procure por "IPv4" no adaptador ativo.

## 🔧 Troubleshooting

### Não consegue acessar de outros dispositivos
1. Verifique se o IP está correto: `ipconfig`
2. Verifique o firewall do Windows
3. Certifique-se de que todos os dispositivos estão na mesma rede
4. Tente desabilitar temporariamente o firewall para testar

### Porta já em uso
Se a porta 4000 estiver ocupada:
```bash
# Windows PowerShell
netstat -ano | findstr :4000
# Depois, finalize o processo ou use outra porta
```

### Mudar o IP
Se precisar usar outro IP:
1. Atualize `NEXT_PUBLIC_APP_URL` no `.env`
2. Atualize `ALLOWED_ORIGINS` no `.env`
3. Reinicie o servidor

## 📝 Notas

- O servidor de desenvolvimento do Next.js não é recomendado para produção
- Para produção, use `npm run build` e `npm run start` com um servidor reverso (nginx, etc.)
- Em produção, configure o servidor para aceitar conexões externas adequadamente

