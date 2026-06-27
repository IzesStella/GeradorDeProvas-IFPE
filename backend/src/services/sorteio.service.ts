import { pool } from '../config/database.js';

export const SorteioService = {
  async gerarSimulado(filtros: any) {
    const { modo, topicos, dificuldades } = filtros;
    let quantidade = parseInt(filtros.quantidade, 10) || 5;

    // TRAVA MÁXIMA DE 12 QUESTÕES
    if (quantidade > 12) {
      quantidade = 12;
    }

    // LÓGICA DA MINIPROVA
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

    let sql = 'SELECT * FROM questoes WHERE ativo = true';
    const values: any[] = [];
    let contadorVariaveis = 1;

    if (topicos && topicos.length > 0) {
      // EXPANSÃO DE TÓPICOS
      const topicosParaBuscar = new Set<string>();
      
      topicos.forEach((t: string) => {
        topicosParaBuscar.add(t);

        // Se o filtro principal for "Laços", engloba automaticamente as miniprovas que tem os títulos laços parte 2 e 1
        if (t === 'Laços') {
          topicosParaBuscar.add('Laços - Parte 1');
          topicosParaBuscar.add('Laços - Parte 2');
        }
      });

      sql += ` AND topico = ANY($${contadorVariaveis})`;
      values.push(Array.from(topicosParaBuscar));
      contadorVariaveis++;
    }

    // O banco SÓ vai trazer as questões se elas baterem com a dificuldade marcada.
    if (dificuldades && dificuldades.length > 0) {
      sql += ` AND nivel_dificuldade = ANY($${contadorVariaveis})`;
      values.push(dificuldades);
      contadorVariaveis++;  
    }

    const { rows, rowCount } = await pool.query(sql, values);

    // Se o banco não achar NADA com essa exata combinação, devolve vazio. 
    // (Isso gera o Aviso Absoluto na tela)
    if (!rows || rowCount === 0) return []; 

    // Agrupa as questões validadas por tópico
    const questoesPorTopico: Record<string, any[]> = {};
    for (const q of rows) {
      if (!questoesPorTopico[q.topico]) questoesPorTopico[q.topico] = [];
      questoesPorTopico[q.topico].push(q);
    }

    // Embaralha
    for (const t in questoesPorTopico) {
      questoesPorTopico[t] = questoesPorTopico[t].sort(() => 0.5 - Math.random());
    }

    const provaFinal: any[] = [];
    const topicosDisponiveis = Object.keys(questoesPorTopico);
    let indexTopico = 0;

    // Sorteio Round-Robin
    while (provaFinal.length < quantidade && topicosDisponiveis.length > 0) {
      const topicoAtual = topicosDisponiveis[indexTopico % topicosDisponiveis.length];
      const questoesDoTopico = questoesPorTopico[topicoAtual];

      if (questoesDoTopico.length === 0) {
        topicosDisponiveis.splice(topicosDisponiveis.indexOf(topicoAtual), 1);
        continue;
      }

      // Tira 1 questão da fila e joga na prova
      const questaoSorteada = questoesDoTopico.splice(0, 1)[0];
      provaFinal.push(questaoSorteada);

      indexTopico++;
    }

    return provaFinal.sort(() => 0.5 - Math.random());
  }
};