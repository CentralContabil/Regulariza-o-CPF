# Sistema de Relatórios e Analytics

## Visão Geral

Sistema completo de geração de relatórios financeiros, de conversão e de processos, com exportação em formato estruturado.

## Tipos de Relatórios

### 1. Relatório Financeiro
Análise completa da performance financeira do negócio:
- Receita total no período
- Total de pagamentos
- Valor médio de pagamento
- Taxa de inadimplência
- Receita por método de pagamento
- Receita agrupada por período (dia, semana, mês)
- Detalhamento de propostas

### 2. Relatório de Conversão
Análise do funil de vendas e taxas de conversão:
- Funil completo (diagnósticos → propostas → pagamentos)
- Taxas de conversão em cada etapa
- Análise por tipo de proposta
- Detalhamento de cada etapa do funil

### 3. Relatório de Processos
Análise de performance e gestão de processos:
- Estatísticas gerais (total, concluídos, em atraso)
- Tempo médio de conclusão
- Distribuição por status e tipo
- Identificação de processos em atraso
- Detalhamento completo de cada processo

## API Endpoints

### POST /api/relatorios/financeiro
Gera relatório financeiro.

**Request:**
```json
{
  "dataInicio": "2024-01-01T00:00:00Z",
  "dataFim": "2024-12-31T23:59:59Z",
  "agruparPor": "mes" // "dia", "semana" ou "mes"
}
```

**Response:**
```json
{
  "periodo": {
    "inicio": "2024-01-01T00:00:00Z",
    "fim": "2024-12-31T23:59:59Z"
  },
  "resumo": {
    "receitaTotal": 50000.00,
    "totalPagamentos": 100,
    "valorMedioPagamento": 500.00,
    "taxaInadimplencia": 10.5
  },
  "receitaPorMetodo": [
    {
      "metodo": "stripe",
      "receita": 45000.00,
      "quantidade": 90
    }
  ],
  "receitaAgrupada": [
    {
      "periodo": "jan 2024",
      "receita": 5000.00
    }
  ],
  "propostas": [...]
}
```

### POST /api/relatorios/conversao
Gera relatório de conversão.

**Request:**
```json
{
  "dataInicio": "2024-01-01T00:00:00Z",
  "dataFim": "2024-12-31T23:59:59Z"
}
```

**Response:**
```json
{
  "periodo": {
    "inicio": "2024-01-01T00:00:00Z",
    "fim": "2024-12-31T23:59:59Z"
  },
  "funil": {
    "diagnosticos": 500,
    "propostasEnviadas": 300,
    "propostasAprovadas": 200,
    "pagamentosAprovados": 150
  },
  "taxas": {
    "diagnosticoParaProposta": 60.0,
    "propostaParaAprovacao": 66.67,
    "aprovacaoParaPagamento": 75.0,
    "diagnosticoParaPagamento": 30.0
  },
  "propostasPorTipo": [...],
  "detalhes": {
    "diagnosticos": [...],
    "propostas": [...],
    "pagamentos": [...]
  }
}
```

### POST /api/relatorios/processos
Gera relatório de processos.

**Request:**
```json
{
  "dataInicio": "2024-01-01T00:00:00Z",
  "dataFim": "2024-12-31T23:59:59Z",
  "tipo": "cpf", // opcional
  "status": "pendente" // opcional
}
```

**Response:**
```json
{
  "periodo": {
    "inicio": "2024-01-01T00:00:00Z",
    "fim": "2024-12-31T23:59:59Z"
  },
  "resumo": {
    "total": 200,
    "concluidos": 120,
    "emAtraso": 10,
    "tempoMedioConclusaoDias": 45.5
  },
  "processosPorStatus": [
    {
      "status": "pendente",
      "quantidade": 30
    }
  ],
  "processosPorTipo": [
    {
      "tipo": "cpf",
      "quantidade": 80
    }
  ],
  "processos": [...]
}
```

### POST /api/relatorios/exportar
Exporta relatório em formato estruturado (JSON).

**Request:**
```json
{
  "tipo": "financeiro", // "financeiro", "conversao" ou "processos"
  "dataInicio": "2024-01-01T00:00:00Z",
  "dataFim": "2024-12-31T23:59:59Z",
  "agruparPor": "mes" // apenas para financeiro
}
```

**Response:**
```json
{
  "tipo": "financeiro",
  "geradoEm": "2024-01-15T10:30:00Z",
  "dados": {
    // Dados do relatório completo
  }
}
```

## Uso no Frontend

### Exemplo: Gerar Relatório Financeiro

```typescript
async function gerarRelatorioFinanceiro() {
  const response = await fetch('/api/relatorios/financeiro', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      dataInicio: '2024-01-01T00:00:00Z',
      dataFim: '2024-12-31T23:59:59Z',
      agruparPor: 'mes',
    }),
  })

  const relatorio = await response.json()
  console.log('Receita Total:', relatorio.resumo.receitaTotal)
}
```

### Exemplo: Exportar Relatório

```typescript
async function exportarRelatorio(tipo: string) {
  const response = await fetch('/api/relatorios/exportar', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      tipo,
      dataInicio: '2024-01-01T00:00:00Z',
      dataFim: '2024-12-31T23:59:59Z',
    }),
  })

  const relatorio = await response.json()
  
  // Salvar como JSON
  const blob = new Blob([JSON.stringify(relatorio, null, 2)], {
    type: 'application/json',
  })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `relatorio-${tipo}-${Date.now()}.json`
  a.click()
}
```

## Funcionalidades Avançadas

### Agrupamento de Receita
- **Por dia**: Receita diária detalhada
- **Por semana**: Receita semanal (Semana X/Ano)
- **Por mês**: Receita mensal (formato: "jan 2024")

### Identificação de Processos em Atraso
Processos são considerados em atraso quando:
- Status diferente de "concluido"
- Sem atualização há mais de 7 dias

### Cálculo de Tempo Médio de Conclusão
Calcula o tempo médio entre criação e conclusão de processos, útil para:
- Planejamento de prazos
- Identificação de gargalos
- Melhoria de processos

## Próximos Passos

- [ ] Implementar exportação para PDF
- [ ] Implementar exportação para Excel
- [ ] Adicionar gráficos e visualizações
- [ ] Implementar agendamento de relatórios
- [ ] Adicionar comparação com períodos anteriores
- [ ] Criar relatórios personalizados
- [ ] Implementar cache para relatórios frequentes

