import fs from 'fs';
import path from 'path';
import pkg from 'pg';
import dotenv from 'dotenv';

const { Pool } = pkg;
dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function importarTodasAsProvas() {
  console.log("Iniciando...");

  // Caminhos atualizados para apontar para dentro da pasta dados_miniprovas
  const pastasDeProvas = [
    './dados_miniprovas/miniprovas_execucaocondicional',
    './dados_miniprovas/miniprovas_operadoreslogicos',
    './dados_miniprovas/miniprovas_operadorestiposvariaveis',
    './dados_miniprovas/miniprovas_laços1',
    './dados_miniprovas/miniprovas_laços2',
    './dados_miniprovas/miniprovas_subprogramas',
    './dados_miniprovas/miniprovas_vetores',
    './dados_miniprovas/miniprovas_arrays',
    './dados_miniprovas/miniprovas_tipos'
  ];

  try {
    console.log("Limpando o banco de dados antigo para evitar clones...");
    await pool.query('TRUNCATE TABLE questoes RESTART IDENTITY CASCADE;');
    console.log("Banco de dados limpo! Começando a importação...");

    let totalQuestoes = 0;

    for (const pasta of pastasDeProvas) {
      if (!fs.existsSync(pasta)) {
        console.log(`⚠️ Pasta não encontrada, pulando: ${pasta}`);
        continue;
      }

      const arquivos = fs.readdirSync(pasta);

      for (const arquivo of arquivos) {
        if (arquivo.endsWith('.json')) {
          const caminhoCompleto = path.join(pasta, arquivo);
          const arquivoBruto = fs.readFileSync(caminhoCompleto, 'utf-8');
          const questoes = JSON.parse(arquivoBruto);

          console.log(`Lendo o arquivo ${arquivo} (${questoes.length} questões)...`);

          for (const questao of questoes) {
            const sql = `
              INSERT INTO questoes (topico, enunciado, codigo_typescript, nivel_dificuldade, tipo_questao, tabela_enunciado, easter_egg_conteudo, origem, ano) 
              VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9);
            `;
            const values = [
              questao.topico,
              questao.enunciado,
              questao.codigo_typescript,
              questao.nivel_dificuldade,
              questao.tipo_questao,
              questao.tabela_enunciado ? JSON.stringify(questao.tabela_enunciado) : null,
              questao.easter_egg_conteudo,
              questao.origem,
              questao.ano
            ];
            await pool.query(sql, values);
          }
          console.log(`Arquivo ${arquivo} importado com sucesso!`);
          totalQuestoes += questoes.length;
        }
      }
    }

    console.log(`\n🎉 Finalizado com sucesso! Um total de ${totalQuestoes} questões foram salvas no PostgreSQL.`);
  } catch (erro) {
    console.error("Erro no processo de importação:", erro.message);
  } finally {
    await pool.end();
  }
}

importarTodasAsProvas();