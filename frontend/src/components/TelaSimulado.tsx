import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface Questao {
  id: number;
  topico: string;
  enunciado: string;
  codigo_typescript: string;
  nivel_dificuldade: string;
  tipo_questao?: string;
  tabela_enunciado: string[][] | null;
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
  'keyword': '#3695D7', 
  'builtin': '#3695D7', 
  'number': '#82B384',
  'string': '#939393',
  'comment': '#5EA63D', 
  'punctuation': '#FFF500', 
  'function': '#ffffff',
  'class-name': '#ffffff',
  'variable': '#ffffff', 
  'parameter': '#ffffff', 
  'property': '#ffffff', 
  'operator': '#ffffff'
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
    temaDoTCC[token] = { 
      color: coresTCC[token], 
      fontStyle: token === 'comment' ? 'italic' : 'normal' 
    };
  }
});

// COMPONENTE PARA RENDERIZAR A TABELA DO ENUNCIADO
const TabelaEnunciado = ({ tabelaData }: { tabelaData: string[][] | null }) => {
  if (!tabelaData || !Array.isArray(tabelaData) || tabelaData.length === 0) return null;

  const cabecalhos = tabelaData[0];
  const linhas = tabelaData.slice(1);

  return (
    <div style={{ overflowX: 'auto', margin: '20px 0' }} className="bloco-inquebravel">
      <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'sans-serif', border: '1px solid #ddd', fontSize: '14px' }}>
        <thead>
          <tr style={{ backgroundColor: '#f2f2f2' }}>
            {cabecalhos.map((cabecalho, index) => (
              <th key={index} style={{ padding: '10px 12px', border: '1px solid #ddd', textAlign: 'left', color: '#333' }}>
                {cabecalho}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {linhas.map((linha, rowIndex) => (
            <tr key={rowIndex} style={{ borderBottom: '1px solid #ddd' }}>
              {linha.map((celula, cellIndex) => (
                <td key={cellIndex} style={{ padding: '10px 12px', border: '1px solid #ddd', color: '#444' }}>
                  {celula}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export function TelaSimulado({ questoes, onVoltar, filtros }: TelaSimuladoProps) {

  // LÓGICA DO AVISO INTELIGENTE: Verifica se falta alguma dificuldade pedida
  const quantidadeSolicitada = Number(filtros?.quantidade) || 0;
  const dificuldadesSolicitadas = filtros?.dificuldades || [];
  const dificuldadesPresentes = new Set(questoes.map(q => q.nivel_dificuldade));
  const faltantes = dificuldadesSolicitadas.filter((d: string) => !dificuldadesPresentes.has(d));

  // SÓ MOSTRA O AVISO se houver questões na prova E faltou dificuldade, 
  // E a quantidade de questões pedida era suficiente para abranger todas as dificuldades!
  const deveMostrarAvisoFaltantes = questoes.length > 0 && faltantes.length > 0 && quantidadeSolicitada >= dificuldadesSolicitadas.length;

  const handleImprimir = () => {
    window.print();
  };

  const topicosUnicos = Array.from(new Set(questoes.map(q => q.topico))).join(', ');

  const formatarEnunciado = (texto: string) => {
    if (!texto) return null;
    return texto.split('\n').map((linha, index) => {
      const ehPadraoCodigo = linha.trim().length > 0 && !/[a-z]/.test(linha) && /[X#\*\-\+\[\]\(\)\=]/.test(linha);
      
      return (
        <span 
          key={index} 
          style={{ 
            display: 'block', 
            fontFamily: ehPadraoCodigo ? "Consolas, 'Courier New', monospace" : 'inherit',
            letterSpacing: ehPadraoCodigo ? '2px' : 'normal',
            color: ehPadraoCodigo ? '#111' : 'inherit',
            minHeight: '1.6em'
          }}
        >
          {linha}
        </span>
      );
    });
  };

  return (
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, minHeight: '100vh', backgroundColor: '#f4f6f8', fontFamily: 'system-ui, -apple-system, sans-serif', color: '#333' }}>
      <style>
        {`
          body, html { margin: 0 !important; padding: 0 !important; background-color: #f4f6f8; }
          * { box-sizing: border-box; }
          
          /* ESTILO DAS DIFICULDADES */
          .badge { padding: 6px 12px; border-radius: 20px; font-size: 13px; font-weight: bold; display: inline-block; text-align: center; }
          .badge-facil { background-color: #e8f8f5; color: #2ecc71; }
          .badge-media { background-color: #fef5e7; color: #f39c12; }
          .badge-dificil { background-color: #fdedec; color: #e74c3c; }

          @media screen {
            .documento-pdf { display: none !important; }
            .tela-sistema { width: 100%; padding-bottom: 60px; }
          }

          /* REGRAS ESPECÍFICAS PARA O PDF */
          @media print {
            .tela-sistema { display: none !important; }
            .documento-pdf { display: block !important; width: 100%; font-family: Arial, sans-serif; background-color: white !important; }
            * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
            @page { margin: 1.5cm; size: A4 portrait; }
            body, html { background-color: white !important; }
            
            .questao-item { break-inside: auto; page-break-inside: auto; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 1px dashed #ccc; }
            .questao-item:last-child { border-bottom: none; }
            .bloco-inquebravel { break-inside: avoid !important; page-break-inside: avoid !important; }
            pre { white-space: pre-wrap !important; word-wrap: break-word !important; break-inside: avoid !important; page-break-inside: avoid !important; }
            .caixa-resposta { break-inside: avoid !important; page-break-inside: avoid !important; }
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

          {/* AVISO: Mostra se alguma dificuldade pedida não foi encontrada */}
          {deveMostrarAvisoFaltantes && (
            <div style={{ backgroundColor: '#fff8e1', borderLeft: '5px solid #ffc107', padding: '16px 20px', borderRadius: '6px', marginBottom: '30px', color: '#856404', fontSize: '15px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '22px' }}>⚠️</span>
              <div>
                <strong>Aviso:</strong> Não encontramos questões de nível <strong>{faltantes.join(', ')}</strong> para os tópicos selecionados. <br/>
                Exibindo apenas as dificuldades disponíveis para garantir seu estudo.
              </div>
            </div>
          )}

          {/* AVISO ABSOLUTO: Se nenhuma questão passar no filtro estrito */}
          {questoes.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '50px 30px', backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #eaeaea', boxShadow: '0 10px 30px rgba(0,0,0,0.04)' }}>
              
              <h2 style={{ color: '#1a1d24', marginTop: 0, fontSize: '24px', fontWeight: '800' }}>
                Nenhuma questão foi encontrada.
              </h2>
              
              <p style={{ fontSize: '15px', color: '#6a737d', maxWidth: '520px', margin: '0 auto 30px', lineHeight: '1.6' }}>
                Não temos questões cadastradas que combinem exatamente com os <strong>tópicos</strong> e a <strong>dificuldade</strong> selecionados. <br/><br/>
                
                <span style={{ backgroundColor: '#fef5e7', color: '#b9770e', padding: '10px 15px', borderRadius: '8px', display: 'inline-block', fontSize: '14px', border: '1px solid #fdebd0' }}>
                  <strong>💡 Dica:</strong> Assuntos introdutórios (como Operadores, Tipos e Variáveis) geralmente possuem apenas questões de nível Fácil ou Média. Ajuste os filtros e tente novamente!
                </span>
              </p>
              
              <button onClick={onVoltar} style={{ backgroundColor: '#36a860', color: '#fff', border: 'none', padding: '14px 32px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px', letterSpacing: '0.5px', transition: 'all 0.2s', boxShadow: '0 4px 12px rgba(54, 168, 96, 0.25)' }}>
                VOLTAR PARA CONFIGURAÇÕES
              </button>
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
                  <TabelaEnunciado tabelaData={questao.tabela_enunciado} />
                </div>

                {questao.codigo_typescript && questao.codigo_typescript.trim() !== '' && (
                  <SyntaxHighlighter 
                    language="typescript" 
                    style={temaDoTCC} 
                    showLineNumbers={true}
                    customStyle={{ borderRadius: '8px', padding: '20px', fontSize: '14px', fontFamily: "Consolas, 'Courier New', monospace", backgroundColor: '#1e1e1e', color: '#ffffff' }}
                  >
                    {questao.codigo_typescript}
                  </SyntaxHighlighter>
                )}

                {questao.easter_egg_conteudo && (
                  <div style={{ backgroundColor: '#fdf8e4', border: '1px solid #faebcc', borderRadius: '8px', marginTop: '25px', padding: '15px', color: '#8a6d3b' }}>
                    <strong>💡 Easter egg: </strong>
                    {questao.easter_egg_conteudo.split(/(https?:\/\/[^\s]+)/g).map((part, i) => 
                      part.match(/https?:\/\/[^\s]+/) ? (
                        <a key={i} href={part} target="_blank" rel="noopener noreferrer" style={{ color: '#8a6d3b', textDecoration: 'underline', fontWeight: 'bold' }}>
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
        
        <header style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '20px', paddingBottom: '15px', borderBottom: '2px solid #eaeaea' }}>
          <svg viewBox="0 0 350 470" height="45" style={{ flexShrink: 0 }}>
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
          </svg>
          <div style={{ borderLeft: '3px solid #2ecc71', paddingLeft: '15px' }}>
            <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 'bold', color: '#111' }}>Simulado Personalizado</h2>
            <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>Gerador de Provas</p>
          </div>
        </header>

        <div style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '15px', marginBottom: '30px', backgroundColor: 'transparent' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ fontSize: '15px', color: '#111' }}>
              <strong>Aluno(a):</strong> __________________________________________________________________
            </div>
            <div style={{ fontSize: '15px', color: '#111' }}>
              <strong>Tópicos:</strong> {topicosUnicos}
            </div>
          </div>
        </div>

        {questoes.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {questoes.map((questao, index) => (
              <div key={`print-${questao.id}`} className="questao-item">
                
                <div className="bloco-inquebravel">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
                    <div style={{ backgroundColor: '#2ea73a', color: '#fff', width: '28px', height: '28px', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '14px' }}>
                      {index + 1}
                    </div>
                    <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 'bold', color: '#111' }}>
                      Questão {index + 1} - {questao.topico}
                    </h3>
                  </div>
                  
                  <div style={{ marginLeft: '40px', marginBottom: '10px' }}>
                    <span style={{ fontSize: '12px', color: '#666', fontWeight: 500 }}>
                      Fonte: {questao.origem} ({questao.ano})
                    </span>
                  </div>

                  <div style={{ fontSize: '15px', lineHeight: '1.5', margin: '0 0 15px 0', color: '#222' }}>
                    {formatarEnunciado(questao.enunciado)}
                    <TabelaEnunciado tabelaData={questao.tabela_enunciado} />
                  </div>
                </div>

                {questao.codigo_typescript && questao.codigo_typescript.trim() !== '' && (
                  <div style={{ marginBottom: '15px' }}>
                    <SyntaxHighlighter 
                      language="typescript" 
                      style={temaDoTCC} 
                      customStyle={{ borderRadius: '6px', padding: '12px', fontSize: '13px', fontFamily: "Consolas, 'Courier New', monospace", backgroundColor: '#1e1e1e', margin: 0 }}
                    >
                      {questao.codigo_typescript}
                    </SyntaxHighlighter>
                  </div>
                )}

                <div className="caixa-resposta" style={{ marginTop: '15px' }}>
                  <p style={{ fontWeight: 'bold', fontSize: '14px', marginBottom: '8px', color: '#333' }}>Sua resposta:</p>
                  <div style={{ border: '1px solid #aaa', borderRadius: '6px', minHeight: '220px', backgroundColor: '#fff' }}></div>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}