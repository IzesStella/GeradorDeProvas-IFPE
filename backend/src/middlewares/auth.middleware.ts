import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service.js';

// Bloqueia as rotas do painel para quem não fez login
export function exigirLogin(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token || !AuthService.tokenValido(token)) {
    return res.status(401).json({ error: 'Faça login para continuar.' });
  }
  next();
}
