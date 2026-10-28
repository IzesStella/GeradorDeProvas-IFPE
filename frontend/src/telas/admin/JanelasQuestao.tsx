import { useState, type ChangeEvent, type FormEvent, type ReactNode } from 'react';
import { BlocoCodigo, Enunciado } from '../../components/ConteudoQuestao';
import type { Questao } from '../../tipos';
import { CURSOS, NIVEIS, ORIGENS, TIPOS, TOPICOS_CADASTRO, classeNivel, classeTipo, separarOrigem } from '../../opcoes';

// Janelas do painel que mostram uma questão: visualização e formulário de cadastro/edição

interface VisualizarQuestaoProps {
  aberto: boolean;
  questao: Questao | null;
  aoFechar: () => void;
  aoEditar: () => void;
}

// Janela com a questão completa, como o estudante vai vê-la
export function VisualizarQuestao({ aberto, questao, aoFechar, aoEditar }: VisualizarQuestaoProps) {
  const origem = questao ? separarOrigem(questao.origem) : null;
  const temCodigo = questao?.codigo_typescript && questao.codigo_typescript.trim() !== '';

  return (
    <aside className={`admin-janela ${aberto ? 'aberta' : ''}`} role="dialog" aria-label="Detalhes da questão" aria-hidden={!aberto}>
      <div className="admin-janela-topo">
        <h3>Questão #{questao?.id}</h3>
        <button className="admin-botao-icone" onClick={aoFechar} aria-label="Fechar">✕</button>
      </div>

      <div className="admin-janela-corpo">
        {questao && origem && (
          <>
            <div className="etiquetas">
              <span className={`etiqueta ${classeTipo(questao.tipo_questao)}`}>{questao.tipo_questao || 'N/A'}</span>
              <span className="etiqueta">{questao.topico}</span>
              <span className={`etiqueta nivel ${classeNivel(questao.nivel_dificuldade)}`}>{questao.nivel_dificuldade}</span>
            </div>
            <div className="admin-texto-suave admin-detalhe-origem">{origem.fonte} - {origem.curso} {questao.ano}</div>
            <div className="admin-enunciado">
              <Enunciado texto={questao.enunciado} tabela={questao.tabela_enunciado} />
            </div>
            {temCodigo && (
              <BlocoCodigo codigo={questao.codigo_typescript} numerarLinhas estilo={{ borderRadius: '8px', padding: '16px', fontSize: '14px' }} />
            )}
          </>
        )}
      </div>

      <div className="admin-janela-rodape">
        <button className="botao" onClick={aoFechar}>Fechar</button>
        <button className="botao primario" onClick={aoEditar}>Editar questão</button>
      </div>
    </aside>
  );
}

interface FormularioQuestaoProps {
  aberto: boolean;
  questao: Questao | null;
  aoFechar: () => void;
  aoSalvar: (dados: object) => void;
}

// Valores dos campos: os da questão em edição ou, numa questão nova, os padrões
const camposIniciais = (questao: Questao | null) => {
  const origem = separarOrigem(questao?.origem ?? '');
  return {
    topico: questao?.topico ?? '',
    tipo: questao?.tipo_questao || TIPOS[0],
    nivel: questao?.nivel_dificuldade ?? NIVEIS[0],
    fonte: origem.fonte,
    curso: origem.curso || CURSOS[0],
    ano: questao?.ano ?? '',
    enunciado: questao?.enunciado ?? '',
    tabela: questao?.tabela_enunciado ? JSON.stringify(questao.tabela_enunciado, null, 2) : '',
    codigo: questao?.codigo_typescript ?? '',
    easterEgg: questao?.easter_egg_conteudo ?? ''
  };
};

type Campos = ReturnType<typeof camposIniciais>;

