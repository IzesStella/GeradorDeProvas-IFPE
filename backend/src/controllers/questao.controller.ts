import { Request, Response } from 'express';
import { pool } from '../config/database.js';

export const QuestaoController = {
  // Rota de Login do Admin
  async login(req: Request, res: Response) {
    const { usuario, senha } = req.body;
    if (usuario === 'admin' && senha === 'ifpe2026') {
      return res.json({ auth: true, token: 'questify-token-seguro-2026' });
    }
    return res.status(401).json({ error: 'Usuário ou senha inválidos.' });
  },

  // Listar todas as questões ativas
  async listar(req: Request, res: Response) {
    try {
      const sql = 'SELECT * FROM questoes WHERE ativo = true ORDER BY id DESC';
      const { rows } = await pool.query(sql);
      return res.json(rows);
    } catch (error: any) {
      console.error('Erro ao buscar questões:', error);
      return res.status(500).json({ error: error.message });
    }
  },

  // Criar nova questão
  async criar(req: Request, res: Response) {
    const { topico, enunciado, codigo_typescript, nivel_dificuldade, tipo_questao, tabela_enunciado, easter_egg_conteudo, origem, ano } = req.body;
    try {
      const sql = `
        INSERT INTO questoes (topico, enunciado, codigo_typescript, nivel_dificuldade, tipo_questao, tabela_enunciado, easter_egg_conteudo, origem, ano) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *;
      `;
      const values = [
        topico, enunciado, codigo_typescript, nivel_dificuldade, tipo_questao, 
        tabela_enunciado ? JSON.stringify(tabela_enunciado) : null, 
        easter_egg_conteudo, origem, ano
      ];
      const { rows } = await pool.query(sql, values);
      return res.status(201).json({ message: 'Questão cadastrada com sucesso.', data: rows[0] });
    } catch (error: any) {
      console.error('Erro ao cadastrar questão:', error);
      return res.status(500).json({ error: error.message });
    }
  },

  // Atualizar questão existente
  async atualizar(req: Request, res: Response) {
    const { id } = req.params;
    const { topico, enunciado, codigo_typescript, nivel_dificuldade, tipo_questao, tabela_enunciado, easter_egg_conteudo, origem, ano } = req.body;
    try {
      const sql = `
        UPDATE questoes SET topico = $1, enunciado = $2, codigo_typescript = $3, nivel_dificuldade = $4, tipo_questao = $5, tabela_enunciado = $6, easter_egg_conteudo = $7, origem = $8, ano = $9 
        WHERE id = $10 RETURNING *;
      `;
      const values = [
        topico, enunciado, codigo_typescript, nivel_dificuldade, tipo_questao, 
        tabela_enunciado ? JSON.stringify(tabela_enunciado) : null, 
        easter_egg_conteudo, origem, ano, id
      ];
      const { rows, rowCount } = await pool.query(sql, values);
      if (rowCount === 0) return res.status(404).json({ error: 'Questão não encontrada.' });
      return res.json({ message: 'Questão atualizada com sucesso.', data: rows[0] });
    } catch (error: any) {
      console.error('Erro ao atualizar questão:', error);
      return res.status(500).json({ error: error.message });
    }
  },

  // Exclusão lógica (desativar)
  async deletar(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const sql = 'UPDATE questoes SET ativo = false WHERE id = $1 RETURNING *';
      const { rowCount } = await pool.query(sql, [id]);
      if (rowCount === 0) return res.status(404).json({ error: 'Questão não encontrada.' });
      return res.json({ message: 'Questão desativada com sucesso.' });
    } catch (error: any) {
      console.error('Erro ao desativar questão:', error);
      return res.status(500).json({ error: error.message });
    }
  }
};