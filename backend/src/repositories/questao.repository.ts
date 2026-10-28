import { pool } from '../config/database.js';

// Critérios para sortear a questão de uma posição da prova
export interface FiltroSorteio {
  tipo?: string;
  topicos?: string[];
  muitoDificil?: boolean;
  apenasMiniprovas?: boolean;
}

// Todo o SQL da tabela questoes fica neste arquivo
export const QuestaoRepository = {
  // Sorteia uma questão que atenda ao filtro, sem repetir as que já foram sorteadas
  async sortearUma(filtro: FiltroSorteio, idsJaSorteados: number[]) {
    const valores: unknown[] = [];
    const parametro = (valor: unknown) => {
      valores.push(valor);
      return `$${valores.length}`;
    };

    const condicoes = [
      'ativo = true',
      `NOT (id = ANY(${parametro(idsJaSorteados)}::int[]))`,
      `origem ${filtro.apenasMiniprovas ? 'ILIKE' : 'NOT ILIKE'} ${parametro('%Miniprova%')}`,
      `nivel_dificuldade ${filtro.muitoDificil ? '=' : '<>'} ${parametro('Muito Difícil')}`
    ];
    if (filtro.tipo) condicoes.push(`tipo_questao = ${parametro(filtro.tipo)}`);
    if (filtro.topicos) condicoes.push(`topico = ANY(${parametro(filtro.topicos)})`);

    const sql = `SELECT * FROM questoes WHERE ${condicoes.join(' AND ')} ORDER BY RANDOM() LIMIT 1`;
    const { rows } = await pool.query(sql, valores);
    return rows[0] ?? null;
  },

  // Todas as questões dos tópicos e níveis escolhidos no Modelo Livre
  async buscarParaModeloLivre(topicos: string[], dificuldades: string[]) {
    const sql = 'SELECT * FROM questoes WHERE ativo = true AND topico = ANY($1) AND nivel_dificuldade = ANY($2)';
    const { rows } = await pool.query(sql, [topicos, dificuldades]);
    return rows;
  },

  async listar() {
    const sql = 'SELECT * FROM questoes WHERE ativo = true ORDER BY id DESC';
    const { rows } = await pool.query(sql);
    return rows;
  },

  async criar(dados: any) {
    const sql = `
      INSERT INTO questoes (topico, enunciado, codigo_typescript, nivel_dificuldade, tipo_questao, tabela_enunciado, easter_egg_conteudo, origem, ano)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *;
    `;
    const { rows } = await pool.query(sql, valoresDaQuestao(dados));
    return rows[0];
  },

  // Retorna null quando a questão não existe
  async atualizar(id: string, dados: any) {
    const sql = `
      UPDATE questoes SET topico = $1, enunciado = $2, codigo_typescript = $3, nivel_dificuldade = $4, tipo_questao = $5, tabela_enunciado = $6, easter_egg_conteudo = $7, origem = $8, ano = $9
      WHERE id = $10 RETURNING *;
    `;
    const { rows } = await pool.query(sql, [...valoresDaQuestao(dados), id]);
    return rows[0] ?? null;
  },

  // Exclusão definitiva. Retorna false quando a questão não existe
  async deletar(id: string) {
    const { rowCount } = await pool.query('DELETE FROM questoes WHERE id = $1', [id]);
    return rowCount !== 0;
  }
};

function valoresDaQuestao(dados: any) {
  const { topico, enunciado, codigo_typescript, nivel_dificuldade, tipo_questao, tabela_enunciado, easter_egg_conteudo, origem, ano } = dados;
  return [
    topico, enunciado, codigo_typescript, nivel_dificuldade, tipo_questao,
    tabela_enunciado ? JSON.stringify(tabela_enunciado) : null,
    easter_egg_conteudo, origem, ano
  ];
}