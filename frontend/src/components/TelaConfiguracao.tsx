import { useState, useEffect, useRef } from 'react';
import ilustracaoCodigo from '../assets/imagemtelaconf.png';

interface TelaConfiguracaoProps {
  onGerar: (filtros: any) => void;
  onAcessarAdmin: () => void;
}

const TOPICOS_PADRAO = [
  'Operadores, Tipos e Variáveis',
  'Execução Condicional',
  'Operadores Lógicos',
  'Laços',
  'Subprogramas',
  'Vetores',
  'Arrays',
  'Tipos'
];

const TOPICOS_MINIPROVA = [
  'Operadores, Tipos e Variáveis',
  'Execução Condicional',
  'Operadores Lógicos',
  'Laços - Parte 1',
  'Laços - Parte 2',
  'Subprogramas',
  'Vetores',
  'Arrays',
  'Tipos'
];

type ModoProva = 'livre' | 'unidade1' | 'unidade2' | 'miniprova' | 'final';

export function TelaConfiguracao({ onGerar, onAcessarAdmin }: TelaConfiguracaoProps) {
  const [modoAtivo, setModoAtivo] = useState<ModoProva>('livre');
  const [topicosSelecionados, setTopicosSelecionados] = useState<string[]>([]);
  const [quantidade, setQuantidade] = useState(5);
  const [dificuldadesSelecionadas, setDificuldadesSelecionadas] = useState<string[]>(['Fácil', 'Média', 'Difícil']);
  const [erro, setErro] = useState<string | null>(null);

  const estadoLivreRef = useRef({
    topicos: [] as string[],
    quantidade: 5,
    dificuldades: ['Fácil', 'Média', 'Difícil']
  });

  const topicosAtuais = modoAtivo === 'miniprova' ? TOPICOS_MINIPROVA : TOPICOS_PADRAO;

  useEffect(() => {
    switch (modoAtivo) {
      case 'miniprova':
        setQuantidade(2);
        setDificuldadesSelecionadas([]); 
        setTopicosSelecionados([]); 
        break;
      case 'unidade1':
        setQuantidade(5);
        setDificuldadesSelecionadas(['Fácil', 'Média', 'Difícil']);
        setTopicosSelecionados([
          'Operadores, Tipos e Variáveis', 
          'Operadores Lógicos', 
          'Execução Condicional', 
          'Laços', 
          'Subprogramas'
        ]);
        break;
      case 'unidade2':
        setQuantidade(5);
        setDificuldadesSelecionadas(['Fácil', 'Média', 'Difícil']);
        setTopicosSelecionados(['Vetores', 'Arrays', 'Tipos']);
        break;
      case 'final':
        setQuantidade(5);
        setDificuldadesSelecionadas(['Fácil', 'Média', 'Difícil']);
        setTopicosSelecionados(['Vetores', 'Arrays', 'Tipos']); 
        break;
      case 'livre':
        setQuantidade(estadoLivreRef.current.quantidade);
        setDificuldadesSelecionadas(estadoLivreRef.current.dificuldades);
        setTopicosSelecionados(estadoLivreRef.current.topicos);
        break;
    }
    setErro(null);
  }, [modoAtivo]);

  const isQtdLocked = modoAtivo !== 'livre'; 
  const isDifLocked = modoAtivo === 'unidade1' || modoAtivo === 'unidade2' || modoAtivo === 'final'; 
  const isTopicosLocked = modoAtivo === 'unidade1' || modoAtivo === 'unidade2' || modoAtivo === 'final'; 

  const handleToggleTopico = (topico: string) => {
    if (isTopicosLocked) return; 
    
    setTopicosSelecionados(prev => {
      if (modoAtivo === 'miniprova') {
        return prev.includes(topico) ? [] : [topico];
      }
      const novosTopicos = prev.includes(topico) ? prev.filter(t => t !== topico) : [...prev, topico];
      if (modoAtivo === 'livre') estadoLivreRef.current.topicos = novosTopicos;
      return novosTopicos;
    });
    setErro(null);
  };

  const handleToggleDificuldade = (nivel: string) => {
    if (isDifLocked || modoAtivo === 'miniprova') return; 

    setDificuldadesSelecionadas(prev => {
      const novasDificuldades = prev.includes(nivel) ? prev.filter(d => d !== nivel) : [...prev, nivel];
      if (modoAtivo === 'livre') estadoLivreRef.current.dificuldades = novasDificuldades;
      return novasDificuldades;
    });
    setErro(null);
  };

  const handleQuantidadeChange = (delta: number) => {
    if (isQtdLocked) return;
    
    const novaQtd = Math.max(1, quantidade + delta);
    setQuantidade(novaQtd);
    if (modoAtivo === 'livre') estadoLivreRef.current.quantidade = novaQtd;
  };

  const handleGerar = () => {
    if (topicosSelecionados.length === 0) {
      setErro('Selecione pelo menos um tópico!');
      return;
    }
    if (modoAtivo !== 'miniprova' && dificuldadesSelecionadas.length === 0) {
      setErro('Selecione pelo menos um nível de dificuldade!');
      return;
    }
    setErro(null);
    onGerar({
      modo: modoAtivo,
      topicos: topicosSelecionados,
      quantidade,
      dificuldades: dificuldadesSelecionadas 
    });
  };

  const LockIcon = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: '-1px' }}>
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
    </svg>
  );

  return (
    <>
      <style>{`
        body, html { margin: 0; padding: 0; width: 100%; overflow-x: hidden; background-color: #121418; }
        * { box-sizing: border-box; }
        
        .checkbox-redondo {
          appearance: none; -webkit-appearance: none; width: 16px; height: 16px; border: 1px solid #6a737d;
          border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center;
          background-color: transparent; margin: 0; transition: all 0.2s ease-in-out;
        }
        .checkbox-redondo:checked { background-color: #2ecc71; border-color: #2ecc71; }
        .checkbox-redondo:checked::after {
          content: ''; width: 4px; height: 8px; border: solid #121418; border-width: 0 2px 2px 0;
          transform: rotate(45deg); margin-bottom: 2px;
        }
        .checkbox-redondo:disabled { cursor: not-allowed; opacity: 0.5; }

        .main-container {
          flex: 1; display: flex; flex-direction: row; flex-wrap: nowrap; padding: 30px 5vw;
          align-items: center; justify-content: center; gap: 50px; max-width: 1100px; margin: 0 auto; width: 100%;
        }

        .coluna-esquerda { flex: 1 1 350px; max-width: 450px; display: flex; flex-direction: column; gap: 15px; }
        .coluna-direita { flex: 1 1 320px; max-width: 380px; background-color: #1a1d24; padding: 25px; border-radius: 12px; box-shadow: 0 10px 40px rgba(0,0,0,0.3); width: 100%; }

        .titulo-principal { font-size: 28px; margin-bottom: 5px; color: #fff; }
        .texto-principal { font-size: 15px; color: #a0aab5; line-height: 1.5; margin: 0; }

        .tabs-container { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 20px; border-bottom: 1px solid #2a2d35; padding-bottom: 15px; }
        .tab-btn { background-color: transparent; color: #a0aab5; border: 1px solid #3a3d45; padding: 6px 10px; border-radius: 6px; font-size: 12px; cursor: pointer; transition: 0.2s; font-weight: 500; }
        .tab-btn:hover { background-color: #2a2d35; color: #fff; }
        .tab-btn.ativo { background-color: #36a860; color: #121418; border-color: #36a860; font-weight: bold; }
        
        .input-locked { opacity: 0.6; }

        /* Estilo para a badge de bloqueio */
        .badge-locked {
          color: #e74c3c;
          font-size: 11px;
          font-weight: bold;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        @media (max-width: 960px) {
          .header-config { flex-direction: row !important; flex-wrap: wrap; padding: 15px 20px !important; }
          .header-config > div { flex: unset !important; }
          .header-config > div:nth-child(1) { width: 50%; justify-content: flex-start !important; }
          .header-botoes { width: 50%; justify-content: flex-end !important; }
          .header-config > div:nth-child(2) { width: 100%; justify-content: center !important; margin-top: 15px; order: 3; }
          .header-config svg { height: 35px !important; }
          .main-container { padding: 30px 2vw; gap: 20px; flex-wrap: nowrap; }
          .coluna-esquerda, .coluna-direita { flex: 1 1 50%; max-width: 500px; }
          .coluna-esquerda { align-items: center !important; text-align: center; }
          .titulo-principal { font-size: 24px; }
          .texto-principal { font-size: 15px; }
          .coluna-direita { padding: 25px 20px; }
        }
        
        @media (max-width: 600px) { .main-container { flex-direction: column; } .coluna-esquerda, .coluna-direita { flex: 1 1 100%; } }
      `}</style>

      <div style={{ backgroundColor: '#121418', minHeight: '100vh', display: 'flex', flexDirection: 'column', color: '#fff', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
        
        <header className="header-config" style={{ backgroundColor: '#1a1d24', padding: '15px 5vw', display: 'flex', alignItems: 'center', borderBottom: '1px solid #2a2d35' }}>
          <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-start' }}>
            <svg viewBox="0 0 2300 470" height="40" style={{ flexShrink: 0, maxWidth: '100%' }}>
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

          <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
            <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#fff', textAlign: 'center' }}>Gerador de Provas</span>
          </div>

          <div className="header-botoes" style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '15px' }}>
            <button onClick={onAcessarAdmin} style={{ backgroundColor: 'transparent', color: '#a0aab5', border: '1px solid #2a2d35', padding: '8px 15px', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold' }}>
              Painel Admin
            </button>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#2a2d35', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'bold', cursor: 'pointer', flexShrink: 0 }}>
              ?
            </div>
          </div>
        </header>

        <main className="main-container">
          
          <div className="coluna-esquerda">
            <div>
              <h1 className="titulo-principal">SEJA BEM-VINDO!</h1>
              <p className="texto-principal">
                Selecione os tópicos desejados e gere simulados personalizados de Lógica de Programação baseados em provas reais.
              </p>
            </div>
            <img 
              src={ilustracaoCodigo} 
              alt="Ilustração gerador de simulados" 
              style={{ width: '100%', maxWidth: '500px', objectFit: 'contain' }} 
            />
          </div>

          <div className="coluna-direita">
            <h2 style={{ fontSize: '20px', marginBottom: '20px', color: '#fff' }}>Configure o seu simulado</h2>

            <div className="tabs-container">
              <button className={`tab-btn ${modoAtivo === 'livre' ? 'ativo' : ''}`} onClick={() => setModoAtivo('livre')}>Modelo Livre</button>
              <button className={`tab-btn ${modoAtivo === 'unidade1' ? 'ativo' : ''}`} onClick={() => setModoAtivo('unidade1')}>1ª Unidade</button>
              <button className={`tab-btn ${modoAtivo === 'unidade2' ? 'ativo' : ''}`} onClick={() => setModoAtivo('unidade2')}>2ª Unidade</button>
              <button className={`tab-btn ${modoAtivo === 'miniprova' ? 'ativo' : ''}`} onClick={() => setModoAtivo('miniprova')}>Mini-prova</button>
              <button className={`tab-btn ${modoAtivo === 'final' ? 'ativo' : ''}`} onClick={() => setModoAtivo('final')}>Avaliação Final</button>
            </div>

            <div style={{ marginBottom: '15px' }} className={isTopicosLocked ? 'input-locked' : ''}>
              <label style={{ display: 'flex', justifyContent: 'space-between', color: '#a0aab5', fontSize: '13px', marginBottom: '8px' }}>
                <span>Seleção de Tópicos</span>
                {isTopicosLocked && <span className="badge-locked"><LockIcon /> Travado</span>}
              </label>
              <div style={{ border: '1px solid #2a2d35', borderRadius: '8px', padding: '12px', display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '180px', overflowY: 'auto' }}>
                {topicosAtuais.map(topico => (
                  <label key={topico} style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: isTopicosLocked ? 'not-allowed' : 'pointer', fontSize: '14px', color: '#e0e0e0', wordBreak: 'break-word' }}>
                    <input 
                      type="checkbox" 
                      checked={topicosSelecionados.includes(topico)}
                      onChange={() => handleToggleTopico(topico)}
                      disabled={isTopicosLocked}
                      style={{ width: '16px', height: '16px', cursor: isTopicosLocked ? 'not-allowed' : 'pointer', accentColor: '#2ecc71', flexShrink: 0 }}
                    />
                    {topico}
                  </label>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: '15px' }} className={isQtdLocked ? 'input-locked' : ''}>
              <label style={{ display: 'flex', justifyContent: 'space-between', color: '#a0aab5', fontSize: '13px', marginBottom: '8px' }}>
                <span>Quantidade de Questões</span>
                {isQtdLocked && <span className="badge-locked"><LockIcon /> Travado</span>}
              </label>
              <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#121418', borderRadius: '8px', border: '1px solid #2a2d35' }}>
                <button onClick={() => handleQuantidadeChange(-1)} disabled={isQtdLocked} style={{ flex: 1, padding: '8px', background: 'none', border: 'none', color: '#fff', fontSize: '20px', cursor: isQtdLocked ? 'not-allowed' : 'pointer' }}>-</button>
                <span style={{ flex: 2, textAlign: 'center', fontWeight: 'bold', fontSize: '16px' }}>{quantidade}</span>
                <button onClick={() => handleQuantidadeChange(1)} disabled={isQtdLocked} style={{ flex: 1, padding: '8px', background: 'none', border: 'none', color: '#fff', fontSize: '20px', cursor: isQtdLocked ? 'not-allowed' : 'pointer' }}>+</button>
              </div>
            </div>

            {/* SEÇÃO DE DIFICULDADE DINÂMICA */}
            {modoAtivo !== 'miniprova' ? (
              <div style={{ marginBottom: '15px' }} className={isDifLocked ? 'input-locked' : ''}>
                <label style={{ display: 'flex', justifyContent: 'space-between', color: '#a0aab5', fontSize: '13px', marginBottom: '8px' }}>
                  <span>Dificuldade</span>
                  {isDifLocked && <span className="badge-locked"><LockIcon /> Travado</span>}
                </label>
                <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
                  {['Fácil', 'Média', 'Difícil', 'Muito Difícil'].map(nivel => (
                    <label key={nivel} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: isDifLocked ? 'not-allowed' : 'pointer', color: '#e0e0e0', fontSize: '14px' }}>
                      <input 
                        type="checkbox" 
                        className="checkbox-redondo"
                        checked={dificuldadesSelecionadas.includes(nivel)}
                        onChange={() => handleToggleDificuldade(nivel)}
                        disabled={isDifLocked}
                      />
                      {nivel}
                    </label>
                  ))}
                </div>
              </div>
            ) : (
              <div style={{ marginBottom: '15px' }} className="input-locked">
                <label style={{ display: 'flex', justifyContent: 'space-between', color: '#a0aab5', fontSize: '13px', marginBottom: '8px' }}>
                  <span>Dificuldade</span>
                  <span className="badge-locked"><LockIcon /> Automática</span>
                </label>
                <div style={{ padding: '12px', backgroundColor: '#121418', borderRadius: '8px', border: '1px dashed #3a3d45', color: '#a0aab5', fontSize: '13px', textAlign: 'center' }}>
                  Sorteio automático pelo sistema. <br/>
                </div>
              </div>
            )}

            {erro && (
              <div style={{ backgroundColor: 'rgba(231, 76, 60, 0.1)', border: '1px solid #e74c3c', color: '#ff6b6b', padding: '10px 12px', borderRadius: '6px', marginBottom: '15px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                  <circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                {erro}
              </div>
            )}

            <button onClick={handleGerar} style={{ width: '100%', backgroundColor: '#36a860', color: '#121418', border: 'none', padding: '12px', borderRadius: '6px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer' }}>
              Gerar Simulado
            </button>
          </div>
        </main>

        <footer style={{ borderTop: '1px solid #2a2d35', padding: '15px', textAlign: 'center', color: '#6a737d', fontSize: '12px' }}>
          Instituto Federal de Educação, Ciência e Tecnologia - Campus Igarassu | Izes Stella Barbalho Bezerra
        </footer>

      </div>
    </>
  );
}