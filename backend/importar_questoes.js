import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function importarTodasAsProvas() {
  console.log("Iniciando o carteiro robô avançado... 🤖");
  const pastaProvas = './dados_provas';

  try {
    // Limpa a tabela inteira antes de importar para evitar duplicações
    console.log("Limpando o banco de dados antigo para evitar clones...");
    const { error: erroLimpeza } = await supabase
      .from('questoes')
      .delete()
      .neq('id', 0); // O Supabase exige uma condição para deletar múltiplos, 'id diferente de 0' pega todos.

    if (erroLimpeza) {
      console.error("❌ Erro ao limpar a tabela:", erroLimpeza.message);
      return; // Para o robô aqui se não conseguir limpar
    }
    console.log("✨ Banco de dados limpo! Começando a importação...");

    // Lê todos os nomes de arquivos que estão na pasta
    const arquivos = fs.readdirSync(pastaProvas);
    let totalQuestoes = 0;

    for (const arquivo of arquivos) {
      if (arquivo.endsWith('.json')) {
        const caminhoCompleto = path.join(pastaProvas, arquivo);
        const arquivoBruto = fs.readFileSync(caminhoCompleto, 'utf-8');
        const questoes = JSON.parse(arquivoBruto);
        
        // Envia as questões do arquivo atual
        const { error } = await supabase.from('questoes').insert(questoes);

        if (error) {
          console.error(`Erro ao importar ${arquivo}:`, error.message);
        } else {
          console.log(`Arquivo ${arquivo} importado com sucesso! (${questoes.length} questões)`);
          totalQuestoes += questoes.length;
        }
      }
    }
    console.log(`Finalizado! Um total de ${totalQuestoes} questões foram salvas no banco sem duplicações.`);
  } catch (erro) {
    console.error("Erro no processo:", erro.message);
  }
}

importarTodasAsProvas();