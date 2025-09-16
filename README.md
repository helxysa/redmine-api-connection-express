# API Projeto Auditor - Integração com Redmine

Esta API fornece integração completa com a API do Redmine, suportando três métodos de autenticação diferentes.

## Configuração

### 1. Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes configurações:

```env
# Configurações do Redmine
REDMINE_URL=https://seu-redmine.exemplo.com
REDMINE_USERNAME=seu_usuario
REDMINE_PASSWORD=sua_senha
REDMINE_API_KEY=sua_chave_api_aqui

# Configurações da API
PORT=3000
NODE_ENV=development

# Configurações SSL (para desenvolvimento)
# Defina como 'false' para ignorar erros de certificado SSL em desenvolvimento
SSL_REJECT_UNAUTHORIZED=false
```

**⚠️ Importante sobre SSL:**
- Para desenvolvimento, defina `SSL_REJECT_UNAUTHORIZED=false` para ignorar erros de certificado SSL
- Para produção, mantenha `SSL_REJECT_UNAUTHORIZED=true` (padrão) para maior segurança

### 2. Instalação

```bash
npm install
```

### 3. Execução

```bash
npm run dev
```

## Métodos de Autenticação

A API suporta três métodos de autenticação com o Redmine:

### 1. Autenticação Básica (Login e Senha)
- Usa seu nome de usuário e senha do Redmine
- Menos seguro, pois expõe credenciais na URL
- Configurado automaticamente quando `authMethod: 'basic'`

### 2. Chave de API como Parâmetro na URL
- Usa sua chave de API como parâmetro na URL
- Mais seguro que login/senha
- Configurado automaticamente quando `authMethod: 'apiKey'`

### 3. Chave de API no Cabeçalho HTTP (Recomendado)
- Usa sua chave de API no cabeçalho `X-Redmine-API-Key`
- Método mais seguro e recomendado
- Configurado automaticamente quando `authMethod: 'apiKeyHeader'`

## Endpoints Disponíveis

### Teste de Conexão
```http
GET /api/redmine/test-connection
```
Testa todos os métodos de autenticação e retorna quais funcionam.

### Usuário
```http
GET /api/redmine/user/current
```
Obtém informações do usuário atual autenticado.

### Projetos
```http
GET /api/redmine/projects
GET /api/redmine/projects/:id
```
Lista todos os projetos ou obtém um projeto específico.

### Issues
```http
GET /api/redmine/issues
GET /api/redmine/issues/:id
POST /api/redmine/issues
PUT /api/redmine/issues/:id
DELETE /api/redmine/issues/:id
```

#### Parâmetros para GET /api/redmine/issues:
- `project_id` (opcional): ID do projeto para filtrar issues
- `limit` (opcional): Número máximo de issues (padrão: 25)
- `offset` (opcional): Número de issues para pular (padrão: 0)

#### Exemplo de criação de issue (POST /api/redmine/issues):
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

### Testar Conexão
```bash
curl http://localhost:3000/api/redmine/test-connection
```

### Obter Projetos
```bash
curl http://localhost:3000/api/redmine/projects
```

### Obter Issues de um Projeto
```bash
curl "http://localhost:3000/api/redmine/issues?project_id=1&limit=10"
```

### Criar uma Issue
```bash
curl -X POST http://localhost:3000/api/redmine/issues \
  -H "Content-Type: application/json" \
  -d '{
    "project_id": 1,
    "subject": "Nova Issue de Teste",
    "description": "Esta é uma issue criada via API"
  }'
```

## Configuração do Redmine

Para usar a API REST do Redmine, certifique-se de que:

1. A API REST está habilitada no Redmine
2. Acesse: Administração > Configurações > Autenticação
3. Marque a opção "Habilitar a API REST"

## Obtenção da Chave de API

1. Faça login no Redmine
2. Acesse "Minha Conta" (/my/account)
3. Na seção "Chave de API", copie sua chave
4. Use esta chave na variável `REDMINE_API_KEY` do arquivo `.env`

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

## Resolução de Problemas

### Erro de Certificado SSL

Se você receber um erro como `Hostname/IP does not match certificate's altnames`, isso significa que há um problema com o certificado SSL do servidor Redmine. Para resolver:

**Para Desenvolvimento:**
```env
SSL_REJECT_UNAUTHORIZED=false
```

**Para Produção:**
- Verifique se a URL do Redmine está correta
- Certifique-se de que o certificado SSL está válido
- Mantenha `SSL_REJECT_UNAUTHORIZED=true` (padrão)

### Erro de Autenticação

Se receber erro 401 (Unauthorized):
1. Verifique se as credenciais estão corretas
2. Confirme se a chave de API está válida
3. Teste os diferentes métodos de autenticação usando `/api/redmine/test-connection`

## Tratamento de Erros

A API retorna erros padronizados com:
- Código de status HTTP apropriado
- Mensagem de erro descritiva
- Detalhes do erro quando disponível

Exemplo de resposta de erro:
```json
{
  "error": "Erro ao obter projetos",
  "message": "Request failed with status code 401"
}
```
