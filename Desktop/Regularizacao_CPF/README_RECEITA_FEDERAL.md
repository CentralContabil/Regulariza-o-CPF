# Integração com APIs da Receita Federal

## Status Atual

A estrutura de integração foi criada, mas **a implementação real depende de APIs disponíveis**.

## Desafios

A Receita Federal do Brasil **não oferece API pública oficial** para:
- Consulta de situação do CPF
- Verificação de declarações de IRPF
- Consulta de Saída Definitiva

## Opções de Integração

### 1. Serviços Terceiros Autorizados

Alguns serviços oferecem APIs para consultas na Receita Federal:

- **Serpro (Serviço Federal de Processamento de Dados)**
  - Requer credenciamento
  - APIs oficiais do governo
  - Documentação: https://developers.serpro.gov.br/

- **ReceitaWS / ConsultaCPF**
  - Serviços terceiros
  - Requer assinatura e credenciamento
  - Verificar legalidade e termos de uso

### 2. Web Scraping

- Consulta direta no site da Receita Federal
- **CUIDADO**: Verificar legalidade e termos de uso
- Pode violar termos de serviço
- Requer manutenção constante (sites mudam)

### 3. Integração Manual

- Para casos específicos, pode ser necessário consulta manual
- Usuário fornece informações
- Sistema armazena e processa

## Estrutura Criada

O código está preparado para receber integração real. Basta:

1. Configurar variáveis de ambiente:
   ```env
   RECEITA_FEDERAL_API_URL=https://api.exemplo.com
   RECEITA_FEDERAL_TOKEN=seu_token_aqui
   ```

2. Implementar métodos em `ReceitaFederalService.ts`:
   - `consultarSituacaoCPF()` - Substituir mock por chamada real
   - `verificarDeclaracoesIRPF()` - Substituir mock por chamada real
   - `consultarSaidaDefinitiva()` - Substituir mock por chamada real

## APIs Disponíveis

### POST /api/receita-federal/cpf
Consulta situação do CPF

**Request:**
```json
{
  "cpf": "12345678900"
}
```

**Response:**
```json
{
  "cpf": "12345678900",
  "situacao": "regular",
  "motivo": null,
  "dataConsulta": "2026-01-23T..."
}
```

### POST /api/receita-federal/irpf
Verifica declarações de IRPF

**Request:**
```json
{
  "cpf": "12345678900",
  "anos": [2023, 2022, 2021]
}
```

**Response:**
```json
[
  {
    "anoExercicio": 2023,
    "situacao": "entregue",
    "dataEntrega": "2024-04-15",
    "recibo": "123456"
  }
]
```

### POST /api/receita-federal/saida-definitiva
Consulta Saída Definitiva

**Request:**
```json
{
  "cpf": "12345678900"
}
```

**Response:**
```json
{
  "cpf": "12345678900",
  "comunicada": true,
  "dataComunicacao": "2020-01-15",
  "dataSaida": "2020-01-10",
  "status": "processada"
}
```

### DELETE /api/receita-federal/cache?cpf=12345678900
Limpa cache de consultas

## Cache

O sistema implementa cache de 1 hora para:
- Consultas de CPF
- Verificações de IRPF
- Consultas de Saída Definitiva

Isso reduz chamadas desnecessárias e melhora performance.

## Próximos Passos

1. Pesquisar e escolher serviço de integração
2. Obter credenciais/API keys
3. Implementar métodos reais em `ReceitaFederalService`
4. Testar com dados reais
5. Adicionar tratamento de erros específicos
6. Implementar retry logic para falhas temporárias



