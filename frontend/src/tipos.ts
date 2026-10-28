// Formatos dos dados usados em mais de um arquivo

// Ex.: usado em estrutura.tsx e icones.tsx
export type Tema = 'claro' | 'escuro';

// Modelos de prova da tela de configuração, aparece tbm em opcoes.ts e paineis.tsc
export type ModoProva = 'livre' | 'unidade1' | 'unidade2' | 'miniprova';

// Escolhas do estudante na tela de configuração, enviadas ao backend para gerar o simulado
export interface FiltrosSimulado {
  modo: ModoProva;
  topicos: string[];
  quantidade: number;
  dificuldades: string[];
}

// Uma questão do acervo, com os mesmos campos da tabela questoes do banco
export interface Questao {
  id: number;
  topico: string;
  enunciado: string;
  codigo_typescript: string;
  nivel_dificuldade: string;
  tipo_questao?: string;
  tabela_enunciado: string[][] | null;
  easter_egg_conteudo: string | null;
  origem: string;
  ano: string;
}