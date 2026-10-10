import React, { useState, useEffect } from 'react';

interface TelaLoginProps {
  onLoginSucesso: () => void;
  onVoltar: () => void;
}

type Tema = 'claro' | 'escuro';

const CHAVE_TEMA = 'tema-gerador-provas';
const FUNDO_BODY: Record<Tema, string> = { claro: '#f3f6f4', escuro: '#121418' };

const IconeTema = ({ tema }: { tema: Tema }) =>
  tema === 'escuro' ? (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4"></circle>
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"></path>
    </svg>
  ) : (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"></path>
    </svg>
  );

export function TelaLogin({ onLoginSucesso, onVoltar }: TelaLoginProps) {
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [enviando, setEnviando] = useState(false);

  const [tema, setTema] = useState<Tema>(() => {
    try {
      const salvo = localStorage.getItem(CHAVE_TEMA);
      if (salvo === 'claro' || salvo === 'escuro') return salvo;
    } catch {
    }
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'escuro' : 'claro';
  });

  const alternarTema = () => {
    const novo: Tema = tema === 'escuro' ? 'claro' : 'escuro';
    setTema(novo);
    try {
      localStorage.setItem(CHAVE_TEMA, novo);
    } catch {
    }
    window.dispatchEvent(new CustomEvent('tema-alterado', { detail: novo }));
  };

  useEffect(() => {
    document.body.style.backgroundColor = FUNDO_BODY[tema];
    document.documentElement.style.backgroundColor = FUNDO_BODY[tema];
    return () => {
      document.body.style.backgroundColor = '';
      document.documentElement.style.backgroundColor = '';
    };
  }, [tema]);

  useEffect(() => {
    const aoMudar = (e: Event) => {
      const novo = (e as CustomEvent).detail;
      if (novo === 'claro' || novo === 'escuro') setTema(novo);
    };
    window.addEventListener('tema-alterado', aoMudar);
    return () => window.removeEventListener('tema-alterado', aoMudar);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');
    setEnviando(true);
    try {
      const resposta = await fetch('http://localhost:3333/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuario, senha })
      });

      const dados = await resposta.json();

      if (dados.auth) {
        onLoginSucesso();
      } else {
        setErro(dados.error || 'Usuário ou senha inválidos.');
      }
    } catch (error) {
      setErro('Erro de conexão com o servidor.');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <>
      <style>{`
        :root { padding: 0 !important; margin: 0 !important; max-width: 100% !important; }
        body, html, #root { margin: 0 !important; padding: 0 !important; width: 100% !important; overflow-x: clip; }
        .tela-login, .tela-login *, .tela-login *::before, .tela-login *::after { box-sizing: border-box; }

        .tela-login {
          --bg: #f3f6f4; --card: #ffffff; --tx: #17211b; --mu: #55625b; --rodape: #66736b;
          --bd: #dce4df; --bd2: #aab7af; --ctl: #ffffff;
          --g: #1f7a3d; --on: #ffffff; --gl: #e6f4ea;
          --sombra: 0 6px 24px rgba(23,33,27,.06); --logo: #111111; --chip: #eef2ef;
          --erro: #d63b2b;
        }
        .tela-login[data-tema='escuro'] {
          --bg: #121418; --card: #1a1d24; --tx: #e8efea; --mu: #a0aab5; --rodape: #6a737d;
          --bd: #2a2d35; --bd2: #4a525c; --ctl: #20242c;
          --g: #36a860; --on: #121418; --gl: rgba(54,168,96,.16);
          --sombra: 0 10px 40px rgba(0,0,0,.3); --logo: #ffffff; --chip: #2a2d35;
          --erro: #ff6b6b;
        }

        .tela-login { background-color: var(--bg); color: var(--tx); min-height: 100vh; display: flex; flex-direction: column; font-family: system-ui, -apple-system, sans-serif; }
        .tela-login button, .tela-login input { font-family: inherit; }

        .header-login { background-color: var(--card); padding: 15px 5vw; display: flex; align-items: center; border-bottom: 1px solid var(--bd); position: sticky; top: 0; z-index: 5; }
        .header-login > div { flex: 1; display: flex; align-items: center; }
        .login-titulo-cab { font-size: 18px; font-weight: bold; color: var(--tx); text-align: center; }
        .login-btn-circ { width: 32px; height: 32px; border-radius: 50%; background-color: var(--chip); color: var(--tx); border: none; display: flex; align-items: center; justify-content: center; cursor: pointer; flex-shrink: 0; transition: 0.2s; padding: 0; }
        .login-btn-circ:hover { background-color: var(--g); color: var(--on); }

        .login-main { flex: 1 0 auto; display: flex; align-items: center; justify-content: center; padding: 28px clamp(16px, 4vw, 56px); }
        .login-painel { width: 100%; max-width: 400px; background: var(--card); border: 1px solid var(--bd); border-radius: 12px; padding: 40px; box-shadow: var(--sombra); display: flex; flex-direction: column; gap: 20px; }
        .logo-if-login { height: 60px; }
        .titulo-acesso { color: var(--tx); font-size: 22px; text-align: center; margin: 0 0 10px 0; }

        .login-form { display: flex; flex-direction: column; gap: 15px; }
        .login-form label { display: block; color: var(--mu); font-size: 14px; margin-bottom: 8px; }
        .login-voltar { width: 100%; background: transparent; color: var(--mu); border: 1px solid var(--bd); padding: 14px; border-radius: 8px; font-size: 15px; cursor: pointer; }
        .login-voltar:hover { color: var(--tx); border-color: var(--bd2); }
        .login-campo { width: 100%; height: 46px; padding: 0 12px; border: 1.5px solid var(--bd); border-radius: 10px; background: var(--ctl); color: var(--tx); font-size: 14px; outline: none; }
        .login-campo::placeholder { color: var(--mu); opacity: .8; }
        .login-campo:focus { border-color: var(--g); box-shadow: 0 0 0 3px var(--gl); }

        .login-erro { background-color: rgba(231,76,60,.1); border: 1px solid #e74c3c; color: var(--erro); padding: 10px 12px; border-radius: 10px; font-size: 13px; text-align: center; word-break: break-word; }
        .login-entrar { width: 100%; height: 48px; margin-top: 4px; border-radius: 10px; border: 0; background: var(--g); color: var(--on); font-size: 16px; font-weight: 700; cursor: pointer; }
        .login-entrar:hover:not(:disabled) { filter: brightness(1.08); }
        .login-entrar:disabled { opacity: .6; cursor: not-allowed; }

        .rodape-login { border-top: 1px solid var(--bd); padding: 15px; text-align: center; color: var(--rodape); font-size: 12px; }

        .tela-login button:focus-visible { outline: 2px solid var(--g); outline-offset: 2px; }

        @media (min-width: 1700px) {
          .header-login { padding: 18px 4vw; }
          .header-login svg.login-logo { height: 46px; }
          .login-titulo-cab { font-size: 20px; }
          .login-btn-circ { width: 38px; height: 38px; }
          .login-painel { max-width: 480px; padding: 48px; }
          .logo-if-login { height: 72px; }
          .titulo-acesso { font-size: 26px; }
          .login-voltar { font-size: 17px; padding: 16px; }
          .login-form label { font-size: 16px; }
          .login-campo { height: 56px; font-size: 16px; }
          .login-entrar { height: 58px; font-size: 18px; }
          .rodape-login { font-size: 13px; padding: 20px; }
        }
        @media (min-width: 2200px) {
          .header-login { padding: 22px 4vw; }
          .header-login svg.login-logo { height: 56px; }
          .login-titulo-cab { font-size: 24px; }
          .login-btn-circ { width: 46px; height: 46px; }
          .login-painel { max-width: 580px; padding: 56px; }
          .logo-if-login { height: 88px; }
          .titulo-acesso { font-size: 31px; }
          .login-voltar { font-size: 20px; padding: 20px; }
          .login-form label { font-size: 19px; }
          .login-campo { height: 68px; font-size: 19px; }
          .login-entrar { height: 70px; font-size: 22px; }
          .rodape-login { font-size: 15px; }
        }
        @media (max-width: 960px) {
          .header-login { flex-wrap: wrap; padding: 15px 20px; }
          .header-login > div { flex: unset; }
          .header-login > div:nth-child(1) { width: 50%; }
          .header-login > div:nth-child(3) { width: 50%; }
          .header-login > div:nth-child(2) { width: 100%; margin-top: 15px; order: 3; }
          .header-login svg.login-logo { height: 35px; }
        }
        @media (max-width: 600px) {
          .login-main { padding: 20px 14px; }
          .login-painel { padding: 25px 20px; gap: 15px; }
          .logo-if-login { height: 50px; }
          .titulo-acesso { font-size: 19px; }
        }
      `}</style>

      <div className="tela-login" data-tema={tema}>
        <header className="header-login">
          <div style={{ justifyContent: 'flex-start' }}>
            <svg className="login-logo" viewBox="0 0 2300 470" height="40" style={{ flexShrink: 0, maxWidth: '100%', color: 'var(--logo)' }}>
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
              <text x="390" y="340" fontFamily="Arial, sans-serif" fontWeight="bold" fontSize="140" fill="currentColor" letterSpacing="2">INSTITUTO FEDERAL</text>
              <text x="390" y="460" fontFamily="Arial, sans-serif" fontWeight="normal" fontSize="105" fill="currentColor">Pernambuco</text>
            </svg>
          </div>
          <div style={{ justifyContent: 'center' }}>
            <span className="login-titulo-cab">Painel Administrativo</span>
          </div>
          <div style={{ justifyContent: 'flex-end', gap: '15px' }}>
            <button
              type="button"
              className="login-btn-circ"
              onClick={alternarTema}
              aria-label={tema === 'escuro' ? 'Mudar para o tema claro' : 'Mudar para o tema escuro'}
              title={tema === 'escuro' ? 'Tema claro' : 'Tema escuro'}
            >
              <IconeTema tema={tema} />
            </button>
          </div>
        </header>

        <main className="login-main">
          <section className="login-painel">
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

            <form onSubmit={handleLogin} className="login-form">
              <div>
                <label htmlFor="login-usuario">Usuário:</label>
                <input
                  id="login-usuario"
                  className="login-campo"
                  type="text"
                  value={usuario}
                  onChange={(e) => setUsuario(e.target.value)}
                  placeholder="Digite o usuário"
                  autoComplete="username"
                  required
                />
              </div>

              <div>
                <label htmlFor="login-senha">Senha:</label>
                <input
                  id="login-senha"
                  className="login-campo"
                  type="password"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                />
              </div>

              {erro && (
                <div className="login-erro" role="alert">
                  {erro}
                </div>
              )}

              <button type="submit" className="login-entrar" disabled={enviando}>
                {enviando ? 'Entrando...' : 'Entrar no Painel'}
              </button>

              <button type="button" className="login-voltar" onClick={onVoltar}>
                Voltar ao Início
              </button>
            </form>
          </section>
        </main>

        <footer className="rodape-login">
          Instituto Federal de Educação, Ciência e Tecnologia - Campus Igarassu | Izes Stella Barbalho Bezerra
        </footer>
      </div>
    </>
  );
}
