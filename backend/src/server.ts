import express from 'express';
import cors from 'cors';
import { supabase } from './config/supabase.js';

const app = express();

app.use(cors());
app.use(express.json());

// Rota para cadastrar nova questão via Painel Admin
app.post('/api/questoes', async (req, res) => {
  const { topico, enunciado, codigo_typescript, nivel_dificuldade, easter_egg_conteudo, origem, ano } = req.body;

  const { data, error } = await supabase.from('questoes').insert([
    { topico, enunciado, codigo_typescript, nivel_dificuldade, easter_egg_conteudo, origem, ano }
  ]);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.status(201).json({ message: 'Questão cadastrada com sucesso!', data });
});

// rota para buscar, filtrar e sortear as questões do simulado
app.post('/api/simulado', async (req, res) => {
  const { topicosSelecionados, quantidade, dificuldade } = req.body;

  try {
    let query = supabase.from('questoes').select('*');

    // Filtra pelos tópicos marcados
    if (topicosSelecionados && topicosSelecionados.length > 0) {
      query = query.in('topico', topicosSelecionados);
    }

    // Filtra pela dificuldade escolhida
    if (dificuldade) {
      query = query.eq('nivel_dificuldade', dificuldade);
    }

    const { data, error } = await query;

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    if (!data || data.length === 0) {
      return res.status(200).json([]);
    }

    // Embaralha as questões encontradas e corta na quantidade solicitada
    const questoesEmbaralhadas = data.sort(() => 0.5 - Math.random());
    const questoesSorteadas = questoesEmbaralhadas.slice(0, quantidade);

    return res.status(200).json(questoesSorteadas);
  } catch (erro) {
    console.error('Erro na geração do simulado:', erro);
    return res.status(500).json({ error: 'Erro interno no servidor' });
  }
});

const PORT = 3333;
app.listen(PORT, () => {
  console.log(`Servidor backend rodando na porta ${PORT}`);
});