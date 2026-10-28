import { useEffect, useRef, useState } from 'react';
import { Cabecalho, Rodape } from '../../components/Estrutura';
import { IconeAviso } from '../../components/Icones';
import type { FiltrosSimulado, Questao } from '../../tipos';
import { CartaoQuestao } from './CartaoQuestao';
import { DocumentoPdf } from './DocumentoPdf';
import './TelaSimulado.css';

interface TelaSimuladoProps {
  questoes: Questao[];
  filtros: FiltrosSimulado;
  onVoltar: () => void;
}

export function TelaSimulado({ questoes, filtros, onVoltar }: TelaSimuladoProps) {
  const [questaoAtiva, setQuestaoAtiva] = useState(0);
  const cartoesRef = useRef<(HTMLElement | null)[]>([]);
  const cliqueRef = useRef<number | null>(null);

  // Marca no índice a questão que está sendo lida enquanto o estudante rola a página
  useEffect(() => {
    const aoRolar = () => {
      // logo depois de um clique no índice, a rolagem é do próprio clique
      if (cliqueRef.current !== null) {
        window.clearTimeout(cliqueRef.current);
        cliqueRef.current = window.setTimeout(() => { cliqueRef.current = null; }, 150);
        return;
      }
      let atual = 0;
      cartoesRef.current.forEach((cartao, i) => {
        if (cartao && cartao.getBoundingClientRect().top <= 160) atual = i;
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

  const irParaQuestao = (indice: number) => {
    const suave = !window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (cliqueRef.current !== null) window.clearTimeout(cliqueRef.current);
    cliqueRef.current = window.setTimeout(() => { cliqueRef.current = null; }, 300);
    setQuestaoAtiva(indice);
    cartoesRef.current[indice]?.scrollIntoView({ behavior: suave ? 'smooth' : 'auto', block: 'start' });
  };

  const imprimir = () => {
    const tituloOriginal = document.title;
    document.title = 'Simulado - Lógica de Programação';
    window.addEventListener('afterprint', () => { document.title = tituloOriginal; }, { once: true });
    window.print();
  };

  const temQuestoes = questoes.length > 0;

  return (
    <div>
      <div className="tela tela-sistema">
        <Cabecalho titulo="Simulado Personalizado">
          <span className="simulado-contagem">Questões: {questoes.length}</span>
          {temQuestoes && <button type="button" className="botao primario" onClick={imprimir}>Imprimir PDF</button>}
          <button type="button" className="botao" onClick={onVoltar}>Voltar</button>
        </Cabecalho>

        <main className={`simulado-conteudo ${temQuestoes ? 'com-indice' : ''}`}>
          {temQuestoes && <IndiceQuestoes questoes={questoes} ativa={questaoAtiva} onEscolher={irParaQuestao} />}

          <div className="simulado-questoes">
            <AvisosSimulado questoes={questoes} filtros={filtros} />
            {temQuestoes ? (
              questoes.map((questao, indice) => (
                <CartaoQuestao
                  key={questao.id}
                  questao={questao}
                  numero={indice + 1}
                  ref={(el) => { cartoesRef.current[indice] = el; }}
                />
              ))
            ) : (
              <SimuladoVazio onVoltar={onVoltar} />
            )}
          </div>
        </main>

        <Rodape />
      </div>

      <DocumentoPdf questoes={questoes} />
    </div>
  );
}

interface IndiceQuestoesProps {
  questoes: Questao[];
  ativa: number;
  onEscolher: (indice: number) => void;
}

// Índice lateral (só aparece em telas largas): lista as questões e destaca a que está sendo lida
function IndiceQuestoes({ questoes, ativa, onEscolher }: IndiceQuestoesProps) {
  return (
    <nav className="indice" aria-label="Índice das questões">
      <div className="indice-topo">
        <strong>Neste simulado</strong>
        <span>Questão {ativa + 1} de {questoes.length}</span>
        <div className="indice-progresso" aria-hidden="true">
          <i style={{ width: `${((ativa + 1) / questoes.length) * 100}%` }} />
        </div>
      </div>
      <ol>
        {questoes.map((questao, indice) => (
          <li key={questao.id}>
            <button
              type="button"
              className={`indice-item ${indice === ativa ? 'selecionado' : ''}`}
              aria-current={indice === ativa ? 'true' : undefined}
              onClick={() => onEscolher(indice)}
            >
              <b>{indice + 1}</b>
              <span>
                {questao.topico}
                <small>{questao.tipo_questao ? `${questao.tipo_questao} · ` : ''}{questao.nivel_dificuldade}</small>
              </span>
            </button>
          </li>
        ))}
      </ol>
    </nav>
  );
}

// "a, b e c"
const listar = (itens: string[]) =>
  itens.length <= 1 ? itens.join('') : `${itens.slice(0, -1).join(', ')} e ${itens[itens.length - 1]}`;

// O tópico "Laços" também conta as questões de "Laços - Parte 1" e "Laços - Parte 2"
const apareceu = (topico: string, presentes: string[]) =>
  presentes.some(p => p === topico || p.startsWith(`${topico} - `));

interface AvisosSimuladoProps {
  questoes: Questao[];
  filtros: FiltrosSimulado;
}

// Avisos do Modelo Livre quando o acervo não atende a tudo o que o estudante pediu.
// Só aparecem quando a quantidade pedida daria para incluir todos os tópicos ou níveis.
function AvisosSimulado({ questoes, filtros }: AvisosSimuladoProps) {
  if (filtros.modo !== 'livre' || questoes.length === 0) return null;

  const pedida = filtros.quantidade;
  const topicosPresentes = questoes.map(q => q.topico);
  const niveisPresentes = questoes.map(q => q.nivel_dificuldade);
  const topicosFaltantes = filtros.topicos.filter(t => !apareceu(t, topicosPresentes));
  const niveisFaltantes = filtros.dificuldades.filter(n => !niveisPresentes.includes(n));

  const faltouQuantidade = questoes.length < pedida;
  const faltouTopico = topicosFaltantes.length > 0 && pedida >= filtros.topicos.length;
  const faltouNivel = niveisFaltantes.length > 0 && pedida >= filtros.dificuldades.length;

  if (!faltouQuantidade && !faltouTopico && !faltouNivel) return null;

  return (
    <div className="avisos">
      {faltouQuantidade && (
        <div className="aviso info" role="status">
          <IconeAviso />
          <div>
            <strong>Aviso de Quantidade:</strong> Você solicitou <strong>{pedida}</strong> questões, mas só encontramos <strong>{questoes.length}</strong> cadastradas com esses filtros. <br />
            Para treinar mais, tente marcar outros tópicos ou dificuldades!
          </div>
        </div>
      )}
      {faltouTopico && (
        <div className="aviso alerta" role="status">
          <IconeAviso />
          <div>
            <strong>Aviso de Tópico:</strong> Não encontramos questões de <strong>{listar(topicosFaltantes)}</strong> para {filtros.dificuldades.length > 1 ? 'os níveis de dificuldade selecionados' : 'o nível de dificuldade selecionado'}. <br />
            Exibindo apenas os tópicos disponíveis para garantir seu estudo.
          </div>
        </div>
      )}
      {faltouNivel && (
        <div className="aviso alerta" role="status">
          <IconeAviso />
          <div>
            <strong>Aviso de Dificuldade:</strong> Não encontramos questões de nível <strong>{listar(niveisFaltantes)}</strong> para os tópicos selecionados. <br />
            Exibindo apenas as dificuldades disponíveis para garantir seu estudo.
          </div>
        </div>
      )}
    </div>
  );
}

// Mensagem quando nenhuma questão combina com os filtros (vale para qualquer modelo)
function SimuladoVazio({ onVoltar }: { onVoltar: () => void }) {
  return (
    <div className="cartao-questao simulado-vazio">
      <h2>Nenhuma questão foi encontrada.</h2>
      <p>
        Não temos questões cadastradas que combinem exatamente com os <strong>tópicos</strong> e a <strong>dificuldade</strong> selecionados.
      </p>
      <div className="aviso alerta">
        <IconeAviso />
        <div>
          <strong>Dica:</strong> Assuntos introdutórios (como Operadores, Tipos e Variáveis) geralmente possuem apenas questões de nível Fácil ou Média. Ajuste os filtros e tente novamente!
        </div>
      </div>
      <button type="button" className="botao primario" onClick={onVoltar}>
        Voltar para configurações
      </button>
    </div>
  );
}