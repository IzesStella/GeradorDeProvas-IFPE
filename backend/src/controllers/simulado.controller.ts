import { Request, Response } from 'express';
import { SorteioService } from '../services/sorteio.service.js';

export const SimuladoController = {
  async gerar(req: Request, res: Response) {
    try {
      // Chama o serviço de gerar simulado que existe la no sorteio.service, passando os filtros
      const questoesSorteadas = await SorteioService.gerarSimulado(req.body);
      
      return res.status(200).json(questoesSorteadas);
    } catch (erro) {
      console.error('Erro na geração do simulado:', erro);
      return res.status(500).json({ error: 'Erro interno no servidor' });
    }
  }
};