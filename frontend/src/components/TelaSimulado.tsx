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

// TEMA SEMÂNTICO DE CORES DO CÓDIGO
const temaDoTCC = JSON.parse(JSON.stringify(vscDarkPlus));

// TABELA DE CORES
const coresTCC: Record<string, string> = {
  'keyword': '#3695D7',      // Palavras-chave (function, let, return): Azul
  'builtin': '#3695D7',      // Tipos (number, string): Azul
  'number': '#82B384',       // Números (30, 40): Verde claro
  'string': '#939393',       // Textos ("valor da..."): Cinza escuro
  'comment': '#5EA63D',      // Comentários (//...): Verde escuro
  'punctuation': '#FFF500',  // Parênteses e chaves: Amarelo vibrante
  
  'function': '#ffffff',     // Nomes de função (multiplicar, log): Branco
  'class-name': '#ffffff',   // Classes Globais (console): Branco
  'variable': '#ffffff',     // Nomes de variáveis (resultado, x): Branco
  'parameter': '#ffffff',    // Parâmetros (a, b, c): Branco
  'property': '#ffffff',     // Propriedades: Branco
  'operator': '#ffffff'      // Operadores (=, *): Branco
};

// Aplica as cores e remove o itálico de tudo (menos dos comentários)
Object.keys(temaDoTCC).forEach((key) => {
  if (temaDoTCC[key].fontStyle === 'italic' && key !== 'comment') {
    temaDoTCC[key].fontStyle = 'normal';
  }
});

Object.keys(coresTCC).forEach(token => {
  if (temaDoTCC[token]) {
    temaDoTCC[token].color = coresTCC[token];
    if (token !== 'comment') temaDoTCC[token].fontStyle = 'normal'; 
  } else {
    temaDoTCC[token] = { color: coresTCC[token], fontStyle: token === 'comment' ? 'italic' : 'normal' };
  }
});


