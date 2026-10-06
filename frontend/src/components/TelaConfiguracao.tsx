import { useState, useEffect, useRef } from 'react';
import { ModalSobre } from './ModalSobre';

interface TelaConfiguracaoProps {
  onGerar: (filtros: any) => void;
  onAcessarAdmin: () => void;
}

const TOPICOS_PADRAO = [
  'Operadores, Tipos e Variáveis',
  'Execução Condicional',
  'Operadores Lógicos',
  'Laços',
  'Subprogramas',
  'Vetores',
  'Arrays',
  'Tipos',
  'Recursão - Unidade 1',
  'Recursão - Unidade 2'
];

const TOPICOS_MINIPROVA = [
  'Operadores, Tipos e Variáveis',
  'Execução Condicional',
  'Operadores Lógicos',
  'Laços - Parte 1',
  'Laços - Parte 2',
  'Subprogramas',
  'Vetores',
  'Arrays',
  'Tipos'
];

type ModoProva = 'livre' | 'unidade1' | 'unidade2' | 'miniprova' | 'final';
type Tema = 'claro' | 'escuro';

const QTD_FIXA: Record<Exclude<ModoProva, 'livre'>, number> = {
  unidade1: 7,
  unidade2: 6,
  miniprova: 2,
  final: 6
};

const MODOS: { id: ModoProva; titulo: string; descricao: string }[] = [
  { id: 'livre', titulo: 'Modelo Livre', descricao: 'Personalize manualmente os tópicos e o nível de dificuldade desejado.' },
  { id: 'unidade1', titulo: '1ª Unidade', descricao: 'Simulado do primeiro ciclo do componente curricular, abordando os primeiros assuntos até Subprogramas.' },
  { id: 'unidade2', titulo: '2ª Unidade', descricao: 'Simulado do segundo ciclo do componente curricular, focado em Vetores, Arrays e Tipos.' },
  { id: 'miniprova', titulo: 'Mini-prova', descricao: 'Formato de avaliação semanal: 1 questão de Implementação e 1 de Execução.' },
  { id: 'final', titulo: 'Avaliação Final', descricao: 'Revisão de toda a ementa.' }
];

const NIVEIS = [
  { nome: 'Fácil', classe: 'd1' },
  { nome: 'Média', classe: 'd2' },
  { nome: 'Difícil', classe: 'd3' },
  { nome: 'Muito Difícil', classe: 'd4' }
];

// Mesma chave usada pelo painel admin, para o tema ser um só em todo o sistema
const CHAVE_TEMA = 'tema-gerador-provas';
const FUNDO_BODY: Record<Tema, string> = { claro: '#f3f6f4', escuro: '#121418' };

const LockIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: '-1px' }}>
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
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

