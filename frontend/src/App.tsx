import { useEffect, useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import './App.css';

// Definindo o formato da questão para ajudar o TypeScript
interface Questao {
  id: number;
  topico: string;
  enunciado: string;
  codigo_typescript: string;
  nivel_dificuldade: string;
}

function App() {
  const [questoes, setQuestoes] = useState<Questao[]>([]);

  useEffect(() => {
    fetch('http://localhost:3000/api/questoes')
      .then((resposta) => resposta.json())
      .then((dados) => setQuestoes(dados))
      .catch((erro) => console.error("Erro ao buscar dados:", erro));
  }, []);

  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', color: '#2c3e50' }}>Gerador de Provas do IFPE</h1>
      <p style={{ textAlign: 'center', color: '#7f8c8d' }}>Questões no banco: <strong>{questoes.length}</strong></p>
      
      <hr style={{ marginBottom: '30px' }} />

      {}
      {questoes.map((questao) => (
        <div key={questao.id} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '20px', marginBottom: '20px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
          
          {/* Cabeçalho do Card (Tópico e Dificuldade) */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
            <span style={{ backgroundColor: '#e1f5fe', color: '#0288d1', padding: '4px 10px', borderRadius: '4px', fontSize: '14px', fontWeight: 'bold' }}>
              {questao.topico}
            </span>
            <span style={{ backgroundColor: '#fff3e0', color: '#e65100', padding: '4px 10px', borderRadius: '4px', fontSize: '14px', fontWeight: 'bold' }}>
              {questao.nivel_dificuldade}
            </span>
          </div>
          
          {/* Enunciado */}
          <h3 style={{ marginTop: '0', color: '#333', fontSize: '18px' }}>{questao.enunciado}</h3>
          
          {/* Syntax Highlighting (tipo VSCode) */}
          <SyntaxHighlighter 
            language="typescript" 
            style={vscDarkPlus} 
            showLineNumbers={true} 
            customStyle={{ borderRadius: '6px', fontSize: '15px' }}
          >
            {questao.codigo_typescript}
          </SyntaxHighlighter>

        </div>
      ))}
    </div>
  );
}

export default App;