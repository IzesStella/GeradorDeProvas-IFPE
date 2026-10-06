import { Fragment, useState, useEffect, useLayoutEffect, useRef } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface Questao {
  id: number;
  topico: string;
  enunciado: string;
  codigo_typescript: string;
  nivel_dificuldade: string;
  tipo_questao?: string;
  tabela_enunciado: string[][] | null;
  easter_egg_conteudo: string | null;
  origem: string;
  ano: string | number;
}

interface TelaSimuladoProps {
  questoes: Questao[];
  onVoltar: () => void;
  filtros: any;
}

type Tema = 'claro' | 'escuro';

const ALTURA_MAX_PDF = 790;

const CHAVE_TEMA = 'tema-gerador-provas';
const FUNDO_BODY: Record<Tema, string> = { claro: '#f3f6f4', escuro: '#121418' };

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
Object.keys(coresTCC).forEach(token => {
  if (temaDoTCC[token]) {
    temaDoTCC[token].color = coresTCC[token];
    if (token !== 'comment') temaDoTCC[token].fontStyle = 'normal';
  } else {
    temaDoTCC[token] = { color: coresTCC[token], fontStyle: token === 'comment' ? 'italic' : 'normal' };
  }
});

const listar = (itens: string[]) =>
  itens.length <= 1 ? itens.join('') : `${itens.slice(0, -1).join(', ')} e ${itens[itens.length - 1]}`;

const classeTipo = (t?: string) =>
  (t || '').startsWith('Impl') ? 'tipo-impl' : (t || '').startsWith('Corre') ? 'tipo-corr' : 'tipo-exec';

const classeDif = (d: string) =>
  d === 'Fácil' ? 'd1' : d === 'Média' ? 'd2' : d === 'Difícil' ? 'd3' : 'd4';

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

const IconeLampada = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: '-3px', marginRight: '6px' }} aria-hidden="true">
    <path d="M9 18h6M10 22h4"></path>
    <path d="M15.1 14c.2-1 .7-1.7 1.4-2.5A6 6 0 1 0 7.5 11.5c.7.8 1.2 1.5 1.4 2.5"></path>
  </svg>
);

const IconeAviso = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }} aria-hidden="true">
    <circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line>
  </svg>
);

