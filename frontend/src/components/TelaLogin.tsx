import React, { useState } from 'react';

interface TelaLoginProps {
  onLoginSucesso: () => void; // Nome alterado para coincidir com o App.tsx
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
        body: JSON.stringify({ usuario, senha })
      });

      const dados = await resposta.json();

      if (dados.auth) {
        // Agora chamamos a função correta que o App.tsx espera
        onLoginSucesso();
      } else {
        setErro(dados.error || 'Usuário ou senha inválidos.');
      }
    } catch (error) {
      setErro('Erro de conexão com o servidor.');
    }
  };

  return (
    <>
      <style>{`
        :root { padding: 0 !important; margin: 0 !important; max-width: 100% !important; }
        body, html, #root {
          margin: 0 !important;
          padding: 0 !important;
          width: 100vw !important;
          height: 100vh !important;
          background-color: #121418;
        }
        * { box-sizing: border-box; }

        .login-card {
          background-color: #1a1d24;
          padding: 40px;
          border-radius: 12px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.5);
          width: 100%;
          max-width: 400px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .logo-if-login { height: 60px; }
        .titulo-acesso { color: #fff; font-size: 22px; text-align: center; margin: 0 0 10px 0; }

        @media (max-width: 480px) {
          .login-card { padding: 25px 20px; gap: 15px; }
          .logo-if-login { height: 50px; }
          .titulo-acesso { font-size: 19px; }
        }
      `}</style>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', width: '100vw', backgroundColor: '#121418', fontFamily: 'system-ui, -apple-system, sans-serif', padding: '20px' }}>
        
        <div className="login-card">
          
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '5px' }}>
            <svg viewBox="0 0 350 470" className="logo-if-login" style={{ flexShrink: 0 }}>
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
          </div>

          <h2 className="titulo-acesso">Acesso do Administrador</h2>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            
            <div>
              <label style={{ display: 'block', color: '#a0aab5', fontSize: '14px', marginBottom: '8px' }}>Usuário:</label>
              <input 
                type="text" 
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                placeholder="Digite o usuário"
                required
                style={{ width: '100%', padding: '12px', backgroundColor: '#121418', border: '1px solid #2a2d35', color: '#fff', borderRadius: '8px', fontSize: '15px', outline: 'none' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', color: '#a0aab5', fontSize: '14px', marginBottom: '8px' }}>Senha:</label>
              <input 
                type="password" 
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="••••••••"
                required
                style={{ width: '100%', padding: '12px', backgroundColor: '#121418', border: '1px solid #2a2d35', color: '#fff', borderRadius: '8px', fontSize: '15px', outline: 'none' }}
              />
            </div>

            {erro && (
              <div style={{ color: '#ff6b6b', fontSize: '14px', textAlign: 'center', backgroundColor: 'rgba(231, 76, 60, 0.1)', padding: '10px', borderRadius: '6px', border: '1px solid #e74c3c', wordBreak: 'break-word' }}>
                {erro}
              </div>
            )}

            <button type="submit" style={{ width: '100%', backgroundColor: '#2ecc71', color: '#121418', border: 'none', padding: '14px', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', marginTop: '5px' }}>
              Entrar no Painel
            </button>

            <button type="button" onClick={onVoltar} style={{ width: '100%', backgroundColor: 'transparent', color: '#a0aab5', border: '1px solid #2a2d35', padding: '14px', borderRadius: '8px', fontSize: '15px', cursor: 'pointer' }}>
              Voltar ao Início
            </button>

          </form>
        </div>
      </div>
    </>
  );
}