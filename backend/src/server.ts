import express from 'express';
import cors from 'cors';
import { pool } from './config/database.js';
import simuladoRoutes from './routes/simulado.routes.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', simuladoRoutes);

app.post('/api/questoes', async (req, res) => {
  const { topico, enunciado, codigo_typescript, nivel_dificuldade, easter_egg_conteudo, origem, ano } = req.body;

  try {
    const sql = `
      INSERT INTO questoes (topico, enunciado, codigo_typescript, nivel_dificuldade, easter_egg_conteudo, origem, ano)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *;
    `;
    
    const values = [topico, enunciado, codigo_typescript, nivel_dificuldade, easter_egg_conteudo, origem, ano];
    
    const { rows } = await pool.query(sql, values);

    return res.status(201).json({ 
      message: 'Questão cadastrada com sucesso.', 
      data: rows[0] 
    });
    
  } catch (error: any) {
    console.error('Erro ao cadastrar questão:', error);
    return res.status(500).json({ error: error.message });
  }
});

const PORT = 3333;
app.listen(PORT, () => {
  console.log(`Servidor backend rodando na porta ${PORT}`);
});