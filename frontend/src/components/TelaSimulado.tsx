import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface Questao {
  id: number;
  topico: string;
  enunciado: string;
  codigo_typescript: string;
  nivel_dificuldade: string;
  easter_egg_conteudo: string | null;
  origem: string;
  ano: string | number;
}

interface TelaSimuladoProps {
  questoes: Questao[];
  onVoltar: () => void;
  filtros: any;
}

export function TelaSimulado({ questoes, onVoltar }: TelaSimuladoProps) {
  
  // chamar a tela de impressão/salvar PDF
  const handleImprimir = () => {
    window.print();
  };

  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', backgroundColor: '#f4f6f8', minHeight: '100vh', paddingBottom: '60px', color: '#333' }}>
      
      {/* Estilo apenas p/ hora da impressão */}
      <style>
        {`
          @media print {
            .no-print {
              display: none !important;
            }
            body {
              background-color: white !important;
            }
            .questao-card {
              box-shadow: none !important;
              border: 1px solid #ccc !important;
              break-inside: avoid;
            }
          }
        `}
      </style>

      <header style={{ backgroundColor: '#1a1b26', color: 'white', padding: '15px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '50px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{ width: '32px', height: '32px', backgroundColor: '#2ecc71', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '20px', color: '#1a1b26' }}>IF</div>
          <span style={{ fontSize: '14px', fontWeight: 600, letterSpacing: '1.5px', textTransform: 'uppercase' }}>Instituto Federal</span>
        </div>
        <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 500 }}>Simulado Personalizado: Lógica de Programação</h2>
        
            <div className="no-print" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <span style={{ fontSize: '14px' }}>Questões: {questoes.length}</span>
          
          <button onClick={handleImprimir} style={{ backgroundColor: '#2ecc71', color: '#1a1b26', border: 'none', padding: '8px 20px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontFamily: 'inherit' }}>
            IMPRIMIR PDF
          </button>
          
          <button onClick={onVoltar} style={{ backgroundColor: '#2c3e50', color: '#2ecc71', border: 'none', padding: '8px 20px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontFamily: 'inherit' }}>
            VOLTAR
          </button>
        </div>
      </header>

      <div style={{ maxWidth: '960px', margin: '0 auto', padding: '0 20px' }}>
        {questoes.length === 0 ? (
          <div className="no-print" style={{ textAlign: 'center', padding: '50px', backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 6px 15px rgba(0,0,0,0.08)' }}>
            <h2>Nenhuma questão encontrada com esses filtros.</h2>
            <p style={{ color: '#7f8c8d' }}>Tente selecionar outros tópicos ou dificuldades.</p>
          </div>
        ) : (
          questoes.map((questao, index) => (
            <div key={questao.id} className="questao-card" style={{ backgroundColor: '#ffffff', borderRadius: '12px', marginBottom: '35px', padding: '25px 30px', boxShadow: '0 6px 15px rgba(0,0,0,0.08)' }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee', paddingBottom: '15px', marginBottom: '20px' }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '18px' }}>Questão {index + 1}</h3>
                  <span style={{ fontSize: '13px', color: '#7f8c8d', marginTop: '6px', display: 'inline-block', fontWeight: 500 }}>
                    Fonte: {questao.origem} ({questao.ano})
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <span style={{ backgroundColor: '#e2f6ff', color: '#0077b3', padding: '6px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: 'bold' }}>{questao.topico}</span>
                  <span style={{ backgroundColor: '#fff3e0', color: '#e65100', padding: '6px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: 'bold' }}>{questao.nivel_dificuldade}</span>
                </div>
              </div>
              
              <p style={{ fontSize: '17px', lineHeight: '1.6', marginBottom: '25px' }}>{questao.enunciado}</p>
              
              {/* Só exibe o bloco de código se realmente existir código cadastrado */}
              {questao.codigo_typescript && questao.codigo_typescript.trim() !== '' && (
                <SyntaxHighlighter language="typescript" style={vscDarkPlus} showLineNumbers={true} customStyle={{ borderRadius: '8px', padding: '20px', fontSize: '14px', fontFamily: 'monospace' }}>
                  {questao.codigo_typescript}
                </SyntaxHighlighter>
              )}
              
              {questao.easter_egg_conteudo && (
                <div style={{ backgroundColor: '#fdf8e4', border: '1px solid #faebcc', borderRadius: '8px', marginTop: '25px', padding: '15px', color: '#8a6d3b' }}>
                  <strong>Curiosidade:</strong> {questao.easter_egg_conteudo}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}