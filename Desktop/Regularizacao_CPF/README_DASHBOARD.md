# Dashboard Administrativo

## Visão Geral

Sistema completo de dashboard administrativo para gestão de clientes, processos, métricas de conversão e análise de performance.

## Funcionalidades

### Métricas Gerais
Visão consolidada de todos os indicadores principais do sistema:
- **Clientes**: Total e novos este mês
- **Processos**: Total, pendentes, em andamento e concluídos
- **Propostas**: Total, pendentes, aprovadas e taxa de aprovação
- **Financeiro**: Total de pagamentos, receita total e receita do mês

### Funil de Vendas
Análise completa do funil de conversão:
- Diagnósticos realizados
- Propostas enviadas
- Propostas aprovadas
- Pagamentos aprovados
- Taxas de conversão em cada etapa

### Análise de Processos
- Distribuição por status
- Distribuição por tipo (CPF, IRPF, Saída Definitiva)
- Processos pendentes que precisam de atenção

### Análise Financeira
- Receita por mês (últimos 12 meses)
- Tendências de crescimento
- Comparativo mensal

### Tarefas Pendentes
Sistema inteligente de priorização:
- Identifica processos que precisam de atenção
- Calcula dias sem atualização
- Classifica por prioridade (alta, média, baixa)
- Ordena por urgência

### Estatísticas de Conversão
Métricas de performance do funil:
- Taxa de conversão de diagnóstico para proposta
- Taxa de conversão de proposta para pagamento
- Análise dos últimos 30 dias

## API Endpoints

### GET /api/dashboard/metricas
Retorna métricas gerais do dashboard.

**Response:**
```json
{
  "clientes": {
    "total": 150,
    "novosEsteMes": 25
  },
  "processos": {
    "total": 200,
    "pendentes": 30,
    "emAndamento": 50,
    "concluidos": 120
  },
  "propostas": {
    "total": 180,
    "pendentes": 20,
    "aprovadas": 120,
    "taxaAprovacao": 66.67
  },
  "financeiro": {
    "totalPagamentos": 100,
    "receitaTotal": 50000.00,
    "receitaMes": 5000.00
  }
}
```

### GET /api/dashboard/funil
Retorna dados do funil de vendas.

**Response:**
```json
{
  "diagnosticos": 500,
  "propostasEnviadas": 300,
  "propostasAprovadas": 200,
  "pagamentosAprovados": 150,
  "taxaConversaoDiagnostico": 60.0,
  "taxaConversaoProposta": 66.67,
  "taxaConversaoPagamento": 75.0
}
```

### GET /api/dashboard/processos/status
Retorna distribuição de processos por status.

**Response:**
```json
[
  { "status": "pendente", "quantidade": 30 },
  { "status": "em-andamento", "quantidade": 50 },
  { "status": "concluido", "quantidade": 120 }
]
```

### GET /api/dashboard/processos/tipo
Retorna distribuição de processos por tipo.

**Response:**
```json
[
  { "tipo": "cpf", "quantidade": 80 },
  { "tipo": "irpf", "quantidade": 70 },
  { "tipo": "saida-definitiva", "quantidade": 50 }
]
```

### GET /api/dashboard/receita/mes
Retorna receita dos últimos 12 meses.

**Response:**
```json
[
  { "mes": "jan 2024", "receita": 5000.00 },
  { "mes": "fev 2024", "receita": 6000.00 },
  ...
]
```

### GET /api/dashboard/clientes/recentes
Retorna clientes mais recentes.

**Query Parameters:**
- `limit` (number, padrão: 10)

**Response:**
```json
[
  {
    "id": "clxxx",
    "nomeCompleto": "João Silva",
    "email": "joao@example.com",
    "estado": "CA",
    "createdAt": "2024-01-01T00:00:00Z",
    "processos": [...]
  }
]
```

### GET /api/dashboard/processos/pendentes
Retorna processos pendentes que precisam de atenção.

**Query Parameters:**
- `limit` (number, padrão: 10)

**Response:**
```json
[
  {
    "id": "proxxx",
    "tipo": "cpf",
    "status": "pendente",
    "cliente": {
      "id": "clxxx",
      "nomeCompleto": "João Silva",
      "email": "joao@example.com"
    }
  }
]
```

### GET /api/dashboard/tarefas
Retorna tarefas pendentes priorizadas.

**Response:**
```json
[
  {
    "id": "proxxx",
    "tipo": "cpf",
    "status": "pendente",
    "cliente": "João Silva",
    "email": "joao@example.com",
    "diasSemAtualizacao": 10,
    "prioridade": "alta",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
]
```

### GET /api/dashboard/conversao
Retorna estatísticas de conversão dos últimos 30 dias.

**Response:**
```json
{
  "periodo": "30 dias",
  "diagnosticos": 100,
  "propostas": 60,
  "pagamentos": 40,
  "taxaDiagnosticoParaProposta": 60.0,
  "taxaPropostaParaPagamento": 66.67
}
```

## Uso no Frontend

### Exemplo com React

```typescript
import { useEffect, useState } from 'react'

function Dashboard() {
  const [metricas, setMetricas] = useState(null)

  useEffect(() => {
    fetch('/api/dashboard/metricas')
      .then(res => res.json())
      .then(data => setMetricas(data))
  }, [])

  if (!metricas) return <div>Carregando...</div>

  return (
    <div>
      <h1>Dashboard</h1>
      <div>
        <h2>Clientes</h2>
        <p>Total: {metricas.clientes.total}</p>
        <p>Novos este mês: {metricas.clientes.novosEsteMes}</p>
      </div>
      {/* ... mais componentes ... */}
    </div>
  )
}
```

### Exemplo com Gráficos (Chart.js)

```typescript
import { Line } from 'react-chartjs-2'

function ReceitaChart() {
  const [dados, setDados] = useState([])

  useEffect(() => {
    fetch('/api/dashboard/receita/mes')
      .then(res => res.json())
      .then(data => setDados(data))
  }, [])

  const chartData = {
    labels: dados.map(d => d.mes),
    datasets: [{
      label: 'Receita',
      data: dados.map(d => d.receita),
      borderColor: 'rgb(75, 192, 192)',
    }]
  }

  return <Line data={chartData} />
}
```

## Performance

- Todas as queries são otimizadas com índices do Prisma
- Métricas são calculadas em paralelo usando `Promise.all`
- Dados são agregados no banco de dados (não em memória)
- Cache pode ser implementado para métricas que não mudam frequentemente

## Próximos Passos

- [ ] Implementar cache para métricas (Redis)
- [ ] Adicionar filtros de data customizados
- [ ] Criar exportação de relatórios (PDF/Excel)
- [ ] Adicionar notificações em tempo real
- [ ] Implementar gráficos interativos
- [ ] Adicionar comparação com períodos anteriores

