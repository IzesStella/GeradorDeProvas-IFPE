import { useEffect, useState } from 'react';
import { TelaConfiguracao } from './components/TelaConfiguracao';
import { TelaSimulado } from './components/TelaSimulado';

function App() {
  const [telaAtual, setTelaAtual] = useState<'config' | 'simulado'>('config');
  const [bancoDeQuestoes, setBancoDeQuestoes] = useState([]);
  const [questoesDaProva, setQuestoesDaProva] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3000/api/questoes')
      .then((res) => res.json())
      .then((dados) => setBancoDeQuestoes(dados))
      .catch((erro) => console.error(erro));
  }, []);

  const gerarProva = (filtros: any) => {
    let filtradas = [...bancoDeQuestoes];
    if (filtros.topicosSelecionados.length > 0) {
      filtradas = filtradas.filter((q: any) => filtros.topicosSelecionados.includes(q.topico));
    }
    if (filtros.dificuldade) {
      filtradas = filtradas.filter((q: any) => q.nivel_dificuldade === filtros.dificuldade);
    }
    filtradas.sort(() => Math.random() - 0.5);
    setQuestoesDaProva(filtradas.slice(0, filtros.quantidade));
    setTelaAtual('simulado');
  };

  return (
    <div style={{ fontFamily: 'sans-serif' }}>
      {telaAtual === 'config' ? (
        <TelaConfiguracao onGerar={gerarProva} />
      ) : (
        <TelaSimulado questoes={questoesDaProva} onVoltar={() => setTelaAtual('config')} />
      )}
    </div>
  );
}

export default App;