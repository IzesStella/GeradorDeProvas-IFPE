import type { ModoProva } from './tipos';

// Listas fixas usadas na tela de configuração e no painel administrativo

export const NIVEIS = ['Fácil', 'Média', 'Difícil', 'Muito Difícil'];
export const TIPOS = ['Implementação', 'Execução de Código', 'Correção de Código'];
export const CURSOS = ['IPI', 'TSI'];
export const QUANTIDADE_MAXIMA = 12;

// Tópicos que o estudante pode escolher na tela de configuração
export const TOPICOS = [
  'Operadores, Tipos e Variáveis',
  'Execução Condicional',
  'Operadores Lógicos',
  'Laços',
  'Subprogramas',
  'Vetores',
  'Arrays',
  'Tipos',
  'Recursão - Unidade 1',
  'Recursão - Unidade 2'
];

// Tópicos da Miniprova: Laços é dividido em duas partes e não há Recursão
export const TOPICOS_MINIPROVA = [
  'Operadores, Tipos e Variáveis',
  'Execução Condicional',
  'Operadores Lógicos',
  'Laços - Parte 1',
  'Laços - Parte 2',
  'Subprogramas',
  'Vetores',
  'Arrays',
  'Tipos'
];

// Tópicos do painel admin (filtro e formulário de cadastro)
export const TOPICOS_CADASTRO = [
  'Operadores, Tipos e Variáveis',
  'Operadores Lógicos',
  'Execução Condicional',
  'Laços',
  'Laços - Parte 1',
  'Laços - Parte 2',
  'Subprogramas',
  'Vetores',
  'Arrays',
  'Tipos',
  'Recursão - Unidade 1',
  'Recursão - Unidade 2'
];

// Avaliações de onde as questões foram (campo "Fonte" do formulário do painel)
export const ORIGENS = [
  'Miniprova - Operadores, Tipos e Variáveis',
  'Miniprova - Execução Condicional',
  'Miniprova - Operadores Lógicos',
  'Miniprova - Laços Parte 1',
  'Miniprova - Laços Parte 2',
  'Miniprova - Subprogramas',
  'Miniprova - Vetores',
  'Miniprova - Arrays',
  'Miniprova - Tipos',
  'Primeira Avaliação Individual',
  'Primeira Recuperação Individual',
  'Segunda Avaliação Individual',
  'Segunda Recuperação Individual',
  'Avaliação Final Individual'
];

// Modelos de prova da tela de configuração: nome e descrição de cada um  
export const MODELOS: { id: ModoProva; titulo: string; descricao: string }[] = [
  { id: 'livre', titulo: 'Modelo Livre', descricao: 'Personalize manualmente os tópicos e o nível de dificuldade desejado.' },
  { id: 'unidade1', titulo: 'Avaliação da Primeira Unidade', descricao: 'Segue o formato da prova da primeira unidade, com os assuntos até Subprogramas.' },
  { id: 'unidade2', titulo: 'Avaliação da 2ª Unidade / Final', descricao: 'Segue o formato das provas da segunda unidade e final, com Vetores, Arrays e Tipos.' },
  { id: 'miniprova', titulo: 'Miniprova', descricao: 'Formato de avaliação semanal: 1 questão de Implementação e 1 de Execução.' }
];

// O que a tela de configuração preenche (e trava) em cada modelo de prova
export const PREDEFINICOES: Record<Exclude<ModoProva, 'livre'>, { quantidade: number; topicos: string[]; dificuldades: string[] }> = {
  unidade1: {
    quantidade: 7,
    topicos: ['Operadores, Tipos e Variáveis', 'Operadores Lógicos', 'Execução Condicional', 'Laços', 'Subprogramas', 'Recursão - Unidade 1'],
    dificuldades: NIVEIS
  },
  unidade2: {
    quantidade: 6,
    topicos: ['Vetores', 'Arrays', 'Tipos', 'Recursão - Unidade 2'],
    dificuldades: NIVEIS
  },
  miniprova: { quantidade: 2, topicos: [], dificuldades: [] }
};

// No banco, a origem é salva junto com o curso ("Miniprova - Arrays - TSI").
// Esta função separa as duas partes para o painel mostrar e filtrar pelo curso.
export const separarOrigem = (origem: string) => {
  const partes = (origem || '').match(/^(.*) - (IPI|TSI)$/);
  return partes ? { fonte: partes[1], curso: partes[2] } : { fonte: origem || '', curso: '' };
};

// Classes CSS que dão a cor de cada tipo de questão e de cada nível (cores em index.css)
export const classeTipo = (tipo?: string) =>
  tipo?.startsWith('Impl') ? 'tipo-implementacao' : tipo?.startsWith('Corre') ? 'tipo-correcao' : 'tipo-execucao';

const CLASSES_NIVEL: Record<string, string> = {
  'Fácil': 'nivel-facil',
  'Média': 'nivel-media',
  'Difícil': 'nivel-dificil',
  'Muito Difícil': 'nivel-muito-dificil'
};

export const classeNivel = (nivel: string) => CLASSES_NIVEL[nivel] ?? 'nivel-muito-dificil';