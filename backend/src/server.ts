import express from 'express';
import cors from 'cors';
import { supabase } from './config/supabase.js';
import simuladoRoutes from './routes/simulado.routes.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', simuladoRoutes);

// Manter a rota de cadastro de questões aqui por enquanto (por causa da telaAdmin)
app.post('/api/questoes', async (req, res) => {
  const { topico, enunciado, codigo_typescript, nivel_dificuldade, easter_egg_conteudo, origem, ano } = req.body;

  const { data, error } = await supabase.from('questoes').insert([
    { topico, enunciado, codigo_typescript, nivel_dificuldade, easter_egg_conteudo, origem, ano }
  ]);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.status(201).json({ message: 'Questão cadastrada com sucesso.', data });
});

const PORT = 3333;
app.listen(PORT, () => {
  console.log(`Servidor backend rodando na porta ${PORT}`);
});