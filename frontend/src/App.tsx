import { useState } from 'react';
import { TelaConfiguracao } from './components/TelaConfiguracao';
import { TelaSimulado } from './components/TelaSimulado';
import { TelaAdmin } from './components/TelaAdmin';
import { TelaLogin } from './components/TelaLogin';
import './App.css';

export default function App() {
  const [telaAtual, setTelaAtual] = useState<'configuracao' | 'simulado' | 'admin'>('configuracao');
  const [filtrosSimulado, setFiltrosSimulado] = useState<any>(null);
  const [questoesAtuais, setQuestoesAtuais] = useState<any[]>([]);

  const [autenticado, setAutenticado] = useState(() => {
    return !!localStorage.getItem('gerador_token');
  });

  const handleLogout = () => {
    localStorage.removeItem('gerador_token');
    setAutenticado(false);
    setTelaAtual('configuracao');
  };

  const handleGerar = async (filtros: any) => {
    setFiltrosSimulado(filtros);
    
    try {
      const resposta = await fetch('http://localhost:3333/api/simulado', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(filtros),
      });

      if (resposta.ok) {
        const questoesSorteadas = await resposta.json();
        setQuestoesAtuais(questoesSorteadas);
        setTelaAtual('simulado');
      } else {
        alert('Erro ao buscar as questões. Verifique o servidor.');
      }
    } catch (erro) {
      console.error('Erro na requisição:', erro);
      alert('Erro de conexão. O backend está rodando na porta 3333?');
    }
  };

  return (
    <>
      {telaAtual === 'configuracao' && (
        <TelaConfiguracao 
          onGerar={handleGerar} 
          onAcessarAdmin={() => setTelaAtual('admin')} 
        />
      )}
      
      {telaAtual === 'simulado' && (
        <TelaSimulado 
          questoes={questoesAtuais}
          filtros={filtrosSimulado} 
          onVoltar={() => setTelaAtual('configuracao')} 
        />
      )}

      {telaAtual === 'admin' && (
        <>
          {!autenticado ? (
            <TelaLogin 
              onLoginSucesso={() => setAutenticado(true)} 
              onVoltar={() => setTelaAtual('configuracao')} 
            />
          ) : (
            <TelaAdmin 
              onVoltar={handleLogout} 
            />
          )}
        </>
      )}
    </>
  );
}