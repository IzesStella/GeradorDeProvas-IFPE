import React, { useState, useEffect, useRef } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { ModalAjudaAdmin } from './ModalAjudaAdmin';

const temaDoTCC = JSON.parse(JSON.stringify(vscDarkPlus));

const coresTCC: Record<string, string> = {
  'keyword': '#3695D7',
  'builtin': '#3695D7',
  'number': '#82B384',
  'string': '#939393',
  'comment': '#5EA63D',
  'punctuation': '#FFF500',
  'function': '#ffffff',
  'class-name': '#ffffff',
  'variable': '#ffffff',
  'parameter': '#ffffff',
  'property': '#ffffff',
  'operator': '#ffffff'
};

Object.keys(temaDoTCC).forEach((key) => {
  if (temaDoTCC[key].fontStyle === 'italic' && key !== 'comment') {
    temaDoTCC[key].fontStyle = 'normal';
  }
});
Object.keys(coresTCC).forEach((token) => {
  if (temaDoTCC[token]) {
    temaDoTCC[token].color = coresTCC[token];
    if (token !== 'comment') temaDoTCC[token].fontStyle = 'normal';
  } else {
    temaDoTCC[token] = { color: coresTCC[token], fontStyle: token === 'comment' ? 'italic' : 'normal' };
  }
});

const normalizar = (t: unknown) =>
  String(t ?? '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

// Mesma chave usada pela tela inicial, para o tema ser um só em todo o sistema
const CHAVE_TEMA = 'tema-gerador-provas';
// Mesmos fundos da tela inicial e do login
const FUNDO_BODY = { claro: '#f3f6f4', escuro: '#121418' } as const;

interface TelaAdminProps {
  onVoltar: () => void;
  onSair?: () => void;
}

interface Questao {
  id: number;
  topico: string;
  enunciado: string;
  codigo_typescript: string;
  nivel_dificuldade: string;
  origem: string;
  ano: string;
  tipo_questao?: string;
  tabela_enunciado?: any;
}

const TOPICOS_DISPONIVEIS = [
  'Operadores, Tipos e Variáveis',
  'Operadores Lógicos',
  'Execução Condicional',
  'Laços',
  'Laços - Parte 1',
  'Laços - Parte 2',
  'Subprogramas',
  'Vetores',
  'Arrays',
  'Tipos',
  'Recursão - Unidade 1',
  'Recursão - Unidade 2'
];

const ORIGENS_BASE = [
  'Miniprova - Operadores, Tipos e Variáveis',
  'Miniprova - Execução Condicional',
  'Miniprova - Operadores Lógicos',
  'Miniprova - Laços Parte 1',
  'Miniprova - Laços Parte 2',
  'Miniprova - Subprogramas',
  'Miniprova - Vetores',
  'Miniprova - Arrays',
  'Miniprova - Tipos',
  'Primeira Avaliação Individual',
  'Primeira Recuperação Individual',
  'Segunda Avaliação Individual',
  'Segunda Recuperação Individual',
  'Avaliação Final Individual'
];

const CURSOS_DISPONIVEIS = ['IPI', 'TSI'];
const TIPOS_QUESTAO = ['Implementação', 'Execução de Código', 'Correção de Código'];
const DIFICULDADES = ['Fácil', 'Média', 'Difícil', 'Muito Difícil'];
// Quantidade de questões por página: no mínimo 12, aumentando conforme a altura da tela
const MIN_ITENS_POR_PAGINA = 12;
const MAX_ITENS_POR_PAGINA = 60;
const API = 'http://localhost:3333/api/questoes';

const separarOrigem = (origem: string) => {
  const m = (origem || '').match(/^(.*) - (IPI|TSI)$/);
  return m ? { base: m[1], curso: m[2] } : { base: origem || '', curso: '' };
};

const classeTipo = (t?: string) =>
  (t || '').startsWith('Impl') ? 'tipo-impl' : (t || '').startsWith('Corre') ? 'tipo-corr' : 'tipo-exec';

const classeDif = (d: string) =>
  d === 'Fácil' ? 'dif-facil' : d === 'Média' ? 'dif-media' : d === 'Difícil' ? 'dif-dificil' : 'dif-muito';

const paginasVisiveis = (atual: number, total: number): (number | '…')[] => {
  if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);
  const base = Array.from(new Set([1, total, atual - 1, atual, atual + 1].filter((n) => n >= 1 && n <= total)));
  base.sort((a, b) => a - b);
  const saida: (number | '…')[] = [];
  base.forEach((n, i) => {
    if (i > 0 && n - base[i - 1] > 1) saida.push('…');
    saida.push(n);
  });
  return saida;
};

const Icone = ({ d }: { d: string }) => (
  <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d={d} />
  </svg>
);
const ICONES = {
  olho: 'M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z',
  lapis: 'M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z',
  lixo: 'M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14',
  lua: 'M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z',
  sol: 'M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4',
  busca: 'M11 3a8 8 0 1 0 0 16 8 8 0 0 0 0-16z M21 21l-4.35-4.35'
};

interface SeletorProps {
  rotulo: string;
  todos: string;
  valor: string;
  opcoes: string[];
  onChange: (v: string) => void;
  ponto?: (opcao: string) => string;
  alinharDireita?: boolean;
}

