import React, { useState } from 'react';

interface TelaAdminProps {
  onVoltar: () => void;
}

export function TelaAdmin({ onVoltar }: TelaAdminProps) {
  const [topico, setTopico] = useState('');
  const [enunciado, setEnunciado] = useState('');
  const [codigo, setCodigo] = useState('');
  const [dificuldade, setDificuldade] = useState('Fácil');
  
 const [semestre, setSemestre] = useState('');

  const handleSalvar = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const resposta = await fetch('http://localhost:3333/api/questoes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topico,
          enunciado,
          codigo_typescript: codigo,
          nivel_dificuldade: dificuldade,
          easter_egg_conteudo: null,
          origem: 'Cadastro Manual - Painel',
          ano: semestre 
        }),
      });

      if (resposta.ok) {
        alert('Questão salva com sucesso no banco de dados!');
        
        setTopico('');
        setEnunciado('');
        setCodigo('');
        setDificuldade('Fácil');
        setSemestre('');
      } else {
        alert('Erro ao salvar a questão. Verifique o console do navegador.');
      }
    } catch (erro) {
      console.error('Erro na requisição:', erro);
      alert('Erro de conexão. O backend está rodando na porta 3333?');
    }
  };

  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', backgroundColor: '#121418', minHeight: '100vh', color: '#e0e0e0', display: 'flex', flexDirection: 'column' }}>
      <header style={{ backgroundColor: '#1a1d24', padding: '20px 50px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #2a2d35' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{ width: '32px', height: '32px', backgroundColor: '#2ecc71', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#121418', fontWeight: 'bold' }}>IF</div>
          <span style={{ fontWeight: 'bold', fontSize: '16px', letterSpacing: '1px' }}>INSTITUTO FEDERAL<br/><span style={{fontSize: '11px', fontWeight: 'normal'}}>Pernambuco</span></span>
        </div>
        <div style={{ fontSize: '18px', fontWeight: 'bold' }}>Painel Administrativo</div>
        <button onClick={onVoltar} style={{ backgroundColor: 'transparent', color: '#f44336', border: '1px solid #f44336', padding: '8px 15px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', fontFamily: 'inherit' }}>
          Voltar
        </button>
      </header>

      <div style={{ flex: 1, padding: '40px 20px', display: 'flex', justifyContent: 'center' }}>
        <div style={{ backgroundColor: '#1a1d24', padding: '40px', borderRadius: '12px', width: '100%', maxWidth: '600px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
          <h2 style={{ color: '#fff', marginBottom: '30px', fontSize: '24px' }}>Cadastrar Nova Questão</h2>
          
          <form onSubmit={handleSalvar} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            <div>
              <label style={{ display: 'block', marginBottom: '8px', color: '#a0aab5' }}>Tópico da Questão:</label>
              <input 
                type="text" 
                value={topico} 
                onChange={(e) => setTopico(e.target.value)} 
                placeholder="Ex: Arrays, Laços, Tipos..."
                required 
                style={{ width: '100%', padding: '12px', backgroundColor: '#121418', border: '1px solid #2a2d35', color: '#fff', borderRadius: '8px', fontFamily: 'inherit' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', color: '#a0aab5' }}>Nível de Dificuldade:</label>
              <select 
                value={dificuldade} 
                onChange={(e) => setDificuldade(e.target.value)}
                style={{ width: '100%', padding: '12px', backgroundColor: '#121418', border: '1px solid #2a2d35', color: '#fff', borderRadius: '8px', fontFamily: 'inherit' }}
              >
                <option value="Fácil">Fácil</option>
                <option value="Média">Média</option>
                <option value="Difícil">Difícil</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', color: '#a0aab5' }}>Enunciado:</label>
              <textarea 
                value={enunciado} 
                onChange={(e) => setEnunciado(e.target.value)} 
                rows={4}
                required
                style={{ width: '100%', padding: '12px', backgroundColor: '#121418', border: '1px solid #2a2d35', color: '#fff', borderRadius: '8px', fontFamily: 'inherit', resize: 'vertical' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', color: '#a0aab5' }}>Código TypeScript (Opcional):</label>
              <textarea 
                value={codigo} 
                onChange={(e) => setCodigo(e.target.value)} 
                rows={5}
                placeholder="// Digite o código aqui ou deixe em branco"
                style={{ width: '100%', padding: '12px', backgroundColor: '#121418', border: '1px solid #2a2d35', color: '#2ecc71', borderRadius: '8px', fontFamily: 'monospace', resize: 'vertical' }}
              />
            </div>

            {/* NOVO: Campo de input para o usuário poder digitar o semestre exato */}
            <div>
              <label style={{ display: 'block', marginBottom: '8px', color: '#a0aab5' }}>Semestre / Ano:</label>
              <input 
                type="text" 
                value={semestre} 
                onChange={(e) => setSemestre(e.target.value)} 
                placeholder="Ex: 2025.1"
                required 
                style={{ width: '100%', padding: '12px', backgroundColor: '#121418', border: '1px solid #2a2d35', color: '#fff', borderRadius: '8px', fontFamily: 'inherit' }}
              />
            </div>

            <button type="submit" style={{ width: '100%', backgroundColor: '#2ecc71', color: '#121418', border: 'none', padding: '15px', borderRadius: '8px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px', fontFamily: 'inherit' }}>
              Salvar Questão
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}