import { useState } from 'react';
import { TelaConfiguracao } from './components/TelaConfiguracao';
import { TelaSimulado } from './components/TelaSimulado';
import { TelaAdmin } from './components/TelaAdmin';
import './App.css';

export default function App() {
  const [telaAtual, setTelaAtual] = useState<'configuracao' | 'simulado' | 'admin'>('configuracao');
  const [filtrosSimulado, setFiltrosSimulado] = useState<any>(null);
  
  // estado vazio para guardar as questões 
  const [questoesAtuais, setQuestoesAtuais] = useState<any[]>([]);

  const handleGerar = (filtros: any) => {
    setFiltrosSimulado(filtros);
    setQuestoesAtuais([]); 
    setTelaAtual('simulado');
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
        <TelaAdmin 
          onVoltar={() => setTelaAtual('configuracao')} 
        />
      )}
    </>
  );
}