export function TelaSimulado({ questoes, onVoltar }: TelaSimuladoProps) {
  
  const handleImprimir = () => {
    window.print();
  };

  const topicosUnicos = Array.from(new Set(questoes.map(q => q.topico))).join(', ');

  const formatarEnunciado = (texto: string) => {
    if (!texto) return null;
    return texto.split('\n').map((linha, index) => {
      const ehPadraoCodigo = linha.trim().length > 0 && !/[a-z]/.test(linha) && /[X#\*\-\+\[\]\(\)\=]/.test(linha);
      
      return (
        <span key={index} style={{ 
          display: 'block', 
          fontFamily: ehPadraoCodigo ? "Consolas, 'Courier New', monospace" : 'inherit',
          letterSpacing: ehPadraoCodigo ? '2px' : 'normal', 
          color: ehPadraoCodigo ? '#111' : 'inherit',
          minHeight: '1.6em'
        }}>
          {linha}
        </span>
      );
    });
  };

  return (
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, minHeight: '100vh', backgroundColor: '#f4f6f8', fontFamily: 'system-ui, -apple-system, sans-serif', color: '#333' }}>
      
      <style>
        {`
          body, html {
            margin: 0 !important;
            padding: 0 !important;
            background-color: #f4f6f8;
          }
          * { box-sizing: border-box; }

          /* === ESTILO DAS DIFICULDADES === */
          .badge {
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 13px;
            font-weight: bold;
            display: inline-block;
            text-align: center;
          }
          .badge-facil { background-color: #e8f8f5; color: #2ecc71; }
          .badge-media { background-color: #fef5e7; color: #f39c12; }
          .badge-dificil { background-color: #fdedec; color: #e74c3c; }

          @media screen {
            .documento-pdf { display: none !important; }
            .tela-sistema { width: 100%; padding-bottom: 60px; }
          }

          @media print {
            .tela-sistema { display: none !important; }
            .documento-pdf { display: block !important; width: 100%; }
            * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
            @page { margin: 1.5cm; }
            body, html { background-color: white !important; }
            .questao-item { break-inside: avoid; margin-bottom: 30px; }
            pre { white-space: pre-wrap !important; word-wrap: break-word !important; }
          }
        `}
      </style>

      {/* TELA DO SISTEMA */}
      <div className="tela-sistema">
        <header style={{ backgroundColor: '#1a1d24', color: 'white', padding: '15px 5vw', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '50px', borderBottom: '1px solid #2a2d35' }}>
          
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <svg viewBox="0 0 2300 470" height="40" style={{ flexShrink: 0 }}>
              <g transform="translate(5, 5)">
                <circle cx="50" cy="50" r="55" fill="#c8191e" />
                <rect x="0" y="120" width="100" height="100" rx="10" fill="#2f9e41" />
                <rect x="0" y="240" width="100" height="100" rx="10" fill="#2f9e41" />
                <rect x="0" y="360" width="100" height="100" rx="10" fill="#2f9e41" />
                <rect x="120" y="0" width="100" height="100" rx="10" fill="#2f9e41" />
                <rect x="120" y="120" width="100" height="100" rx="10" fill="#2f9e41" />
                <rect x="120" y="240" width="100" height="100" rx="10" fill="#2f9e41" />
                <rect x="120" y="360" width="100" height="100" rx="10" fill="#2f9e41" />
                <rect x="240" y="0" width="100" height="100" rx="10" fill="#2f9e41" />
                <rect x="240" y="240" width="100" height="100" rx="10" fill="#2f9e41" />
              </g>
              <text x="390" y="340" fontFamily="Arial, sans-serif" fontWeight="bold" fontSize="140" fill="#ffffff" letterSpacing="2">INSTITUTO FEDERAL</text>
              <text x="390" y="460" fontFamily="Arial, sans-serif" fontWeight="normal" fontSize="105" fill="#ffffff">Pernambuco</text>
            </svg>
          </div>

          <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 500 }}>Simulado Personalizado</h2>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#a0aab5' }}>Questões: {questoes.length}</span>
            <button onClick={handleImprimir} style={{ backgroundColor: '#36a860', color: '#121418', border: 'none', padding: '8px 20px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontFamily: 'inherit' }}>
              IMPRIMIR PDF
            </button>
            <button onClick={onVoltar} style={{ backgroundColor: '#2c3e50', color: '#2ecc71', border: 'none', padding: '8px 20px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontFamily: 'inherit' }}>
              VOLTAR
            </button>
          </div>
        </header>

        <div style={{ maxWidth: '960px', margin: '0 auto', padding: '0 20px' }}>
          {questoes.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '50px', backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 6px 15px rgba(0,0,0,0.08)' }}>
              <h2>Nenhuma questão encontrada com esses filtros.</h2>
            </div>
          ) : (
            questoes.map((questao, index) => (
              <div key={questao.id} style={{ backgroundColor: '#ffffff', borderRadius: '12px', marginBottom: '35px', padding: '25px 30px', boxShadow: '0 6px 15px rgba(0,0,0,0.08)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee', paddingBottom: '15px', marginBottom: '20px' }}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '18px' }}>Questão {index + 1}</h3>
                    <span style={{ fontSize: '13px', color: '#7f8c8d', marginTop: '6px', display: 'inline-block', fontWeight: 500 }}>
                      Fonte: {questao.origem} ({questao.ano})
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <span style={{ backgroundColor: '#e2f6ff', color: '#0077b3', padding: '6px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: 'bold' }}>{questao.topico}</span>
                    <span className={`badge ${questao.nivel_dificuldade === 'Fácil' ? 'badge-facil' : questao.nivel_dificuldade === 'Média' ? 'badge-media' : 'badge-dificil'}`}>
                      {questao.nivel_dificuldade}
                    </span>
                  </div>
                </div>
                
                <div style={{ fontSize: '17px', lineHeight: '1.6', marginBottom: '25px' }}>
                  {formatarEnunciado(questao.enunciado)}
                </div>
                
                {questao.codigo_typescript && questao.codigo_typescript.trim() !== '' && (
                  <SyntaxHighlighter 
                    language="typescript" 
                    style={temaDoTCC} 
                    showLineNumbers={true} 
                    customStyle={{ 
                      borderRadius: '8px', 
                      padding: '20px', 
                      fontSize: '14px', 
                      fontFamily: "Consolas, 'Courier New', monospace", 
                      backgroundColor: '#1e1e1e', 
                      color: '#ffffff'
                    }}
                  >
                    {questao.codigo_typescript}
                  </SyntaxHighlighter>
                )}
                
                {questao.easter_egg_conteudo && (
                  <div style={{ backgroundColor: '#fdf8e4', border: '1px solid #faebcc', borderRadius: '8px', marginTop: '25px', padding: '15px', color: '#8a6d3b' }}>
                    <strong>💡 Curiosidade: </strong>
                    {questao.easter_egg_conteudo.split(/(https?:\/\/[^\s]+)/g).map((part, i) => 
                      part.match(/https?:\/\/[^\s]+/) ? (
                        <a 
                          key={i} 
                          href={part} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          style={{ color: '#8a6d3b', textDecoration: 'underline', fontWeight: 'bold' }}
                        >
                          {part}
                        </a>
                      ) : (
                        part
                      )
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* TELA DE IMPRESSÃO (PDF) */}
      <div className="documento-pdf">
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', paddingBottom: '15px', borderBottom: '2px solid #eaeaea' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '3px' }}>
              <div style={{ width: '14px', height: '14px', backgroundColor: '#e74c3c', borderRadius: '2px' }}></div>
              <div style={{ width: '14px', height: '14px', backgroundColor: '#2ecc71', borderRadius: '2px' }}></div>
              <div style={{ width: '14px', height: '14px', backgroundColor: '#2ecc71', borderRadius: '2px' }}></div>
              <div style={{ width: '14px', height: '14px', backgroundColor: '#2ecc71', borderRadius: '2px' }}></div>
            </div>
            <div>
              <h1 style={{ margin: 0, fontSize: '20px', fontWeight: '800', letterSpacing: '-0.5px', color: '#111' }}>INSTITUTO FEDERAL</h1>
              <p style={{ margin: 0, fontSize: '14px', color: '#555' }}>Pernambuco</p>
            </div>
          </div>
          <div style={{ textAlign: 'right', borderLeft: '3px solid #2ecc71', paddingLeft: '15px' }}>
            <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold', color: '#111' }}>Simulado Personalizado</h2>
            <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>Gerador de Provas</p>
          </div>
        </header>

        <div style={{ backgroundColor: '#f8f9fa', borderRadius: '8px', padding: '20px', marginBottom: '35px', display: 'flex', gap: '30px', border: '1px solid #e2e2e2' }}>
          <div style={{ flex: 1 }}>
            <p style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#444' }}><strong>Origem:</strong> Simulado Personalizado</p>
            <p style={{ margin: 0, fontSize: '14px', color: '#444' }}><strong>Aluno(a):</strong> _______________________________________________________</p>
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#444' }}><strong>Tópicos:</strong> {topicosUnicos}</p>
            <p style={{ margin: 0, fontSize: '14px', color: '#444' }}><strong>Quantidade de Questões:</strong> {questoes.length}</p>
          </div>
        </div>

        {questoes.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
            {questoes.map((questao, index) => (
              <div key={`print-${questao.id}`} className="questao-item">
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
                  <div style={{ backgroundColor: '#2ea73a', color: '#fff', width: '32px', height: '32px', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '16px' }}>
                    {index + 1}
                  </div>
                  <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold', color: '#111' }}>
                    Questão {index + 1} - {questao.topico}
                  </h3>
                </div>
                <div style={{ marginLeft: '44px', marginBottom: '15px' }}>
                  <span style={{ fontSize: '13px', color: '#666', fontWeight: 500 }}>
                    Fonte: {questao.origem} ({questao.ano})
                  </span>
                </div>
                <div style={{ fontSize: '16px', lineHeight: '1.6', margin: '0 0 20px 0', color: '#222' }}>
                  {formatarEnunciado(questao.enunciado)}
                </div>
                {questao.codigo_typescript && questao.codigo_typescript.trim() !== '' && (
                  <div style={{ marginBottom: '25px' }}>
                    <SyntaxHighlighter language="typescript" style={temaDoTCC} customStyle={{ borderRadius: '8px', padding: '15px', fontSize: '14px', fontFamily: "Consolas, 'Courier New', monospace", backgroundColor: '#1e1e1e', margin: 0 }}>
                      {questao.codigo_typescript}
                    </SyntaxHighlighter>
                  </div>
                )}
                <div style={{ marginTop: '15px' }}>
                  <p style={{ fontWeight: 'bold', fontSize: '15px', marginBottom: '10px', color: '#333' }}>Sua resposta:</p>
                  <div style={{ border: '2px solid #ccc', borderRadius: '8px', minHeight: '160px', backgroundColor: '#fafafa' }}></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}