import { Router } from 'express';
import { RedmineService } from '../services/RedmineService.ts';

const router = Router();

// Instanciar o serviço do Redmine apenas com chave de API no cabeçalho (método mais seguro)
const redmine = new RedmineService();

/**
 * Testa a conexão com o Redmine usando chave de API
 */
router.get('/test-connection', async (req, res) => {
  try {
    const success = await redmine.testConnection();

    res.json({
      message: 'Teste de conexão com Redmine',
      config: {
        url: process.env.REDMINE_URL || 'https://seu-redmine.exemplo.com',
        hasApiKey: !!process.env.REDMINE_API_KEY,
        sslRejectUnauthorized: process.env.SSL_REJECT_UNAUTHORIZED !== 'false'
      },
      success,
      recommendation: success 
        ? 'Conexão estabelecida com sucesso usando chave de API!' 
        : 'Verifique se a chave de API está configurada corretamente'
    });
  } catch (error) {
    res.status(500).json({
      error: 'Erro interno do servidor',
      message: error instanceof Error ? error.message : 'Erro desconhecido'
    });
  }
});

/**
 * Obtém informações do usuário atual
 */
router.get('/user/current', async (req, res) => {
  try {
    const user = await redmine.getCurrentUser();
    res.json({
      message: 'Usuário atual obtido com sucesso',
      user
    });
  } catch (error) {
    res.status(500).json({
      error: 'Erro ao obter usuário atual',
      message: error instanceof Error ? error.message : 'Erro desconhecido'
    });
  }
});

/**
 * Lista todos os projetos
 */
router.get('/projects', async (req, res) => {
  try {
    const projects = await redmine.getProjects();
    res.json({
      message: 'Projetos obtidos com sucesso',
      count: projects.length,
      projects
    });
  } catch (error) {
    res.status(500).json({
      error: 'Erro ao obter projetos',
      message: error instanceof Error ? error.message : 'Erro desconhecido'
    });
  }
});

/**
 * Obtém um projeto específico
 */
router.get('/projects/:id', async (req, res) => {
  try {
    const projectId = parseInt(req.params.id);
    if (isNaN(projectId)) {
      return res.status(400).json({
        error: 'ID do projeto inválido'
      });
    }

    const project = await redmine.getProject(projectId);
    res.json({
      message: 'Projeto obtido com sucesso',
      project
    });
  } catch (error) {
    res.status(500).json({
      error: 'Erro ao obter projeto',
      message: error instanceof Error ? error.message : 'Erro desconhecido'
    });
  }
});

/**
 * Lista issues (com filtros opcionais)
 */
router.get('/issues', async (req, res) => {
  try {
    const projectId = req.query.project_id ? parseInt(req.query.project_id as string) : undefined;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 25;
    const offset = req.query.offset ? parseInt(req.query.offset as string) : 0;

    const result = await redmine.getIssues(projectId, limit, offset);
    res.json({
      message: 'Issues obtidas com sucesso',
      ...result
    });
  } catch (error) {
    res.status(500).json({
      error: 'Erro ao obter issues',
      message: error instanceof Error ? error.message : 'Erro desconhecido'
    });
  }
});

/**
 * Obtém uma issue específica
 */
router.get('/issues/:id', async (req, res) => {
  try {
    const issueId = parseInt(req.params.id);
    if (isNaN(issueId)) {
      return res.status(400).json({
        error: 'ID da issue inválido'
      });
    }

    const issue = await redmine.getIssue(issueId);
    res.json({
      message: 'Issue obtida com sucesso',
      issue
    });
  } catch (error) {
    res.status(500).json({
      error: 'Erro ao obter issue',
      message: error instanceof Error ? error.message : 'Erro desconhecido'
    });
  }
});

/**
 * Cria uma nova issue
 */
router.post('/issues', async (req, res) => {
  try {
    const { project_id, subject, description, priority_id, tracker_id, assigned_to_id } = req.body;

    if (!project_id || !subject) {
      return res.status(400).json({
        error: 'project_id e subject são obrigatórios'
      });
    }

    const issue = await redmine.createIssue({
      project_id,
      subject,
      description,
      priority_id,
      tracker_id,
      assigned_to_id
    });

    res.status(201).json({
      message: 'Issue criada com sucesso',
      issue
    });
  } catch (error) {
    res.status(500).json({
      error: 'Erro ao criar issue',
      message: error instanceof Error ? error.message : 'Erro desconhecido'
    });
  }
});

/**
 * Atualiza uma issue existente
 */
router.put('/issues/:id', async (req, res) => {
  try {
    const issueId = parseInt(req.params.id);
    if (isNaN(issueId)) {
      return res.status(400).json({
        error: 'ID da issue inválido'
      });
    }

    const issue = await redmine.updateIssue(issueId, req.body);
    res.json({
      message: 'Issue atualizada com sucesso',
      issue
    });
  } catch (error) {
    res.status(500).json({
      error: 'Erro ao atualizar issue',
      message: error instanceof Error ? error.message : 'Erro desconhecido'
    });
  }
});

/**
 * Deleta uma issue
 */
router.delete('/issues/:id', async (req, res) => {
  try {
    const issueId = parseInt(req.params.id);
    if (isNaN(issueId)) {
      return res.status(400).json({
        error: 'ID da issue inválido'
      });
    }

    await redmine.deleteIssue(issueId);
    res.json({
      message: 'Issue deletada com sucesso'
    });
  } catch (error) {
    res.status(500).json({
      error: 'Erro ao deletar issue',
      message: error instanceof Error ? error.message : 'Erro desconhecido'
    });
  }
});

export default router;
