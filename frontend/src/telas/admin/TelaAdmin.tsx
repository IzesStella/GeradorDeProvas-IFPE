import { useEffect, useEffectEvent, useRef, useState } from 'react';
import { Cabecalho, Rodape } from '../../components/Estrutura';
import { ModalAjudaAdmin } from '../../components/Modais';
import { IconeLinha } from '../../components/Icones';
import { api, SessaoExpirada } from '../../api';
import type { Questao } from '../../tipos';
import { CURSOS, NIVEIS, TIPOS, TOPICOS_CADASTRO, classeNivel, separarOrigem } from '../../opcoes';
import { TabelaQuestoes } from './TabelaQuestoes';
import { FormularioQuestao, VisualizarQuestao } from './JanelasQuestao';
import './TelaAdmin.css';

interface TelaAdminProps {
  onSair: () => void;
}

// Busca sem diferenciar acentos nem maiúsculas e minúsculas
const normalizar = (texto: unknown) =>
  String(texto ?? '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

export function TelaAdmin({ onSair }: TelaAdminProps) {
  const [questoes, setQuestoes] = useState<Questao[]>([]);
  const [busca, setBusca] = useState('');
  const [filtroTopico, setFiltroTopico] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('');
  const [filtroNivel, setFiltroNivel] = useState('');
  const [filtroCurso, setFiltroCurso] = useState('');

  const [janela, setJanela] = useState<'ver' | 'formulario' | null>(null);
  const [questaoSelecionada, setQuestaoSelecionada] = useState<Questao | null>(null);
  const [idParaExcluir, setIdParaExcluir] = useState<number | null>(null);
  const [ajudaAberta, setAjudaAberta] = useState(false);
  const [aviso, setAviso] = useState('');

  // Se o login expirou, volta para o início; nos outros erros, avisa o professor
  const tratarErro = (erro: unknown, mensagem: string) => {
    if (erro instanceof SessaoExpirada) return onSair();
    console.error(erro);
    alert(mensagem);
  };

  // Busca as questões ao abrir o painel e de novo sempre que uma questão é salva ou excluída
  const [versaoLista, setVersaoLista] = useState(0);
  const recarregar = () => setVersaoLista(v => v + 1);
  const erroAoCarregar = useEffectEvent((erro: unknown) => tratarErro(erro, 'Erro ao buscar as questões.'));

  useEffect(() => {
    api.listarQuestoes().then(setQuestoes).catch(erroAoCarregar);
  }, [versaoLista]);

  // Esc fecha a janela aberta
  useEffect(() => {
    const apertouEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setIdParaExcluir(null); setJanela(null); }
    };
    window.addEventListener('keydown', apertouEsc);
    return () => window.removeEventListener('keydown', apertouEsc);
  }, []);

  const mostrarAviso = (mensagem: string) => {
    setAviso(mensagem);
    setTimeout(() => setAviso(''), 2200);
  };

  const abrir = (tipo: 'ver' | 'formulario', questao: Questao | null) => {
    setQuestaoSelecionada(questao);
    setJanela(tipo);
  };

  const editarDaVisualizacao = () => {
    setJanela(null);
    setTimeout(() => setJanela('formulario'), 150);
  };

  const salvar = async (dados: object) => {
    try {
      await api.salvarQuestao(dados, questaoSelecionada?.id ?? null);
      mostrarAviso(`Questão ${questaoSelecionada ? 'atualizada' : 'salva'} com sucesso`);
      setJanela(null);
      recarregar();
    } catch (erro) {
      tratarErro(erro, 'Erro ao salvar a questão.');
    }
  };

  const excluir = async () => {
    if (idParaExcluir === null) return;
    try {
      await api.excluirQuestao(idParaExcluir);
      mostrarAviso('Questão excluída');
      recarregar();
    } catch (erro) {
      tratarErro(erro, 'Erro ao excluir a questão.');
    }
    setIdParaExcluir(null);
  };

  // Aplica a busca e os filtros
  const termo = normalizar(busca.trim());
  const filtradas = questoes.filter(q => {
    const camposBuscados = [q.enunciado, q.topico, q.origem, q.ano, q.nivel_dificuldade, q.tipo_questao, q.id];
    return (
      camposBuscados.some(campo => normalizar(campo).includes(termo)) &&
      (!filtroTopico || q.topico === filtroTopico) &&
      (!filtroTipo || q.tipo_questao === filtroTipo) &&
      (!filtroNivel || q.nivel_dificuldade === filtroNivel) &&
      (!filtroCurso || separarOrigem(q.origem).curso === filtroCurso)
    );
  });

  const temFiltroDeMenu = !!(filtroTopico || filtroTipo || filtroNivel || filtroCurso);
  const limparFiltros = () => { setFiltroTopico(''); setFiltroTipo(''); setFiltroNivel(''); setFiltroCurso(''); };

  return (
    <div className="tela admin">
      <Cabecalho titulo="Painel Administrativo">
        <button type="button" className="botao" onClick={onSair}>Voltar ao início</button>
        <button type="button" className="botao-redondo" onClick={() => setAjudaAberta(true)} aria-label="Ajuda" title="Ajuda">?</button>
      </Cabecalho>

      <main className="admin-conteudo">
        <div className="admin-topo">
          <div>
            <h2>Banco de Questões</h2>
            <div className="admin-texto-suave">{questoes.length} questões cadastradas</div>
          </div>
          <button type="button" className="botao primario" onClick={() => abrir('formulario', null)}>+ Nova questão</button>
        </div>

        <div className="admin-filtros">
          <div className="admin-busca">
            <IconeLinha nome="lupa" />
            <input className="admin-entrada" type="text" placeholder="Buscar por enunciado, tópico, ano, tipo..." value={busca} onChange={(e) => setBusca(e.target.value)} aria-label="Buscar questões" />
          </div>
          <Filtro rotulo="Tópico" todos="Todos" valor={filtroTopico} opcoes={TOPICOS_CADASTRO} onMudar={setFiltroTopico} />
          <Filtro rotulo="Tipo" todos="Todos" valor={filtroTipo} opcoes={TIPOS} onMudar={setFiltroTipo} />
          <Filtro rotulo="Dificuldade" todos="Todas" valor={filtroNivel} opcoes={NIVEIS} onMudar={setFiltroNivel} classeOpcao={classeNivel} alinharDireita />
          <Filtro rotulo="Curso" todos="Todos" valor={filtroCurso} opcoes={CURSOS} onMudar={setFiltroCurso} alinharDireita />
          {temFiltroDeMenu && <button type="button" className="admin-limpar-filtros" onClick={limparFiltros}>Limpar filtros</button>}
        </div>

        <TabelaQuestoes
          questoes={filtradas}
          chaveFiltros={[busca, filtroTopico, filtroTipo, filtroNivel, filtroCurso].join('|')}
          temFiltro={!!busca || temFiltroDeMenu}
          onVer={(q) => abrir('ver', q)}
          onEditar={(q) => abrir('formulario', q)}
          onExcluir={setIdParaExcluir}
        />
      </main>

      <Rodape />

      <div className={`admin-fundo-escuro ${janela ? 'visivel' : ''}`} onClick={() => setJanela(null)} />
      <VisualizarQuestao aberto={janela === 'ver'} questao={questaoSelecionada} aoFechar={() => setJanela(null)} aoEditar={editarDaVisualizacao} />
      <FormularioQuestao aberto={janela === 'formulario'} questao={questaoSelecionada} aoFechar={() => setJanela(null)} aoSalvar={salvar} />

      {idParaExcluir !== null && (
        <ConfirmarExclusao id={idParaExcluir} aoCancelar={() => setIdParaExcluir(null)} aoConfirmar={excluir} />
      )}

      {aviso && <div className="admin-aviso" role="status">{aviso}</div>}

      <ModalAjudaAdmin aberto={ajudaAberta} aoFechar={() => setAjudaAberta(false)} />
    </div>
  );
}

