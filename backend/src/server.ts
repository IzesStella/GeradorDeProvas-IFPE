import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { supabase } from './config/supabase.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Rota de teste inicial
app.get('/', (req, res) => {
  res.send('Servidor do Gerador funcionando');
});

// Rota que vai buscar as questões ao Supabase
app.get('/api/questoes', async (req, res) => {
  const { data, error } = await supabase.from('questoes').select('*');

  if (error) {
    return res.status(500).json({ erro: error.message });
  }

  res.json(data);
});

app.listen(PORT, () => {
  console.log(`backend rodando em http://localhost:${PORT}`);
});