const TabelaEnunciado = ({ tabelaData }: { tabelaData: string[][] | null }) => {
  if (!tabelaData || !Array.isArray(tabelaData) || tabelaData.length === 0) return null;
  const cabecalhos = tabelaData[0];
  const linhas = tabelaData.slice(1);
  return (
    <div className="tabela-wrap bloco-inquebravel">
      <table className="tabela-enunciado">
        <thead>
          <tr>
            {cabecalhos.map((cabecalho, index) => (
              <th key={index}>{cabecalho}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {linhas.map((linha, rowIndex) => (
            <tr key={rowIndex}>
              {linha.map((celula, cellIndex) => (
                <td key={cellIndex}>{celula}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export function TelaSimulado({ questoes, onVoltar, filtros }: TelaSimuladoProps) {
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

  // dificuldades pedidas que não vieram em nenhuma questão
  const quantidadeSolicitada = Number(filtros?.quantidade) || 0;
  const dificuldadesSolicitadas: string[] = filtros?.dificuldades || [];
  const dificuldadesPresentes = new Set(questoes.map(q => q.nivel_dificuldade));
  const faltantes = dificuldadesSolicitadas.filter((d: string) => !dificuldadesPresentes.has(d));

  const deveMostrarAvisoFaltantes = filtros?.modo === 'livre' && questoes.length > 0 && faltantes.length > 0 && quantidadeSolicitada >= dificuldadesSolicitadas.length;

  const topicosSolicitados: string[] = filtros?.topicos || [];
  const topicosPresentes = Array.from(new Set(questoes.map(q => q.topico)));
  const topicosFaltantes = topicosSolicitados.filter(
    (t) => !topicosPresentes.some((p) => p === t || p.startsWith(`${t} - `))
  );

  const deveMostrarAvisoTopicos = filtros?.modo === 'livre' && questoes.length > 0 && topicosFaltantes.length > 0 && quantidadeSolicitada >= topicosSolicitados.length;

  const quantidadeRetornada = questoes.length;
  const deveMostrarAvisoQuantidade = filtros?.modo === 'livre' && quantidadeRetornada > 0 && quantidadeRetornada < quantidadeSolicitada;

  const handleImprimir = () => {
    const tituloOriginal = document.title;
    document.title = 'Simulado - Lógica de Programação';
    window.addEventListener('afterprint', () => { document.title = tituloOriginal; }, { once: true });
    window.print();
  };

  const [questaoAtiva, setQuestaoAtiva] = useState(0);
  const secoesRef = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const aoRolar = () => {
      let atual = 0;
      secoesRef.current.forEach((el, i) => {
        if (el && el.getBoundingClientRect().top <= 160) atual = i;
      });
      const chegouAoFim = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
      if (chegouAoFim && questoes.length > 0) atual = questoes.length - 1;
      setQuestaoAtiva(atual);
    };
    aoRolar();
    window.addEventListener('scroll', aoRolar, { passive: true });
    window.addEventListener('resize', aoRolar);
    return () => {
      window.removeEventListener('scroll', aoRolar);
      window.removeEventListener('resize', aoRolar);
    };
  }, [questoes.length]);

  const irParaQuestao = (index: number) => {
    const suave = !window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    secoesRef.current[index]?.scrollIntoView({ behavior: suave ? 'smooth' : 'auto', block: 'start' });
  };

  const temIndice = questoes.length > 0;

  const topicosUnicos = Array.from(new Set(questoes.map(q => q.topico))).join(', ');

  // PDF: questão que não cabe em uma folha ganha uma segunda folha só para a resposta
  const [cabem, setCabem] = useState<boolean[]>([]);
  const medidorRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const blocos = Array.from(medidorRef.current?.children ?? []) as HTMLElement[];
    setCabem(blocos.map((bloco) => bloco.offsetHeight <= ALTURA_MAX_PDF));
  }, [questoes]);

  const topoPdf = (
    <>
      <header className="cabecalho-pdf">
        <svg viewBox="0 0 350 470">
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
        <div>
          <h2>Simulado Personalizado</h2>
          <p>Instituto Federal - <em>Campus</em> Igarassu</p>
        </div>
      </header>

      <div className="identificacao-pdf">
        <div>
          <b>Aluno(a):</b><i />
          <b>Data:</b><i className="curta" />
        </div>
        <div>
          <span><b>Tópicos:</b> {topicosUnicos}</span>
        </div>
        <div>
          <span><b>Questões:</b> {questoes.length}</span>
        </div>
      </div>
    </>
  );

  const questaoPdf = (questao: Questao, index: number) => (
    <>
      <div className="bloco-inquebravel">
        <div className="questao-topo-pdf">
          <b>{index + 1}</b>
          <h3>Questão {index + 1} - {questao.topico}</h3>
        </div>
        <div className="questao-meta-pdf">
          <span>Fonte: {questao.origem} ({questao.ano})</span>
          <span>{questao.tipo_questao ? `${questao.tipo_questao} · ` : ''}{questao.nivel_dificuldade}</span>
        </div>
        <div className="enunciado-pdf">
          {formatarEnunciado(questao.enunciado)}
          <TabelaEnunciado tabelaData={questao.tabela_enunciado} />
        </div>
      </div>

      {questao.codigo_typescript && questao.codigo_typescript.trim() !== '' && (
        <div className="codigo-pdf">
          <SyntaxHighlighter
            language="typescript"
            style={temaDoTCC}
            customStyle={{ borderRadius: '6px', padding: '10px 12px', fontSize: '12px', fontFamily: "Consolas, 'Courier New', monospace", backgroundColor: '#1e1e1e', margin: 0 }}
          >
            {questao.codigo_typescript}
          </SyntaxHighlighter>
        </div>
      )}
    </>
  );

  const respostaPdf = (index: number, outraFolha = false) => (
    <div className="resposta-pdf">
      <p>{outraFolha ? `Sua resposta (Questão ${index + 1}):` : 'Sua resposta:'}</p>
      <div></div>
    </div>
  );

  const rodapePdf = (index: number) => (
    <footer className="rodape-pdf">
      <span>IFPE Campus Igarassu</span>
      <span>Questão {index + 1} de {questoes.length}</span>
    </footer>
  );

  const formatarEnunciado = (texto: string) => {
    if (!texto) return null;
    return texto.split('\n').map((linha, index) => {
      const ehPadraoCodigo = linha.trim().length > 0 && !/[a-z]/.test(linha) && /[X#\*\-\+\[\]\(\)\=]/.test(linha);
      return (
        <span
          key={index}
          style={{
            display: 'block',
            fontFamily: ehPadraoCodigo ? "Consolas, 'Courier New', monospace" : 'inherit',
            letterSpacing: ehPadraoCodigo ? '2px' : 'normal',
            minHeight: '1.6em'
          }}
        >
          {linha}
        </span>
      );
    });
  };

  return (
    <div className="tela-simulado" data-tema={tema}>
      <style>
        {`
        body, html { margin: 0 !important; padding: 0 !important; width: 100%; }
        .tela-simulado, .tela-simulado *, .tela-simulado *::before, .tela-simulado *::after { box-sizing: border-box; }

        .tela-simulado {
          --bg: #f3f6f4; --card: #ffffff; --tx: #17211b; --mu: #55625b; --rodape: #66736b;
          --bd: #dce4df; --bd2: #aab7af;
          --g: #1f7a3d; --on: #ffffff; --gl: #e6f4ea;
          --impl-bg: #e6f4ea; --impl: #17602f; --exec-bg: #eef2ef; --exec: #55625b; --corr-bg: #d8f0f1; --corr: #0f6b73;
          --warn: #8a5a00; --warn-bg: rgba(240,184,74,.18); --warn-bd: #e0a52e;
          --info: #0d4f8b; --info-bg: #e3f0fb; --info-bd: #3d8fd6;
          --sombra: 0 6px 24px rgba(23,33,27,.06); --logo: #111111; --chip: #eef2ef;
        }
        .tela-simulado[data-tema='escuro'] {
          --bg: #121418; --card: #1a1d24; --tx: #e8efea; --mu: #a0aab5; --rodape: #6a737d;
          --bd: #2a2d35; --bd2: #4a525c;
          --g: #36a860; --on: #121418; --gl: rgba(54,168,96,.16);
          --impl-bg: rgba(54,168,96,.16); --impl: #7fe3a2; --exec-bg: #2a2d35; --exec: #a0aab5; --corr-bg: #12353a; --corr: #6fd3da;
          --warn: #f0b84a; --warn-bg: rgba(240,184,74,.12); --warn-bd: #f0b84a;
          --info: #8ec5f7; --info-bg: rgba(61,143,214,.14); --info-bd: #3d8fd6;
          --sombra: 0 10px 40px rgba(0,0,0,.3); --logo: #ffffff; --chip: #2a2d35;
        }
        .tela-simulado .d1 { --c: #1f7a3d; --b: #e6f4ea; --t: #17602f; }
        .tela-simulado .d2 { --c: #b7791f; --b: #fff3d6; --t: #8a5a00; }
        .tela-simulado .d3 { --c: #c2501f; --b: #fde8df; --t: #a23a10; }
        .tela-simulado .d4 { --c: #a3203f; --b: #fbe3ea; --t: #8e1d3b; }
        .tela-simulado[data-tema='escuro'] .d1 { --c: #5fd38a; --b: rgba(95,211,138,.14); --t: #7fe3a2; }
        .tela-simulado[data-tema='escuro'] .d2 { --c: #f0b84a; --b: rgba(240,184,74,.14); --t: #f6c866; }
        .tela-simulado[data-tema='escuro'] .d3 { --c: #f08a5d; --b: rgba(240,138,93,.14); --t: #f6a07a; }
        .tela-simulado[data-tema='escuro'] .d4 { --c: #f27a96; --b: rgba(242,122,150,.14); --t: #f79bb1; }

        .tela-simulado { background-color: var(--bg); color: var(--tx); font-family: system-ui, -apple-system, sans-serif; }
        .tela-simulado button { font-family: inherit; }
        .tela-simulado button:focus-visible { outline: 2px solid var(--g); outline-offset: 2px; }

        .header-sim { background-color: var(--card); padding: 15px 5vw; display: flex; align-items: center; border-bottom: 1px solid var(--bd); }
        .header-sim > div { flex: 1; display: flex; align-items: center; }
        .sim-titulo-cab { font-size: 18px; font-weight: bold; color: var(--tx); text-align: center; }
        .sim-contagem { font-size: 14px; font-weight: bold; color: var(--mu); white-space: nowrap; }
        .sim-btn { background: transparent; color: var(--mu); border: 1px solid var(--bd); padding: 8px 15px; border-radius: 6px; cursor: pointer; font-size: 14px; font-weight: bold; white-space: nowrap; }
        .sim-btn:hover { color: var(--tx); border-color: var(--bd2); }
        .sim-btn.p { background: var(--g); border-color: var(--g); color: var(--on); }
        .sim-btn.p:hover { filter: brightness(1.08); color: var(--on); border-color: var(--g); }
        .sim-btn-circ { width: 32px; height: 32px; border-radius: 50%; background-color: var(--chip); color: var(--tx); border: none; display: flex; align-items: center; justify-content: center; cursor: pointer; flex-shrink: 0; transition: 0.2s; padding: 0; }
        .sim-btn-circ:hover { background-color: var(--g); color: var(--on); }

        .sim-main { flex: 1 0 auto; width: 100%; max-width: 960px; margin: 0 auto; padding: 28px 20px 40px; }

        .sim-aviso { display: flex; align-items: flex-start; gap: 12px; padding: 14px 18px; border-radius: 10px; background: var(--card); border: 1px solid var(--bd); border-left: 4px solid var(--bd2); color: var(--mu); margin-bottom: 12px; font-size: 14px; line-height: 1.5; }
        .sim-aviso strong { color: var(--tx); font-weight: 600; }
        .sim-aviso.info { border-left-color: var(--info-bd); }
        .sim-aviso.info svg { color: var(--info-bd); }
        .sim-aviso.warn { border-left-color: var(--warn-bd); }
        .sim-aviso.warn svg { color: var(--warn-bd); }
        .sim-aviso svg { margin-top: 1px; }
        .sim-avisos { margin-bottom: 24px; }

        .sim-card { background: var(--card); border: 1px solid var(--bd); border-radius: 16px; padding: 22px 24px; margin-bottom: 32px; box-shadow: var(--sombra); }
        .sim-card-topo { display: flex; justify-content: space-between; align-items: center; gap: 12px; flex-wrap: wrap; padding-bottom: 16px; border-bottom: 1px solid var(--bd); margin-bottom: 18px; }
        .sim-card-topo h3 { margin: 0; font-size: 17px; line-height: 1.2; }
        .sim-fonte { font-size: 13px; color: var(--mu); margin-top: 6px; display: inline-block; }
        .sim-chips { display: flex; gap: 8px; flex-wrap: wrap; }
        .sim-chip { display: inline-flex; align-items: center; gap: 7px; border-radius: 999px; padding: 4px 12px; font-size: 12px; font-weight: 600; background: var(--chip); color: var(--tx); white-space: nowrap; }
        .sim-chip.dif { background: var(--b); color: var(--t); }
        .sim-chip.tipo-impl { background: var(--impl-bg); color: var(--impl); }
        .sim-chip.tipo-exec { background: var(--exec-bg); color: var(--exec); }
        .sim-chip.tipo-corr { background: var(--corr-bg); color: var(--corr); }
        .sim-chip.dif::before { content: ''; width: 8px; height: 8px; border-radius: 50%; background: var(--c); }
        .sim-enunciado { font-size: 16px; line-height: 1.6; margin-bottom: 20px; }
        .sim-easter { background: var(--warn-bg); border: 1px solid var(--warn-bd); border-radius: 10px; margin-top: 20px; padding: 12px 14px; color: var(--warn); font-size: 14px; word-break: break-word; }
        .sim-easter a { color: inherit; text-decoration: underline; font-weight: normal; }

        .sim-vazio { text-align: center; padding: 44px 28px; }
        .sim-vazio h2 { margin: 0 0 10px; font-size: 22px; }
        .sim-vazio p { font-size: 15px; color: var(--mu); max-width: 520px; margin: 0 auto 20px; line-height: 1.6; }
        .sim-vazio .sim-aviso { text-align: left; max-width: 520px; margin: 0 auto 24px; }
        .sim-vazio .sim-btn { height: 48px; padding: 0 30px; border-radius: 10px; font-size: 16px; }

        .tabela-enunciado { width: 100%; border-collapse: collapse; font-size: 14px; border: 1px solid var(--bd, #ddd); }
        .tabela-enunciado th { padding: 10px 12px; border: 1px solid var(--bd, #ddd); text-align: left; background: var(--chip, #f2f2f2); color: var(--tx, #333); }
        .tabela-enunciado td { padding: 10px 12px; border: 1px solid var(--bd, #ddd); color: var(--tx, #444); }

        .rodape-sim { border-top: 1px solid var(--bd); padding: 15px; text-align: center; color: var(--rodape); font-size: 12px; }

        @media screen {
          .documento-pdf { display: none !important; }
          .tela-sistema { width: 100%; min-height: 100vh; display: flex; flex-direction: column; }
        }

        .sim-conteudo { min-width: 0; }
        .sim-indice { display: none; }
        .sim-card { scroll-margin-top: 20px; }

        @media screen and (min-width: 1100px) {
          .sim-main.com-indice { max-width: 1260px; display: grid; grid-template-columns: 260px minmax(0, 1fr); gap: 24px; align-items: start; }
          .sim-indice { display: flex; flex-direction: column; position: sticky; top: 20px; max-height: calc(100vh - 40px); background: var(--card); border: 1px solid var(--bd); border-radius: 16px; box-shadow: var(--sombra); padding: 18px 12px 12px; }
          .sim-indice-topo { padding: 0 8px 12px; border-bottom: 1px solid var(--bd); margin-bottom: 8px; }
          .sim-indice-topo strong { display: block; font-size: 15px; }
          .sim-indice-topo span { font-size: 13px; color: var(--mu); }
          .sim-progresso { height: 4px; border-radius: 999px; background: var(--chip); margin-top: 10px; overflow: hidden; }
          .sim-progresso i { display: block; height: 100%; background: var(--g); border-radius: 999px; transition: width .2s; }
          .sim-indice ol { list-style: none; margin: 0; padding: 0; overflow-y: auto; }
          .sim-indice-item { display: flex; align-items: center; gap: 10px; width: 100%; text-align: left; background: none; border: 1.5px solid transparent; border-radius: 10px; padding: 8px; cursor: pointer; color: var(--tx); }
          .sim-indice-item:hover { background: var(--chip); }
          .sim-indice-item b { flex: none; width: 26px; height: 26px; border-radius: 50%; display: grid; place-items: center; font-size: 12px; background: var(--chip); color: var(--mu); }
          .sim-indice-item b { font-weight: 600; }
          .sim-indice-item > span { min-width: 0; font-size: 13px; font-weight: 400; line-height: 1.35; }
          .sim-indice-item small { display: block; font-size: 12px; font-weight: 400; color: var(--mu); }
          .sim-indice-item.on { background: var(--gl); border-color: var(--g); }
          .sim-indice-item.on > span { font-weight: 600; }
          .sim-indice-item.on small { font-weight: 400; }
          .sim-indice-item.on b { background: var(--g); color: var(--on); }
        }
        @media (prefers-reduced-motion: reduce) { .sim-progresso i { transition: none; } }

        @media screen and (min-width: 1700px) {
          .sim-main.com-indice { max-width: 1520px; grid-template-columns: 310px minmax(0, 1fr); gap: 30px; }
          .sim-indice-topo strong { font-size: 17px; }
          .sim-indice-topo span, .sim-indice-item > span { font-size: 15px; }
          .sim-indice-item small { font-size: 13px; }
          .sim-indice-item b { width: 30px; height: 30px; font-size: 13px; }
          .header-sim { padding: 18px 4vw; }
          .header-sim svg.sim-logo { height: 46px; }
          .sim-titulo-cab { font-size: 20px; }
          .sim-contagem { font-size: 15px; }
          .sim-btn { font-size: 15px; padding: 10px 18px; }
          .sim-btn-circ { width: 38px; height: 38px; }
          .sim-main { max-width: 1160px; padding: 38px 20px 50px; }
          .sim-aviso { font-size: 16px; padding: 18px 22px; }
          .sim-card { padding: 30px 34px; border-radius: 18px; margin-bottom: 40px; }
          .sim-card-topo h3 { font-size: 21px; }
          .sim-fonte { font-size: 15px; }
          .sim-chip { font-size: 13px; padding: 5px 14px; }
          .sim-enunciado { font-size: 18px; }
          .rodape-sim { font-size: 13px; padding: 20px; }
        }
        @media screen and (min-width: 2200px) {
          .sim-main.com-indice { max-width: 1840px; grid-template-columns: 370px minmax(0, 1fr); }
          .sim-indice-topo strong { font-size: 20px; }
          .sim-indice-topo span, .sim-indice-item > span { font-size: 18px; }
          .sim-indice-item small { font-size: 15px; }
          .sim-indice-item b { width: 36px; height: 36px; font-size: 15px; }
          .header-sim { padding: 22px 4vw; }
          .header-sim svg.sim-logo { height: 56px; }
          .sim-titulo-cab { font-size: 24px; }
          .sim-contagem { font-size: 17px; }
          .sim-btn { font-size: 17px; padding: 12px 22px; }
          .sim-btn-circ { width: 46px; height: 46px; }
          .sim-main { max-width: 1400px; padding: 48px 20px 60px; }
          .sim-aviso { font-size: 19px; }
          .sim-card { padding: 38px 44px; margin-bottom: 48px; }
          .sim-card-topo h3 { font-size: 26px; }
          .sim-fonte { font-size: 18px; }
          .sim-chip { font-size: 15px; }
          .sim-enunciado { font-size: 21px; }
          .rodape-sim { font-size: 15px; }
        }
        @media screen and (max-width: 960px) {
          .header-sim { flex-wrap: wrap; padding: 15px 20px; }
          .header-sim > div { flex: unset; }
          .header-sim > div:nth-child(1) { width: 35%; }
          .header-sim > div:nth-child(3) { width: 65%; }
          .header-sim > div:nth-child(2) { width: 100%; margin-top: 15px; order: 3; }
          .header-sim svg.sim-logo { height: 35px; }
        }
        @media screen and (max-width: 600px) {
          .header-sim > div:nth-child(1), .header-sim > div:nth-child(3) { width: 100%; justify-content: center !important; }
          .header-sim > div:nth-child(3) { margin-top: 12px; flex-wrap: wrap; }
          .sim-main { padding: 20px 14px 30px; }
          .sim-card { padding: 18px 16px; }
        }

        .tabela-wrap { overflow-x: auto; margin: 20px 0; }

        .medidor-pdf { position: absolute; left: -10000px; top: 0; width: 178mm; visibility: hidden; pointer-events: none; }
        .medidor-pdf > div { display: flow-root; }
        .pagina-pdf, .medidor-pdf { font-family: Arial, sans-serif; color: #222; }

        .cabecalho-pdf { display: flex; align-items: center; gap: 16px; padding-bottom: 12px; border-bottom: 2px solid #e2e2e2; margin-bottom: 14px; }
        .cabecalho-pdf svg { height: 46px; flex-shrink: 0; }
        .cabecalho-pdf > div { border-left: 3px solid #2f9e41; padding-left: 14px; }
        .cabecalho-pdf h2 { margin: 0; font-size: 19px; color: #111; }
        .cabecalho-pdf p { margin: 2px 0 0; font-size: 12px; color: #555; }

        .identificacao-pdf { border: 1px solid #bbb; border-radius: 6px; padding: 12px 14px; margin-bottom: 18px; font-size: 13px; color: #111; display: flex; flex-direction: column; gap: 10px; }
        .identificacao-pdf > div { display: flex; align-items: flex-end; gap: 6px; }
        .identificacao-pdf i { flex: 1; border-bottom: 1px solid #555; height: 14px; }
        .identificacao-pdf i.curta { flex: 0 0 34mm; }
        .identificacao-pdf b { margin-left: 10px; }
        .identificacao-pdf b:first-child { margin-left: 0; }

        .questao-topo-pdf { display: flex; align-items: center; gap: 10px; }
        .questao-topo-pdf b { flex: none; width: 26px; height: 26px; border-radius: 6px; background: #2f9e41; color: #fff; display: flex; align-items: center; justify-content: center; font-size: 13px; }
        .questao-topo-pdf h3 { margin: 0; font-size: 15px; color: #111; }
        .questao-meta-pdf { display: flex; justify-content: space-between; gap: 12px; margin: 4px 0 10px 36px; font-size: 11px; color: #555; }
        .enunciado-pdf { font-size: 14px; line-height: 1.5; color: #222; margin-bottom: 12px; }
        .codigo-pdf { margin-bottom: 12px; }

        .pagina-pdf .tabela-wrap, .medidor-pdf .tabela-wrap { margin: 10px 0; }
        .pagina-pdf .tabela-enunciado, .medidor-pdf .tabela-enunciado { font-size: 12px; }
        .pagina-pdf .tabela-enunciado th, .pagina-pdf .tabela-enunciado td,
        .medidor-pdf .tabela-enunciado th, .medidor-pdf .tabela-enunciado td { padding: 6px 10px; }

        .resposta-pdf { flex: 1; display: flex; flex-direction: column; min-height: 45mm; break-inside: avoid; page-break-inside: avoid; }
        .resposta-pdf p { margin: 0 0 6px; font-size: 13px; font-weight: bold; color: #333; }
        .resposta-pdf div { flex: 1; border: 1px solid #999; border-radius: 6px; background: #fff; }
        .espaco-pdf { flex: 1; }

        .rodape-pdf { display: flex; justify-content: space-between; gap: 12px; margin-top: 7mm; padding-top: 3mm; border-top: 1px solid #e2e2e2; font-size: 10px; color: #666; }

        @media print {
          @page { size: A4 portrait; margin: 0; }
          * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
          body, html { background-color: white !important; }
          .tela-sistema, .medidor-pdf { display: none !important; }
          .tela-simulado, .tela-simulado[data-tema='escuro'] { background-color: white !important; color: #222; --bd: #ddd; --chip: #f2f2f2; --tx: #333; }
          .documento-pdf { display: block !important; width: 100%; background-color: white !important; }

          .pagina-pdf { min-height: 295mm; padding: 14mm 16mm 9mm; display: flex; flex-direction: column; -webkit-box-decoration-break: clone; box-decoration-break: clone; }
          .pagina-pdf + .pagina-pdf { break-before: page; page-break-before: always; }

          .bloco-inquebravel { break-inside: avoid !important; page-break-inside: avoid !important; }
          pre { white-space: pre-wrap !important; word-wrap: break-word !important; break-inside: avoid !important; page-break-inside: avoid !important; }
        }
      `}
      </style>

      {/* TELA DO SISTEMA */}
      <div className="tela-sistema">
        <header className="header-sim">
          <div style={{ justifyContent: 'flex-start' }}>
            <svg className="sim-logo" viewBox="0 0 2300 470" height="40" style={{ flexShrink: 0, maxWidth: '100%', color: 'var(--logo)' }}>
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
            <span className="sim-titulo-cab">Simulado Personalizado</span>
          </div>
          <div style={{ justifyContent: 'flex-end', gap: '15px' }}>
            <span className="sim-contagem">Questões: {questoes.length}</span>
            {questoes.length > 0 && (
              <button type="button" className="sim-btn p" onClick={handleImprimir}>
                Imprimir PDF
              </button>
            )}
            <button type="button" className="sim-btn" onClick={onVoltar}>
              Voltar
            </button>
            <button
              type="button"
              className="sim-btn-circ"
              onClick={alternarTema}
              aria-label={tema === 'escuro' ? 'Mudar para o tema claro' : 'Mudar para o tema escuro'}
              title={tema === 'escuro' ? 'Tema claro' : 'Tema escuro'}
            >
              <IconeTema tema={tema} />
            </button>
          </div>
        </header>

        <main className={`sim-main ${temIndice ? 'com-indice' : ''}`}>

          {/* ÍNDICE LATERAL (só em tela larga) */}
          {temIndice && (
            <nav className="sim-indice" aria-label="Índice das questões">
              <div className="sim-indice-topo">
                <strong>Neste simulado</strong>
                <span>Questão {questaoAtiva + 1} de {questoes.length}</span>
                <div className="sim-progresso" aria-hidden="true">
                  <i style={{ width: `${((questaoAtiva + 1) / questoes.length) * 100}%` }} />
                </div>
              </div>
              <ol>
                {questoes.map((questao, index) => (
                  <li key={questao.id}>
                    <button
                      type="button"
                      className={`sim-indice-item ${index === questaoAtiva ? 'on' : ''}`}
                      aria-current={index === questaoAtiva ? 'true' : undefined}
                      onClick={() => irParaQuestao(index)}
                    >
                      <b>{index + 1}</b>
                      <span>
                        {questao.topico}
                        <small>{questao.tipo_questao ? `${questao.tipo_questao} · ` : ''}{questao.nivel_dificuldade}</small>
                      </span>
                    </button>
                  </li>
                ))}
              </ol>
            </nav>
          )}

          <div className="sim-conteudo">

          {(deveMostrarAvisoQuantidade || deveMostrarAvisoTopicos || deveMostrarAvisoFaltantes) && (
            <div className="sim-avisos">
              {/* AVISO: Quantidade Insuficiente no Banco */}
              {deveMostrarAvisoQuantidade && (
                <div className="sim-aviso info" role="status">
                  <IconeAviso />
                  <div>
                    <strong>Aviso de Quantidade:</strong> Você solicitou <strong>{quantidadeSolicitada}</strong> questões, mas só encontramos <strong>{quantidadeRetornada}</strong> cadastradas com esses filtros. <br />
                    Para treinar mais, tente marcar outros tópicos ou dificuldades!
                  </div>
                </div>
              )}

              {/* AVISO: Tópicos sem questões */}
              {deveMostrarAvisoTopicos && (
                <div className="sim-aviso warn" role="status">
                  <IconeAviso />
                  <div>
                    <strong>Aviso de Tópico:</strong> Não encontramos questões de <strong>{listar(topicosFaltantes)}</strong> para {dificuldadesSolicitadas.length > 1 ? 'os níveis de dificuldade selecionados' : 'o nível de dificuldade selecionado'}. <br />
                    Exibindo apenas os tópicos disponíveis para garantir seu estudo.
                  </div>
                </div>
              )}

              {/* AVISO: Dificuldades Faltantes */}
              {deveMostrarAvisoFaltantes && (
                <div className="sim-aviso warn" role="status">
                  <IconeAviso />
                  <div>
                    <strong>Aviso de Dificuldade:</strong> Não encontramos questões de nível <strong>{listar(faltantes)}</strong> para os tópicos selecionados. <br />
                    Exibindo apenas as dificuldades disponíveis para garantir seu estudo.
                  </div>
                </div>
              )}
            </div>
          )}

          {/* AVISO: Nenhuma questão encontrada */}
          {questoes.length === 0 ? (
            <div className="sim-card sim-vazio">
              <h2>Nenhuma questão foi encontrada.</h2>
              <p>
                Não temos questões cadastradas que combinem exatamente com os <strong>tópicos</strong> e a <strong>dificuldade</strong> selecionados.
              </p>
              <div className="sim-aviso warn">
                <IconeAviso />
                <div>
                  <strong>Dica:</strong> Assuntos introdutórios (como Operadores, Tipos e Variáveis) geralmente possuem apenas questões de nível Fácil ou Média. Ajuste os filtros e tente novamente!
                </div>
              </div>
              <button type="button" className="sim-btn p" onClick={onVoltar}>
                Voltar para configurações
              </button>
            </div>
          ) : (
            questoes.map((questao, index) => (
              <section key={questao.id} className="sim-card" ref={(el) => { secoesRef.current[index] = el; }}>
                <div className="sim-card-topo">
                  <div>
                    <h3>Questão {index + 1}</h3>
                    <span className="sim-fonte">
                      Fonte: {questao.origem} ({questao.ano})
                    </span>
                  </div>
                  <div className="sim-chips">
                    {questao.tipo_questao && (
                      <span className={`sim-chip ${classeTipo(questao.tipo_questao)}`}>{questao.tipo_questao}</span>
                    )}
                    <span className="sim-chip">{questao.topico}</span>
                    <span className={`sim-chip dif ${classeDif(questao.nivel_dificuldade)}`}>
                      {questao.nivel_dificuldade}
                    </span>
                  </div>
                </div>

                <div className="sim-enunciado">
                  {formatarEnunciado(questao.enunciado)}
                  <TabelaEnunciado tabelaData={questao.tabela_enunciado} />
                </div>

                {questao.codigo_typescript && questao.codigo_typescript.trim() !== '' && (
                  <SyntaxHighlighter
                    language="typescript"
                    style={temaDoTCC}
                    showLineNumbers={true}
                    customStyle={{ margin: 0, borderRadius: '10px', border: '1px solid var(--bd)', padding: '20px', fontSize: '14px', fontFamily: "Consolas, 'Courier New', monospace", backgroundColor: '#1e1e1e', color: '#ffffff' }}
                  >
                    {questao.codigo_typescript}
                  </SyntaxHighlighter>
                )}

                {questao.easter_egg_conteudo && (
                  <div className="sim-easter">
                    <IconeLampada />
                    Easter egg:{" "}
                    {questao.easter_egg_conteudo.split(/(https?:\/\/[^\s]+)/g).map((part, i) =>
                      part.match(/https?:\/\/[^\s]+/) ? (
                        <a key={i} href={part} target="_blank" rel="noopener noreferrer">
                          {part}
                        </a>
                      ) : (
                        part
                      )
                    )}
                  </div>
                )}
              </section>
            ))
          )}
          </div>
        </main>

        <footer className="rodape-sim">
          Instituto Federal de Educação, Ciência e Tecnologia - Campus Igarassu | Izes Stella Barbalho Bezerra
        </footer>
      </div>

      <div className="medidor-pdf" ref={medidorRef} aria-hidden="true">
        {questoes.map((questao, index) => (
          <div key={`medir-${questao.id}`}>
            {index === 0 && topoPdf}
            {questaoPdf(questao, index)}
          </div>
        ))}
      </div>

      {/* TELA DE IMPRESSÃO (PDF) */}
      <div className="documento-pdf">
        {questoes.map((questao, index) => {
          const cabe = cabem[index] ?? true;
          return (
            <Fragment key={`print-${questao.id}`}>
              <div className="pagina-pdf">
                {index === 0 && topoPdf}
                {questaoPdf(questao, index)}
                {cabe ? respostaPdf(index) : <div className="espaco-pdf"></div>}
                {rodapePdf(index)}
              </div>
              {!cabe && (
                <div className="pagina-pdf">
                  {respostaPdf(index, true)}
                  {rodapePdf(index)}
                </div>
              )}
            </Fragment>
          );
        })}
      </div>
    </div>
  );
}
