import { pool } from '../config/database.js';

export const SorteioService = {
  async gerarSimulado(filtros: any) {
  
    const { topicos, quantidade, dificuldades } = filtros;
    
    let sql = 'SELECT * FROM questoes WHERE 1=1';
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

    // Fisher-Yates Shuffle maravilhoso
    let questoes = [...rows];
    for (let i = questoes.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [questoes[i], questoes[j]] = [questoes[j], questoes[i]];
    }

    return questoes.slice(0, quantidade);
  }
};