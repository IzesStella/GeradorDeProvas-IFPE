import { Router } from 'express';
import { SimuladoController } from '../controllers/simulado.controller.js';

const simuladoRoutes = Router();

// pra quando alguém chamar POST /api/simulado, o controller assumir
simuladoRoutes.post('/simulado', SimuladoController.gerar);

export default simuladoRoutes;