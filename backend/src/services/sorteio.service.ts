import { pool } from '../config/database.js';

export const SorteioService = {
  async gerarSimulado(filtros: any) {
    const { modo, topicos, dificuldades } = filtros;
    let quantidade = parseInt(filtros.quantidade, 10) || 5;

    if (quantidade > 12) {
      quantidade = 12;
    }

    // 1. REGRA DA MINIPROVA (implementação + execução)
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

    // 2. REGRA DA UNIDADE 1 (Ordenada por progressão de Dificuldade)
    if (modo === 'unidade1') {
      const sql = `
        (SELECT * FROM questoes WHERE tipo_questao = 'Implementação' AND nivel_dificuldade != 'Muito Difícil' AND ativo = true AND origem NOT ILIKE '%Miniprova%' AND topico = ANY($1) ORDER BY RANDOM() LIMIT 4)
        UNION ALL
        (SELECT * FROM questoes WHERE tipo_questao = 'Execução de Código' AND nivel_dificuldade != 'Muito Difícil' AND ativo = true AND origem NOT ILIKE '%Miniprova%' AND topico = ANY($1) ORDER BY RANDOM() LIMIT 1)
        UNION ALL
        (SELECT * FROM questoes WHERE tipo_questao = 'Correção de Código' AND nivel_dificuldade != 'Muito Difícil' AND ativo = true AND origem NOT ILIKE '%Miniprova%' AND topico = ANY($1) ORDER BY RANDOM() LIMIT 1)
        UNION ALL
        (SELECT * FROM questoes WHERE nivel_dificuldade = 'Muito Difícil' AND ativo = true AND origem NOT ILIKE '%Miniprova%' AND topico = ANY($1) ORDER BY RANDOM() LIMIT 1);
      `;
      const { rows } = await pool.query(sql, [arrayTopicos]);
      
      const pesosDificuldade: Record<string, number> = { 'Fácil': 1, 'Média': 2, 'Difícil': 3 };

      const implementacoes = rows
        .filter(q => q.tipo_questao === 'Implementação' && q.nivel_dificuldade !== 'Muito Difícil')
        .sort((a, b) => (pesosDificuldade[a.nivel_dificuldade] || 99) - (pesosDificuldade[b.nivel_dificuldade] || 99));

      const provaOrdenada = [
        ...implementacoes,
        ...rows.filter(q => q.tipo_questao === 'Execução de Código' && q.nivel_dificuldade !== 'Muito Difícil'),
        ...rows.filter(q => q.tipo_questao === 'Correção de Código' && q.nivel_dificuldade !== 'Muito Difícil'),
        ...rows.filter(q => q.nivel_dificuldade === 'Muito Difícil')
      ];

      return provaOrdenada; 
    }

    // 2.1 REGRA DA UNIDADE 2 (6 Questões - Ordenada por progressão de Tópicos)
    if (modo === 'unidade2') {
      const sql = `
        (SELECT * FROM questoes WHERE tipo_questao = 'Implementação' AND nivel_dificuldade != 'Muito Difícil' AND ativo = true AND origem NOT ILIKE '%Miniprova%' AND topico = 'Vetores' ORDER BY RANDOM() LIMIT 1)
        UNION ALL
        (SELECT * FROM questoes WHERE tipo_questao = 'Implementação' AND nivel_dificuldade != 'Muito Difícil' AND ativo = true AND origem NOT ILIKE '%Miniprova%' AND topico = 'Arrays' ORDER BY RANDOM() LIMIT 1)
        UNION ALL
        (SELECT * FROM questoes WHERE tipo_questao = 'Implementação' AND nivel_dificuldade != 'Muito Difícil' AND ativo = true AND origem NOT ILIKE '%Miniprova%' AND topico = 'Tipos' ORDER BY RANDOM() LIMIT 1)
        UNION ALL
        (SELECT * FROM questoes WHERE tipo_questao = 'Correção de Código' AND nivel_dificuldade != 'Muito Difícil' AND ativo = true AND origem NOT ILIKE '%Miniprova%' AND topico = ANY($1) ORDER BY RANDOM() LIMIT 1)
        UNION ALL
        (SELECT * FROM questoes WHERE tipo_questao = 'Execução de Código' AND nivel_dificuldade != 'Muito Difícil' AND ativo = true AND origem NOT ILIKE '%Miniprova%' AND topico = ANY($1) ORDER BY RANDOM() LIMIT 1)
        UNION ALL
        (SELECT * FROM questoes WHERE nivel_dificuldade = 'Muito Difícil' AND ativo = true AND origem NOT ILIKE '%Miniprova%' AND topico = ANY($1) ORDER BY RANDOM() LIMIT 1);
      `;
      const { rows } = await pool.query(sql, [arrayTopicos]);
      
      const pesosTopico: Record<string, number> = { 'Vetores': 1, 'Arrays': 2, 'Tipos': 3 };

      // Ordena garantindo que Vetores vem antes de Arrays, que vem antes de Tipos
      const implementacoes = rows
        .filter(q => q.tipo_questao === 'Implementação' && q.nivel_dificuldade !== 'Muito Difícil')
        .sort((a, b) => (pesosTopico[a.topico] || 99) - (pesosTopico[b.topico] || 99));

      const provaOrdenada = [
        ...implementacoes,
        ...rows.filter(q => q.tipo_questao === 'Correção de Código' && q.nivel_dificuldade !== 'Muito Difícil'),
        ...rows.filter(q => q.tipo_questao === 'Execução de Código' && q.nivel_dificuldade !== 'Muito Difícil'),
        ...rows.filter(q => q.nivel_dificuldade === 'Muito Difícil')
      ];

      return provaOrdenada; 
    }

    // 3. REGRA DA AVALIAÇÃO FINAL (Garantindo equilíbrio entre Média e Difícil)
    if (modo === 'final') {
      const sql = `
        (SELECT * FROM questoes WHERE tipo_questao = 'Implementação' AND nivel_dificuldade = 'Média' AND ativo = true AND origem NOT ILIKE '%Miniprova%' AND topico = ANY($1) ORDER BY RANDOM() LIMIT 2)
        UNION ALL
        (SELECT * FROM questoes WHERE tipo_questao = 'Implementação' AND nivel_dificuldade = 'Difícil' AND ativo = true AND origem NOT ILIKE '%Miniprova%' AND topico = ANY($1) ORDER BY RANDOM() LIMIT 1)
        UNION ALL
        (SELECT * FROM questoes WHERE tipo_questao = 'Correção de Código' AND nivel_dificuldade != 'Muito Difícil' AND ativo = true AND origem NOT ILIKE '%Miniprova%' AND topico = ANY($1) ORDER BY RANDOM() LIMIT 1)
        UNION ALL
        (SELECT * FROM questoes WHERE tipo_questao = 'Execução de Código' AND nivel_dificuldade != 'Muito Difícil' AND ativo = true AND origem NOT ILIKE '%Miniprova%' AND topico = ANY($1) ORDER BY RANDOM() LIMIT 1)
        UNION ALL
        (SELECT * FROM questoes WHERE nivel_dificuldade = 'Muito Difícil' AND ativo = true AND origem NOT ILIKE '%Miniprova%' AND topico = ANY($1) ORDER BY RANDOM() LIMIT 1);
      `;
      const { rows } = await pool.query(sql, [arrayTopicos]);
      
      const provaOrdenada = [
        ...rows.filter(q => q.tipo_questao === 'Implementação'),
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

    const provaFinal: any[] = [];
    
    // Embaralha o pool completo antes de começar a extrair
    const questoesRestantes = [...rows].sort(() => 0.5 - Math.random());

    // PASSO 1: Garantir ao menos UMA questão de cada DIFICULDADE solicitada (se existir no BD)
    if (dificuldades && dificuldades.length > 0) {
      const dificuldadesEmbaralhadas = [...dificuldades].sort(() => 0.5 - Math.random());
      for (const dif of dificuldadesEmbaralhadas) {
        if (provaFinal.length >= quantidade) break;
        const index = questoesRestantes.findIndex(q => q.nivel_dificuldade === dif);
        if (index !== -1) {
          provaFinal.push(questoesRestantes.splice(index, 1)[0]);
        }
      }
    }

    // PASSO 2: Garantir ao menos UMA questão de cada TÓPICO solicitado (se existir no BD)
    if (arrayTopicos && arrayTopicos.length > 0) {
      const topicosEmbaralhados = [...arrayTopicos].sort(() => 0.5 - Math.random());
      for (const topico of topicosEmbaralhados) {
        if (provaFinal.length >= quantidade) break;
        // Verifica se esse tópico já foi incluído no Passo 1
        const hasTopic = provaFinal.some(q => q.topico === topico);
        if (!hasTopic) {
          const index = questoesRestantes.findIndex(q => q.topico === topico);
          if (index !== -1) {
            provaFinal.push(questoesRestantes.splice(index, 1)[0]);
          }
        }
      }
    }

    // PASSO 3: Preencher o restante (se faltar) dividindo os tópicos de forma equilibrada (Round-Robin)
    const questoesPorTopico: Record<string, any[]> = {};
    for (const q of questoesRestantes) {
      if (!questoesPorTopico[q.topico]) questoesPorTopico[q.topico] = [];
      questoesPorTopico[q.topico].push(q);
    }

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

    // Retorna a prova final misturada para a ordem não ficar previsível
    return provaFinal.sort(() => 0.5 - Math.random());
  }
};