# Dashboard do Cliente

## Visão Geral

Sistema completo de dashboard para clientes acompanharem seus processos de regularização, documentos, comunicações e propostas.

## Funcionalidades

### Visão Geral do Dashboard
- Resumo de processos (total, pendentes, em andamento, concluídos)
- Status de propostas pendentes
- Total de documentos enviados
- Informações do cliente

### Acompanhamento de Processos
- Lista de todos os processos do cliente
- Status atual de cada processo
- Progresso visual (0-100%)
- Próximos passos identificados automaticamente
- Checklist de documentos
- Timeline de eventos

### Gestão de Documentos
- Lista de documentos enviados
- Status de cada documento
- Organização por processo
- Histórico de versões

### Comunicações
- Histórico de interações (email, WhatsApp, chamadas)
- Mensagens recebidas e enviadas
- Organização cronológica

### Propostas
- Propostas pendentes de aprovação
- Status de cada proposta
- Valores e descrições

## API Endpoints

### GET /api/cliente/[id]/dashboard
Retorna dashboard completo do cliente.

**Response:**
```json
{
  "cliente": {
    "id": "clxxx",
    "nomeCompleto": "João Silva",
    "email": "joao@example.com",
    "situacaoCpf": "regular",
    "statusIrpf": "em-dia"
  },
  "processos": [
    {
      "id": "proxxx",
      "tipo": "cpf",
      "status": "em-andamento",
      "descricao": "Regularização de CPF",
      "checklist": [
        {
          "titulo": "Enviar CPF",
          "descricao": "Enviar cópia do CPF",
          "concluido": true
        }
      ],
      "etapas": [...],
      "proximosPassos": [
        "Enviar comprovante de residência",
        "Aguardar análise da Receita Federal"
      ],
      "progresso": 45,
      "eventos": [...],
      "documentos": [...],
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-15T00:00:00Z"
    }
  ],
  "propostas": [...],
  "interacoes": [...],
  "documentos": [...],
  "resumo": {
    "totalProcessos": 3,
    "processosPendentes": 1,
    "processosEmAndamento": 1,
    "processosConcluidos": 1,
    "totalDocumentos": 10,
    "propostasPendentes": 1
  }
}
```

### GET /api/cliente/[id]/processos/[processoId]/timeline
Retorna timeline completa de um processo.

**Response:**
```json
[
  {
    "id": "evtxxx",
    "tipo": "status-change",
    "titulo": "Status atualizado",
    "descricao": "Processo movido para 'em-andamento'",
    "data": "2024-01-15T00:00:00Z",
    "metadata": {...}
  },
  {
    "id": "criacao",
    "tipo": "criacao",
    "titulo": "Processo criado",
    "descricao": "Processo de cpf foi criado",
    "data": "2024-01-01T00:00:00Z",
    "metadata": null
  }
]
```

### GET /api/cliente/[id]/comunicacoes
Retorna histórico de comunicações do cliente.

**Query Parameters:**
- `limit` (number, padrão: 20)

**Response:**
```json
[
  {
    "id": "intxxx",
    "tipo": "email",
    "assunto": "Bem-vindo!",
    "conteudo": "Olá João...",
    "direcao": "outbound",
    "data": "2024-01-01T00:00:00Z"
  }
]
```

## Cálculo de Progresso

O progresso é calculado com base em:
- **Checklist**: 50% do progresso total
  - Cada item concluído aumenta o progresso proporcionalmente
- **Etapas**: 50% do progresso total
  - Cada etapa concluída aumenta o progresso proporcionalmente
- **Status**: Processos concluídos sempre mostram 100%

## Próximos Passos

Os próximos passos são extraídos automaticamente de:
1. Itens do checklist não concluídos (máximo 3)
2. Próxima etapa pendente
3. Mensagens padrão baseadas no status

## Uso no Frontend

### Exemplo: Carregar Dashboard

```typescript
async function carregarDashboard(clienteId: string) {
  const response = await fetch(`/api/cliente/${clienteId}/dashboard`)
  const dashboard = await response.json()
  
  console.log('Processos:', dashboard.processos)
  console.log('Progresso:', dashboard.processos[0].progresso)
  console.log('Próximos passos:', dashboard.processos[0].proximosPassos)
}
```

### Exemplo: Exibir Timeline

```typescript
async function carregarTimeline(clienteId: string, processoId: string) {
  const response = await fetch(
    `/api/cliente/${clienteId}/processos/${processoId}/timeline`
  )
  const timeline = await response.json()
  
  // Ordenar por data (mais recente primeiro)
  timeline.sort((a, b) => 
    new Date(b.data).getTime() - new Date(a.data).getTime()
  )
}
```

### Exemplo: Componente de Progresso

```tsx
function ProgressoBar({ progresso }: { progresso: number }) {
  return (
    <div className="w-full bg-gray-200 rounded-full h-4">
      <div
        className="bg-blue-600 h-4 rounded-full transition-all"
        style={{ width: `${progresso}%` }}
      >
        <span className="text-xs text-white px-2">{progresso}%</span>
      </div>
    </div>
  )
}
```

## Próximos Passos (Melhorias Futuras)

- [ ] Implementar autenticação de clientes
- [ ] Adicionar notificações em tempo real
- [ ] Criar área de upload de documentos
- [ ] Implementar chat integrado
- [ ] Adicionar assinatura digital de propostas
- [ ] Criar área de pagamentos
- [ ] Implementar histórico completo de transações

