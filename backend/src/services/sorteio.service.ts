import { pool } from '../config/database.js';

export const SorteioService = {
  async gerarSimulado(filtros: any) {
  
  
    const { modo, topicos, quantidade, dificuldades } = filtros;
    
    // LÓGICA: SE FOR MINIPROVA, 1 IMPLEMENTAÇÃO + 1 EXECUÇÃO
    if (modo === 'miniprova') {
      const topicoSelecionado = topicos[0]; // Na miniprova sempre vem apenas 1 tópico

      const sql = `
        (SELECT * FROM questoes WHERE topico = $1 AND tipo_questao = 'Implementação' AND ativo = true ORDER BY RANDOM() LIMIT 1)
        UNION ALL
        (SELECT * FROM questoes WHERE topico = $1 AND tipo_questao = 'Execução de Código' AND ativo = true ORDER BY RANDOM() LIMIT 1);
      `;

      const { rows } = await pool.query(sql, [topicoSelecionado]);
      return rows; // Retorna exatamente o par sorteado
    }

  
    // LÓGICA PADRÃO: PARA AS DEMAIS PROVAS (Livre, 1ª Unidade, etc)
    let sql = 'SELECT * FROM questoes WHERE ativo = true'; // Pega só as que não foram deletadas
    const values: any[] = [];
    let contadorVariaveis = 1;

    // Filtro de Tópicos 
    if (topicos && topicos.length > 0) {
      sql += ` AND topico = ANY($${contadorVariaveis})`;
      values.push(topicos);
      contadorVariaveis++;
    }

    // Filtro de Dificuldades 
    if (dificuldades && dificuldades.length > 0) {
      sql += ` AND nivel_dificuldade = ANY($${contadorVariaveis})`;
      values.push(dificuldades);
      contadorVariaveis++;
    }

    const { rows, rowCount } = await pool.query(sql, values);

    if (!rows || rowCount === 0) {
      return [];
    }

    // Fisher-Yates Shuffle
    let questoes = [...rows];
    for (let i = questoes.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [questoes[i], questoes[j]] = [questoes[j], questoes[i]];
    }

    return questoes.slice(0, quantidade);
  }
};