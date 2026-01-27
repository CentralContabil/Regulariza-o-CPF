# Segurança e Conformidade LGPD

## Visão Geral

Sistema completo de segurança e conformidade com a Lei Geral de Proteção de Dados (LGPD), incluindo rate limiting, headers de segurança, auditoria e gestão de consentimentos.

## Funcionalidades de Segurança

### Rate Limiting
- **API Rate Limiter**: 100 requests por 15 minutos
- **Auth Rate Limiter**: 5 tentativas de login por 15 minutos
- **Upload Rate Limiter**: 20 uploads por hora

### Headers de Segurança
- `X-Frame-Options: DENY` - Previne clickjacking
- `X-Content-Type-Options: nosniff` - Previne MIME type sniffing
- `X-XSS-Protection: 1; mode=block` - Proteção XSS
- `Content-Security-Policy` - Política de segurança de conteúdo
- `Strict-Transport-Security` - HTTPS obrigatório em produção
- `Referrer-Policy` - Controle de referrer
- `Permissions-Policy` - Controle de permissões

### Validações
- **CSRF Protection**: Validação de tokens CSRF
- **Origin Validation**: Validação de origem das requisições
- **Input Sanitization**: Sanitização de entrada para prevenir XSS

## Conformidade LGPD

### Consentimentos
O sistema gerencia três tipos de consentimento:
- **marketing**: Consentimento para receber comunicações de marketing
- **comunicacao**: Consentimento para receber comunicações gerais
- **processamento**: Consentimento para processamento de dados

### Direitos do Titular

#### 1. Portabilidade de Dados
Exporta todos os dados pessoais do cliente em formato estruturado.

**Endpoint**: `POST /api/lgpd/exportar`

**Request:**
```json
{
  "clienteId": "clxxx"
}
```

**Response:**
```json
{
  "cliente": { ... },
  "processos": [ ... ],
  "documentos": [ ... ],
  "interacoes": [ ... ],
  "propostas": [ ... ],
  "diagnosticos": [ ... ],
  "exportadoEm": "2024-01-01T00:00:00Z"
}
```

#### 2. Anonimização de Dados
Anonimiza dados pessoais mantendo referências para fins estatísticos.

**Endpoint**: `POST /api/lgpd/anonimizar`

**Request:**
```json
{
  "clienteId": "clxxx"
}
```

**Response:**
```json
{
  "hash": "abc123...",
  "anonimizado": true
}
```

#### 3. Remoção de Dados (Direito ao Esquecimento)
Remove completamente os dados pessoais do sistema.

**Endpoint**: `POST /api/lgpd/remover`

**Request:**
```json
{
  "clienteId": "clxxx"
}
```

**Response:**
```json
{
  "removido": true
}
```

#### 4. Gestão de Consentimentos
Registra e verifica consentimentos LGPD.

**Registrar Consentimento**: `POST /api/lgpd/consentimento`
```json
{
  "clienteId": "clxxx",
  "tipo": "marketing",
  "consentido": true
}
```

**Verificar Consentimento**: `GET /api/lgpd/consentimento?clienteId=clxxx&tipo=marketing`
```json
{
  "consentido": true
}
```

## Auditoria

### Registro de Eventos
Todos os eventos importantes são registrados automaticamente:
- Criação, atualização e exclusão de dados
- Acesso a dados sensíveis
- Modificações em processos críticos

### Consulta de Logs
**Endpoint**: `GET /api/auditoria`

**Query Parameters:**
- `page` (number, padrão: 1)
- `limit` (number, padrão: 50)
- `usuarioId` (string, opcional)
- `entidade` (string, opcional)
- `acao` (string, opcional)
- `dataInicio` (ISO date, opcional)
- `dataFim` (ISO date, opcional)

**Response:**
```json
{
  "logs": [
    {
      "id": "audxxx",
      "usuarioId": "userxxx",
      "acao": "dados_criar",
      "entidade": "Cliente",
      "entidadeId": "clxxx",
      "detalhes": { ... },
      "ip": "192.168.1.1",
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 100,
    "totalPages": 2
  }
}
```

## Uso dos Serviços

### Rate Limiting
```typescript
import { rateLimit, apiRateLimiter } from '@/middleware/rateLimiter'

export const GET = async (request: NextRequest) => {
  const rateLimitResponse = await rateLimit(request, apiRateLimiter)
  if (rateLimitResponse) {
    return rateLimitResponse
  }
  
  // Sua lógica aqui
}
```

### Headers de Segurança
```typescript
import { withSecurityHeaders } from '@/middleware/security'

export const GET = withSecurityHeaders(async (request: NextRequest) => {
  // Sua lógica aqui
})
```

### Auditoria
```typescript
import { AuditService } from '@/services/AuditService'

// Registrar evento
await AuditService.registrar({
  usuarioId: 'userxxx',
  acao: 'dados_criar',
  entidade: 'Cliente',
  entidadeId: 'clxxx',
  ip: request.headers.get('x-forwarded-for'),
})

// Registrar acesso a dados sensíveis
await AuditService.registrarAcessoSensivel(
  'userxxx',
  'Cliente',
  'clxxx',
  request.headers.get('x-forwarded-for')
)
```

### LGPD
```typescript
import { LGPDService } from '@/services/LGPDService'

// Verificar consentimento antes de enviar email
const temConsentimento = await LGPDService.verificarConsentimento(
  clienteId,
  'marketing'
)

if (temConsentimento) {
  // Enviar email
}
```

## Configuração

### Variáveis de Ambiente

```env
# Rate Limiting (opcional, valores padrão usados se não definidos)
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100

# CORS
ALLOWED_ORIGINS=https://app.example.com,https://www.example.com

# LGPD
LGPD_ENCRYPTION_KEY=your-encryption-key
```

## Boas Práticas

1. **Sempre verificar consentimento** antes de enviar comunicações
2. **Registrar auditoria** para ações críticas
3. **Usar rate limiting** em todas as APIs públicas
4. **Aplicar headers de segurança** em todas as respostas
5. **Validar origem** em requisições sensíveis
6. **Sanitizar entrada** antes de processar
7. **Criptografar dados sensíveis** antes de armazenar
8. **Manter logs de auditoria** por pelo menos 6 meses (conforme LGPD)

## Conformidade Legal

- ✅ Consentimento explícito para processamento
- ✅ Direito à portabilidade de dados
- ✅ Direito à anonimização
- ✅ Direito ao esquecimento
- ✅ Auditoria de acessos
- ✅ Proteção de dados sensíveis
- ✅ Política de privacidade (a ser implementada no frontend)



