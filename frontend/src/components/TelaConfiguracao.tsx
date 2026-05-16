import { useState } from 'react';

interface TelaConfiguracaoProps {
  onGerar: (filtros: any) => void;
  onAcessarAdmin: () => void;
}

export function TelaConfiguracao({ onGerar, onAcessarAdmin }: TelaConfiguracaoProps) {
  const [quantidade, setQuantidade] = useState(5);
  const [topicosSelecionados, setTopicosSelecionados] = useState<string[]>([]);
  const [dificuldade, setDificuldade] = useState<string>('');

  const listaTopicos = ['Operadores Lógicos', 'Execução Condicional', 'Laços', 'Subprogramas', 'Tipos e Variáveis', 'Arrays'];

  const handleTopicoToggle = (topico: string) => {
    setTopicosSelecionados(prev => 
      prev.includes(topico) ? prev.filter(t => t !== topico) : [...prev, topico]
    );
  };

  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', backgroundColor: '#121418', minHeight: '100vh', color: '#e0e0e0', display: 'flex', flexDirection: 'column' }}>
      <header style={{ backgroundColor: '#1a1d24', padding: '20px 50px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #2a2d35' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{ width: '32px', height: '32px', backgroundColor: '#2ecc71', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#121418', fontWeight: 'bold' }}>IF</div>
          <span style={{ fontWeight: 'bold', fontSize: '16px', letterSpacing: '1px' }}>INSTITUTO FEDERAL<br/><span style={{fontSize: '11px', fontWeight: 'normal'}}>Pernambuco</span></span>
        </div>
        
        <div style={{ fontSize: '18px', fontWeight: 'bold' }}>Gerador de Provas</div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <button 
            onClick={onAcessarAdmin} 
            style={{ backgroundColor: 'transparent', color: '#2ecc71', border: '1px solid #2ecc71', padding: '8px 15px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', fontFamily: 'inherit' }}
          >
            Painel Admin
          </button>
          <div style={{ width: '30px', height: '30px', borderRadius: '50%', backgroundColor: '#333', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold' }}>?</div>
        </div>
      </header>

      <div style={{ display: 'flex', flex: 1, padding: '60px 80px', gap: '60px', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ flex: 1, maxWidth: '500px' }}>
          <h1 style={{ fontSize: '36px', color: '#fff', marginBottom: '20px' }}>SEJA BEM-VINDO!</h1>
          <p style={{ fontSize: '18px', color: '#a0aab5', lineHeight: '1.6' }}>Selecione os tópicos desejados e gere simulados personalizados.</p>
        </div>

        <div style={{ backgroundColor: '#1a1d24', padding: '40px', borderRadius: '12px', width: '450px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
          <h2 style={{ color: '#fff', marginBottom: '30px', fontSize: '24px' }}>Configure o seu simulado</h2>
          
          <div style={{ marginBottom: '25px' }}>
            <label style={{ display: 'block', marginBottom: '15px', color: '#a0aab5' }}>Seleção de Tópicos</label>
            <div style={{ border: '1px solid #2a2d35', borderRadius: '8px', padding: '15px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {listaTopicos.map(topico => (
                <label key={topico} style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                  <input type="checkbox" checked={topicosSelecionados.includes(topico)} onChange={() => handleTopicoToggle(topico)} style={{ width: '18px', height: '18px', accentColor: '#2ecc71' }} />
                  {topico}
                </label>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: '25px' }}>
            <label style={{ display: 'block', marginBottom: '10px', color: '#a0aab5' }}>Quantidade de Questões</label>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#121418', padding: '10px 20px', borderRadius: '8px' }}>
              <button onClick={() => setQuantidade(q => Math.max(1, q - 1))} style={{ background: 'none', border: 'none', color: '#fff', fontSize: '20px', cursor: 'pointer' }}>-</button>
              <span style={{ fontSize: '18px', fontWeight: 'bold' }}>{quantidade}</span>
              <button onClick={() => setQuantidade(q => q + 1)} style={{ background: 'none', border: 'none', color: '#fff', fontSize: '20px', cursor: 'pointer' }}>+</button>
            </div>
          </div>

          <div style={{ marginBottom: '40px' }}>
            <label style={{ display: 'block', marginBottom: '15px', color: '#a0aab5' }}>Dificuldade</label>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              {['Fácil', 'Média', 'Difícil'].map(nivel => (
                <label key={nivel} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input type="radio" name="dificuldade" value={nivel} checked={dificuldade === nivel} onChange={(e) => setDificuldade(e.target.value)} style={{ accentColor: '#2ecc71' }} /> {nivel}
                </label>
              ))}
            </div>
          </div>

          <button onClick={() => onGerar({ topicosSelecionados, quantidade, dificuldade })} style={{ width: '100%', backgroundColor: '#2ecc71', color: '#121418', border: 'none', padding: '15px', borderRadius: '8px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer', fontFamily: 'inherit' }}>
            Gerar Simulado
          </button>
        </div>
      </div>
    </div>
  );
}