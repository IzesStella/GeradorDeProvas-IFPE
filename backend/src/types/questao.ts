export interface Questao {
  id?: number; // opcional, o supabase gera ele automaticamente
  topico: string;
  enunciado: string;
  codigo_typescript: string | null;
  nivel_dificuldade: string;
  easter_egg_conteudo: string | null;
  origem: string;
  ano: string | number;
}