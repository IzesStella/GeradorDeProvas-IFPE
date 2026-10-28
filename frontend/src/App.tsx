import { useState } from 'react';
import { TelaConfiguracao } from './telas/configuracao/TelaConfiguracao';
import { TelaSimulado } from './telas/simulado/TelaSimulado';
import { TelaLogin } from './telas/login/TelaLogin';
import { TelaAdmin } from './telas/admin/TelaAdmin';
import { api, sessao } from './api';
import { API_URL } from './config';
import type { FiltrosSimulado, Questao } from './tipos';

type NomeTela = 'configuracao' | 'simulado' | 'admin';

// Decide qual tela aparece e guarda o simulado gerado
export default function App() {
  const [tela, setTela] = useState<NomeTela>('configuracao');
  const [filtros, setFiltros] = useState<FiltrosSimulado | null>(null);
  const [questoes, setQuestoes] = useState<Questao[]>([]);
  const [logado, setLogado] = useState(sessao.ativa);

  // Sai do painel: apaga o token do login e volta para a tela inicial
  const sair = () => {
    sessao.encerrar();
    setLogado(false);
    setTela('configuracao');
  };

  // Pede as questões ao backend e abre a tela do simulado
  const gerarSimulado = async (novosFiltros: FiltrosSimulado) => {
    try {
      setQuestoes(await api.gerarSimulado(novosFiltros));
      setFiltros(novosFiltros);
      setTela('simulado');
    } catch (erro) {
      console.error(erro);
      alert(`Não foi possível gerar o simulado. O backend está rodando em ${API_URL}?`);
    }
  };

  if (tela === 'simulado' && filtros) {
    return <TelaSimulado questoes={questoes} filtros={filtros} onVoltar={() => setTela('configuracao')} />;
  }

  // O painel só aparece depois do login
  if (tela === 'admin') {
    return logado
      ? <TelaAdmin onSair={sair} />
      : <TelaLogin onLoginSucesso={() => setLogado(true)} onVoltar={() => setTela('configuracao')} />;
  }

  return <TelaConfiguracao ultimosFiltros={filtros} onGerar={gerarSimulado} onAcessarAdmin={() => setTela('admin')} />;
}