export function TelaConfiguracao({ onGerar, onAcessarAdmin }: TelaConfiguracaoProps) {
  const [modoAtivo, setModoAtivo] = useState<ModoProva>('livre');
  const [topicosSelecionados, setTopicosSelecionados] = useState<string[]>([]);
  const [quantidade, setQuantidade] = useState(5);
  const [dificuldadesSelecionadas, setDificuldadesSelecionadas] = useState<string[]>(['Fácil', 'Média', 'Difícil']);
  const [erro, setErro] = useState<string | null>(null);

  const [modalSobreAberto, setModalSobreAberto] = useState(false);

  const [tema, setTema] = useState<Tema>(() => {
    try {
      const salvo = localStorage.getItem(CHAVE_TEMA);
      if (salvo === 'claro' || salvo === 'escuro') return salvo;
    } catch {
    }
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'escuro' : 'claro';
  });

  const estadoLivreRef = useRef({
    topicos: [] as string[],
    quantidade: 5,
    dificuldades: ['Fácil', 'Média', 'Difícil']
  });

  const topicosAtuais = modoAtivo === 'miniprova' ? TOPICOS_MINIPROVA : TOPICOS_PADRAO;

  useEffect(() => {
    try {
      localStorage.setItem(CHAVE_TEMA, tema);
    } catch {
    }
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

  useEffect(() => {
    switch (modoAtivo) {
      case 'miniprova':
        setQuantidade(QTD_FIXA.miniprova);
        setDificuldadesSelecionadas([]);
        setTopicosSelecionados([]);
        break;
      case 'unidade1':
        setQuantidade(QTD_FIXA.unidade1);
        setDificuldadesSelecionadas(['Fácil', 'Média', 'Difícil', 'Muito Difícil']);
        setTopicosSelecionados([
          'Operadores, Tipos e Variáveis',
          'Operadores Lógicos',
          'Execução Condicional',
          'Laços',
          'Subprogramas',
          'Recursão - Unidade 1'
        ]);
        break;
      case 'unidade2':
        setQuantidade(QTD_FIXA.unidade2);
        setDificuldadesSelecionadas(['Fácil', 'Média', 'Difícil', 'Muito Difícil']);
        setTopicosSelecionados(['Vetores', 'Arrays', 'Tipos', 'Recursão - Unidade 2']);
        break;
      case 'final':
        setQuantidade(QTD_FIXA.final);
        setDificuldadesSelecionadas(['Fácil', 'Média', 'Difícil', 'Muito Difícil']);
        setTopicosSelecionados(['Vetores', 'Arrays', 'Tipos', 'Recursão - Unidade 2']);
        break;
      case 'livre':
        setQuantidade(estadoLivreRef.current.quantidade);
        setDificuldadesSelecionadas(estadoLivreRef.current.dificuldades);
        setTopicosSelecionados(estadoLivreRef.current.topicos);
        break;
    }
    setErro(null);
  }, [modoAtivo]);

  const isQtdLocked = modoAtivo !== 'livre';
  const isDifLocked = modoAtivo === 'unidade1' || modoAtivo === 'unidade2' || modoAtivo === 'final';
  const isTopicosLocked = modoAtivo === 'unidade1' || modoAtivo === 'unidade2' || modoAtivo === 'final';

  const handleToggleTopico = (topico: string) => {
    if (isTopicosLocked) return;
    setTopicosSelecionados(prev => {
      if (modoAtivo === 'miniprova') {
        return prev.includes(topico) ? [] : [topico];
      }
      const novosTopicos = prev.includes(topico) ? prev.filter(t => t !== topico) : [...prev, topico];
      if (modoAtivo === 'livre') estadoLivreRef.current.topicos = novosTopicos;
      return novosTopicos;
    });
    setErro(null);
  };

  const handleSelecionarTodos = () => {
    if (modoAtivo !== 'livre') return;
    const todosMarcados = topicosSelecionados.length === topicosAtuais.length;
    const novos = todosMarcados ? [] : [...topicosAtuais];
    estadoLivreRef.current.topicos = novos;
    setTopicosSelecionados(novos);
    setErro(null);
  };

  const handleToggleDificuldade = (nivel: string) => {
    if (isDifLocked || modoAtivo === 'miniprova') return;
    setDificuldadesSelecionadas(prev => {
      const novasDificuldades = prev.includes(nivel) ? prev.filter(d => d !== nivel) : [...prev, nivel];
      if (modoAtivo === 'livre') estadoLivreRef.current.dificuldades = novasDificuldades;
      return novasDificuldades;
    });
    setErro(null);
  };

  const handleQuantidadeChange = (delta: number) => {
    if (isQtdLocked) return;
    const novaQtd = Math.min(12, Math.max(1, quantidade + delta));
    setQuantidade(novaQtd);
    if (modoAtivo === 'livre') estadoLivreRef.current.quantidade = novaQtd;
  };

  const handleGerar = () => {
    if (topicosSelecionados.length === 0) {
      setErro('Selecione pelo menos um tópico!');
      return;
    }
    if (modoAtivo !== 'miniprova' && dificuldadesSelecionadas.length === 0) {
      setErro('Selecione pelo menos um nível de dificuldade!');
      return;
    }
    setErro(null);
    onGerar({
      modo: modoAtivo,
      topicos: topicosSelecionados,
      quantidade,
      dificuldades: dificuldadesSelecionadas
    });
  };

  const nomeModo = MODOS.find(m => m.id === modoAtivo)?.titulo ?? '';
  const resumoTopicos =
    topicosSelecionados.length === 0
      ? 'Nenhum tópico selecionado'
      : topicosSelecionados.length <= 2
        ? topicosSelecionados.join(', ')
        : `${topicosSelecionados.length} tópicos`;
  const resumoDificuldade =
    modoAtivo === 'miniprova'
      ? 'Dificuldade automática'
      : dificuldadesSelecionadas.length > 0
        ? dificuldadesSelecionadas.join(', ')
        : 'Nenhuma dificuldade';

  const etiquetaModo = (id: ModoProva) => (id === 'livre' ? 'até 12' : `${QTD_FIXA[id]} questões`);
  const roleTopico = modoAtivo === 'miniprova' ? 'radio' : 'checkbox';

  return (
    <>
      <style>{`
        body, html { margin: 0; padding: 0; width: 100%; overflow-x: hidden; }
        *, *::before, *::after { box-sizing: border-box; }

        .tela-config {
          --bg: #f3f6f4; --card: #ffffff; --tx: #17211b; --mu: #55625b; --rodape: #66736b;
          --bd: #dce4df; --bd2: #aab7af; --ctl: #ffffff;
          --g: #1f7a3d; --on: #ffffff; --ga: #17602f; --gl: #e6f4ea;
          --warn: #8a5a00; --warn-bg: rgba(240,184,74,.18);
          --sombra: 0 6px 24px rgba(23,33,27,.06); --logo: #111111; --chip: #eef2ef;
        }
        .tela-config[data-tema='escuro'] {
          --bg: #121418; --card: #1a1d24; --tx: #e8efea; --mu: #a0aab5; --rodape: #6a737d;
          --bd: #2a2d35; --bd2: #4a525c; --ctl: #20242c;
          --g: #36a860; --on: #121418; --ga: #7fe3a2; --gl: rgba(54,168,96,.16);
          --warn: #f0b84a; --warn-bg: rgba(240,184,74,.12);
          --sombra: 0 10px 40px rgba(0,0,0,.3); --logo: #ffffff; --chip: #2a2d35;
        }
        .tela-config .d1 { --c: #1f7a3d; --b: #e6f4ea; --t: #17602f; }
        .tela-config .d2 { --c: #b7791f; --b: #fff3d6; --t: #8a5a00; }
        .tela-config .d3 { --c: #c2501f; --b: #fde8df; --t: #a23a10; }
        .tela-config .d4 { --c: #a3203f; --b: #fbe3ea; --t: #8e1d3b; }
        .tela-config[data-tema='escuro'] .d1 { --c: #5fd38a; --b: rgba(95,211,138,.14); --t: #7fe3a2; }
        .tela-config[data-tema='escuro'] .d2 { --c: #f0b84a; --b: rgba(240,184,74,.14); --t: #f6c866; }
        .tela-config[data-tema='escuro'] .d3 { --c: #f08a5d; --b: rgba(240,138,93,.14); --t: #f6a07a; }
        .tela-config[data-tema='escuro'] .d4 { --c: #f27a96; --b: rgba(242,122,150,.14); --t: #f79bb1; }

        .tela-config { background-color: var(--bg); color: var(--tx); min-height: 100vh; display: flex; flex-direction: column; font-family: system-ui, -apple-system, sans-serif; }
        .tela-config button { font-family: inherit; }

        .header-config { background-color: var(--card); padding: 15px 5vw; display: flex; align-items: center; border-bottom: 1px solid var(--bd); }
        .titulo-cab { font-size: 18px; font-weight: bold; color: var(--tx); text-align: center; }
        .btn-admin { background: transparent; color: var(--mu); border: 1px solid var(--bd); padding: 8px 15px; border-radius: 6px; cursor: pointer; font-size: 14px; font-weight: bold; }
        .btn-admin:hover { color: var(--tx); border-color: var(--bd2); }
        .btn-circ { width: 32px; height: 32px; border-radius: 50%; background-color: var(--chip); color: var(--tx); border: none; display: flex; align-items: center; justify-content: center; cursor: pointer; flex-shrink: 0; transition: 0.2s; padding: 0; font-weight: bold; font-size: 14px; }
        .btn-circ:hover { background-color: var(--g); color: var(--on); }

        .config-main { flex: 1 0 auto; display: flex; flex-direction: column; width: 100%; max-width: 1320px; margin: 0 auto; padding: 28px clamp(16px, 4vw, 56px); }
        .hero { margin-bottom: 20px; }
        .hero h1 { font-size: 28px; line-height: 1.2; margin: 0 0 6px; color: var(--tx); }
        .hero p { margin: 0; color: var(--mu); font-size: 15px; line-height: 1.5; max-width: 820px; }
        .colunas { flex: 1 1 auto; display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1.5fr); gap: 20px; align-items: stretch; }
        .painel { background: var(--card); border: 1px solid var(--bd); border-radius: 16px; padding: 22px 24px; display: flex; flex-direction: column; box-shadow: var(--sombra); min-width: 0; }
        .painel-topo { display: flex; align-items: center; gap: 12px; padding-bottom: 16px; border-bottom: 1px solid var(--bd); margin-bottom: 16px; }
        .painel-topo b { width: 30px; height: 30px; border-radius: 50%; background: var(--g); color: var(--on); display: grid; place-items: center; font-size: 14px; flex: none; }
        .painel-topo h3 { margin: 0; font-size: 17px; line-height: 1.2; }
        .painel-topo span { font-size: 13px; color: var(--mu); }

        .lista-modos { flex: 1; display: flex; flex-direction: column; }
        .modo { flex: 1 1 auto; display: flex; align-items: center; gap: 12px; width: 100%; text-align: left; border: 1.5px solid var(--bd); border-radius: 10px; min-height: 60px; padding: 10px 14px; margin-bottom: 8px; background: var(--ctl); cursor: pointer; color: var(--tx); }
        .modo:last-child { margin-bottom: 0; }
        .modo::before { content: ''; flex: none; width: 18px; height: 18px; border-radius: 50%; border: 2px solid var(--bd2); }
        .modo > div { flex: 1; font-size: 13px; color: var(--mu); line-height: 1.4; }
        .modo strong { display: block; font-size: 15px; color: var(--tx); }
        .modo em { font-style: normal; font-size: 12px; font-weight: 600; color: var(--mu); background: var(--bg); border-radius: 999px; padding: 3px 10px; white-space: nowrap; }
        .modo.on { border-color: var(--g); background: var(--gl); }
        .modo.on::before { border: 5px solid var(--g); background: var(--card); }
        .modo.on em { color: var(--ga); }

        .bloco { padding: 16px 0; border-top: 1px solid var(--bd); }
        .bloco:first-child, .painel-topo + .bloco { border-top: 0; padding-top: 0; }
        .bloco-topicos { flex: 1; display: flex; flex-direction: column; }
        .bloco-cab { display: flex; justify-content: space-between; align-items: baseline; gap: 10px; flex-wrap: wrap; font-size: 14px; font-weight: 600; margin-bottom: 10px; }
        .bloco-cab em { font-style: normal; font-weight: 500; color: var(--mu); font-size: 13px; }
        .link-acao { background: none; border: 0; color: var(--ga); font-size: 13px; font-weight: 600; cursor: pointer; padding: 0; }
        .trava { color: var(--warn); background: var(--warn-bg); font-size: 11px; font-weight: 700; display: inline-flex; align-items: center; gap: 4px; border-radius: 999px; padding: 2px 9px; }

        .opt { display: flex; align-items: center; gap: 10px; min-height: 46px; padding: 6px 12px; border: 1.5px solid var(--bd); border-radius: 10px; background: var(--ctl); color: var(--tx); font-size: 14px; font-weight: 500; line-height: 1.2; text-align: left; cursor: pointer; width: 100%; }
        .opt.on { border-color: var(--g); background: var(--gl); font-weight: 600; }
        .opt:disabled { cursor: not-allowed; opacity: .55; }

        .grade-topicos { display: grid; grid-template-columns: repeat(auto-fit, minmax(190px, 1fr)); grid-auto-rows: minmax(46px, 1fr); gap: 8px; flex: 1; }
        .grade-topicos .opt::before { content: ''; flex: none; width: 18px; height: 18px; border-radius: 5px; border: 2px solid var(--bd2); }
        .grade-topicos .opt[role='radio']::before { border-radius: 50%; }
        .grade-topicos .opt.on::before { content: '✓'; background: var(--g); border-color: var(--g); color: var(--on); font-size: 12px; display: grid; place-items: center; }

        .grade-dif { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 8px; }
        .grade-dif .opt { justify-content: center; text-align: center; padding: 6px; }
        .grade-dif .opt::before { content: ''; width: 8px; height: 8px; border-radius: 50%; background: var(--c); flex: none; }
        .grade-dif .opt.on { border-color: var(--c); background: var(--b); color: var(--t); }

        .stepper { display: inline-flex; align-items: center; height: 46px; border: 1.5px solid var(--bd); border-radius: 10px; background: var(--ctl); }
        .stepper button { width: 46px; height: 100%; border: 0; background: none; font-size: 20px; cursor: pointer; color: var(--tx); }
        .stepper button:disabled { cursor: not-allowed; opacity: .55; }
        .stepper output { min-width: 48px; text-align: center; font-size: 18px; font-weight: 700; border-left: 1.5px solid var(--bd); border-right: 1.5px solid var(--bd); line-height: 30px; }
        .linha-qtd { display: flex; align-items: center; gap: 14px; flex-wrap: wrap; }
        .linha-qtd span { font-size: 13px; color: var(--mu); }
        .caixa-auto { padding: 12px; background: var(--bg); border-radius: 10px; border: 1px dashed var(--bd2); color: var(--mu); font-size: 13px; text-align: center; }

        .erro-config { background-color: rgba(231,76,60,.1); border: 1px solid #e74c3c; color: #d63b2b; padding: 10px 12px; border-radius: 10px; margin-top: 20px; font-size: 13px; display: flex; align-items: center; gap: 10px; }
        .tela-config[data-tema='escuro'] .erro-config { color: #ff6b6b; }
        .barra { margin-top: 20px; background: var(--card); border: 1px solid var(--bd); border-radius: 16px; padding: 16px 24px; display: flex; align-items: center; justify-content: space-between; gap: 16px; flex-wrap: wrap; box-shadow: var(--sombra); }
        .barra strong { font-size: 18px; display: block; }
        .barra span { font-size: 14px; color: var(--mu); }
        .gerar { height: 48px; padding: 0 34px; border-radius: 10px; border: 0; background: var(--g); color: var(--on); font-size: 16px; font-weight: 700; cursor: pointer; }
        .gerar:hover { filter: brightness(1.08); }

        .rodape-config { border-top: 1px solid var(--bd); padding: 15px; text-align: center; color: var(--rodape); font-size: 12px; }

        .tela-config button:focus-visible { outline: 2px solid var(--g); outline-offset: 2px; }

        @media (min-width: 1700px) {
          .header-config { padding: 18px 4vw; }
          .header-config svg { height: 46px; }
          .titulo-cab { font-size: 20px; }
          .btn-admin { font-size: 15px; padding: 10px 18px; }
          .btn-circ { width: 38px; height: 38px; font-size: 16px; }
          .config-main { max-width: 1680px; padding: 38px 4vw; }
          .hero { margin-bottom: 26px; }
          .hero h1 { font-size: 36px; }
          .hero p { font-size: 17px; max-width: 980px; }
          .colunas { gap: 26px; }
          .painel { padding: 30px 34px; border-radius: 18px; }
          .painel-topo { padding-bottom: 20px; margin-bottom: 20px; }
          .painel-topo b { width: 36px; height: 36px; font-size: 16px; }
          .painel-topo h3 { font-size: 21px; }
          .painel-topo span { font-size: 15px; }
          .modo { min-height: 76px; padding: 14px 18px; gap: 16px; margin-bottom: 10px; }
          .modo strong { font-size: 18px; }
          .modo > div { font-size: 15px; }
          .modo em { font-size: 13px; padding: 4px 12px; }
          .bloco { padding: 22px 0; }
          .bloco-cab { font-size: 16px; margin-bottom: 14px; }
          .bloco-cab em, .link-acao, .linha-qtd span { font-size: 15px; }
          .trava { font-size: 12px; }
          .opt { min-height: 56px; font-size: 16px; padding: 8px 16px; }
          .grade-topicos { grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 10px; grid-auto-rows: minmax(56px, 1fr); }
          .grade-dif { gap: 10px; }
          .stepper { height: 56px; }
          .stepper button { width: 56px; font-size: 24px; }
          .stepper output { min-width: 60px; font-size: 22px; }
          .caixa-auto { font-size: 15px; padding: 16px; }
          .barra { margin-top: 26px; padding: 22px 34px; border-radius: 18px; }
          .barra strong { font-size: 22px; }
          .barra span { font-size: 16px; }
          .gerar { height: 58px; padding: 0 46px; font-size: 18px; }
          .rodape-config { font-size: 13px; padding: 20px; }
        }
        @media (min-width: 2200px) {
          .header-config { padding: 22px 4vw; }
          .header-config svg { height: 56px; }
          .titulo-cab { font-size: 24px; }
          .btn-admin { font-size: 17px; padding: 12px 22px; }
          .btn-circ { width: 46px; height: 46px; font-size: 18px; }
          .config-main { max-width: 2100px; padding: 48px 4vw; }
          .hero h1 { font-size: 44px; }
          .hero p { font-size: 20px; max-width: 1200px; }
          .colunas { gap: 32px; }
          .painel { padding: 38px 44px; }
          .painel-topo b { width: 44px; height: 44px; font-size: 20px; }
          .painel-topo h3 { font-size: 26px; }
          .painel-topo span { font-size: 18px; }
          .modo { min-height: 92px; padding: 18px 24px; }
          .modo strong { font-size: 22px; }
          .modo > div { font-size: 18px; }
          .modo em { font-size: 16px; padding: 5px 14px; }
          .bloco-cab { font-size: 19px; }
          .bloco-cab em, .link-acao, .linha-qtd span { font-size: 18px; }
          .trava { font-size: 14px; }
          .opt { min-height: 68px; font-size: 19px; }
          .grade-topicos { grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); grid-auto-rows: minmax(68px, 1fr); }
          .stepper { height: 68px; }
          .stepper button { width: 68px; font-size: 28px; }
          .stepper output { min-width: 76px; font-size: 26px; }
          .caixa-auto { font-size: 18px; }
          .barra { padding: 28px 44px; }
          .barra strong { font-size: 27px; }
          .barra span { font-size: 19px; }
          .gerar { height: 70px; padding: 0 60px; font-size: 22px; }
          .rodape-config { font-size: 15px; }
        }

        @media (max-width: 960px) {
          .header-config { flex-direction: row !important; flex-wrap: wrap; padding: 15px 20px !important; }
          .header-config > div { flex: unset !important; }
          .header-config > div:nth-child(1) { width: 50%; justify-content: flex-start !important; }
          .header-botoes { width: 50%; justify-content: flex-end !important; }
          .header-config > div:nth-child(2) { width: 100%; justify-content: center !important; margin-top: 15px; order: 3; }
          .header-config svg { height: 35px !important; }
          }
        @media (max-width: 1100px) {
          .colunas { grid-template-columns: minmax(0, 1fr) minmax(0, 1.3fr); }
          .grade-dif { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        }
        @media (max-width: 800px) {
          .colunas { grid-template-columns: 1fr; }
          .grade-dif { grid-template-columns: repeat(4, minmax(0, 1fr)); }
          .hero h1 { font-size: 24px; }
        }
        @media (max-width: 600px) {
          .config-main { padding: 20px 14px; }
          .painel { padding: 18px 16px; }
          .grade-topicos { grid-template-columns: 1fr; }
          .grade-dif { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          .barra { padding: 16px; }
          .gerar { width: 100%; }
        }
      `}</style>

      <div className="tela-config" data-tema={tema}>
        <header className="header-config">
          <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-start' }}>
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
          <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
            <span className="titulo-cab">Gerador de Provas</span>
          </div>
          <div className="header-botoes" style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '15px' }}>
            <button type="button" className="btn-admin" onClick={onAcessarAdmin}>
              Painel Admin
            </button>
            <button
              type="button"
              className="btn-circ"
              onClick={() => setTema(t => (t === 'escuro' ? 'claro' : 'escuro'))}
              aria-label={tema === 'escuro' ? 'Mudar para o tema claro' : 'Mudar para o tema escuro'}
              title={tema === 'escuro' ? 'Tema claro' : 'Tema escuro'}
            >
              <IconeTema tema={tema} />
            </button>
            <button type="button" className="btn-circ" onClick={() => setModalSobreAberto(true)} aria-label="Sobre o sistema" title="Sobre">?</button>
          </div>
        </header>

        <main className="config-main">
          <div className="hero">
            <h1>Simulados de Lógica de Programação</h1>
            <p>Gere simulados personalizados a partir de um banco de questões baseado nas avaliações aplicadas nos cursos de Sistemas para Internet (TSI) e Informática para Internet (IPI) do Campus Igarassu.</p>
          </div>

          <div className="colunas">
            <section className="painel">
              <div className="painel-topo">
                <b>1</b>
                <div>
                  <h3>Escolha o modelo</h3>
                  <span>Define o formato da prova</span>
                </div>
              </div>
              <div className="lista-modos" role="radiogroup" aria-label="Modelo de prova">
                {MODOS.map(m => (
                  <button
                    key={m.id}
                    type="button"
                    role="radio"
                    aria-checked={modoAtivo === m.id}
                    className={`modo ${modoAtivo === m.id ? 'on' : ''}`}
                    onClick={() => setModoAtivo(m.id)}
                  >
                    <div>
                      <strong>{m.titulo}</strong>
                      {m.descricao}
                    </div>
                    <em>{etiquetaModo(m.id)}</em>
                  </button>
                ))}
              </div>
            </section>

            <section className="painel">
              <div className="painel-topo">
                <b>2</b>
                <div>
                  <h3>Personalize</h3>
                  <span>Tópicos, quantidade e dificuldade</span>
                </div>
              </div>

              <div className="bloco bloco-topicos">
                <div className="bloco-cab">
                  <span>{modoAtivo === 'miniprova' ? 'Tópico' : 'Tópicos'}</span>
                  {isTopicosLocked ? (
                    <span className="trava"><LockIcon /> Travado</span>
                  ) : modoAtivo === 'miniprova' ? (
                    <em>Escolha 1 tópico</em>
                  ) : (
                    <span>
                      <em>{topicosSelecionados.length} de {topicosAtuais.length}</em>
                      {' · '}
                      <button type="button" className="link-acao" onClick={handleSelecionarTodos}>
                        {topicosSelecionados.length === topicosAtuais.length ? 'Limpar' : 'Selecionar todos'}
                      </button>
                    </span>
                  )}
                </div>
                <div className="grade-topicos">
                  {topicosAtuais.map(topico => {
                    const marcado = topicosSelecionados.includes(topico);
                    return (
                      <button
                        key={topico}
                        type="button"
                        role={roleTopico}
                        aria-checked={marcado}
                        className={`opt ${marcado ? 'on' : ''}`}
                        disabled={isTopicosLocked}
                        onClick={() => handleToggleTopico(topico)}
                      >
                        {topico}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="bloco">
                <div className="bloco-cab">
                  <span>Quantidade de questões</span>
                  {isQtdLocked && <span className="trava"><LockIcon /> Travado</span>}
                </div>
                <div className="linha-qtd">
                  <div className="stepper">
                    <button type="button" onClick={() => handleQuantidadeChange(-1)} disabled={isQtdLocked} aria-label="Diminuir quantidade">−</button>
                    <output aria-live="polite">{quantidade}</output>
                    <button type="button" onClick={() => handleQuantidadeChange(1)} disabled={isQtdLocked} aria-label="Aumentar quantidade">+</button>
                  </div>
                  {!isQtdLocked && <span>máximo 12 questões</span>}
                </div>
              </div>

              <div className="bloco">
                <div className="bloco-cab">
                  <span>Dificuldade</span>
                  {modoAtivo === 'miniprova' ? (
                    <span className="trava"><LockIcon /> Automática</span>
                  ) : (
                    isDifLocked && <span className="trava"><LockIcon /> Travado</span>
                  )}
                </div>
                {modoAtivo !== 'miniprova' ? (
                  <div className="grade-dif">
                    {NIVEIS.map(({ nome, classe }) => {
                      const marcado = dificuldadesSelecionadas.includes(nome);
                      return (
                        <button
                          key={nome}
                          type="button"
                          role="checkbox"
                          aria-checked={marcado}
                          className={`opt ${classe} ${marcado ? 'on' : ''}`}
                          disabled={isDifLocked}
                          onClick={() => handleToggleDificuldade(nome)}
                        >
                          {nome}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="caixa-auto">Sorteio automático pelo sistema.</div>
                )}
              </div>
            </section>
          </div>

          {erro && (
            <div className="erro-config" role="alert">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                <circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              {erro}
            </div>
          )}

          <div className="barra">
            <div>
              <strong>{quantidade} questões · {nomeModo}</strong>
              <span>{resumoTopicos} · {resumoDificuldade}</span>
            </div>
            <button type="button" className="gerar" onClick={handleGerar}>
              Gerar Simulado
            </button>
          </div>
        </main>

        <footer className="rodape-config">
          Instituto Federal de Educação, Ciência e Tecnologia - Campus Igarassu | Izes Stella Barbalho Bezerra
        </footer>
      </div>

      <ModalSobre isOpen={modalSobreAberto} onClose={() => setModalSobreAberto(false)} />
    </>
  );
}
