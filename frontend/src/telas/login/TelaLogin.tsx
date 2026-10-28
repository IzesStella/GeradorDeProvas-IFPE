import { useState, type FormEvent } from 'react';
import simboloIf from '../../assets/simbolo-if.svg';
import { Cabecalho, Rodape } from '../../components/Estrutura';
import { api } from '../../api';
import './TelaLogin.css';

interface TelaLoginProps {
  onLoginSucesso: () => void;
  onVoltar: () => void;
}

export function TelaLogin({ onLoginSucesso, onVoltar }: TelaLoginProps) {
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [enviando, setEnviando] = useState(false);

  // Envia usuário e senha; se der certo, o api.ts guarda o token e o painel é aberto
  const entrar = async (e: FormEvent) => {
    e.preventDefault();
    setErro('');
    setEnviando(true);
    try {
      const mensagemErro = await api.entrar(usuario, senha);
      if (mensagemErro) setErro(mensagemErro);
      else onLoginSucesso();
    } catch {
      setErro('Erro de conexão com o servidor.');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="tela">
      <Cabecalho titulo="Painel Administrativo" />

      <main className="login-conteudo">
        <section className="login-cartao">
          <img className="login-simbolo" src={simboloIf} alt="Instituto Federal de Pernambuco" />
          <h2 className="login-titulo">Acesso do Administrador</h2>

          <form onSubmit={entrar} className="login-formulario">
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

            {erro && <div className="login-erro" role="alert">{erro}</div>}

            <button type="submit" className="login-entrar" disabled={enviando}>
              {enviando ? 'Entrando...' : 'Entrar no Painel'}
            </button>
            <button type="button" className="login-voltar" onClick={onVoltar}>
              Voltar ao Início
            </button>
          </form>
        </section>
      </main>

      <Rodape />
    </div>
  );
}