# Guia de Setup - Brazilian Relax

Este guia irá te ajudar a configurar e executar o projeto passo a passo.

## 📋 Pré-requisitos

- Node.js >= 20.0.0
- npm >= 10.0.0
- PostgreSQL (ou outro banco de dados compatível)
- Conta AWS (para S3 - opcional)
- Conta Stripe (para pagamentos - opcional)
- Conta WhatsApp Business API (opcional)

## 🚀 Passo a Passo

### 1. Instalar Dependências

```bash
npm install
```

### 2. Configurar Variáveis de Ambiente

Copie o arquivo `.env.example` para `.env`:

```bash
cp .env.example .env
```

Edite o arquivo `.env` e preencha todas as variáveis necessárias:

#### Obrigatórias:
- `DATABASE_URL` - URL de conexão com PostgreSQL
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` - Configuração de email

#### Opcionais (para funcionalidades específicas):
- `STRIPE_SECRET_KEY` - Para pagamentos
- `AWS_*` - Para armazenamento de documentos
- `WHATSAPP_*` - Para integração WhatsApp
- `DOCUMENT_ENCRYPTION_KEY` - Para criptografia de documentos
- `JWT_SECRET` - Para autenticação

### 3. Configurar Banco de Dados

#### 3.1. Criar Banco de Dados PostgreSQL

```sql
CREATE DATABASE brazilian_relax;
```

#### 3.2. Executar Migrações do Prisma

```bash
npx prisma migrate dev --name init
```

Isso irá:
- Criar todas as tabelas no banco de dados
- Gerar o Prisma Client

#### 3.3. (Opcional) Visualizar Banco de Dados

```bash
npx prisma studio
```

### 4. Verificar Compilação

```bash
npm run type-check
```

### 5. Executar em Modo Desenvolvimento

```bash
npm run dev
```

O servidor estará disponível em: `http://localhost:3000`

### 6. Build para Produção

```bash
npm run build
npm start
```

## 📁 Estrutura do Projeto

```
Regularizacao_CPF/
├── prisma/
│   └── schema.prisma          # Schema do banco de dados
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── api/               # API Routes
│   │   ├── page.tsx           # Landing page
│   │   └── layout.tsx         # Layout principal
│   ├── components/            # Componentes React
│   ├── services/              # Lógica de negócio
│   ├── lib/                   # Utilitários
│   └── middleware/            # Middlewares
├── public/                    # Arquivos estáticos
└── .env                       # Variáveis de ambiente (não versionado)
```

## 🔧 Configurações Adicionais

### Configurar Cron Jobs

Para produção, você precisa configurar os cron jobs. Opções:

1. **Vercel Cron** (se usando Vercel):
   - Criar arquivo `vercel.json` com configuração de cron

2. **Servidor próprio**:
   - Importar `iniciarCronJobs()` no seu servidor

3. **Serviços externos**:
   - AWS EventBridge
   - Google Cloud Scheduler
   - GitHub Actions (cron)

### Configurar S3 para Documentos

1. Criar bucket no AWS S3
2. Configurar políticas de acesso
3. Adicionar credenciais no `.env`

### Configurar Stripe

1. Criar conta no Stripe
2. Obter chaves de API (teste e produção)
3. Configurar webhook para `/api/pagamentos/webhook`
4. Adicionar chaves no `.env`

### Configurar WhatsApp Business API

1. Criar conta no Meta for Developers
2. Configurar WhatsApp Business API
3. Obter token e phone ID
4. Configurar webhook para `/api/whatsapp/webhook`
5. Adicionar configurações no `.env`

## 🧪 Testar Funcionalidades

### 1. Testar Landing Page
- Acesse: `http://localhost:3000`
- Verifique todas as seções

### 2. Testar Pré-Diagnóstico
- Preencha o formulário na landing page
- Verifique se os dados são salvos no banco

### 3. Testar APIs
- Use Postman ou similar
- Teste endpoints principais:
  - `GET /api/dashboard/metricas`
  - `POST /api/pre-diagnostico`
  - `GET /api/clientes`

## 🐛 Troubleshooting

### Erro: "Prisma Client not generated"
```bash
npx prisma generate
```

### Erro: "Database connection failed"
- Verifique se PostgreSQL está rodando
- Verifique `DATABASE_URL` no `.env`
- Teste conexão: `psql $DATABASE_URL`

### Erro: "Module not found"
```bash
npm install
```

### Erro: "Port 3000 already in use"
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:3000 | xargs kill
```

## 📚 Documentação Adicional

- [README_DASHBOARD.md](./README_DASHBOARD.md) - Dashboard administrativo
- [README_DASHBOARD_CLIENTE.md](./README_DASHBOARD_CLIENTE.md) - Dashboard do cliente
- [README_DOCUMENTOS.md](./README_DOCUMENTOS.md) - Sistema de documentos
- [README_RECEITA_FEDERAL.md](./README_RECEITA_FEDERAL.md) - Integração Receita Federal
- [README_SEGURANCA_LGPD.md](./README_SEGURANCA_LGPD.md) - Segurança e LGPD
- [README_AUTOMACOES.md](./README_AUTOMACOES.md) - Sistema de automações
- [README_RELATORIOS.md](./README_RELATORIOS.md) - Relatórios e analytics

## ✅ Checklist de Setup

- [ ] Node.js e npm instalados
- [ ] PostgreSQL instalado e rodando
- [ ] Banco de dados criado
- [ ] Arquivo `.env` configurado
- [ ] Dependências instaladas (`npm install`)
- [ ] Migrações executadas (`npx prisma migrate dev`)
- [ ] Prisma Client gerado (`npx prisma generate`)
- [ ] TypeScript compila sem erros (`npm run type-check`)
- [ ] Servidor inicia sem erros (`npm run dev`)
- [ ] Landing page carrega corretamente
- [ ] APIs respondem corretamente

## 🚀 Deploy

### Vercel (Recomendado)

1. Conectar repositório GitHub
2. Configurar variáveis de ambiente
3. Deploy automático

### Outras Plataformas

- **Railway**: Suporta PostgreSQL e Node.js
- **Render**: Suporta PostgreSQL e Node.js
- **AWS**: EC2 + RDS
- **DigitalOcean**: App Platform

## 📞 Suporte

Em caso de problemas, verifique:
1. Logs do servidor
2. Logs do banco de dados
3. Variáveis de ambiente
4. Documentação específica de cada módulo



