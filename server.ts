import express from 'express';
import dotenv from 'dotenv';
import redmineRoutes from './routes/redmineRoutes.ts';
import { config } from './config.ts';

const app = express();

app.use(express.json());

app.use('/api/redmine', redmineRoutes);

app.get('/', (req, res) => {
  res.json({
    message: 'API do Projeto Auditor - Redmine Integration',
    version: '1.0.0',
    endpoints: {
      test: 'GET /api/redmine/test-connection',
      user: 'GET /api/redmine/user/current',
      projects: 'GET /api/redmine/projects',
      issues: 'GET /api/redmine/issues'
    }
  });
});

app.listen(config.port, () => {
  console.log(`Servidor rodando na porta ${config.port}...`);
  console.log(`Acesse: http://localhost:${config.port}`);
  console.log(`Teste a conexão: http://localhost:${config.port}/api/redmine/test-connection`);
});

export default app;