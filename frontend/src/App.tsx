import { useEffect, useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import './App.css';

interface Questao {
  id: number;
  topico: string;
  enunciado: string;
  codigo_typescript: string;
  nivel_dificuldade: string;
  easter_egg_conteudo: string | null;
}

// TELA 2: simulado 
function TelaSimulado({ questoes, onVoltar }: { questoes: Questao[], onVoltar: () => void }) {
  return (
    <div style={{ backgroundColor: '#f4f6f8', minHeight: '100vh', paddingBottom: '60px', color: '#333' }}>
      <header style={{ backgroundColor: '#1a1b26', color: 'white', padding: '15px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '50px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{ width: '32px', height: '32px', backgroundColor: '#2ecc71', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '20px' }}>I</div>
          <span style={{ fontSize: '14px', fontWeight: 600, letterSpacing: '1.5px', textTransform: 'uppercase' }}>Instituto Federal</span>
        </div>
        <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 500 }}>Simulado Personalizado: Lógica de Programação</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <span style={{ fontSize: '14px' }}>Questões: {questoes.length}</span>
          <button onClick={onVoltar} style={{ backgroundColor: '#2c3e50', color: '#2ecc71', border: 'none', padding: '8px 20px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
            VOLTAR
          </button>
        </div>
      </header>

      <div style={{ maxWidth: '960px', margin: '0 auto', padding: '0 20px' }}>
        {questoes.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '50px', backgroundColor: '#fff', borderRadius: '12px' }}>
            <h2>Nenhuma questão encontrada com esses filtros. 😢</h2>
            <p>Tente selecionar outros tópicos ou dificuldades.</p>
          </div>
        ) : (
          questoes.map((questao, index) => (
            <div key={questao.id} style={{ backgroundColor: '#ffffff', borderRadius: '12px', marginBottom: '35px', padding: '25px 30px', boxShadow: '0 6px 15px rgba(0,0,0,0.08)' }}>
              
              {/* CABEÇALHO DA QUESTÃO COM AS TAGS */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee', paddingBottom: '15px', marginBottom: '20px' }}>
                <h3 style={{ margin: 0, fontSize: '18px', color: '#333' }}>Questão {index + 1}</h3>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <span style={{ backgroundColor: '#e2f6ff', color: '#0077b3', padding: '6px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: 'bold' }}>
                    {questao.topico}
                  </span>
                  <span style={{ backgroundColor: '#fff3e0', color: '#e65100', padding: '6px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: 'bold' }}>
                    {questao.nivel_dificuldade || 'Média'}
                  </span>
                </div>
              </div>

              <p style={{ fontSize: '17px', lineHeight: '1.6', marginBottom: '25px', marginTop: 0 }}>{questao.enunciado}</p>
              
              <div style={{ border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden' }}>
                <div style={{ backgroundColor: '#eaeaea', padding: '10px 15px', fontWeight: 'bold', fontSize: '14px' }}>Bloco de Código (TypeScript)</div>
                <SyntaxHighlighter language="typescript" style={vscDarkPlus} showLineNumbers={true} customStyle={{ margin: 0, padding: '20px', fontSize: '14px' }}>
                  {questao.codigo_typescript}
                </SyntaxHighlighter>
              </div>
              
              {questao.easter_egg_conteudo && (
                <div style={{ backgroundColor: '#fdf8e4', border: '1px solid #faebcc', borderRadius: '8px', marginTop: '25px', padding: '15px', color: '#66512c' }}>
                  <strong>💡 Ver curiosidade:</strong> {questao.easter_egg_conteudo}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// TELA 1: CONFIGURAÇÃO DO SIMULADO
function TelaConfiguracao({ onGerar }: { onGerar: (filtros: any) => void }) {
  const [quantidade, setQuantidade] = useState(5);
  const [topicosSelecionados, setTopicosSelecionados] = useState<string[]>([]);
  const [dificuldade, setDificuldade] = useState<string>('');

  const listaTopicos = ['Operadores Lógicos', 'Execução Condicional', 'Laços', 'Subprogramas', 'Tipos e Variáveis', 'Arrays'];

  const handleTopicoToggle = (topico: string) => {
    if (topicosSelecionados.includes(topico)) {
      setTopicosSelecionados(topicosSelecionados.filter(t => t !== topico));
    } else {
      setTopicosSelecionados([...topicosSelecionados, topico]);
    }
  };

  return (
    <div style={{ backgroundColor: '#121418', minHeight: '100vh', color: '#e0e0e0', display: 'flex', flexDirection: 'column' }}>
      <header style={{ backgroundColor: '#1a1d24', padding: '20px 50px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #2a2d35' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{ width: '32px', height: '32px', backgroundColor: '#2ecc71', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#121418', fontWeight: 'bold' }}>IF</div>
          <span style={{ fontWeight: 'bold', fontSize: '16px', letterSpacing: '1px' }}>INSTITUTO FEDERAL<br/><span style={{fontSize: '11px', fontWeight: 'normal'}}>Pernambuco</span></span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '18px', fontWeight: 'bold' }}>Gerador de Provas</div>
        <div style={{ width: '30px', height: '30px', borderRadius: '50%', backgroundColor: '#333', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold', cursor: 'pointer' }}>?</div>
      </header>

      <div style={{ display: 'flex', flex: 1, padding: '60px 80px', gap: '60px', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ flex: 1, maxWidth: '500px' }}>
          <h1 style={{ fontSize: '36px', color: '#fff', marginBottom: '20px' }}>SEJA BEM-VINDO!</h1>
          <p style={{ fontSize: '18px', color: '#a0aab5', lineHeight: '1.6' }}>
            Selecione os tópicos desejados e gere simulados personalizados de Lógica de Programação baseados em provas reais.
          </p>
        </div>

        <div style={{ backgroundColor: '#1a1d24', padding: '40px', borderRadius: '12px', width: '450px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
          <h2 style={{ color: '#fff', marginTop: 0, marginBottom: '30px', fontSize: '24px' }}>Configure o seu simulado</h2>
          
          <div style={{ marginBottom: '25px' }}>
            <label style={{ display: 'block', marginBottom: '15px', color: '#a0aab5' }}>Seleção de Tópicos</label>
            <div style={{ border: '1px solid #2a2d35', borderRadius: '8px', padding: '15px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {listaTopicos.map(topico => (
                <label key={topico} style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                  <input 
                    type="checkbox" 
                    checked={topicosSelecionados.includes(topico)}
                    onChange={() => handleTopicoToggle(topico)}
                    style={{ width: '18px', height: '18px', accentColor: '#2ecc71' }} 
                  />
                  {topico}
                </label>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: '25px' }}>
            <label style={{ display: 'block', marginBottom: '10px', color: '#a0aab5' }}>Quantidade de Questões</label>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#121418', padding: '10px 20px', borderRadius: '8px' }}>
              <button onClick={() => setQuantidade(q => Math.max(1, q - 1))} style={{ background: 'none', border: 'none', color: '#fff', fontSize: '20px', cursor: 'pointer', padding: '0 10px' }}>-</button>
              <span style={{ fontSize: '18px', fontWeight: 'bold' }}>{quantidade}</span>
              <button onClick={() => setQuantidade(q => q + 1)} style={{ background: 'none', border: 'none', color: '#fff', fontSize: '20px', cursor: 'pointer', padding: '0 10px' }}>+</button>
            </div>
          </div>

          <div style={{ marginBottom: '40px' }}>
            <label style={{ display: 'block', marginBottom: '15px', color: '#a0aab5' }}>Dificuldade</label>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              {['Fácil', 'Média', 'Difícil'].map(nivel => (
                <label key={nivel} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input 
                    type="radio" 
                    name="dificuldade" 
                    value={nivel}
                    checked={dificuldade === nivel}
                    onChange={(e) => setDificuldade(e.target.value)}
                    style={{ accentColor: '#2ecc71' }} 
                  /> {nivel}
                </label>
              ))}
            </div>
          </div>

          <button 
            onClick={() => onGerar({ topicosSelecionados, quantidade, dificuldade })}
            style={{ width: '100%', backgroundColor: '#2ecc71', color: '#121418', border: 'none', padding: '15px', borderRadius: '8px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer', transition: '0.2s' }}
          >
            Gerar Simulado
          </button>
        </div>
      </div>
      <footer style={{ textAlign: 'center', padding: '20px', color: '#555', fontSize: '12px', borderTop: '1px solid #2a2d35' }}>
        Instituto Federal de Educação, Ciência e Tecnologia - Campus Igarassu | Izes Stella Barbalho Bezerra
      </footer>
    </div>
  );
}

function App() {
  const [telaAtual, setTelaAtual] = useState<'config' | 'simulado'>('config');
  const [bancoDeQuestoes, setBancoDeQuestoes] = useState<Questao[]>([]);
  const [questoesDaProva, setQuestoesDaProva] = useState<Questao[]>([]);

  useEffect(() => {
    fetch('http://localhost:3000/api/questoes')
      .then((res) => res.json())
      .then((dados) => setBancoDeQuestoes(dados))
      .catch((erro) => console.error(erro));
  }, []);

  const gerarProva = (filtros: any) => {
    let filtradas = [...bancoDeQuestoes];

    if (filtros.topicosSelecionados.length > 0) {
      filtradas = filtradas.filter(q => filtros.topicosSelecionados.includes(q.topico));
    }

    if (filtros.dificuldade) {
      filtradas = filtradas.filter(q => q.nivel_dificuldade === filtros.dificuldade);
    }

    filtradas.sort(() => Math.random() - 0.5);
    filtradas = filtradas.slice(0, filtros.quantidade);

    setQuestoesDaProva(filtradas);
    setTelaAtual('simulado');
  };

  return (
    <div style={{ fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif" }}>
      {telaAtual === 'config' ? (
        <TelaConfiguracao onGerar={gerarProva} />
      ) : (
        <TelaSimulado questoes={questoesDaProva} onVoltar={() => setTelaAtual('config')} />
      )}
    </div>
  );
}

export default App;