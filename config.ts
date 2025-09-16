import dotenv from 'dotenv';

dotenv.config();

export const config = {
  redmine: {
    url: process.env.REDMINE_URL || 'https://seu-redmine.exemplo.com',
    username: process.env.REDMINE_USERNAME || 'seu_usuario',
    password: process.env.REDMINE_PASSWORD || 'sua_senha',
    apiKey: process.env.REDMINE_API_KEY || 'sua_chave_api_aqui'
  },
  port: process.env.PORT || 3000,
  environment: process.env.NODE_ENV || 'development',
  ssl: {
    rejectUnauthorized: process.env.SSL_REJECT_UNAUTHORIZED !== 'false'
  }
};