function Seletor({ rotulo, todos, valor, opcoes, onChange, ponto, alinharDireita }: SeletorProps) {
  const [aberto, setAberto] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!aberto) return;
    const fora = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setAberto(false);
    };
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') setAberto(false); };
    document.addEventListener('mousedown', fora);
    document.addEventListener('keydown', esc);
    return () => {
      document.removeEventListener('mousedown', fora);
      document.removeEventListener('keydown', esc);
    };
  }, [aberto]);

  const ativo = valor !== '';
  const escolher = (v: string) => { onChange(v); setAberto(false); };

  return (
    <div className="adm-sel" ref={ref}>
      <button type="button" className={`adm-sel-btn ${ativo ? 'ativo' : ''}`} aria-haspopup="listbox" aria-expanded={aberto} onClick={() => setAberto(!aberto)}>
        <span className="adm-sel-rot">{rotulo}:</span>
        <span className="adm-sel-val">{ativo ? valor : todos}</span>
        <svg className={`adm-sel-seta ${aberto ? 'aberto' : ''}`} viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6" /></svg>
      </button>
      {aberto && (
        <ul className={`adm-sel-menu ${alinharDireita ? 'dir' : ''}`} role="listbox" aria-label={rotulo}>
          <li role="option" aria-selected={!ativo} className={!ativo ? 'on' : ''} onClick={() => escolher('')}>
            <span>{todos}</span>{!ativo && <b>✓</b>}
          </li>
          {opcoes.map((o) => (
            <li key={o} role="option" aria-selected={valor === o} className={valor === o ? 'on' : ''} onClick={() => escolher(o)}>
              <span className={ponto ? `adm-dif ${ponto(o)}` : undefined}>{o}</span>{valor === o && <b>✓</b>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function TelaAdmin({ onVoltar, onSair }: TelaAdminProps) {
  const [topico, setTopico] = useState('');
  const [enunciado, setEnunciado] = useState('');
  const [codigo, setCodigo] = useState('');
  const [dificuldade, setDificuldade] = useState('Fácil');
  const [semestre, setSemestre] = useState('');
  const [origemBase, setOrigemBase] = useState('');
  const [origemCurso, setOrigemCurso] = useState(CURSOS_DISPONIVEIS[0]);
  const [tipoQuestao, setTipoQuestao] = useState('Implementação');
  const [tabelaEnunciado, setTabelaEnunciado] = useState('');

  const [questoes, setQuestoes] = useState<Questao[]>([]);
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [modalAjudaAberto, setModalAjudaAberto] = useState(false);
  const [painel, setPainel] = useState<'ver' | 'form' | null>(null);
  const [questaoVista, setQuestaoVista] = useState<Questao | null>(null);
  const [idParaExcluir, setIdParaExcluir] = useState<number | null>(null);
  const [aviso, setAviso] = useState('');

  const [termoPesquisa, setTermoPesquisa] = useState('');
  const [fTopico, setFTopico] = useState('');
  const [fTipo, setFTipo] = useState('');
  const [fDif, setFDif] = useState('');
  const [fCurso, setFCurso] = useState('');
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [itensPorPagina, setItensPorPagina] = useState(MIN_ITENS_POR_PAGINA);
  const cardRef = useRef<HTMLDivElement>(null);
  const theadRef = useRef<HTMLTableSectionElement>(null);
  const linhaRef = useRef<HTMLTableRowElement>(null);
  const pagRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLElement>(null);

  const [tema, setTema] = useState<'claro' | 'escuro'>(() => {
    try {
      const salvo = localStorage.getItem(CHAVE_TEMA);
      if (salvo === 'claro' || salvo === 'escuro') return salvo;
    } catch {}
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'escuro' : 'claro';
  });
  const alternarTema = () => {
    const novo = tema === 'claro' ? 'escuro' : 'claro';
    setTema(novo);
    try { localStorage.setItem(CHAVE_TEMA, novo); } catch {}
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

  // Calcula quantas linhas cabem na altura da tela (a lista acompanha o tamanho da janela)
  useEffect(() => {
    const recalcular = () => {
      const card = cardRef.current;
      if (!card) return;
      const topo = card.getBoundingClientRect().top + window.scrollY;
      const fixo =
        (theadRef.current?.offsetHeight ?? 44) +
        (pagRef.current?.offsetHeight ?? 62) +
        (footerRef.current?.offsetHeight ?? 50) +
        48;
      const linha = linhaRef.current?.offsetHeight || 54;
      const cabem = Math.floor((window.innerHeight - topo - fixo) / linha);
      setItensPorPagina(Math.max(MIN_ITENS_POR_PAGINA, Math.min(MAX_ITENS_POR_PAGINA, cabem)));
    };
    recalcular();
    window.addEventListener('resize', recalcular);
    return () => window.removeEventListener('resize', recalcular);
  }, [questoes.length, tema]);

  useEffect(() => { carregarQuestoes(); }, []);
  useEffect(() => { setPaginaAtual(1); }, [termoPesquisa, fTopico, fTipo, fDif, fCurso]);
  useEffect(() => {
    const fechar = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setIdParaExcluir(null); fecharPainel(); }
    };
    window.addEventListener('keydown', fechar);
    return () => window.removeEventListener('keydown', fechar);
  }, []);

  const mostrarAviso = (msg: string) => {
    setAviso(msg);
    setTimeout(() => setAviso(''), 2200);
  };

  const carregarQuestoes = async () => {
    try {
      const resposta = await fetch(API);
      if (resposta.ok) setQuestoes(await resposta.json());
    } catch (erro) {
      console.error('Erro ao buscar questões:', erro);
    }
  };

  const limparFormulario = () => {
    setEditandoId(null);
    setTopico('');
    setEnunciado('');
    setCodigo('');
    setDificuldade('Fácil');
    setSemestre('');
    setOrigemBase('');
    setOrigemCurso(CURSOS_DISPONIVEIS[0]);
    setTipoQuestao('Implementação');
    setTabelaEnunciado('');
  };

  const fecharPainel = () => {
    setPainel(null);
    setTimeout(() => { limparFormulario(); setQuestaoVista(null); }, 250);
  };

  const handleSalvar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topico) { alert('Por favor, selecione um tópico válido.'); return; }
    if (!origemBase) { alert('Por favor, selecione uma fonte para a questão.'); return; }

    let tabelaParseada = null;
    if (tabelaEnunciado.trim() !== '') {
      try {
        tabelaParseada = JSON.parse(tabelaEnunciado);
      } catch (erro) {
        alert('O formato da Tabela do Enunciado é inválido. Certifique-se de usar o padrão JSON (Ex: [["A", "B"], ["1", "2"]]).');
        return;
      }
    }

    const origemFinal = `${origemBase} - ${origemCurso}`;
    const url = editandoId ? `${API}/${editandoId}` : API;
    const method = editandoId ? 'PUT' : 'POST';

    try {
      const resposta = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topico,
          enunciado,
          codigo_typescript: codigo,
          nivel_dificuldade: dificuldade,
          tipo_questao: tipoQuestao,
          tabela_enunciado: tabelaParseada,
          easter_egg_conteudo: null,
          origem: origemFinal,
          ano: semestre
        }),
      });

      if (resposta.ok) {
        mostrarAviso(`Questão ${editandoId ? 'atualizada' : 'salva'} com sucesso`);
        fecharPainel();
        carregarQuestoes();
      } else {
        alert('Erro ao salvar a questão.');
      }
    } catch (erro) {
      console.error('Erro na requisição:', erro);
      alert('Erro de conexão com o backend.');
    }
  };

  const abrirNova = () => {
    limparFormulario();
    setPainel('form');
  };

  const handleEditar = (questao: Questao) => {
    setEditandoId(questao.id);
    setTopico(questao.topico);
    setEnunciado(questao.enunciado);
    setCodigo(questao.codigo_typescript || '');
    setDificuldade(questao.nivel_dificuldade);
    setSemestre(questao.ano);
    setTipoQuestao(questao.tipo_questao || 'Implementação');
    setTabelaEnunciado(questao.tabela_enunciado ? JSON.stringify(questao.tabela_enunciado, null, 2) : '');
    const { base, curso } = separarOrigem(questao.origem);
    setOrigemBase(base);
    setOrigemCurso(curso || CURSOS_DISPONIVEIS[0]);
    setPainel('form');
  };

  const handleVer = (questao: Questao) => {
    setQuestaoVista(questao);
    setPainel('ver');
  };

  const editarDaVisualizacao = () => {
    if (!questaoVista) return;
    const q = questaoVista;
    setPainel(null);
    setTimeout(() => handleEditar(q), 150);
  };

  const confirmarExclusao = async () => {
    if (idParaExcluir === null) return;
    try {
      const resposta = await fetch(`${API}/${idParaExcluir}`, { method: 'DELETE' });
      if (resposta.ok) {
        carregarQuestoes();
        mostrarAviso('Questão excluída');
      }
    } catch (erro) {
      console.error('Erro ao excluir:', erro);
    }
    setIdParaExcluir(null);
  };

  const questoesFiltradas = questoes.filter((q) => {
    const termo = normalizar(termoPesquisa.trim());
    const { curso } = separarOrigem(q.origem);
    const passaBusca =
      normalizar(q.enunciado).includes(termo) ||
      normalizar(q.topico).includes(termo) ||
      normalizar(q.origem).includes(termo) ||
      normalizar(q.ano).includes(termo) ||
      normalizar(q.nivel_dificuldade).includes(termo) ||
      normalizar(q.tipo_questao).includes(termo) ||
      String(q.id).includes(termo);
    return (
      passaBusca &&
      (!fTopico || q.topico === fTopico) &&
      (!fTipo || q.tipo_questao === fTipo) &&
      (!fDif || q.nivel_dificuldade === fDif) &&
      (!fCurso || curso === fCurso)
    );
  });

  const totalPaginas = Math.max(1, Math.ceil(questoesFiltradas.length / itensPorPagina));
  const paginaSegura = Math.min(paginaAtual, totalPaginas);
  const indexInicial = (paginaSegura - 1) * itensPorPagina;
  const questoesPaginadas = questoesFiltradas.slice(indexInicial, indexInicial + itensPorPagina);
  const temFiltro = !!(termoPesquisa || fTopico || fTipo || fDif || fCurso);

  return (
    <>
      <style>{`
        body, html { margin: 0; padding: 0; width: 100%; }
        .adm, .adm * { box-sizing: border-box; font-family: system-ui, -apple-system, sans-serif; }

        /* Paleta igual à da tela inicial e do login */
        .adm { --bg:#f3f6f4; --surface:#ffffff; --soft:#f3f6f4; --chip:#eef2ef; --line:#dce4df; --line2:#aab7af; --texto:#17211b; --mudo:#55625b; --rodape:#66736b; --logo:#111111;
          --verde:#1f7a3d; --verde-h:#17602f; --verde-tx:#17602f; --verde-bg:#e6f4ea; --on:#ffffff; --vermelho:#c0392b;
          --sombra:0 6px 24px rgba(23,33,27,.06); --veu:rgba(10,20,14,.45);
          --impl-bg:#e6f4ea; --impl:#17602f; --exec-bg:#eef2ef; --exec:#55625b; --corr-bg:#d8f0f1; --corr:#0f6b73;
          --d1:#1f7a3d; --d2:#b7791f; --d3:#c2501f; --d4:#a3203f; }
        .adm[data-tema="escuro"] { --bg:#121418; --surface:#1a1d24; --soft:#20242c; --chip:#2a2d35; --line:#2a2d35; --line2:#4a525c; --texto:#e8efea; --mudo:#a0aab5; --rodape:#6a737d; --logo:#ffffff;
          --verde:#36a860; --verde-h:#41b86d; --verde-tx:#7fe3a2; --verde-bg:rgba(54,168,96,.16); --on:#121418; --vermelho:#f0705f;
          --sombra:0 10px 40px rgba(0,0,0,.3); --veu:rgba(0,0,0,.6);
          --impl-bg:rgba(54,168,96,.16); --impl:#7fe3a2; --exec-bg:#2a2d35; --exec:#a0aab5; --corr-bg:#12353a; --corr:#6fd3da;
          --d1:#5fd38a; --d2:#f0b84a; --d3:#f08a5d; --d4:#f27a96; }
        .adm { background: var(--bg); color: var(--texto); min-height: 100vh; display: flex; flex-direction: column; font-size: 14px; line-height: 1.45; }
        .adm button, .adm input, .adm select, .adm textarea { font: inherit; color: inherit; }
        .adm button { cursor: pointer; }
        .adm :focus-visible { outline: 2px solid var(--verde); outline-offset: 2px; }

        /* Cabeçalho com as mesmas medidas da tela inicial */
        .adm-header { background: var(--surface); border-bottom: 1px solid var(--line); display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; gap: 12px; padding: 15px 5vw; position: sticky; top: 0; z-index: 5; line-height: normal; }
        .adm-logo { display: flex; justify-content: flex-start; }
        .adm-titulo { font-size: 18px; font-weight: bold; text-align: center; }
        .adm-direita { display: flex; justify-content: flex-end; align-items: center; gap: 15px; }

        .adm-btn { background: var(--surface); border: 1px solid var(--line); border-radius: 6px; padding: 8px 15px; font-size: 14px; font-weight: bold; transition: background-color .2s; white-space: nowrap; }
        .adm-btn:hover { background: var(--soft); }
        .adm-btn.p { background: var(--verde); border-color: var(--verde); color: var(--on); }
        .adm-btn.p:hover { background: var(--verde-h); border-color: var(--verde-h); }
        .adm-direita .adm-btn { background: transparent; color: var(--mudo); }
        .adm-direita .adm-btn:hover { background: transparent; color: var(--texto); border-color: var(--line2); }
        .adm-btn.d, .adm-direita .adm-btn.d, .adm-direita .adm-btn.d:hover { color: var(--vermelho); border-color: color-mix(in srgb, var(--vermelho) 45%, var(--line)); }
        .adm-redondo { width: 32px; height: 32px; border-radius: 50%; border: 0; background: var(--chip); color: var(--texto); display: flex; align-items: center; justify-content: center; padding: 0; font-weight: bold; font-size: 14px; flex-shrink: 0; transition: 0.2s; }
        .adm-redondo svg { width: 16px; height: 16px; stroke-width: 2; }
        .adm-redondo:hover { background: var(--verde); color: var(--on); }
        .adm-icone { width: 34px; height: 34px; border-radius: 6px; border: 1px solid var(--line); background: var(--surface); display: grid; place-items: center; padding: 0; flex-shrink: 0; }
        .adm-icone:hover { background: var(--soft); }

        .adm-main { flex: 1; display: flex; flex-direction: column; width: 100%; max-width: 1180px; margin: 0 auto; padding: 28px 5vw; }
        .adm-main > .adm-card { flex: 1; display: flex; flex-direction: column; }
        .adm-topo { display: flex; justify-content: space-between; align-items: flex-end; gap: 12px; margin-bottom: 16px; }
        .adm-topo h2 { margin: 0; font-size: 24px; }
        .adm-mudo { color: var(--mudo); }
        .adm-card { background: var(--surface); border: 1px solid var(--line); border-radius: 16px; box-shadow: var(--sombra); overflow: hidden; }
        .adm-filtros { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; margin-bottom: 14px; }
        .adm-in { width: 100%; background: var(--surface); border: 1px solid var(--line); border-radius: 8px; padding: 9px 11px; font-size: 13px; }
        .adm[data-tema="escuro"] .adm-in { background: var(--soft); }
        .adm-in:focus { border-color: var(--verde); outline: none; box-shadow: 0 0 0 3px var(--verde-bg); }
        .adm-in::placeholder { color: var(--mudo); }
        select.adm-in { appearance: none; -webkit-appearance: none; padding-right: 32px; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%237a877f' stroke-width='2.2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 11px center; cursor: pointer; }
        .adm-busca .adm-in { height: 38px; }
        .adm-sel { position: relative; }
        .adm-sel-btn { height: 38px; display: inline-flex; align-items: center; gap: 6px; padding: 0 11px 0 13px; background: var(--surface); border: 1px solid var(--line); border-radius: 8px; font-size: 13px; white-space: nowrap; transition: border-color .15s, background-color .15s; }
        .adm-sel-btn:hover { border-color: var(--line2); }
        .adm-sel-rot { color: var(--mudo); }
        .adm-sel-val { font-weight: 600; max-width: 150px; overflow: hidden; text-overflow: ellipsis; }
        .adm-sel-seta { color: var(--mudo); margin-left: 2px; transition: transform .15s; flex-shrink: 0; }
        .adm-sel-seta.aberto { transform: rotate(180deg); }
        .adm-sel-btn.ativo { border-color: var(--verde); background: var(--verde-bg); }
        .adm-sel-btn.ativo .adm-sel-val { color: var(--verde-tx); }
        .adm-sel-menu { position: absolute; top: calc(100% + 6px); left: 0; min-width: 100%; width: max-content; max-width: min(320px, 80vw); max-height: 300px; overflow: auto; margin: 0; padding: 5px; list-style: none; background: var(--surface); border: 1px solid var(--line); border-radius: 10px; box-shadow: var(--sombra); z-index: 8; }
        .adm-sel-menu.dir { left: auto; right: 0; }
        .adm-sel-menu li { display: flex; align-items: center; justify-content: space-between; gap: 14px; padding: 8px 10px; border-radius: 6px; font-size: 13px; cursor: pointer; }
        .adm-sel-menu li:hover { background: var(--soft); }
        .adm-sel-menu li.on { background: var(--verde-bg); color: var(--verde-tx); font-weight: 700; }
        .adm-sel-menu li b { font-size: 12px; }
        .adm-sel-menu .adm-dif { font-size: inherit; font-weight: inherit; }
        .adm-limpar { background: none; border: 0; color: var(--verde-tx); font-weight: 600; font-size: 13px; padding: 0 6px; height: 38px; }
        .adm-limpar:hover { text-decoration: underline; }
        .adm-busca { position: relative; flex: 1; min-width: 220px; }
        .adm-busca svg { position: absolute; left: 11px; top: 50%; transform: translateY(-50%); color: var(--mudo); }
        .adm-busca .adm-in { width: 100%; padding-left: 34px; }

        .adm-tabela { overflow-x: auto; flex: 1; }
        .adm-tabela table { width: 100%; border-collapse: collapse; min-width: 760px; text-align: left; }
        .adm-tabela th { font-size: 12px; font-weight: 600; color: var(--mudo); background: var(--soft); padding: 11px 16px; border-bottom: 1px solid var(--line); }
        .adm-tabela td { padding: 11px 16px; border-bottom: 1px solid var(--line); vertical-align: middle; font-size: 13px; }
        .adm-tabela tbody tr:hover { background: var(--soft); }
        .adm-chip { display: inline-block; border-radius: 99px; padding: 2px 10px; font-size: 12px; font-weight: 600; }
        .tipo-impl { background: var(--impl-bg); color: var(--impl); }
        .tipo-exec { background: var(--exec-bg); color: var(--exec); }
        .tipo-corr { background: var(--corr-bg); color: var(--corr); }
        .adm-origem small { display: flex; gap: 6px; align-items: center; color: var(--mudo); margin-top: 2px; font-size: 12px; }
        .adm-curso { border: 1px solid var(--mudo); border-radius: 3px; font-size: 10px; font-weight: 700; padding: 0 4px; color: var(--mudo); }
        .adm-dif { display: inline-flex; align-items: center; gap: 7px; font-weight: 600; font-size: 12px; white-space: nowrap; }
        .adm-dif::before { content: ''; width: 8px; height: 8px; border-radius: 50%; }
        .dif-facil::before { background: var(--d1); }
        .dif-media::before { background: var(--d2); }
        .dif-dificil::before { background: var(--d3); }
        .dif-muito::before { background: var(--d4); }
        .adm-acoes { display: flex; gap: 6px; }
        .adm-vazio { padding: 40px; text-align: center; color: var(--mudo); }
        .adm-rodape-tab { margin-top: auto; display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; color: var(--mudo); font-size: 13px; flex-wrap: wrap; gap: 8px; }
        .adm-pag { display: flex; gap: 6px; }
        .adm-pag button { min-width: 32px; height: 32px; border: 1px solid var(--line); background: var(--surface); border-radius: 6px; font-weight: 600; }
        .adm-pag button.on { background: var(--verde); border-color: var(--verde); color: var(--on); }
        .adm-pag button:disabled { opacity: .4; cursor: not-allowed; }
        .adm-pag button:not(:disabled):not(.on):hover { background: var(--soft); }
        .adm-rodape { text-align: center; color: var(--rodape); font-size: 12px; padding: 15px; border-top: 1px solid var(--line); line-height: normal; }

        .adm-veu { position: fixed; inset: 0; background: var(--veu); opacity: 0; pointer-events: none; transition: opacity .2s; z-index: 10; }
        .adm-veu.on { opacity: 1; pointer-events: auto; }
        .adm-vista { position: fixed; top: 50%; left: 50%; width: min(1040px, calc(100% - 24px)); max-height: 86vh; background: var(--surface); border: 1px solid var(--line); border-radius: 16px; box-shadow: var(--sombra); z-index: 11; display: flex; flex-direction: column; opacity: 0; pointer-events: none; transform: translate(-50%, -48%); transition: opacity .2s, transform .2s; }
        .adm-vista.on { opacity: 1; pointer-events: auto; transform: translate(-50%, -50%); }
        .adm-vista .adm-gc { min-height: 0; }
        .adm-gh, .adm-gf { padding: 16px 22px; display: flex; justify-content: space-between; align-items: center; gap: 8px; }
        .adm-gh { border-bottom: 1px solid var(--line); }
        .adm-gf { border-top: 1px solid var(--line); }
        .adm-gh h3 { margin: 0; font-size: 18px; }
        .adm-gc { padding: 20px 22px; overflow: auto; flex: 1; }
        .adm-chips { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 8px; }
        .adm-chips .adm-chip { background: var(--soft); border: 1px solid var(--line); }
        .adm-chips .adm-chip.tipo-impl { background: var(--impl-bg); color: var(--impl); border-color: transparent; }
        .adm-chips .adm-chip.tipo-exec { background: var(--exec-bg); color: var(--exec); border-color: transparent; }
        .adm-chips .adm-chip.tipo-corr { background: var(--corr-bg); color: var(--corr); border-color: transparent; }
        .adm-form-cols { display: grid; grid-template-columns: 1fr 1.15fr; gap: 32px; }
        .adm-enun { margin: 14px 0; white-space: pre-wrap; }
        .adm-tab-enun { border-collapse: collapse; margin: 12px 0; }
        .adm-tab-enun td { border: 1px solid var(--line); padding: 6px 12px; }
        .adm-secao { font-weight: 700; margin: 6px 0 10px; padding-bottom: 6px; border-bottom: 1px solid var(--line); }
        .adm-g2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .adm-campo { margin-bottom: 14px; }
        .adm-campo label { display: block; font-weight: 600; font-size: 13px; margin-bottom: 5px; }
        .adm-dica { color: var(--mudo); font-size: 12px; margin-top: 4px; }
        .adm-modal { position: fixed; inset: 0; display: grid; place-items: center; z-index: 20; background: var(--veu); padding: 16px; }
        .adm-confirma { width: 100%; max-width: 420px; padding: 0; }
        .adm-confirma-pe { justify-content: flex-end; }
        .adm-btn.perigo { background: var(--vermelho); border-color: var(--vermelho); color: var(--on); }
        .adm-btn.perigo:hover { background: var(--vermelho); filter: brightness(1.08); }
        .adm-aviso { position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%); background: var(--texto); color: var(--bg); padding: 9px 16px; border-radius: 8px; z-index: 30; }

        @media (max-width: 960px) {
          .adm-header { display: flex; flex-wrap: wrap; padding: 15px 20px; }
          .adm-logo { flex: 1; }
          .adm-logo svg { height: 35px; }
          .adm-direita { flex: 1; }
          .adm-titulo { order: 3; width: 100%; margin-top: 15px; }
        }
        @media (max-width: 760px) {
          .adm-main { padding: 20px 15px; }
          .adm-topo { flex-direction: column; align-items: flex-start; }
          .adm-sel { flex: 1 1 140px; }
          .adm-sel-btn { width: 100%; justify-content: space-between; }
          .adm-form-cols { grid-template-columns: 1fr !important; }
          .adm-g2 { grid-template-columns: 1fr; }
        }
        @media (min-width: 1700px) {
          .adm { font-size: 15px; }
          .adm-header { padding: 18px 4vw; }
          .adm-logo svg { height: 46px; }
          .adm-titulo { font-size: 20px; }
          .adm-main { max-width: 1560px; padding: 36px 4vw; }
          .adm-topo { margin-bottom: 22px; }
          .adm-topo h2 { font-size: 30px; }
          .adm-btn { font-size: 15px; padding: 10px 18px; }
          .adm-redondo { width: 38px; height: 38px; font-size: 16px; }
          .adm-icone { width: 38px; height: 38px; }
          .adm-in { font-size: 14px; padding: 11px 13px; }
          .adm-busca .adm-in, .adm-sel-btn, .adm-limpar { height: 44px; }
          .adm-sel-btn, .adm-sel-menu li, .adm-limpar { font-size: 14px; }
          .adm-tabela th { font-size: 13px; padding: 16px 22px; }
          .adm-tabela td { font-size: 14px; padding: 17px 22px; }
          .adm-chip, .adm-dif { font-size: 13px; }
          .adm-rodape-tab { padding: 18px 22px; font-size: 14px; }
          .adm-pag button { min-width: 38px; height: 38px; }
          .adm-vista { width: min(1240px, calc(100% - 48px)); }
          .adm-rodape { font-size: 13px; padding: 20px; }
        }
        @media (min-width: 2200px) {
          .adm { font-size: 17px; }
          .adm-header { padding: 22px 4vw; }
          .adm-logo svg { height: 56px; }
          .adm-titulo { font-size: 24px; }
          .adm-main { max-width: 1960px; padding: 44px 4vw; }
          .adm-topo h2 { font-size: 36px; }
          .adm-btn { font-size: 17px; padding: 12px 22px; }
          .adm-redondo { width: 46px; height: 46px; font-size: 18px; }
          .adm-icone { width: 46px; height: 46px; }
          .adm-in { font-size: 16px; padding: 13px 15px; }
          .adm-busca .adm-in, .adm-sel-btn, .adm-limpar { height: 52px; }
          .adm-sel-btn, .adm-sel-menu li, .adm-limpar { font-size: 16px; }
          .adm-tabela th { font-size: 15px; padding: 20px 28px; }
          .adm-tabela td { font-size: 16px; padding: 22px 28px; }
          .adm-chip, .adm-dif { font-size: 15px; }
          .adm-rodape-tab { padding: 22px 28px; font-size: 16px; }
          .adm-pag button { min-width: 46px; height: 46px; font-size: 15px; }
          .adm-vista { width: min(1500px, calc(100% - 64px)); }
          .adm-rodape { font-size: 15px; }
        }
        @media (prefers-reduced-motion: reduce) { .adm *, .adm-veu, .adm-vista { transition: none !important; } }
      `}</style>

      <div className="adm" data-tema={tema}>
        <header className="adm-header">
          <div className="adm-logo">
            <svg viewBox="0 0 2300 470" height="40" style={{ flexShrink: 0, maxWidth: '100%', color: 'var(--logo)' }}>
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

          <div className="adm-titulo">Painel Administrativo</div>

          <div className="adm-direita">
            <button className="adm-btn" onClick={onVoltar}>Voltar ao início</button>
            {onSair && <button className="adm-btn d" onClick={onSair}>Sair</button>}
            <button className="adm-redondo" onClick={alternarTema} aria-label={tema === 'escuro' ? 'Mudar para o tema claro' : 'Mudar para o tema escuro'} title={tema === 'claro' ? 'Tema escuro' : 'Tema claro'}>
              <Icone d={tema === 'claro' ? ICONES.lua : ICONES.sol} />
            </button>
            <button className="adm-redondo" onClick={() => setModalAjudaAberto(true)} aria-label="Ajuda" title="Ajuda">?</button>
          </div>
        </header>

        <main className="adm-main">
          <div className="adm-topo">
            <div>
              <h2>Banco de Questões</h2>
              <div className="adm-mudo">{questoes.length} questões cadastradas</div>
            </div>
            <button className="adm-btn p" onClick={abrirNova}>+ Nova questão</button>
          </div>

          <div className="adm-filtros">
            <div className="adm-busca">
              <Icone d={ICONES.busca} />
              <input className="adm-in" type="text" placeholder="Buscar por enunciado, tópico, ano, tipo..." value={termoPesquisa} onChange={(e) => setTermoPesquisa(e.target.value)} aria-label="Buscar questões" />
            </div>
            <Seletor rotulo="Tópico" todos="Todos" valor={fTopico} opcoes={TOPICOS_DISPONIVEIS} onChange={setFTopico} />
            <Seletor rotulo="Tipo" todos="Todos" valor={fTipo} opcoes={TIPOS_QUESTAO} onChange={setFTipo} />
            <Seletor rotulo="Dificuldade" todos="Todas" valor={fDif} opcoes={DIFICULDADES} onChange={setFDif} ponto={classeDif} alinharDireita />
            <Seletor rotulo="Curso" todos="Todos" valor={fCurso} opcoes={CURSOS_DISPONIVEIS} onChange={setFCurso} alinharDireita />
            {(fTopico || fTipo || fDif || fCurso) && (
              <button type="button" className="adm-limpar" onClick={() => { setFTopico(''); setFTipo(''); setFDif(''); setFCurso(''); }}>Limpar filtros</button>
            )}
          </div>

          <div className="adm-card" ref={cardRef}>
            <div className="adm-tabela">
              <table>
                <thead ref={theadRef}>
                  <tr>
                    <th>ID</th>
                    <th>Tópico</th>
                    <th>Tipo</th>
                    <th>Origem</th>
                    <th>Dificuldade</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {questoesPaginadas.map((q, i) => {
                    const { base, curso } = separarOrigem(q.origem);
                    return (
                      <tr key={q.id} ref={i === 0 ? linhaRef : undefined}>
                        <td className="adm-mudo">#{q.id}</td>
                        <td style={{ fontWeight: 700 }}>{q.topico}</td>
                        <td><span className={`adm-chip ${classeTipo(q.tipo_questao)}`}>{q.tipo_questao || 'N/A'}</span></td>
                        <td className="adm-origem">
                          {base}
                          <small>{curso && <span className="adm-curso">{curso}</span>}{q.ano}</small>
                        </td>
                        <td><span className={`adm-dif ${classeDif(q.nivel_dificuldade)}`}>{q.nivel_dificuldade}</span></td>
                        <td>
                          <div className="adm-acoes">
                            <button className="adm-icone" onClick={() => handleVer(q)} aria-label={`Ver questão ${q.id}`} title="Ver"><Icone d={ICONES.olho} /></button>
                            <button className="adm-icone" onClick={() => handleEditar(q)} aria-label={`Editar questão ${q.id}`} title="Editar"><Icone d={ICONES.lapis} /></button>
                            <button className="adm-icone" onClick={() => setIdParaExcluir(q.id)} aria-label={`Excluir questão ${q.id}`} title="Excluir"><Icone d={ICONES.lixo} /></button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {questoesFiltradas.length === 0 && (
                <div className="adm-vazio">
                  {temFiltro ? 'Nenhuma questão encontrada com esses filtros.' : 'Nenhuma questão cadastrada ainda.'}
                </div>
              )}
            </div>

            <div className="adm-rodape-tab" ref={pagRef}>
              <span>
                Mostrando <strong>{questoesFiltradas.length > 0 ? indexInicial + 1 : 0}</strong>–<strong>{Math.min(indexInicial + itensPorPagina, questoesFiltradas.length)}</strong> de <strong>{questoesFiltradas.length}</strong>
              </span>
              <div className="adm-pag">
                <button onClick={() => setPaginaAtual(Math.max(1, paginaSegura - 1))} disabled={paginaSegura === 1} aria-label="Página anterior">‹</button>
                {paginasVisiveis(paginaSegura, totalPaginas).map((p, i) =>
                  p === '…' ? (
                    <button key={`e${i}`} disabled>…</button>
                  ) : (
                    <button key={p} className={p === paginaSegura ? 'on' : ''} onClick={() => setPaginaAtual(p)} aria-label={`Página ${p}`}>{p}</button>
                  )
                )}
                <button onClick={() => setPaginaAtual(Math.min(totalPaginas, paginaSegura + 1))} disabled={paginaSegura === totalPaginas} aria-label="Próxima página">›</button>
              </div>
            </div>
          </div>
        </main>

        <footer className="adm-rodape" ref={footerRef}>
          Instituto Federal de Educação, Ciência e Tecnologia - Campus Igarassu | Izes Stella Barbalho Bezerra
        </footer>

        <div className={`adm-veu ${painel ? 'on' : ''}`} onClick={fecharPainel} />

        <aside className={`adm-vista ${painel === 'ver' ? 'on' : ''}`} role="dialog" aria-label="Detalhes da questão" aria-hidden={painel !== 'ver'}>
          <div className="adm-gh">
            <h3>Questão #{questaoVista?.id}</h3>
            <button className="adm-icone" onClick={fecharPainel} aria-label="Fechar">✕</button>
          </div>
          <div className="adm-gc">
            {questaoVista && (
              <>
                <div className="adm-chips">
                  <span className={`adm-chip ${classeTipo(questaoVista.tipo_questao)}`}>{questaoVista.tipo_questao || 'N/A'}</span>
                  <span className="adm-chip">{questaoVista.topico}</span>
                  <span className={`adm-chip adm-dif ${classeDif(questaoVista.nivel_dificuldade)}`}>{questaoVista.nivel_dificuldade}</span>
                </div>
                <div className="adm-mudo">{separarOrigem(questaoVista.origem).base} - {separarOrigem(questaoVista.origem).curso} {questaoVista.ano}</div>
                <div className="adm-enun">{questaoVista.enunciado}</div>
                {Array.isArray(questaoVista.tabela_enunciado) && (
                  <table className="adm-tab-enun">
                    <tbody>
                      {questaoVista.tabela_enunciado.map((linha: any[], i: number) => (
                        <tr key={i}>{linha.map((c, j) => <td key={j}>{String(c)}</td>)}</tr>
                      ))}
                    </tbody>
                  </table>
                )}
                {questaoVista.codigo_typescript && questaoVista.codigo_typescript.trim() !== '' && (
                  <SyntaxHighlighter
                    language="typescript"
                    style={temaDoTCC}
                    showLineNumbers={true}
                    customStyle={{ margin: 0, borderRadius: '8px', padding: '16px', fontSize: '14px', fontFamily: "Consolas, 'Courier New', monospace", backgroundColor: '#1e1e1e', color: '#ffffff' }}
                  >
                    {questaoVista.codigo_typescript}
                  </SyntaxHighlighter>
                )}
              </>
            )}
          </div>
          <div className="adm-gf">
            <button className="adm-btn" onClick={fecharPainel}>Fechar</button>
            <button className="adm-btn p" onClick={editarDaVisualizacao}>Editar questão</button>
          </div>
        </aside>

        <aside className={`adm-vista ${painel === 'form' ? 'on' : ''}`} role="dialog" aria-label="Formulário da questão" aria-hidden={painel !== 'form'}>
          <form onSubmit={handleSalvar} style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
            <div className="adm-gh">
              <h3>{editandoId ? `Editando questão #${editandoId}` : 'Nova questão'}</h3>
              <button type="button" className="adm-icone" onClick={fecharPainel} aria-label="Fechar">✕</button>
            </div>
            <div className="adm-gc">
              <div className="adm-form-cols">
              <div>
              <div className="adm-secao">Classificação</div>
              <div className="adm-campo">
                <label>Tópico da questão</label>
                <select value={topico} onChange={(e) => setTopico(e.target.value)} required className="adm-in">
                  <option value="" disabled>Selecione um tópico</option>
                  {TOPICOS_DISPONIVEIS.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="adm-g2">
                <div className="adm-campo">
                  <label>Tipo da questão</label>
                  <select value={tipoQuestao} onChange={(e) => setTipoQuestao(e.target.value)} className="adm-in">
                    {TIPOS_QUESTAO.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div className="adm-campo">
                  <label>Dificuldade</label>
                  <select value={dificuldade} onChange={(e) => setDificuldade(e.target.value)} className="adm-in">
                    {DIFICULDADES.map((d) => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              </div>

              <div className="adm-secao">Origem</div>
              <div className="adm-campo">
                <label>Fonte da questão</label>
                <select value={origemBase} onChange={(e) => setOrigemBase(e.target.value)} required className="adm-in">
                  <option value="" disabled>Selecione uma fonte</option>
                  {ORIGENS_BASE.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
              <div className="adm-g2">
                <div className="adm-campo">
                  <label>Curso</label>
                  <select value={origemCurso} onChange={(e) => setOrigemCurso(e.target.value)} className="adm-in">
                    {CURSOS_DISPONIVEIS.map((c) => <option key={c} value={c}>Curso {c}</option>)}
                  </select>
                </div>
                <div className="adm-campo">
                  <label>Período (ano)</label>
                  <input type="text" value={semestre} onChange={(e) => setSemestre(e.target.value)} placeholder="Ex: 2025.1" required className="adm-in" />
                </div>
              </div>

              </div>
              <div>
              <div className="adm-secao">Conteúdo</div>
              <div className="adm-campo">
                <label>Enunciado</label>
                <textarea value={enunciado} onChange={(e) => setEnunciado(e.target.value)} rows={7} required className="adm-in" style={{ resize: 'vertical' }} />
                <div className="adm-dica">Use Enter para quebrar linha.</div>
              </div>
              <div className="adm-campo">
                <label>Tabela (JSON, opcional)</label>
                <textarea value={tabelaEnunciado} onChange={(e) => setTabelaEnunciado(e.target.value)} rows={2} placeholder='Ex: [["A", "B"], ["1", "2"]]' className="adm-in" style={{ fontFamily: 'monospace', resize: 'vertical' }} />
              </div>
              <div className="adm-campo">
                <label>Código TypeScript (opcional)</label>
                <textarea value={codigo} onChange={(e) => setCodigo(e.target.value)} rows={6} placeholder="let x = 10;" className="adm-in" style={{ fontFamily: 'monospace', resize: 'vertical' }} />
              </div>
              </div>
              </div>
            </div>
            <div className="adm-gf">
              <button type="button" className="adm-btn" onClick={fecharPainel}>Cancelar</button>
              <button type="submit" className="adm-btn p">{editandoId ? 'Atualizar questão' : 'Salvar questão'}</button>
            </div>
          </form>
        </aside>

        {idParaExcluir !== null && (
          <div className="adm-modal" onClick={() => setIdParaExcluir(null)}>
            <div className="adm-card adm-confirma" role="alertdialog" aria-modal="true" aria-labelledby="adm-confirma-titulo" onClick={(e) => e.stopPropagation()}>
              <div className="adm-gh">
                <h3 id="adm-confirma-titulo">Excluir questão #{idParaExcluir}</h3>
                <button className="adm-icone" onClick={() => setIdParaExcluir(null)} aria-label="Fechar">✕</button>
              </div>
              <div className="adm-gc">
                A questão será removida do banco de dados. Essa ação não poderá ser desfeita.
              </div>
              <div className="adm-gf adm-confirma-pe">
                <button className="adm-btn perigo" onClick={confirmarExclusao}>Excluir questão</button>
              </div>
            </div>
          </div>
        )}

        {aviso && <div className="adm-aviso" role="status">{aviso}</div>}
      </div>

      <ModalAjudaAdmin isOpen={modalAjudaAberto} onClose={() => setModalAjudaAberto(false)} />
    </>
  );
}
