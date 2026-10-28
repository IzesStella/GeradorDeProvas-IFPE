import { useEffect, useRef, useState } from 'react';
import { IconeLinha } from '../../components/Icones';
import type { Questao } from '../../tipos';
import { classeNivel, classeTipo, separarOrigem } from '../../opcoes';

// Quantidade de linhas por página: no mínimo 12, aumentando conforme a altura da janela
const MIN_LINHAS = 12;
const MAX_LINHAS = 60;

// Números de página exibidos: primeira, última e vizinhas da atual, com "…" entre os saltos
const paginasVisiveis = (atual: number, total: number): (number | '…')[] => {
  if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);
  const numeros = [...new Set([1, total, atual - 1, atual, atual + 1])].filter(n => n >= 1 && n <= total).sort((a, b) => a - b);
  const resultado: (number | '…')[] = [];
  numeros.forEach((n, i) => {
    if (i > 0 && n - numeros[i - 1] > 1) resultado.push('…');
    resultado.push(n);
  });
  return resultado;
};

interface TabelaQuestoesProps {
  questoes: Questao[];
  chaveFiltros: string;
  temFiltro: boolean;
  onVer: (questao: Questao) => void;
  onEditar: (questao: Questao) => void;
  onExcluir: (id: number) => void;
}

export function TabelaQuestoes({ questoes, chaveFiltros, temFiltro, onVer, onEditar, onExcluir }: TabelaQuestoesProps) {
  const [pagina, setPagina] = useState(1);
  const [linhasPorPagina, setLinhasPorPagina] = useState(MIN_LINHAS);
  const cartaoRef = useRef<HTMLDivElement>(null);
  const cabecalhoRef = useRef<HTMLTableSectionElement>(null);
  const linhaRef = useRef<HTMLTableRowElement>(null);
  const paginacaoRef = useRef<HTMLDivElement>(null);

  // Volta para a primeira página quando a busca ou os filtros mudam
  const [filtrosAnteriores, setFiltrosAnteriores] = useState(chaveFiltros);
  if (chaveFiltros !== filtrosAnteriores) {
    setFiltrosAnteriores(chaveFiltros);
    setPagina(1);
  }

  // Calcula quantas linhas cabem na altura da janela
  useEffect(() => {
    const recalcular = () => {
      if (!cartaoRef.current) return;
      const topo = cartaoRef.current.getBoundingClientRect().top + window.scrollY;
      const ocupado =
        (cabecalhoRef.current?.offsetHeight ?? 44) +
        (paginacaoRef.current?.offsetHeight ?? 62) +
        (document.querySelector<HTMLElement>('.rodape')?.offsetHeight ?? 50) +
        48;
      const alturaLinha = linhaRef.current?.offsetHeight || 54;
      const cabem = Math.floor((window.innerHeight - topo - ocupado) / alturaLinha);
      setLinhasPorPagina(Math.max(MIN_LINHAS, Math.min(MAX_LINHAS, cabem)));
    };
    recalcular();
    window.addEventListener('resize', recalcular);
    return () => window.removeEventListener('resize', recalcular);
  }, [questoes.length]);

  const totalPaginas = Math.max(1, Math.ceil(questoes.length / linhasPorPagina));
  const paginaAtual = Math.min(pagina, totalPaginas);
  const inicio = (paginaAtual - 1) * linhasPorPagina;
  const daPagina = questoes.slice(inicio, inicio + linhasPorPagina);

  return (
    <div className="admin-cartao" ref={cartaoRef}>
      <div className="admin-tabela">
        <table>
          <thead ref={cabecalhoRef}>
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
            {daPagina.map((questao, i) => {
              const { fonte, curso } = separarOrigem(questao.origem);
              return (
                <tr key={questao.id} ref={i === 0 ? linhaRef : undefined}>
                  <td className="admin-texto-suave">#{questao.id}</td>
                  <td className="admin-topico">{questao.topico}</td>
                  <td><span className={`etiqueta ${classeTipo(questao.tipo_questao)}`}>{questao.tipo_questao || 'N/A'}</span></td>
                  <td className="admin-origem">
                    {fonte}
                    <small>{curso && <span className="admin-curso">{curso}</span>}{questao.ano}</small>
                  </td>
                  <td><span className={`admin-nivel ${classeNivel(questao.nivel_dificuldade)}`}>{questao.nivel_dificuldade}</span></td>
                  <td>
                    <div className="admin-acoes">
                      <button className="admin-botao-icone" onClick={() => onVer(questao)} aria-label={`Ver questão ${questao.id}`} title="Ver"><IconeLinha nome="olho" /></button>
                      <button className="admin-botao-icone" onClick={() => onEditar(questao)} aria-label={`Editar questão ${questao.id}`} title="Editar"><IconeLinha nome="lapis" /></button>
                      <button className="admin-botao-icone" onClick={() => onExcluir(questao.id)} aria-label={`Excluir questão ${questao.id}`} title="Excluir"><IconeLinha nome="lixeira" /></button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {questoes.length === 0 && (
          <div className="admin-vazio">
            {temFiltro ? 'Nenhuma questão encontrada com esses filtros.' : 'Nenhuma questão cadastrada ainda.'}
          </div>
        )}
      </div>

      <div className="admin-paginacao" ref={paginacaoRef}>
        <span>
          Mostrando <strong>{questoes.length > 0 ? inicio + 1 : 0}</strong>–<strong>{Math.min(inicio + linhasPorPagina, questoes.length)}</strong> de <strong>{questoes.length}</strong>
        </span>
        <div className="admin-paginas">
          <button onClick={() => setPagina(Math.max(1, paginaAtual - 1))} disabled={paginaAtual === 1} aria-label="Página anterior">‹</button>
          {paginasVisiveis(paginaAtual, totalPaginas).map((p, i) =>
            p === '…'
              ? <button key={`salto${i}`} disabled>…</button>
              : <button key={p} className={p === paginaAtual ? 'selecionado' : ''} onClick={() => setPagina(p)} aria-label={`Página ${p}`}>{p}</button>
          )}
          <button onClick={() => setPagina(Math.min(totalPaginas, paginaAtual + 1))} disabled={paginaAtual === totalPaginas} aria-label="Próxima página">›</button>
        </div>
      </div>
    </div>
  );
}