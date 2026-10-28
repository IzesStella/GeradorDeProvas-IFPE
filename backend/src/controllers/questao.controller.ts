import { Request, Response } from 'express';
import { QuestaoRepository } from '../repositories/questao.repository.js';

export const QuestaoController = {
  async listar(req: Request, res: Response) {
    try {
      return res.json(await QuestaoRepository.listar());
    } catch (erro) {
      console.error('Erro ao buscar questões:', erro);
      return res.status(500).json({ error: 'Erro interno no servidor' });
    }
  },

  async criar(req: Request, res: Response) {
    try {
      const questao = await QuestaoRepository.criar(req.body);
      return res.status(201).json({ message: 'Questão cadastrada com sucesso.', data: questao });
    } catch (erro) {
      console.error('Erro ao cadastrar questão:', erro);
      return res.status(500).json({ error: 'Erro interno no servidor' });
    }
  },

  async atualizar(req: Request, res: Response) {
    try {
      const questao = await QuestaoRepository.atualizar(String(req.params.id), req.body);
      if (!questao) return res.status(404).json({ error: 'Questão não encontrada.' });
      return res.json({ message: 'Questão atualizada com sucesso.', data: questao });
    } catch (erro) {
      console.error('Erro ao atualizar questão:', erro);
      return res.status(500).json({ error: 'Erro interno no servidor' });
    }
  },

  async deletar(req: Request, res: Response) {
    try {
      const excluida = await QuestaoRepository.deletar(String(req.params.id));
      if (!excluida) return res.status(404).json({ error: 'Questão não encontrada.' });
      return res.json({ message: 'Questão excluída com sucesso.' });
    } catch (erro) {
      console.error('Erro ao excluir questão:', erro);
      return res.status(500).json({ error: 'Erro interno no servidor' });
    }
  }
};
