# Sistema de Documentos Seguro

## Visão Geral

Sistema completo de upload, armazenamento e gestão de documentos com criptografia, versionamento e integração com AWS S3.

## Funcionalidades

### Upload de Documentos
- Validação de tipo de arquivo (PDF, imagens, documentos Office)
- Validação de tamanho (máximo 10MB)
- Criptografia AES-256-CBC antes do upload
- Armazenamento seguro no AWS S3
- Versionamento automático

### Download de Documentos
- URLs assinadas temporárias (válidas por 1 hora por padrão)
- Descriptografia automática
- Controle de acesso por cliente/processo

### Gestão de Documentos
- Listagem com paginação e filtros
- Busca por cliente, processo ou tipo
- Histórico de versões
- Exclusão segura (remove do S3 e banco)

## Configuração

### Variáveis de Ambiente

```env
# AWS S3
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
S3_BUCKET_NAME=brazilian-relax-documents

# Criptografia (opcional em desenvolvimento)
DOCUMENT_ENCRYPTION_KEY=your-encryption-key
```

### Tipos de Arquivo Permitidos

- `application/pdf`
- `image/jpeg`, `image/png`, `image/jpg`
- `application/msword`
- `application/vnd.openxmlformats-officedocument.wordprocessingml.document`
- `application/vnd.ms-excel`
- `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`

## API Endpoints

### POST /api/documentos/upload
Faz upload de um documento.

**Form Data:**
- `clienteId` (string, obrigatório)
- `processoId` (string, opcional)
- `nome` (string, obrigatório)
- `tipo` (string, obrigatório)
- `arquivo` (File, obrigatório)

**Resposta:**
```json
{
  "id": "clxxx",
  "clienteId": "clxxx",
  "nome": "CPF.pdf",
  "tipo": "cpf",
  "versao": 1,
  "tamanho": 1024000,
  "mimeType": "application/pdf",
  "url": "clientes/clxxx/documentos/docxxx/v1",
  "createdAt": "2024-01-01T00:00:00Z"
}
```

### GET /api/documentos
Lista documentos com filtros e paginação.

**Query Parameters:**
- `page` (number, padrão: 1)
- `limit` (number, padrão: 20)
- `clienteId` (string, opcional)
- `processoId` (string, opcional)
- `tipo` (string, opcional)

### GET /api/documentos/[id]
Busca um documento específico por ID.

### GET /api/documentos/[id]/download
Gera URL assinada para download.

**Query Parameters:**
- `expiracao` (number, segundos, padrão: 3600)

**Resposta:**
```json
{
  "success": true,
  "downloadUrl": "https://s3.amazonaws.com/...",
  "expiresIn": 3600
}
```

### DELETE /api/documentos/[id]
Deleta um documento (remove do S3 e banco).

### GET /api/documentos/versoes
Lista todas as versões de um documento.

**Query Parameters:**
- `clienteId` (string, obrigatório)
- `nome` (string, obrigatório)
- `tipo` (string, obrigatório)

## Segurança

### Criptografia
- Documentos são criptografados antes do upload usando AES-256-CBC
- Chave de criptografia configurável via `DOCUMENT_ENCRYPTION_KEY`
- Em desenvolvimento, criptografia pode ser desabilitada

### Armazenamento
- AWS S3 com Server-Side Encryption (AES256)
- Organização por cliente: `clientes/{clienteId}/documentos/{documentoId}/v{versao}`
- URLs nunca expostas diretamente, apenas URLs assinadas temporárias

### Validações
- Tipo de arquivo permitido
- Tamanho máximo (10MB)
- Verificação de existência de cliente/processo

## Versionamento

- Cada novo upload do mesmo documento (mesmo nome e tipo) cria uma nova versão
- Versões são numeradas sequencialmente (1, 2, 3...)
- Histórico completo mantido no banco de dados
- Versões antigas podem ser acessadas via endpoint de versões

## Exemplo de Uso

```typescript
// Upload
const formData = new FormData()
formData.append('clienteId', 'clxxx')
formData.append('nome', 'CPF.pdf')
formData.append('tipo', 'cpf')
formData.append('arquivo', file)

const response = await fetch('/api/documentos/upload', {
  method: 'POST',
  body: formData,
})

// Download
const downloadResponse = await fetch(`/api/documentos/${documentoId}/download`)
const { downloadUrl } = await downloadResponse.json()
window.open(downloadUrl)
```



