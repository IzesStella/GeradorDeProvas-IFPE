import bcrypt from 'bcryptjs';
import { randomUUID } from 'node:crypto';

// Tokens das sessões abertas no painel. Ficam na memória e se perdem quando o servidor reinicia.
const tokensValidos = new Set<string>();

export const AuthService = {
  // Confere usuário e senha com o .env e, se estiverem corretos devolve um token de acesso
  async autenticar(usuario: string, senha: string): Promise<string | null> {
    const usuarioEsperado = process.env.ADMIN_USUARIO;
    const hashEsperado = process.env.ADMIN_SENHA_HASH;
    if (!usuarioEsperado || !hashEsperado) {
      throw new Error('ADMIN_USUARIO e ADMIN_SENHA_HASH precisam estar definidos no .env');
    }

    if (usuario !== usuarioEsperado) return null;

    const senhaConfere = await bcrypt.compare(senha ?? '', hashEsperado);
    if (!senhaConfere) return null;

    const token = randomUUID();
    tokensValidos.add(token);
    return token;
  },

  tokenValido(token: string) {
    return tokensValidos.has(token);
  }
};
