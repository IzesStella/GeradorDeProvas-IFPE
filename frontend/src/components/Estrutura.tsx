import { useEffect, useState, type ReactNode } from 'react';
import logoPreto from '../assets/logo-ifpe-igarassu-preto.svg';
import logoBranco from '../assets/logo-ifpe-igarassu-branco.svg';
import { PORTAL_CAMPUS } from '../config';
import type { Tema } from '../tipos';
import { IconeTema } from './Icones';
import './Estrutura.css';

// Cabeçalho e rodapé, que aparecem em todas as telas

const CHAVE_TEMA = 'tema-gerador-provas';

function temaInicial(): Tema {
  try {
    const salvo = localStorage.getItem(CHAVE_TEMA);
    if (salvo === 'claro' || salvo === 'escuro') return salvo;
  } catch {
   // navegador sem acesso ao localStorage
  }
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'escuro' : 'claro';
}

interface CabecalhoProps {
  titulo: string;
  children?: ReactNode;
}

// Cabeçalho de todas as telas: logo com link para o portal do campus, título,
// os botões de cada tela (children) e o botão de tema claro/escuro
export function Cabecalho({ titulo, children }: CabecalhoProps) {
  const [tema, setTema] = useState<Tema>(temaInicial);

  // As cores ficam em index.css e mudam pelo atributo data-tema da página
  useEffect(() => {
    document.documentElement.dataset.tema = tema;
    try {
      localStorage.setItem(CHAVE_TEMA, tema);
    } catch {
      // navegador sem acesso ao localStorage
    }
  }, [tema]);

  const alternarTema = () => setTema(atual => (atual === 'escuro' ? 'claro' : 'escuro'));

  return (
    <header className="cabecalho">
      <a className="cabecalho-logo" href={PORTAL_CAMPUS} target="_blank" rel="noopener noreferrer" title="Portal do Campus Igarassu">
        <img src={tema === 'escuro' ? logoBranco : logoPreto} alt="Instituto Federal de Pernambuco - Campus Igarassu" />
      </a>

      <span className="cabecalho-titulo">{titulo}</span>

      <div className="cabecalho-acoes">
        {children}
        <button
          type="button"
          className="botao-redondo"
          onClick={alternarTema}
          aria-label={tema === 'escuro' ? 'Mudar para o tema claro' : 'Mudar para o tema escuro'}
          title={tema === 'escuro' ? 'Tema claro' : 'Tema escuro'}
        >
          <IconeTema tema={tema} />
        </button>
      </div>
    </header>
  );
}

// Rodapé de todas as telas
export function Rodape() {
  return (
    <footer className="rodape">
      Instituto Federal de Educação, Ciência e Tecnologia - <em>Campus</em> Igarassu | Izes Stella Barbalho Bezerra
    </footer>
  );
}