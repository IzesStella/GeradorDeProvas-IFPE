import pkg from 'pg';
const { Pool } = pkg;
import 'dotenv/config';

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Testa a conexão ao iniciar e devolve a conexão ao pool em seguida
pool.connect((err, _client, release) => {
  if (err) {
    console.error('Erro ao conectar com o PostgreSQL:', err.stack);
    return;
  }
  release();
  console.log('Conectado ao PostgreSQL com sucesso!');
});
