import { Router } from 'express';
import { SimuladoController } from '../controllers/simulado.controller.js';
import { QuestaoController } from '../controllers/questao.controller.js';
import { AuthController } from '../controllers/auth.controller.js';
import { exigirLogin } from '../middlewares/auth.middleware.js';

const routes = Router();

// Rota utilizada pelo aluno na tela de configuração
routes.post('/simulado', SimuladoController.gerar);

// Autenticação do painel administrativo
routes.post('/login', AuthController.login);

// Rotas utilizadas pelo painel administrativo (exigem login)
routes.get('/questoes', exigirLogin, QuestaoController.listar);
routes.post('/questoes', exigirLogin, QuestaoController.criar);
routes.put('/questoes/:id', exigirLogin, QuestaoController.atualizar);
routes.delete('/questoes/:id', exigirLogin, QuestaoController.deletar);

export default routes;