interface FiltroProps {
  rotulo: string;
  todos: string;
  valor: string;
  opcoes: string[];
  onMudar: (valor: string) => void;
  classeOpcao?: (opcao: string) => string;
  alinharDireita?: boolean;
}

// Menu suspenso de um filtro da tabela (Tópico, Tipo, Dificuldade e Curso)
function Filtro({ rotulo, todos, valor, opcoes, onMudar, classeOpcao, alinharDireita }: FiltroProps) {
  const [aberto, setAberto] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Fecha ao clicar fora do menu ou apertar Esc
  useEffect(() => {
    if (!aberto) return;
    const clicouFora = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setAberto(false);
    };
    const apertouEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') setAberto(false); };
    document.addEventListener('mousedown', clicouFora);
    document.addEventListener('keydown', apertouEsc);
    return () => {
      document.removeEventListener('mousedown', clicouFora);
      document.removeEventListener('keydown', apertouEsc);
    };
  }, [aberto]);

  const ativo = valor !== '';
  const escolher = (opcao: string) => { onMudar(opcao); setAberto(false); };

  return (
    <div className="admin-filtro" ref={ref}>
      <button type="button" className={`admin-filtro-botao ${ativo ? 'ativo' : ''}`} aria-haspopup="listbox" aria-expanded={aberto} onClick={() => setAberto(!aberto)}>
        <span className="admin-filtro-rotulo">{rotulo}:</span>
        <span className="admin-filtro-valor">{ativo ? valor : todos}</span>
        <span className={`admin-filtro-seta ${aberto ? 'aberto' : ''}`}><IconeLinha nome="seta" tamanho={14} /></span>
      </button>
      {aberto && (
        <ul className={`admin-filtro-menu ${alinharDireita ? 'a-direita' : ''}`} role="listbox" aria-label={rotulo}>
          <li role="option" aria-selected={!ativo} className={!ativo ? 'selecionado' : ''} onClick={() => escolher('')}>
            <span>{todos}</span>{!ativo && <b>✓</b>}
          </li>
          {opcoes.map(opcao => (
            <li key={opcao} role="option" aria-selected={valor === opcao} className={valor === opcao ? 'selecionado' : ''} onClick={() => escolher(opcao)}>
              <span className={classeOpcao ? `admin-nivel ${classeOpcao(opcao)}` : undefined}>{opcao}</span>
              {valor === opcao && <b>✓</b>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

interface ConfirmarExclusaoProps {
  id: number;
  aoCancelar: () => void;
  aoConfirmar: () => void;
}

// Pede confirmação antes de excluir, porque a exclusão é definitiva
function ConfirmarExclusao({ id, aoCancelar, aoConfirmar }: ConfirmarExclusaoProps) {
  return (
    <div className="admin-modal-fundo" onClick={aoCancelar}>
      <div className="admin-cartao admin-confirmacao" role="alertdialog" aria-modal="true" aria-labelledby="admin-confirmacao-titulo" onClick={(e) => e.stopPropagation()}>
        <div className="admin-janela-topo">
          <h3 id="admin-confirmacao-titulo">Excluir questão #{id}</h3>
          <button className="admin-botao-icone" onClick={aoCancelar} aria-label="Fechar">✕</button>
        </div>
        <div className="admin-janela-corpo">
          A questão será removida do banco de dados. Essa ação não poderá ser desfeita.
        </div>
        <div className="admin-janela-rodape admin-confirmacao-rodape">
          <button className="botao perigo" onClick={aoConfirmar}>Excluir questão</button>
        </div>
      </div>
    </div>
  );
}