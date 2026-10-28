import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service.js';

export const AuthController = {
  async login(req: Request, res: Response) {
    try {
      const { usuario, senha } = req.body;
      const token = await AuthService.autenticar(usuario, senha);
      if (!token) return res.status(401).json({ error: 'Usuário ou senha inválidos.' });
      return res.json({ auth: true, token });
    } catch (erro) {
      console.error('Erro no login:', erro);
      return res.status(500).json({ error: 'Erro interno no servidor' });
    }
  }
};