// Janela de cadastro e edição. Quando questao é null, cadastra uma nova.
export function FormularioQuestao({ aberto, questao, aoFechar, aoSalvar }: FormularioQuestaoProps) {
  const [campos, setCampos] = useState<Campos>(() => camposIniciais(questao));
  const [estavaAberto, setEstavaAberto] = useState(aberto);

  // Preenche os campos de novo sempre que a janela abre
  if (aberto !== estavaAberto) {
    setEstavaAberto(aberto);
    if (aberto) setCampos(camposIniciais(questao));
  }

  const alterar = (campo: keyof Campos) => (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setCampos({ ...campos, [campo]: e.target.value });

  const salvar = (e: FormEvent) => {
    e.preventDefault();
    if (!campos.topico) return alert('Por favor, selecione um tópico válido.');
    if (!campos.fonte) return alert('Por favor, selecione uma fonte para a questão.');

    // A tabela é digitada em JSON; verifica o formato antes de enviar ao banco
    let tabela = null;
    if (campos.tabela.trim() !== '') {
      try {
        tabela = JSON.parse(campos.tabela);
      } catch {
        return alert('O formato da Tabela do Enunciado é inválido. Certifique-se de usar o padrão JSON (Ex: [["A", "B"], ["1", "2"]]).');
      }
    }

    aoSalvar({
      topico: campos.topico,
      enunciado: campos.enunciado,
      codigo_typescript: campos.codigo,
      nivel_dificuldade: campos.nivel,
      tipo_questao: campos.tipo,
      tabela_enunciado: tabela,
      easter_egg_conteudo: campos.easterEgg.trim() || null,
      origem: `${campos.fonte} - ${campos.curso}`,
      ano: campos.ano
    });
  };

  return (
    <aside className={`admin-janela ${aberto ? 'aberta' : ''}`} role="dialog" aria-label="Formulário da questão" aria-hidden={!aberto}>
      <form onSubmit={salvar} className="admin-formulario">
        <div className="admin-janela-topo">
          <h3>{questao ? `Editando questão #${questao.id}` : 'Nova questão'}</h3>
          <button type="button" className="admin-botao-icone" onClick={aoFechar} aria-label="Fechar">✕</button>
        </div>

        <div className="admin-janela-corpo">
          <div className="admin-formulario-colunas">
            <div>
              <div className="admin-secao">Classificação</div>
              <Campo rotulo="Tópico da questão">
                <select value={campos.topico} onChange={alterar('topico')} required className="admin-entrada">
                  <option value="" disabled>Selecione um tópico</option>
                  {TOPICOS_CADASTRO.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </Campo>
              <div className="admin-duas-colunas">
                <Campo rotulo="Tipo da questão">
                  <select value={campos.tipo} onChange={alterar('tipo')} className="admin-entrada">
                    {TIPOS.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </Campo>
                <Campo rotulo="Dificuldade">
                  <select value={campos.nivel} onChange={alterar('nivel')} className="admin-entrada">
                    {NIVEIS.map(n => <option key={n} value={n}>{n}</option>)}
                  </select>
                </Campo>
              </div>

              <div className="admin-secao">Origem</div>
              <Campo rotulo="Fonte da questão">
                <select value={campos.fonte} onChange={alterar('fonte')} required className="admin-entrada">
                  <option value="" disabled>Selecione uma fonte</option>
                  {ORIGENS.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </Campo>
              <div className="admin-duas-colunas">
                <Campo rotulo="Curso">
                  <select value={campos.curso} onChange={alterar('curso')} className="admin-entrada">
                    {CURSOS.map(c => <option key={c} value={c}>Curso {c}</option>)}
                  </select>
                </Campo>
                <Campo rotulo="Período (ano)">
                  <input type="text" value={campos.ano} onChange={alterar('ano')} placeholder="Ex: 2025.1" required className="admin-entrada" />
                </Campo>
              </div>
            </div>

            <div>
              <div className="admin-secao">Conteúdo</div>
              <Campo rotulo="Enunciado" dica="Use Enter para quebrar linha.">
                <textarea value={campos.enunciado} onChange={alterar('enunciado')} rows={7} required className="admin-entrada" />
              </Campo>
              <Campo rotulo="Tabela (JSON, opcional)">
                <textarea value={campos.tabela} onChange={alterar('tabela')} rows={2} placeholder='Ex: [["A", "B"], ["1", "2"]]' className="admin-entrada codigo" />
              </Campo>
              <Campo rotulo="Código TypeScript (opcional)">
                <textarea value={campos.codigo} onChange={alterar('codigo')} rows={6} placeholder="let x = 10;" className="admin-entrada codigo" />
              </Campo>
              <Campo rotulo="Easter egg (link, opcional)">
                <input type="text" value={campos.easterEgg} onChange={alterar('easterEgg')} placeholder="Ex: https://youtu.be/..." className="admin-entrada" />
              </Campo>
            </div>
          </div>
        </div>

        <div className="admin-janela-rodape">
          <button type="button" className="botao" onClick={aoFechar}>Cancelar</button>
          <button type="submit" className="botao primario">{questao ? 'Atualizar questão' : 'Salvar questão'}</button>
        </div>
      </form>
    </aside>
  );
}

function Campo({ rotulo, dica, children }: { rotulo: string; dica?: string; children: ReactNode }) {
  return (
    <div className="admin-campo">
      <label>
        <span className="admin-rotulo">{rotulo}</span>
        {children}
      </label>
      {dica && <div className="admin-dica">{dica}</div>}
    </div>
  );
}