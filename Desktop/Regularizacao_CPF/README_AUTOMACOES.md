# Sistema de Automações e Recorrência

## Visão Geral

Sistema completo de automações para follow-up, lembretes, renovação de contratos e campanhas de retenção usando jobs agendados (cron).

## Automações Implementadas

### 1. Lembretes de IRPF
**Quando:** Todo dia 15 de janeiro às 9h

**O que faz:**
- Identifica clientes com IRPF atrasado ou que precisam retificar
- Envia email com lembrete do prazo (31 de maio)
- Envia mensagem no WhatsApp (se configurado)

**Template:** Email personalizado com informações sobre o prazo e link para dashboard

### 2. Follow-up de Processos
**Quando:** Toda segunda-feira às 10h

**O que faz:**
- Identifica processos sem atualização há mais de 7 dias
- Envia email de follow-up para manter cliente informado
- Calcula dias sem atualização automaticamente

**Template:** Email informando sobre o status e próximos passos

### 3. Renovação de Contratos
**Quando:** Todo dia às 8h

**O que faz:**
- Verifica contratos de rotina anual que expiram em 30 dias
- Cria automaticamente nova proposta de renovação
- Notifica cliente sobre a renovação

**Template:** Email com proposta de renovação e benefícios

### 4. Campanha de Retenção
**Quando:** Toda primeira segunda-feira do mês às 11h

**O que faz:**
- Identifica clientes inativos há mais de 90 dias
- Envia email de reengajamento
- Foca em clientes com processos pendentes

**Template:** Email amigável para reengajar o cliente

## Configuração de Cron Jobs

Os cron jobs são configurados no arquivo `src/lib/cron.ts`:

```typescript
import { iniciarCronJobs } from '@/lib/cron'

// Iniciar jobs (chamar no servidor)
iniciarCronJobs()
```

### Agendamentos

- **Lembretes IRPF**: `0 9 15 1 *` (15 de janeiro, 9h)
- **Follow-up**: `0 10 * * 1` (Toda segunda, 10h)
- **Renovação**: `0 8 * * *` (Todo dia, 8h)
- **Retenção**: `0 11 1-7 * 1` (Primeira segunda do mês, 11h)

## API Endpoints (Execução Manual)

### POST /api/automacoes/lembretes-irpf
Executa manualmente os lembretes de IRPF.

**Response:**
```json
{
  "enviados": 25,
  "total": 30,
  "mensagem": "Lembretes enviados com sucesso"
}
```

### POST /api/automacoes/follow-up
Executa manualmente o follow-up de processos.

**Response:**
```json
{
  "enviados": 10,
  "total": 15
}
```

### POST /api/automacoes/renovacao
Executa manualmente a verificação de renovações.

**Response:**
```json
{
  "notificacoes": 5,
  "total": 8
}
```

### POST /api/automacoes/retencao
Executa manualmente a campanha de retenção.

**Response:**
```json
{
  "enviados": 12,
  "total": 20
}
```

## Integração com Next.js

Para iniciar os cron jobs em produção, adicione no seu arquivo de servidor:

```typescript
// src/app/api/cron/init/route.ts
import { iniciarCronJobs } from '@/lib/cron'

export async function GET() {
  if (process.env.NODE_ENV === 'production') {
    iniciarCronJobs()
    return Response.json({ message: 'Cron jobs iniciados' })
  }
  return Response.json({ message: 'Apenas em produção' })
}
```

Ou configure um serviço externo como:
- **Vercel Cron** (se usando Vercel)
- **GitHub Actions** (cron jobs)
- **AWS EventBridge**
- **Google Cloud Scheduler**

## Lógica de Negócio

### Lembretes de IRPF
- Filtra clientes com `statusIrpf` = 'atrasado' ou 'preciso-retificar'
- Envia apenas em janeiro (mês 1)
- Combina email + WhatsApp para maior alcance

### Follow-up de Processos
- Processos com status 'pendente' ou 'em-andamento'
- Sem atualização há mais de 7 dias
- Calcula dias sem atualização automaticamente

### Renovação de Contratos
- Propostas do tipo 'rotina-anual'
- Aprovadas há ~11 meses
- Cria nova proposta automaticamente
- Notifica cliente com antecedência

### Campanha de Retenção
- Clientes sem interações há mais de 90 dias
- Apenas clientes com processos pendentes
- Foco em reengajamento

## Templates de Email

Todos os templates são HTML responsivos e incluem:
- Personalização com nome do cliente
- Links para dashboard do cliente
- Design profissional e limpo
- Call-to-action claro

## Monitoramento

Os cron jobs registram logs no console:
- Quantidade de emails/enviados
- Erros durante execução
- Status de cada automação

## Próximos Passos

- [ ] Implementar sistema de retry para falhas
- [ ] Adicionar métricas de abertura/clique
- [ ] Criar dashboard de monitoramento
- [ ] Implementar pausa/retomada de automações
- [ ] Adicionar personalização de templates
- [ ] Implementar testes automatizados

