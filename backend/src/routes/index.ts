import { Router } from 'express';
import { SimuladoController } from '../controllers/simulado.controller.js';
import { QuestaoController } from '../controllers/questao.controller.js';

const routes = Router();

// Rota utilizada pelo aluno na tela de configuração
routes.post('/simulado', SimuladoController.gerar);

// Rotas utilizadas pelo painel administrativo
routes.post('/login', QuestaoController.login);
routes.get('/questoes', QuestaoController.listar);
routes.post('/questoes', QuestaoController.criar);
routes.put('/questoes/:id', QuestaoController.atualizar);
routes.delete('/questoes/:id', QuestaoController.deletar);

export default routes;