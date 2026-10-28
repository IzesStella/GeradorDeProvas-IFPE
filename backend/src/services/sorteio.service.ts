import { QuestaoRepository, FiltroSorteio } from '../repositories/questao.repository.js';
import { montarModeloLivre } from './modelo-livre.service.js';

// Composição fixa dos modelos de avaliação (Tabela 3 do relatório).
// Cada item é uma posição da prova, na ordem em que aparece.
// Posições sem tópico definido usam os tópicos da unidade enviados pela tela.
const PRIMEIRA_UNIDADE: FiltroSorteio[] = [
  { tipo: 'Implementação', topicos: ['Operadores Lógicos', 'Execução Condicional'] },
  { tipo: 'Implementação', topicos: ['Subprogramas'] },
  { tipo: 'Implementação', topicos: ['Laços'] },
  { tipo: 'Implementação', topicos: ['Subprogramas'] },
  { tipo: 'Execução de Código' },
  { tipo: 'Correção de Código' },
  { muitoDificil: true }
];

const SEGUNDA_UNIDADE_FINAL: FiltroSorteio[] = [
  { tipo: 'Implementação', topicos: ['Vetores'] },
  { tipo: 'Implementação', topicos: ['Arrays'] },
  { tipo: 'Implementação', topicos: ['Tipos'] },
  { tipo: 'Correção de Código' },
  { tipo: 'Execução de Código' },
  { muitoDificil: true }
];

function composicaoMiniprova(topico: string): FiltroSorteio[] {
  return [
    { tipo: 'Implementação', topicos: [topico], apenasMiniprovas: true },
    { tipo: 'Execução de Código', topicos: [topico], apenasMiniprovas: true }
  ];
}

export const SorteioService = {
  async gerarSimulado(filtros: any) {
    const topicosEscolhidos: string[] = filtros.topicos ?? [];
    const dificuldades: string[] = filtros.dificuldades ?? [];
    const topicos = expandirTopicos(topicosEscolhidos);

    switch (filtros.modo) {
      case 'miniprova':
        if (topicosEscolhidos.length === 0) return [];
        return sortearPorComposicao(composicaoMiniprova(topicosEscolhidos[0]), topicos);
      case 'unidade1':
        return sortearPorComposicao(PRIMEIRA_UNIDADE, topicos);
      case 'unidade2':
      case 'final':
        return sortearPorComposicao(SEGUNDA_UNIDADE_FINAL, topicos);
      default: {
        const quantidade = Math.min(parseInt(filtros.quantidade, 10) || 5, 12);
        const questoes = await QuestaoRepository.buscarParaModeloLivre(topicos, dificuldades);
        return montarModeloLivre(questoes, topicosEscolhidos, dificuldades, quantidade);
      }
    }
  }
};

// Sorteia uma questão para cada posição, na ordem da composição, sem repetir questões
async function sortearPorComposicao(composicao: FiltroSorteio[], topicosDaUnidade: string[]) {
  const prova: any[] = [];
  for (const posicao of composicao) {
    const filtro = { ...posicao, topicos: posicao.topicos ?? topicosDaUnidade };
    const questao = await QuestaoRepository.sortearUma(filtro, prova.map(q => q.id));
    if (questao) prova.push(questao);
  }
  return prova;
}

// O tópico Laços inclui as duas partes em que ele é dividido nas miniprovas
function expandirTopicos(topicos: string[]) {
  const expandidos = new Set(topicos);
  if (expandidos.has('Laços')) {
    expandidos.add('Laços - Parte 1');
    expandidos.add('Laços - Parte 2');
  }
  return [...expandidos];
}