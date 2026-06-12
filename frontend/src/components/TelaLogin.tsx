import React, { useState } from 'react';

interface TelaLoginProps {
  onLoginSucesso: () => void;
  onVoltar: () => void;
}

export function TelaLogin({ onLoginSucesso, onVoltar }: TelaLoginProps) {
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');

    try {
      const resposta = await fetch('http://localhost:3333/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuario, senha }),
      });

      const dados = await resposta.json();

      if (resposta.ok && dados.token) {
        // Salva o token no localstorage do navegador para lembrar da sessão
        localStorage.setItem('gerador_token', dados.token);
        onLoginSucesso();
      } else {
        setErro(dados.error || 'Credenciais incorretas.');
      }
    } catch (err) {
      setErro('Erro ao conectar com o servidor.');
    }
  };

  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', backgroundColor: '#121418', minHeight: '100vh', color: '#e0e0e0', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
      <div style={{ backgroundColor: '#1a1d24', padding: '40px', borderRadius: '12px', width: '100%', maxWidth: '400px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)', boxSizing: 'border-box' }}>
        
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '30px', gap: '10px' }}>
          <div style={{ width: '45px', height: '45px', backgroundColor: '#2ecc71', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#121418', fontWeight: 'bold', fontSize: '20px' }}>IF</div>
          <h2 style={{ color: '#fff', margin: 0, fontSize: '22px', textAlign: 'center' }}>Acesso do Professor</h2>
        </div>

        {erro && (
          <div style={{ backgroundColor: '#5c1a1b', color: '#fff', padding: '12px', borderRadius: '6px', marginBottom: '20px', fontSize: '14px', textAlign: 'center', border: '1px solid #e74c3c' }}>
            {erro}
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: '#a0aab5', fontSize: '14px' }}>Usuário:</label>
            <input type="text" value={usuario} onChange={(e) => setUsuario(e.target.value)} required placeholder="Digite o usuário" style={{ width: '100%', padding: '12px', backgroundColor: '#121418', border: '1px solid #2a2d35', color: '#fff', borderRadius: '8px', fontFamily: 'inherit', boxSizing: 'border-box' }} />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: '#a0aab5', fontSize: '14px' }}>Senha:</label>
            <input type="password" value={senha} onChange={(e) => setSenha(e.target.value)} required placeholder="••••••••" style={{ width: '100%', padding: '12px', backgroundColor: '#121418', border: '1px solid #2a2d35', color: '#fff', borderRadius: '8px', fontFamily: 'inherit', boxSizing: 'border-box' }} />
          </div>

          <button type="submit" style={{ width: '100%', backgroundColor: '#2ecc71', color: '#121418', border: 'none', padding: '14px', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', fontFamily: 'inherit', marginTop: '10px' }}>
            Entrar no Painel
          </button>

          <button type="button" onClick={onVoltar} style={{ width: '100%', backgroundColor: 'transparent', color: '#a0aab5', border: '1px solid #2a2d35', padding: '12px', borderRadius: '8px', fontSize: '14px', cursor: 'pointer', fontFamily: 'inherit' }}>
            Voltar ao Início
          </button>
        </form>
      </div>
    </div>
  );
}