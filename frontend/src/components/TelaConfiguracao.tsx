import { useState } from 'react';
import ilustracaoCodigo from '../assets/imagemtelaconf.png';

interface TelaConfiguracaoProps {
  onGerar: (filtros: any) => void;
  onAcessarAdmin: () => void;
}

const TOPICOS_DISPONIVEIS = [
  'Operadores Lógicos',
  'Execução Condicional',
  'Laços',
  'Subprogramas',
  'Tipos e Variáveis',
  'Arrays'
];

export function TelaConfiguracao({ onGerar, onAcessarAdmin }: TelaConfiguracaoProps) {
  const [topicosSelecionados, setTopicosSelecionados] = useState<string[]>([]);
  const [quantidade, setQuantidade] = useState(5);
  const [dificuldadesSelecionadas, setDificuldadesSelecionadas] = useState<string[]>([]);
  const [erro, setErro] = useState<string | null>(null);

  const handleToggleTopico = (topico: string) => {
    setTopicosSelecionados(prev => 
      prev.includes(topico) 
        ? prev.filter(t => t !== topico)
        : [...prev, topico]
    );
    setErro(null);
  };

  const handleToggleDificuldade = (nivel: string) => {
    setDificuldadesSelecionadas(prev => 
      prev.includes(nivel) 
        ? prev.filter(d => d !== nivel)
        : [...prev, nivel]
    );
    setErro(null);
  };

  const handleGerar = () => {
    if (topicosSelecionados.length === 0) {
      setErro('Selecione pelo menos um tópico!');
      return;
    }
    if (dificuldadesSelecionadas.length === 0) {
      setErro('Selecione pelo menos um nível de dificuldade!');
      return;
    }

    setErro(null);
    onGerar({
      topicos: topicosSelecionados,
      quantidade,
      dificuldades: dificuldadesSelecionadas
    });
  };

  return (
    <>
      <style>{`
        body, html {
          margin: 0;
          padding: 0;
          width: 100%;
          overflow-x: hidden;
          background-color: #121418;
        }
        * {
          box-sizing: border-box;
        }
        
        .checkbox-redondo {
          appearance: none;
          -webkit-appearance: none;
          width: 16px;
          height: 16px;
          border: 1px solid #6a737d;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: transparent;
          margin: 0;
          transition: all 0.2s ease-in-out;
        }
        .checkbox-redondo:checked {
          background-color: #2ecc71;
          border-color: #2ecc71;
        }
        .checkbox-redondo:checked::after {
          content: '';
          width: 4px;
          height: 8px;
          border: solid #121418;
          border-width: 0 2px 2px 0;
          transform: rotate(45deg);
          margin-bottom: 2px;
        }

        /* Estrutura de Layout Base */
        .main-container {
          flex: 1;
          display: flex;
          flex-direction: row; /* Força lado a lado */
          flex-wrap: nowrap; /* Impede a quebra de linha forçada */
          padding: 30px 5vw;
          
          /* Centraliza em monitores grandes */
          align-items: center; 
          justify-content: center; 
          gap: 50px; 
          
          max-width: 1100px;
          margin: 0 auto;
          width: 100%;
        }

        .coluna-esquerda {
          flex: 1 1 350px;
          max-width: 450px;
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .coluna-direita {
          flex: 1 1 320px;
          max-width: 380px;
          background-color: #1a1d24;
          padding: 25px;
          border-radius: 12px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.3);
          width: 100%;
        }

        .titulo-principal {
          font-size: 28px;
          margin-bottom: 5px;
          color: #fff;
        }

        .texto-principal {
          font-size: 15px;
          color: #a0aab5;
          line-height: 1.5;
          margin: 0;
        }

        /* Responsividade para Tablets e Celulares */
        @media (max-width: 960px) {
          
          .header-config {
            flex-direction: row !important;
            flex-wrap: wrap;
            padding: 15px 20px !important;
          }
          
          .header-config > div {
            flex: unset !important;
          }

          .header-config > div:nth-child(1) {
            width: 50%;
            justify-content: flex-start !important;
          }

          .header-botoes {
            width: 50%;
            justify-content: flex-end !important;
          }

          .header-config > div:nth-child(2) {
            width: 100%;
            justify-content: center !important;
            margin-top: 15px;
            order: 3;
          }

          .header-config svg {
            height: 35px !important;
          }
          
          /* Ajuste CRUCIAL para não quebrar a tela em tablets/notebooks pequenos */
          .main-container {
            padding: 30px 2vw; /* Reduz a margem lateral */
            gap: 20px; /* Reduz o espaço entre as caixas para caber */
            flex-wrap: nowrap; /* Continua forçando lado a lado */
          }
          
          .coluna-esquerda, .coluna-direita {
            flex: 1 1 50%; /* Divide o espaço restante por igual */
            max-width: 500px;
          }
          
          .coluna-esquerda {
            align-items: center !important;
            text-align: center;
          }
          
          .titulo-principal {
            font-size: 24px;
          }
          
          .texto-principal {
            font-size: 15px;
          }

          .coluna-direita {
            padding: 25px 20px;
          }
        }
        
        /* A quebra para empilhar vai ocorrer apenas em celulares bem estreitos */
        @media (max-width: 600px) {
           .main-container {
               flex-direction: column; /* Aí sim, empilha */
           }
           
           .coluna-esquerda, .coluna-direita {
               flex: 1 1 100%;
           }
        }

      `}</style>

      <div style={{ backgroundColor: '#121418', minHeight: '100vh', display: 'flex', flexDirection: 'column', color: '#fff', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
        
        {/* HEADER */}
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

        {/* CONTEÚDO PRINCIPAL */}
        <main className="main-container">
          
          {/* LADO ESQUERDO */}
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

          {/* LADO DIREITO */}
          <div className="coluna-direita">
            <h2 style={{ fontSize: '20px', marginBottom: '20px', color: '#fff' }}>Configure o seu simulado</h2>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', color: '#a0aab5', fontSize: '13px', marginBottom: '8px' }}>Seleção de Tópicos</label>
              <div style={{ border: '1px solid #2a2d35', borderRadius: '8px', padding: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {TOPICOS_DISPONIVEIS.map(topico => (
                  <label key={topico} style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '14px', color: '#e0e0e0', wordBreak: 'break-word' }}>
                    <input 
                      type="checkbox" 
                      checked={topicosSelecionados.includes(topico)}
                      onChange={() => handleToggleTopico(topico)}
                      style={{ width: '16px', height: '16px', cursor: 'pointer', accentColor: '#2ecc71', flexShrink: 0 }}
                    />
                    {topico}
                  </label>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', color: '#a0aab5', fontSize: '13px', marginBottom: '8px' }}>Quantidade de Questões</label>
              <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#121418', borderRadius: '8px', border: '1px solid #2a2d35' }}>
                <button onClick={() => setQuantidade(Math.max(1, quantidade - 1))} style={{ flex: 1, padding: '8px', background: 'none', border: 'none', color: '#fff', fontSize: '20px', cursor: 'pointer' }}>-</button>
                <span style={{ flex: 2, textAlign: 'center', fontWeight: 'bold', fontSize: '16px' }}>{quantidade}</span>
                <button onClick={() => setQuantidade(quantidade + 1)} style={{ flex: 1, padding: '8px', background: 'none', border: 'none', color: '#fff', fontSize: '20px', cursor: 'pointer' }}>+</button>
              </div>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', color: '#a0aab5', fontSize: '13px', marginBottom: '8px' }}>Dificuldade</label>
              <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
                {['Fácil', 'Média', 'Difícil'].map(nivel => (
                  <label key={nivel} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: '#e0e0e0', fontSize: '14px' }}>
                    <input 
                      type="checkbox" 
                      className="checkbox-redondo"
                      checked={dificuldadesSelecionadas.includes(nivel)}
                      onChange={() => handleToggleDificuldade(nivel)}
                    />
                    {nivel}
                  </label>
                ))}
              </div>
            </div>

            {erro && (
              <div style={{ 
                backgroundColor: 'rgba(231, 76, 60, 0.1)', 
                border: '1px solid #e74c3c', 
                color: '#ff6b6b', 
                padding: '10px 12px', 
                borderRadius: '6px', 
                marginBottom: '15px',
                fontSize: '13px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
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