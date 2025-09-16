# API - Integração com Redmine

API para integração com Redmine utilizando API KEY.

## Configuração

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
# Configurações do Redmine
REDMINE_URL=https://seu-redmine.exemplo.com
REDMINE_API_KEY=sua_chave_api_aqui

# Configurações da API
PORT=3000
NODE_ENV=development

# Configurações SSL
SSL_REJECT_UNAUTHORIZED=false
```

### Instalação

```bash
npm install
```

### Execução

```bash
npm run dev
```

## Métodos de Autenticação

A API suporta três métodos de autenticação:

1. **Chave de API no Cabeçalho HTTP** (Recomendado)
   - Utiliza `X-Redmine-API-Key` no cabeçalho
   - Método mais seguro

2. **Chave de API como Parâmetro na URL**
   - Chave de API como parâmetro na URL



## Endpoints Disponíveis

### Teste de Conexão
```http
GET /api/redmine/test-connection
```

### Usuário
```http
GET /api/redmine/user/current
```

### Projetos
```http
GET /api/redmine/projects
GET /api/redmine/projects/:id
```

### Issues
```http
GET /api/redmine/issues
GET /api/redmine/issues/:id
POST /api/redmine/issues
PUT /api/redmine/issues/:id
DELETE /api/redmine/issues/:id
```

**Parâmetros para GET /api/redmine/issues:**
- `project_id` (opcional): ID do projeto
- `limit` (opcional): Máximo de issues (padrão: 25)
- `offset` (opcional): Número de issues para pular (padrão: 0)

**Exemplo de criação de issue:**
```json
{
  "project_id": 1,
  "subject": "Título da Issue",
  "description": "Descrição da issue",
  "priority_id": 1,
  "tracker_id": 1,
  "assigned_to_id": 2
}
```

## Exemplos de Uso

```bash
# Testar conexão
curl http://localhost:3000/api/redmine/test-connection

# Obter projetos
curl http://localhost:3000/api/redmine/projects

# Obter issues de um projeto
curl "http://localhost:3000/api/redmine/issues?project_id=1&limit=10"

# Criar issue
curl -X POST http://localhost:3000/api/redmine/issues \
  -H "Content-Type: application/json" \
  -d '{
    "project_id": 1,
    "subject": "Nova Issue",
    "description": "Descrição da issue"
  }'
```

## Configuração do Redmine

1. Acesse: Administração > Configurações > Autenticação
2. Habilite a opção "Habilitar a API REST"

## Obtenção da Chave de API

1. Faça login no Redmine
2. Acesse "Minha Conta" (/my/account)
3. Copie sua chave de API
4. Configure no arquivo `.env`

## Estrutura do Projeto

```
├── config.ts                 # Configurações da aplicação
├── services/
│   └── RedmineService.ts    # Serviço principal do Redmine
├── routes/
│   └── redmineRoutes.ts     # Rotas da API
├── server.ts                # Servidor principal
└── package.json
```

## Configuração SSL

### Desenvolvimento
```env
SSL_REJECT_UNAUTHORIZED=false
```

### Produção
```env
SSL_REJECT_UNAUTHORIZED=true
```

**Requisitos para produção:**
- Certificado SSL válido no servidor Redmine
- URL HTTPS configurada corretamente
- Validação de certificado habilitada

## Resolução de Problemas

### Erro de Autenticação (401)
1. Verifique as credenciais
2. Confirme a chave de API
3. Teste métodos de autenticação via `/api/redmine/test-connection`

## Tratamento de Erros

A API retorna erros padronizados com código HTTP apropriado e mensagem descritiva.

Exemplo:
```json
{
  "error": "Erro ao obter projetos",
  "message": "Request failed with status code 401"
}
```
