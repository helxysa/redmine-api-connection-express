// Arquivo de exemplo de configuração
// Copie este arquivo para .env na raiz do projeto

export const exampleConfig = {
  redmine: {
    url: 'https://seu-redmine.exemplo.com',
    username: 'seu_usuario',
    password: 'sua_senha',
    apiKey: 'sua_chave_api_aqui'
  },
  port: 3000,
  environment: 'development',
  ssl: {
    rejectUnauthorized: false // Para desenvolvimento, ignore erros de SSL
  }
};

// Variáveis de ambiente correspondentes:
/*
REDMINE_URL=https://seu-redmine.exemplo.com
REDMINE_USERNAME=seu_usuario
REDMINE_PASSWORD=sua_senha
REDMINE_API_KEY=sua_chave_api_aqui
PORT=3000
NODE_ENV=development
SSL_REJECT_UNAUTHORIZED=false
*/
