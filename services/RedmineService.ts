import axios from 'axios';
import type { AxiosInstance, AxiosResponse } from 'axios';
import https from 'https';
import { config } from '../config.ts';

export interface RedmineIssue {
  id: number;
  subject: string;
  description: string;
  status: {
    id: number;
    name: string;
  };
  priority: {
    id: number;
    name: string;
  };
  project: {
    id: number;
    name: string;
  };
  tracker: {
    id: number;
    name: string;
  };
  author: {
    id: number;
    name: string;
  };
  assigned_to?: {
    id: number;
    name: string;
  };
  created_on: string;
  updated_on: string;
}

export interface RedmineProject {
  id: number;
  name: string;
  identifier: string;
  description: string;
  status: number;
  is_public: boolean;
  created_on: string;
  updated_on: string;
}

export class RedmineService {
  private client: AxiosInstance;

  constructor() {
    this.client = this.createClient();
  }

  private createClient(): AxiosInstance {
    const client = axios.create({
      baseURL: config.redmine.url,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      httpsAgent: new https.Agent({
        rejectUnauthorized: config.ssl.rejectUnauthorized
      })
    });

    // Autenticação com chave de API no cabeçalho (método mais seguro)
    client.defaults.headers['X-Redmine-API-Key'] = config.redmine.apiKey;

    return client;
  }

  /**
   * Testa a conexão com a API do Redmine
   */
  async testConnection(): Promise<boolean> {
    try {
      const response = await this.client.get('/users/current.json');
      return response.status === 200;
    } catch (error) {
      console.error('Erro ao testar conexão com Redmine:', error);
      return false;
    }
  }

  /**
   * Obtém informações do usuário atual
   */
  async getCurrentUser(): Promise<any> {
    try {
      const response = await this.client.get('/users/current.json');
      return response.data.user;
    } catch (error) {
      console.error('Erro ao obter usuário atual:', error);
      throw error;
    }
  }

  /**
   * Lista todos os projetos
   */
  async getProjects(): Promise<RedmineProject[]> {
    try {
      const response = await this.client.get('/projects.json');
      return response.data.projects;
    } catch (error) {
      console.error('Erro ao obter projetos:', error);
      throw error;
    }
  }

  /**
   * Obtém um projeto específico por ID
   */
  async getProject(projectId: number): Promise<RedmineProject> {
    try {
      const response = await this.client.get(`/projects/${projectId}.json`);
      return response.data.project;
    } catch (error) {
      console.error(`Erro ao obter projeto ${projectId}:`, error);
      throw error;
    }
  }

  /**
   * Lista issues de um projeto
   */
  async getIssues(projectId?: number, limit: number = 25, offset: number = 0): Promise<{
    issues: RedmineIssue[];
    total_count: number;
    offset: number;
    limit: number;
  }> {
    try {
      let url = '/issues.json';
      const params = new URLSearchParams({
        limit: limit.toString(),
        offset: offset.toString()
      });

      if (projectId) {
        params.append('project_id', projectId.toString());
      }

      url += `?${params.toString()}`;

      const response = await this.client.get(url);
      return response.data;
    } catch (error) {
      console.error('Erro ao obter issues:', error);
      throw error;
    }
  }

  /**
   * Obtém uma issue específica por ID
   */
  async getIssue(issueId: number): Promise<RedmineIssue> {
    try {
      const response = await this.client.get(`/issues/${issueId}.json`);
      return response.data.issue;
    } catch (error) {
      console.error(`Erro ao obter issue ${issueId}:`, error);
      throw error;
    }
  }

  /**
   * Cria uma nova issue
   */
  async createIssue(issueData: {
    project_id: number;
    subject: string;
    description?: string;
    priority_id?: number;
    tracker_id?: number;
    assigned_to_id?: number;
  }): Promise<RedmineIssue> {
    try {
      const response = await this.client.post('/issues.json', {
        issue: issueData
      });
      return response.data.issue;
    } catch (error) {
      console.error('Erro ao criar issue:', error);
      throw error;
    }
  }

  /**
   * Atualiza uma issue existente
   */
  async updateIssue(issueId: number, issueData: Partial<RedmineIssue>): Promise<RedmineIssue> {
    try {
      const response = await this.client.put(`/issues/${issueId}.json`, {
        issue: issueData
      });
      return response.data.issue;
    } catch (error) {
      console.error(`Erro ao atualizar issue ${issueId}:`, error);
      throw error;
    }
  }

  /**
   * Deleta uma issue
   */
  async deleteIssue(issueId: number): Promise<boolean> {
    try {
      await this.client.delete(`/issues/${issueId}.json`);
      return true;
    } catch (error) {
      console.error(`Erro ao deletar issue ${issueId}:`, error);
      throw error;
    }
  }
}
