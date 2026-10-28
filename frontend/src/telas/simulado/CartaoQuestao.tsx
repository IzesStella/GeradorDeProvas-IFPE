import type { Ref } from 'react';
import { BlocoCodigo, Enunciado } from '../../components/ConteudoQuestao';
import { IconeLampada } from '../../components/Icones';
import type { Questao } from '../../tipos';
import { classeNivel, classeTipo } from '../../opcoes';

interface CartaoQuestaoProps {
  questao: Questao;
  numero: number;
  ref?: Ref<HTMLElement>;
}

// Uma questão do simulado na tela: fonte, etiquetas, enunciado, código e easter egg
export function CartaoQuestao({ questao, numero, ref }: CartaoQuestaoProps) {
  const temCodigo = questao.codigo_typescript && questao.codigo_typescript.trim() !== '';

  return (
    <section className="cartao-questao" ref={ref}>
      <div className="cartao-topo">
        <div>
          <h3>Questão {numero}</h3>
          <span className="cartao-fonte">Fonte: {questao.origem} ({questao.ano})</span>
        </div>
        <div className="etiquetas">
          {questao.tipo_questao && (
            <span className={`etiqueta ${classeTipo(questao.tipo_questao)}`}>{questao.tipo_questao}</span>
          )}
          <span className="etiqueta">{questao.topico}</span>
          <span className={`etiqueta nivel ${classeNivel(questao.nivel_dificuldade)}`}>{questao.nivel_dificuldade}</span>
        </div>
      </div>

      <div className="cartao-enunciado">
        <Enunciado texto={questao.enunciado} tabela={questao.tabela_enunciado} />
      </div>

      {temCodigo && (
        <BlocoCodigo
          codigo={questao.codigo_typescript}
          numerarLinhas
          estilo={{ borderRadius: '10px', border: '1px solid var(--borda)', padding: '20px', fontSize: '14px' }}
        />
      )}

      {questao.easter_egg_conteudo && <EasterEgg texto={questao.easter_egg_conteudo} />}
    </section>
  );
}

// Transforma os endereços do texto em links clicáveis
function EasterEgg({ texto }: { texto: string }) {
  return (
    <div className="easter-egg">
      <IconeLampada />
      Easter egg:{' '}
      {texto.split(/(https?:\/\/[^\s]+)/g).map((parte, i) =>
        /^https?:\/\//.test(parte)
          ? <a key={i} href={parte} target="_blank" rel="noopener noreferrer">{parte}</a>
          : parte
      )}
    </div>
  );
}