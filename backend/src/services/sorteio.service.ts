import { pool } from '../config/database.js';

export const SorteioService = {
  async gerarSimulado(filtros: any) {
    const { topicosSelecionados, quantidade, dificuldade } = filtros;
    
    //  consulta base C um array para guardar os valores dos filtros
    let sql = 'SELECT * FROM questoes WHERE 1=1';
    const values: any[] = [];
    let contadorVariaveis = 1;

    // iltro de Tópicos (usando o ANY do PostgreSQL para arrays)
    if (topicosSelecionados && topicosSelecionados.length > 0) {
      sql += ` AND topico = ANY($${contadorVariaveis})`;
      values.push(topicosSelecionados);
      contadorVariaveis++;
    }

    if (dificuldade) {
      sql += ` AND nivel_dificuldade = $${contadorVariaveis}`;
      values.push(dificuldade);
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
      // Troca os elementos de lugar
      [questoes[i], questoes[j]] = [questoes[j], questoes[i]];
    }


    return questoes.slice(0, quantidade);
  }
};