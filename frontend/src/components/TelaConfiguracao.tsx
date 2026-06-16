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
  const [dificuldade, setDificuldade] = useState('');

  const handleToggleTopico = (topico: string) => {
    setTopicosSelecionados(prev => 
      prev.includes(topico) 
        ? prev.filter(t => t !== topico)
        : [...prev, topico]
    );
  };

  const handleGerar = () => {
    if (topicosSelecionados.length === 0) {
      alert('Selecione pelo menos um tópico!');
      return;
    }
    if (!dificuldade) {
      alert('Selecione o nível de dificuldade!');
      return;
    }

    onGerar({
      topicos: topicosSelecionados,
      quantidade,
      dificuldade
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
        @media (max-width: 768px) {
          .header-config {
            flex-direction: column;
            gap: 20px;
          }
          .header-config > div {
            justify-content: center !important;
            width: 100%;
          }
        }
      `}</style>

      <div style={{ backgroundColor: '#121418', minHeight: '100vh', display: 'flex', flexDirection: 'column', color: '#fff', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
        
        {/* HEADER - Dividido em 3 partes iguais (flex: 1) para centralizar perfeitamente */}
        <header className="header-config" style={{ backgroundColor: '#1a1d24', padding: '15px 5vw', display: 'flex', alignItems: 'center', borderBottom: '1px solid #2a2d35' }}>
          
          {/* Esquerda: LOGO */}
          <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-start' }}>
            <svg viewBox="0 0 2300 470" height="48" style={{ flexShrink: 0 }}>
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

          {/* Centro: TÍTULO (Ícone removido e centralizado) */}
          <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
            <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#fff', textAlign: 'center' }}>Gerador de Provas</span>
          </div>

          {/* Direita: BOTÕES */}
          <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '15px' }}>
            <button onClick={onAcessarAdmin} style={{ backgroundColor: 'transparent', color: '#a0aab5', border: '1px solid #2a2d35', padding: '8px 15px', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold' }}>
              Painel Admin
            </button>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#2a2d35', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'bold', cursor: 'pointer' }}>
              ?
            </div>
          </div>
        </header>

        {/* CONTEÚDO PRINCIPAL */}
        <main style={{ flex: 1, display: 'flex', flexWrap: 'wrap', padding: '60px 5vw', alignItems: 'flex-start', justifyContent: 'space-between', gap: '40px', maxWidth: '1300px', margin: '0 auto', width: '100%' }}>
          
          <div style={{ flex: '1 1 450px', maxWidth: '650px', display: 'flex', flexDirection: 'column', gap: '30px' }}>
            <div>
              <h1 style={{ fontSize: '34px', marginBottom: '15px', color: '#fff' }}>SEJA BEM-VINDO!</h1>
              <p style={{ fontSize: '18px', color: '#a0aab5', lineHeight: '1.6', margin: 0 }}>
                Selecione os tópicos desejados e gere simulados<br/>
                personalizados de Lógica de Programação baseados<br/>
                em provas reais.
              </p>
            </div>
            <img 
              src={ilustracaoCodigo} 
              alt="Ilustração gerador de simulados" 
              style={{ width: '100%', maxWidth: '600px', objectFit: 'contain' }} 
            />
          </div>

          <div style={{ flex: '1 1 350px', maxWidth: '420px', backgroundColor: '#1a1d24', padding: '35px', borderRadius: '12px', boxShadow: '0 10px 40px rgba(0,0,0,0.3)' }}>
            <h2 style={{ fontSize: '22px', marginBottom: '25px', color: '#fff' }}>Configure o seu simulado</h2>

            <div style={{ marginBottom: '25px' }}>
              <label style={{ display: 'block', color: '#a0aab5', fontSize: '14px', marginBottom: '10px' }}>Seleção de Tópicos</label>
              <div style={{ border: '1px solid #2a2d35', borderRadius: '8px', padding: '15px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {TOPICOS_DISPONIVEIS.map(topico => (
                  <label key={topico} style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '14px', color: '#e0e0e0' }}>
                    <input 
                      type="checkbox" 
                      checked={topicosSelecionados.includes(topico)}
                      onChange={() => handleToggleTopico(topico)}
                      style={{ width: '16px', height: '16px', cursor: 'pointer', accentColor: '#2ecc71' }}
                    />
                    {topico}
                  </label>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: '25px' }}>
              <label style={{ display: 'block', color: '#a0aab5', fontSize: '14px', marginBottom: '10px' }}>Quantidade de Questões</label>
              <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#121418', borderRadius: '8px', border: '1px solid #2a2d35' }}>
                <button onClick={() => setQuantidade(Math.max(1, quantidade - 1))} style={{ flex: 1, padding: '12px', background: 'none', border: 'none', color: '#fff', fontSize: '20px', cursor: 'pointer' }}>-</button>
                <span style={{ flex: 2, textAlign: 'center', fontWeight: 'bold', fontSize: '16px' }}>{quantidade}</span>
                <button onClick={() => setQuantidade(quantidade + 1)} style={{ flex: 1, padding: '12px', background: 'none', border: 'none', color: '#fff', fontSize: '20px', cursor: 'pointer' }}>+</button>
              </div>
            </div>

            <div style={{ marginBottom: '35px' }}>
              <label style={{ display: 'block', color: '#a0aab5', fontSize: '14px', marginBottom: '10px' }}>Dificuldade</label>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                {['Fácil', 'Média', 'Difícil'].map(nivel => (
                  <label key={nivel} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: '#e0e0e0', fontSize: '14px' }}>
                    <input type="radio" name="dificuldade" value={nivel} checked={dificuldade === nivel} onChange={(e) => setDificuldade(e.target.value)} style={{ width: '16px', height: '16px', cursor: 'pointer', accentColor: '#2ecc71' }} />
                    {nivel}
                  </label>
                ))}
              </div>
            </div>

            <button onClick={handleGerar} style={{ width: '100%', backgroundColor: '#36a860', color: '#121418', border: 'none', padding: '15px', borderRadius: '6px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}>
              Gerar Simulado
            </button>
          </div>
        </main>

        <footer style={{ borderTop: '1px solid #2a2d35', padding: '20px', textAlign: 'center', color: '#6a737d', fontSize: '13px' }}>
          Instituto Federal de Educação, Ciência e Tecnologia - Campus Igarassu | Izes Stella Barbalho Bezerra
        </footer>

      </div>
    </>
  );
}