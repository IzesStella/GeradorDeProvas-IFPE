import { API_URL } from './config';
import type { FiltrosSimulado, Questao } from './tipos';

// Todas as chamadas ao backend ficam neste arquivo.
// Depois do login, o backend devolve um token (uma "senha temporária"). Ele fica salvo
// no navegador e vai junto em toda requisição do painel; sem ele, o backend recusa o pedido.

const CHAVE_TOKEN = 'gerador_token';

export const sessao = {
  ativa: () => !!localStorage.getItem(CHAVE_TOKEN),
  iniciar: (token: string) => localStorage.setItem(CHAVE_TOKEN, token),
  encerrar: () => localStorage.removeItem(CHAVE_TOKEN)
};

// Erro lançado quando o token não vale mais (por exemplo, depois que o servidor reinicia)
export class SessaoExpirada extends Error {}

async function requisitarPainel(caminho: string, opcoes: RequestInit = {}) {
  const resposta = await fetch(`${API_URL}/api${caminho}`, {
    ...opcoes,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem(CHAVE_TOKEN) ?? ''}`
    }
  });
  if (resposta.status === 401) throw new SessaoExpirada();
  if (!resposta.ok) throw new Error(`Erro ${resposta.status} em ${caminho}`);
  return resposta;
}

export const api = {
  async gerarSimulado(filtros: FiltrosSimulado): Promise<Questao[]> {
    const resposta = await fetch(`${API_URL}/api/simulado`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(filtros)
    });
    if (!resposta.ok) throw new Error('Erro ao gerar o simulado');
    return resposta.json();
  },

  // Devolve a mensagem de erro, ou null se o login deu certo
  async entrar(usuario: string, senha: string): Promise<string | null> {
    const resposta = await fetch(`${API_URL}/api/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usuario, senha })
    });
    const dados = await resposta.json();
    if (!dados.auth) return dados.error || 'Usuário ou senha inválidos.';
    sessao.iniciar(dados.token);
    return null;
  },

  async listarQuestoes(): Promise<Questao[]> {
    const resposta = await requisitarPainel('/questoes');
    return resposta.json();
  },

  async salvarQuestao(dados: object, id: number | null) {
    await requisitarPainel(id ? `/questoes/${id}` : '/questoes', {
      method: id ? 'PUT' : 'POST',
      body: JSON.stringify(dados)
    });
  },

  async excluirQuestao(id: number) {
    await requisitarPainel(`/questoes/${id}`, { method: 'DELETE' });
  }
};