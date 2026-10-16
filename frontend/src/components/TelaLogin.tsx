import React, { useState, useEffect } from 'react';
import { API_URL } from '../config';
import logoPreto from '../assets/logo-ifpe-igarassu-preto.svg';
import logoBranco from '../assets/logo-ifpe-igarassu-branco.svg';

interface TelaLoginProps {
  onLoginSucesso: () => void;
  onVoltar: () => void;
}

type Tema = 'claro' | 'escuro';

const CHAVE_TEMA = 'tema-gerador-provas';
const FUNDO_BODY: Record<Tema, string> = { claro: '#f3f6f4', escuro: '#121418' };

const SimboloIf = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 282 373" role="img" aria-label="Instituto Federal de Pernambuco">
    <path d="M202 10C202 7.23858 204.239 5 207 5H277C279.761 5 282 7.23858 282 10V80C282 82.7614 279.761 85 277 85H207C204.239 85 202 82.7614 202 80V10Z" fill="#2F9E41" />
    <path d="M202 202C202 199.239 204.239 197 207 197H277C279.761 197 282 199.239 282 202V272C282 274.761 279.761 277 277 277H207C204.239 277 202 274.761 202 272V202Z" fill="#2F9E41" />
    <path d="M106 202C106 199.239 108.239 197 111 197H181C183.761 197 186 199.239 186 202V272C186 274.761 183.761 277 181 277H111C108.239 277 106 274.761 106 272V202Z" fill="#2F9E41" />
    <path d="M10 202C10 199.239 12.2386 197 15 197H85C87.7614 197 90 199.239 90 202V272C90 274.761 87.7614 277 85 277H15C12.2386 277 10 274.761 10 272V202Z" fill="#2F9E41" />
    <path d="M106 298C106 295.239 108.239 293 111 293H181C183.761 293 186 295.239 186 298V368C186 370.761 183.761 373 181 373H111C108.239 373 106 370.761 106 368V298Z" fill="#2F9E41" />
    <path d="M10 298C10 295.239 12.2386 293 15 293H85C87.7614 293 90 295.239 90 298V368C90 370.761 87.7614 373 85 373H15C12.2386 373 10 370.761 10 368V298Z" fill="#2F9E41" />
    <path d="M10 106C10 103.239 12.2386 101 15 101H85C87.7614 101 90 103.239 90 106V176C90 178.761 87.7614 181 85 181H15C12.2386 181 10 178.761 10 176V106Z" fill="#2F9E41" />
    <path d="M106 106C106 103.239 108.239 101 111 101H181C183.761 101 186 103.239 186 106V176C186 178.761 183.761 181 181 181H111C108.239 181 106 178.761 106 176V106Z" fill="#2F9E41" />
    <path d="M106 10C106 7.23858 108.239 5 111 5H181C183.761 5 186 7.23858 186 10V80C186 82.7614 183.761 85 181 85H111C108.239 85 106 82.7614 106 80V10Z" fill="#2F9E41" />
    <path d="M90 45C90 69.8528 69.8528 90 45 90C20.1472 90 0 69.8528 0 45C0 20.1472 20.1472 0 45 0C69.8528 0 90 20.1472 90 45Z" fill="#CD191E" />
  </svg>
);

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
      const resposta = await fetch(`${API_URL}/api/login`, {
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
        .logo-if { display: block; height: 40px; width: auto; max-width: 100%; object-fit: contain; object-position: left center; flex-shrink: 0; }
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
          .header-login .logo-if { height: 46px; }
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
          .header-login .logo-if { height: 56px; }
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
          .header-login .logo-if { height: 35px; }
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
            <img className="logo-if" src={tema === 'escuro' ? logoBranco : logoPreto} alt="Instituto Federal de Pernambuco - Campus Igarassu" />
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
              <SimboloIf className="logo-if-login" />
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
          Instituto Federal de Educação, Ciência e Tecnologia - <em>Campus</em> Igarassu | Izes Stella Barbalho Bezerra
        </footer>
      </div>
    </>
  );
}
