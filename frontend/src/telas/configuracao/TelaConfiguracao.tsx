import { useEffect, useRef, useState } from 'react';
import { Cabecalho, Rodape } from '../../components/Estrutura';
import { ModalSobre } from '../../components/Modais';
import { IconeAviso } from '../../components/Icones';
import type { FiltrosSimulado, ModoProva } from '../../tipos';
import { ListaModelos, SeletorDificuldade, SeletorQuantidade, SeletorTopicos } from './Paineis';
import { MODELOS, PREDEFINICOES, QUANTIDADE_MAXIMA, TOPICOS, TOPICOS_MINIPROVA } from '../../opcoes';
import './TelaConfiguracao.css';

interface TelaConfiguracaoProps {
  ultimosFiltros: FiltrosSimulado | null;
  onGerar: (filtros: FiltrosSimulado) => void;
  onAcessarAdmin: () => void;
}

const alternarItem = (lista: string[], item: string) =>
  lista.includes(item) ? lista.filter(i => i !== item) : [...lista, item];

export function TelaConfiguracao({ ultimosFiltros, onGerar, onAcessarAdmin }: TelaConfiguracaoProps) {
  const [modo, setModo] = useState<ModoProva>(ultimosFiltros?.modo ?? 'livre');
  const [topicos, setTopicos] = useState<string[]>([]);
  const [quantidade, setQuantidade] = useState(5);
  const [dificuldades, setDificuldades] = useState<string[]>(['Fácil', 'Média', 'Difícil']);
  const [erro, setErro] = useState<string | null>(null);
  const [sobreAberto, setSobreAberto] = useState(false);

  // Guarda as escolhas do Modelo Livre para restaurá-las quando o estudante voltar a ele
  // (inclusive depois de gerar um simulado e clicar em Voltar)
  const escolhasLivre = useRef(
    ultimosFiltros?.modo === 'livre'
      ? { topicos: ultimosFiltros.topicos, quantidade: ultimosFiltros.quantidade, dificuldades: ultimosFiltros.dificuldades }
      : { topicos: [] as string[], quantidade: 5, dificuldades: ['Fácil', 'Média', 'Difícil'] }
  );

  const ehMiniprova = modo === 'miniprova';
  const ehLivre = modo === 'livre';
  const travado = !ehLivre && !ehMiniprova;
  const listaTopicos = ehMiniprova ? TOPICOS_MINIPROVA : TOPICOS;

  useEffect(() => {
    const valores = modo === 'livre' ? escolhasLivre.current : PREDEFINICOES[modo];
    setQuantidade(valores.quantidade);
    setTopicos(valores.topicos);
    setDificuldades(valores.dificuldades);
    setErro(null);
  }, [modo]);

  const lembrarLivre = (mudanca: Partial<typeof escolhasLivre.current>) => {
    if (ehLivre) Object.assign(escolhasLivre.current, mudanca);
  };

  const alternarTopico = (topico: string) => {
    const novos = ehMiniprova ? (topicos.includes(topico) ? [] : [topico]) : alternarItem(topicos, topico);
    setTopicos(novos);
    lembrarLivre({ topicos: novos });
    setErro(null);
  };

  const selecionarTodos = () => {
    const novos = topicos.length === listaTopicos.length ? [] : [...listaTopicos];
    setTopicos(novos);
    lembrarLivre({ topicos: novos });
    setErro(null);
  };

  const alternarDificuldade = (nivel: string) => {
    const novas = alternarItem(dificuldades, nivel);
    setDificuldades(novas);
    lembrarLivre({ dificuldades: novas });
    setErro(null);
  };

  const mudarQuantidade = (diferenca: number) => {
    const nova = Math.min(QUANTIDADE_MAXIMA, Math.max(1, quantidade + diferenca));
    setQuantidade(nova);
    lembrarLivre({ quantidade: nova });
  };

  const gerar = () => {
    if (topicos.length === 0) return setErro('Selecione pelo menos um tópico!');
    if (!ehMiniprova && dificuldades.length === 0) return setErro('Selecione pelo menos um nível de dificuldade!');
    onGerar({ modo, topicos, quantidade, dificuldades });
  };

  const nomeModelo = MODELOS.find(m => m.id === modo)?.titulo ?? '';
  const resumoTopicos =
    topicos.length === 0 ? 'Nenhum tópico selecionado'
      : topicos.length <= 2 ? topicos.join(', ')
        : `${topicos.length} tópicos`;
  const resumoDificuldade =
    ehMiniprova ? 'Dificuldade automática'
      : dificuldades.length > 0 ? dificuldades.join(', ')
        : 'Nenhuma dificuldade';

  return (
    <div className="tela tela-config">
      <Cabecalho titulo="Configurar Simulado">
        <button type="button" className="botao" onClick={onAcessarAdmin}>Painel Admin</button>
        <button type="button" className="botao-redondo" onClick={() => setSobreAberto(true)} aria-label="Sobre o sistema" title="Sobre">?</button>
      </Cabecalho>

      <main className="config-conteudo">
        <div className="apresentacao">
          <h1>Igara<span>.log</span></h1>
          <p className="apresentacao-subtitulo">Simulados de Lógica de Programação</p>
          <p>Gere simulados personalizados a partir de um banco de questões baseado nas avaliações aplicadas nos cursos de Sistemas para Internet (TSI) e Informática para Internet (IPI) do <em>Campus</em> Igarassu.</p>
        </div>

        <div className="colunas">
          <section className="painel">
            <TopoPainel numero={1} titulo="Escolha o modelo" subtitulo="Define o formato da prova" />
            <ListaModelos modoAtivo={modo} onEscolher={setModo} />
          </section>

          <section className="painel painel-personalizar">
            <TopoPainel numero={2} titulo="Personalize" subtitulo="Tópicos, quantidade e dificuldade" />
            <SeletorTopicos
              topicos={listaTopicos}
              selecionados={topicos}
              travado={travado}
              apenasUm={ehMiniprova}
              onAlternar={alternarTopico}
              onSelecionarTodos={selecionarTodos}
            />
            <SeletorQuantidade quantidade={quantidade} travado={!ehLivre} onMudar={mudarQuantidade} />
            <SeletorDificuldade selecionadas={dificuldades} travado={travado} automatica={ehMiniprova} onAlternar={alternarDificuldade} />
          </section>
        </div>

        {erro && (
          <div className="erro-config" role="alert">
            <IconeAviso tamanho={18} />
            {erro}
          </div>
        )}

        <div className="barra-resumo">
          <div>
            <strong>{quantidade} questões · {nomeModelo}</strong>
            <span>{resumoTopicos} · {resumoDificuldade}</span>
          </div>
          <button type="button" className="botao-gerar" onClick={gerar}>Gerar Simulado</button>
        </div>
      </main>

      <Rodape />
      <ModalSobre aberto={sobreAberto} aoFechar={() => setSobreAberto(false)} />
    </div>
  );
}

function TopoPainel({ numero, titulo, subtitulo }: { numero: number; titulo: string; subtitulo: string }) {
  return (
    <div className="painel-topo">
      <b>{numero}</b>
      <div>
        <h3>{titulo}</h3>
        <span>{subtitulo}</span>
      </div>
    </div>
  );
}