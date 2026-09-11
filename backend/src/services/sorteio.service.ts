import { pool } from '../config/database.js';

export const SorteioService = {
  async gerarSimulado(filtros: any) {
    const { modo, topicos, dificuldades } = filtros;
    let quantidade = parseInt(filtros.quantidade, 10) || 5;

    if (quantidade > 12) {
      quantidade = 12;
    }

    // 1. REGRA DA MINIPROVA
    if (modo === 'miniprova') {
      const topicoSelecionado = topicos && topicos.length > 0 ? topicos[0] : null;
      if (!topicoSelecionado) return [];

      const sql = `
        (SELECT * FROM questoes WHERE topico = $1 AND tipo_questao = 'Implementação' AND ativo = true ORDER BY RANDOM() LIMIT 1)
        UNION ALL
        (SELECT * FROM questoes WHERE topico = $1 AND tipo_questao = 'Execução de Código' AND ativo = true ORDER BY RANDOM() LIMIT 1);
      `;
      const { rows } = await pool.query(sql, [topicoSelecionado]);
      return rows; 
    }

    // Configuração de Tópicos (Comum para Provas e Modelo Livre)
    const topicosParaBuscar = new Set<string>();
    if (topicos && topicos.length > 0) {
      topicos.forEach((t: string) => {
        topicosParaBuscar.add(t);
        if (t === 'Laços') {
          topicosParaBuscar.add('Laços - Parte 1');
          topicosParaBuscar.add('Laços - Parte 2');
        }
      });
    }
    const arrayTopicos = Array.from(topicosParaBuscar);

    // 2. REGRA DAS UNIDADES (MODELO NOVO: 7 QUESTÕES)
    if (modo === 'unidade1' || modo === 'unidade2') {
      const sql = `
        (SELECT * FROM questoes WHERE tipo_questao = 'Implementação' AND nivel_dificuldade = 'Fácil' AND ativo = true AND origem NOT ILIKE '%Miniprova%' AND topico = ANY($1) ORDER BY RANDOM() LIMIT 2)
        UNION ALL
        (SELECT * FROM questoes WHERE tipo_questao = 'Implementação' AND nivel_dificuldade = 'Média' AND ativo = true AND origem NOT ILIKE '%Miniprova%' AND topico = ANY($1) ORDER BY RANDOM() LIMIT 2)
        UNION ALL
        (SELECT * FROM questoes WHERE tipo_questao = 'Execução de Código' AND nivel_dificuldade != 'Muito Difícil' AND ativo = true AND origem NOT ILIKE '%Miniprova%' AND topico = ANY($1) ORDER BY RANDOM() LIMIT 1)
        UNION ALL
        (SELECT * FROM questoes WHERE tipo_questao = 'Correção de Código' AND nivel_dificuldade != 'Muito Difícil' AND ativo = true AND origem NOT ILIKE '%Miniprova%' AND topico = ANY($1) ORDER BY RANDOM() LIMIT 1)
        UNION ALL
        (SELECT * FROM questoes WHERE nivel_dificuldade = 'Muito Difícil' AND ativo = true AND origem NOT ILIKE '%Miniprova%' AND topico = ANY($1) ORDER BY RANDOM() LIMIT 1);
      `;
      const { rows } = await pool.query(sql, [arrayTopicos]);
      
      // FORÇANDO A ORDEM EXATA NO JAVASCRIPT:
      const provaOrdenada = [
        ...rows.filter(q => q.tipo_questao === 'Implementação' && q.nivel_dificuldade === 'Fácil'),
        ...rows.filter(q => q.tipo_questao === 'Implementação' && q.nivel_dificuldade === 'Média'),
        ...rows.filter(q => q.tipo_questao === 'Execução de Código' && q.nivel_dificuldade !== 'Muito Difícil'),
        ...rows.filter(q => q.tipo_questao === 'Correção de Código' && q.nivel_dificuldade !== 'Muito Difícil'),
        ...rows.filter(q => q.nivel_dificuldade === 'Muito Difícil')
      ];

      return provaOrdenada; 
    }

    // 3. REGRA DA AVALIAÇÃO FINAL (MODELO ANTIGO: 6 QUESTÕES)
    if (modo === 'final') {
      const sql = `
        (SELECT * FROM questoes WHERE tipo_questao = 'Implementação' AND nivel_dificuldade != 'Muito Difícil' AND ativo = true AND origem NOT ILIKE '%Miniprova%' AND topico = ANY($1) ORDER BY RANDOM() LIMIT 3)
        UNION ALL
        (SELECT * FROM questoes WHERE tipo_questao = 'Correção de Código' AND nivel_dificuldade != 'Muito Difícil' AND ativo = true AND origem NOT ILIKE '%Miniprova%' AND topico = ANY($1) ORDER BY RANDOM() LIMIT 1)
        UNION ALL
        (SELECT * FROM questoes WHERE tipo_questao = 'Execução de Código' AND nivel_dificuldade != 'Muito Difícil' AND ativo = true AND origem NOT ILIKE '%Miniprova%' AND topico = ANY($1) ORDER BY RANDOM() LIMIT 1)
        UNION ALL
        (SELECT * FROM questoes WHERE nivel_dificuldade = 'Muito Difícil' AND ativo = true AND origem NOT ILIKE '%Miniprova%' AND topico = ANY($1) ORDER BY RANDOM() LIMIT 1);
      `;
      const { rows } = await pool.query(sql, [arrayTopicos]);
      
      // FORÇANDO A ORDEM EXATA DA FINAL: Impl -> Correção -> Execução -> Muito Difícil
      const provaOrdenada = [
        ...rows.filter(q => q.tipo_questao === 'Implementação' && q.nivel_dificuldade !== 'Muito Difícil'),
        ...rows.filter(q => q.tipo_questao === 'Correção de Código' && q.nivel_dificuldade !== 'Muito Difícil'),
        ...rows.filter(q => q.tipo_questao === 'Execução de Código' && q.nivel_dificuldade !== 'Muito Difícil'),
        ...rows.filter(q => q.nivel_dificuldade === 'Muito Difícil')
      ];

      return provaOrdenada; 
    }

    // 4. REGRA DO MODELO LIVRE
    let sql = "SELECT * FROM questoes WHERE ativo = true";
    const values: any[] = [];
    let contadorVariaveis = 1;

    if (arrayTopicos.length > 0) {
      sql += ` AND topico = ANY($${contadorVariaveis})`;
      values.push(arrayTopicos);
      contadorVariaveis++;
    }

    if (dificuldades && dificuldades.length > 0) {
      sql += ` AND nivel_dificuldade = ANY($${contadorVariaveis})`;
      values.push(dificuldades);
      contadorVariaveis++;  
    }

    const { rows, rowCount } = await pool.query(sql, values);
    if (!rows || rowCount === 0) return []; 

    const questoesPorTopico: Record<string, any[]> = {};
    for (const q of rows) {
      if (!questoesPorTopico[q.topico]) questoesPorTopico[q.topico] = [];
      questoesPorTopico[q.topico].push(q);
    }

    for (const t in questoesPorTopico) {
      questoesPorTopico[t] = questoesPorTopico[t].sort(() => 0.5 - Math.random());
    }

    const provaFinal: any[] = [];
    const topicosDisponiveis = Object.keys(questoesPorTopico);
    let indexTopico = 0;

    while (provaFinal.length < quantidade && topicosDisponiveis.length > 0) {
      const topicoAtual = topicosDisponiveis[indexTopico % topicosDisponiveis.length];
      const questoesDoTopico = questoesPorTopico[topicoAtual];

      if (questoesDoTopico.length === 0) {
        topicosDisponiveis.splice(topicosDisponiveis.indexOf(topicoAtual), 1);
        continue;
      }

      const questaoSorteada = questoesDoTopico.splice(0, 1)[0];
      provaFinal.push(questaoSorteada);
      indexTopico++;
    }

    return provaFinal.sort(() => 0.5 - Math.random());
  }
};