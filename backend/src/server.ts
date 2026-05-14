import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors()); 
app.use(express.json()); 

// Urota de teste rápida
app.get('/', (req, res) => {
  res.send('Servidor do Gerador rodando!');
});

// LigaNDO o servidor
app.listen(PORT, () => {
  console.log(`Backend rodando em http://localhost:${PORT}`);
});