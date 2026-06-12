import fs from 'fs';
import path from 'path';
import pkg from 'pg';
import dotenv from 'dotenv';

const { Pool } = pkg;

// Lê o arquivo .env
dotenv.config();

// Cria a conexão direta com o PostgreSQL local usando sua variável de ambiente
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function importarTodasAsProvas() {
  console.log("Iniciando...");
  const pastaProvas = './dados_provas';

  try {
    // Limpa a tabela inteira e reinicia o contador do ID SERIAL de volta para 1
    console.log("Limpando o banco de dados antigo para evitar clones...");
    await pool.query('TRUNCATE TABLE questoes RESTART IDENTITY CASCADE;');
    console.log("✨ Banco de dados limpo! Começando a importação...");

    // Lê todos os nomes de arquivos que estão na pasta
    const arquivos = fs.readdirSync(pastaProvas);
    let totalQuestoes = 0;

    for (const arquivo of arquivos) {
      if (arquivo.endsWith('.json')) {
        const caminhoCompleto = path.join(pastaProvas, arquivo);
        const arquivoBruto = fs.readFileSync(caminhoCompleto, 'utf-8');
        const questoes = JSON.parse(arquivoBruto);
        
        console.log(`Lendo o arquivo ${arquivo} (${questoes.length} questões)...`);

        // Percorre cada questão do JSON e insere usando SQL puro
        for (const questao of questoes) {
          const sql = `
            INSERT INTO questoes (topico, enunciado, codigo_typescript, nivel_dificuldade, easter_egg_conteudo, origem, ano)
            VALUES ($1, $2, $3, $4, $5, $6, $7);
          `;
          
          const values = [
            questao.topico,
            questao.enunciado,
            questao.codigo_typescript,
            questao.nivel_dificuldade,
            questao.easter_egg_conteudo,
            questao.origem,
            questao.ano
          ];

          await pool.query(sql, values);
        }

        console.log(`Arquivo ${arquivo} importado com sucesso para o banco local!`);
        totalQuestoes += questoes.length;
      }
    }
    console.log(`\n Finalizado com sucesso! Um total de ${totalQuestoes} questões foram salvas no PostgreSQL.`);
  } catch (erro) {
    console.error("Erro no processo de importação:", erro.message);
  } finally {
    
    await pool.end();
  }
}

importarTodasAsProvas();