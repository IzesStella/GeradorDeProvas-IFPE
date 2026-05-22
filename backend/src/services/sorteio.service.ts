import { supabase } from '../config/supabase.js';

export const SorteioService = {
  async gerarSimulado(filtros: any) {
    const { topicosSelecionados, quantidade, dificuldade } = filtros;
    
    let query = supabase.from('questoes').select('*');

    if (topicosSelecionados && topicosSelecionados.length > 0) {
      query = query.in('topico', topicosSelecionados);
    }

    if (dificuldade) {
      query = query.eq('nivel_dificuldade', dificuldade);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(error.message);
    }

    if (!data || data.length === 0) {
      return [];
    }

    const questoesEmbaralhadas = data.sort(() => 0.5 - Math.random());
    return questoesEmbaralhadas.slice(0, quantidade);
  }
};