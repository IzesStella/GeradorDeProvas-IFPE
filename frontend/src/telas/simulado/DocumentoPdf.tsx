import { Fragment, useLayoutEffect, useRef, useState } from 'react';
import logoPreto from '../../assets/logo-ifpe-igarassu-preto.svg';
import { BlocoCodigo, Enunciado } from '../../components/ConteudoQuestao';
import type { Questao } from '../../tipos';

// Altura máxima (em px) de enunciado + código para ainda sobrar espaço de resposta na mesma folha
const ALTURA_MAXIMA = 790;

// Versão para impressão do simulado (A4): uma questão por folha, com espaço para a resposta.
// Fica escondida na tela e só aparece quando o estudante manda imprimir.
export function DocumentoPdf({ questoes }: { questoes: Questao[] }) {
  const [cabem, setCabem] = useState<boolean[]>([]);
  const medidorRef = useRef<HTMLDivElement>(null);

  // Mede cada questão: se não sobrar espaço, a resposta vai para a folha seguinte
  useLayoutEffect(() => {
    const blocos = Array.from(medidorRef.current?.children ?? []) as HTMLElement[];
    setCabem(blocos.map(bloco => bloco.offsetHeight <= ALTURA_MAXIMA));
  }, [questoes]);

  const topicos = Array.from(new Set(questoes.map(q => q.topico))).join(', ');

  return (
    <>
      <div className="medidor-pdf" ref={medidorRef} aria-hidden="true">
        {questoes.map((questao, indice) => (
          <div key={questao.id}>
            {indice === 0 && <TopoPdf topicos={topicos} total={questoes.length} />}
            <QuestaoPdf questao={questao} numero={indice + 1} />
          </div>
        ))}
      </div>

      <div className="documento-pdf">
        {questoes.map((questao, indice) => {
          const cabe = cabem[indice] ?? true;
          const rodape = <footer className="rodape-pdf"><span>Questão {indice + 1} de {questoes.length}</span></footer>;
          return (
            <Fragment key={questao.id}>
              <div className="pagina-pdf">
                {indice === 0 && <TopoPdf topicos={topicos} total={questoes.length} />}
                <QuestaoPdf questao={questao} numero={indice + 1} />
                {cabe ? <RespostaPdf /> : <div className="espaco-pdf"></div>}
                {rodape}
              </div>
              {!cabe && (
                <div className="pagina-pdf">
                  <RespostaPdf numero={indice + 1} />
                  {rodape}
                </div>
              )}
            </Fragment>
          );
        })}
      </div>
    </>
  );
}

function TopoPdf({ topicos, total }: { topicos: string; total: number }) {
  return (
    <>
      <header className="cabecalho-pdf">
        <img src={logoPreto} alt="Instituto Federal de Pernambuco - Campus Igarassu" />
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
        <div><span><b>Tópicos:</b> {topicos}</span></div>
        <div><span><b>Questões:</b> {total}</span></div>
      </div>
    </>
  );
}

function QuestaoPdf({ questao, numero }: { questao: Questao; numero: number }) {
  const temCodigo = questao.codigo_typescript && questao.codigo_typescript.trim() !== '';

  return (
    <>
      <div className="bloco-inquebravel">
        <div className="questao-topo-pdf">
          <b>{numero}</b>
          <h3>Questão {numero} - {questao.topico}</h3>
        </div>
        <div className="questao-detalhes-pdf">
          <span>Fonte: {questao.origem} ({questao.ano})</span>
          <span>{questao.tipo_questao ? `${questao.tipo_questao} · ` : ''}{questao.nivel_dificuldade}</span>
        </div>
        <div className="enunciado-pdf">
          <Enunciado texto={questao.enunciado} tabela={questao.tabela_enunciado} />
        </div>
      </div>
      {temCodigo && (
        <div className="codigo-pdf">
          <BlocoCodigo codigo={questao.codigo_typescript} estilo={{ borderRadius: '6px', padding: '10px 12px', fontSize: '12px' }} />
        </div>
      )}
    </>
  );
}

// numero só é informado quando a resposta fica sozinha na folha seguinte
function RespostaPdf({ numero }: { numero?: number }) {
  return (
    <div className="resposta-pdf">
      <p>{numero ? `Sua resposta (Questão ${numero}):` : 'Sua resposta:'}</p>
      <div></div>
    </div>
  );
}