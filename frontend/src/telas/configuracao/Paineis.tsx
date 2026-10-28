import { IconeCadeado } from '../../components/Icones';
import type { ModoProva } from '../../tipos';
import { MODELOS, NIVEIS, PREDEFINICOES, QUANTIDADE_MAXIMA, classeNivel } from '../../opcoes';

interface ListaModelosProps {
  modoAtivo: ModoProva;
  onEscolher: (modo: ModoProva) => void;
}

const etiqueta = (modo: ModoProva) =>
  modo === 'livre' ? `até ${QUANTIDADE_MAXIMA}` : `${PREDEFINICOES[modo].quantidade} questões`;

// Painel 1: lista dos modelos de prova
export function ListaModelos({ modoAtivo, onEscolher }: ListaModelosProps) {
  return (
    <div className="lista-modelos" role="radiogroup" aria-label="Modelo de prova">
      {MODELOS.map(modelo => (
        <button
          key={modelo.id}
          type="button"
          role="radio"
          aria-checked={modoAtivo === modelo.id}
          className={`modelo ${modoAtivo === modelo.id ? 'selecionado' : ''}`}
          onClick={() => onEscolher(modelo.id)}
        >
          <div>
            <strong>{modelo.titulo}</strong>
            {modelo.descricao}
          </div>
          <em>{etiqueta(modelo.id)}</em>
        </button>
      ))}
    </div>
  );
}

// Painel 2: escolha de tópicos, quantidade e dificuldade

const Trava = ({ texto = 'Travado' }: { texto?: string }) => (
  <span className="trava"><IconeCadeado /> {texto}</span>
);

interface SeletorTopicosProps {
  topicos: string[];
  selecionados: string[];
  travado: boolean;
  apenasUm: boolean;
  onAlternar: (topico: string) => void;
  onSelecionarTodos: () => void;
}

export function SeletorTopicos({ topicos, selecionados, travado, apenasUm, onAlternar, onSelecionarTodos }: SeletorTopicosProps) {
  const todosMarcados = selecionados.length === topicos.length;

  return (
    <div className="bloco bloco-topicos">
      <div className="bloco-cabecalho">
        <span>{apenasUm ? 'Tópico' : 'Tópicos'}</span>
        {travado ? (
          <Trava />
        ) : apenasUm ? (
          <em>Escolha 1 tópico</em>
        ) : (
          <span>
            <em>{selecionados.length} de {topicos.length}</em>
            {' · '}
            <button type="button" className="link-acao" onClick={onSelecionarTodos}>
              {todosMarcados ? 'Limpar' : 'Selecionar todos'}
            </button>
          </span>
        )}
      </div>
      <div className="grade-topicos">
        {topicos.map(topico => {
          const marcado = selecionados.includes(topico);
          return (
            <button
              key={topico}
              type="button"
              role={apenasUm ? 'radio' : 'checkbox'}
              aria-checked={marcado}
              className={`opcao ${marcado ? 'selecionado' : ''}`}
              disabled={travado}
              onClick={() => onAlternar(topico)}
            >
              {topico}
            </button>
          );
        })}
      </div>
    </div>
  );
}

interface SeletorQuantidadeProps {
  quantidade: number;
  travado: boolean;
  onMudar: (diferenca: number) => void;
}

export function SeletorQuantidade({ quantidade, travado, onMudar }: SeletorQuantidadeProps) {
  return (
    <div className="bloco">
      <div className="bloco-cabecalho">
        <span>Quantidade de questões</span>
        {travado && <Trava />}
      </div>
      <div className="linha-quantidade">
        <div className="contador">
          <button type="button" onClick={() => onMudar(-1)} disabled={travado} aria-label="Diminuir quantidade">−</button>
          <output aria-live="polite">{quantidade}</output>
          <button type="button" onClick={() => onMudar(1)} disabled={travado} aria-label="Aumentar quantidade">+</button>
        </div>
        {!travado && <span>máximo {QUANTIDADE_MAXIMA} questões</span>}
      </div>
    </div>
  );
}

interface SeletorDificuldadeProps {
  selecionadas: string[];
  travado: boolean;
  automatica: boolean;
  onAlternar: (nivel: string) => void;
}

export function SeletorDificuldade({ selecionadas, travado, automatica, onAlternar }: SeletorDificuldadeProps) {
  return (
    <div className="bloco">
      <div className="bloco-cabecalho">
        <span>Dificuldade</span>
        {automatica ? <Trava texto="Automática" /> : travado && <Trava />}
      </div>
      {automatica ? (
        <div className="caixa-automatica">Sorteio automático pelo sistema.</div>
      ) : (
        <div className="grade-niveis">
          {NIVEIS.map(nivel => {
            const marcado = selecionadas.includes(nivel);
            return (
              <button
                key={nivel}
                type="button"
                role="checkbox"
                aria-checked={marcado}
                className={`opcao ${classeNivel(nivel)} ${marcado ? 'selecionado' : ''}`}
                disabled={travado}
                onClick={() => onAlternar(nivel)}
              >
                {nivel}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}