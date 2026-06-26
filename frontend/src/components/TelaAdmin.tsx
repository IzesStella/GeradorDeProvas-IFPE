import React, { useState, useEffect } from 'react';

interface TelaAdminProps {
  onVoltar: () => void;
}

interface Questao {
  id: number;
  topico: string;
  enunciado: string;
  codigo_typescript: string;
  nivel_dificuldade: string;
  origem: string;
  ano: string;
  tipo_questao?: string;
  tabela_enunciado?: any;
}

// Tópicos atualizados com as novas opções
const TOPICOS_DISPONIVEIS = [
  'Operadores, Tipos e Variáveis',
  'Operadores Lógicos',
  'Execução Condicional',
  'Laços - Parte 1',
  'Laços - Parte 2',
  'Subprogramas',
  'Vetores',
  'Arrays',
  'Tipos'
];

// Origens Base com todas as miniprovas e recuperações
const ORIGENS_BASE = [
  'Miniprova - Operadores, Tipos e Variáveis',
  'Miniprova - Execução Condicional',
  'Miniprova - Operadores Lógicos',
  'Miniprova - Laços Parte 1',
  'Miniprova - Laços Parte 2',
  'Miniprova - Subprogramas',
  'Miniprova - Vetores',
  'Miniprova - Arrays',
  'Miniprova - Tipos',
  'Primeira Avaliação Individual',
  'Primeira Recuperação Individual',
  'Segunda Avaliação Individual',
  'Segunda Recuperação Individual',
  'Avaliação Final Individual'
];
const CURSOS_DISPONIVEIS = ['IPI', 'TSI'];

export function TelaAdmin({ onVoltar }: TelaAdminProps) {
  const [topico, setTopico] = useState('');
  const [enunciado, setEnunciado] = useState('');
  const [codigo, setCodigo] = useState('');
  const [dificuldade, setDificuldade] = useState('Fácil');
  const [semestre, setSemestre] = useState('');
  const [origemBase, setOrigemBase] = useState(ORIGENS_BASE[0]);
  const [origemCurso, setOrigemCurso] = useState(CURSOS_DISPONIVEIS[0]);
  const [tipoQuestao, setTipoQuestao] = useState('Implementação');
  const [tabelaEnunciado, setTabelaEnunciado] = useState('');
  
  const [questoes, setQuestoes] = useState<Questao[]>([]);
  const [editandoId, setEditandoId] = useState<number | null>(null);

  useEffect(() => {
    carregarQuestoes();
  }, []);

  const carregarQuestoes = async () => {
    try {
      const resposta = await fetch('http://localhost:3333/api/questoes');
      if (resposta.ok) {
        const dados = await resposta.json();
        setQuestoes(dados);
      }
    } catch (erro) {
      console.error('Erro ao buscar questões:', erro);
    }
  };

  const handleSalvar = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!topico) {
      alert('Por favor, selecione um tópico válido.');
      return;
    }

    // Validação da Tabela JSON
    let tabelaParseada = null;
    if (tabelaEnunciado.trim() !== '') {
      try {
        tabelaParseada = JSON.parse(tabelaEnunciado);
      } catch (erro) {
        alert('O formato da Tabela do Enunciado é inválido. Certifique-se de usar o padrão JSON (Ex: [["A", "B"], ["1", "2"]]).');
        return; // Interrompe o salvamento se o JSON estiver quebrado
      }
    }

    const origemFinal = `${origemBase} - ${origemCurso}`;
    const url = editandoId ? `http://localhost:3333/api/questoes/${editandoId}` : 'http://localhost:3333/api/questoes';
    const method = editandoId ? 'PUT' : 'POST';

    try {
      const resposta = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topico,
          enunciado,
          codigo_typescript: codigo,
          nivel_dificuldade: dificuldade,
          tipo_questao: tipoQuestao,
          tabela_enunciado: tabelaParseada,
          easter_egg_conteudo: null,
          origem: origemFinal,
          ano: semestre
        }),
      });

      if (resposta.ok) {
        alert(`Questão ${editandoId ? 'atualizada' : 'salva'} com sucesso!`);
        limparFormulario();
        carregarQuestoes();
      } else {
        alert('Erro ao salvar a questão.');
      }
    } catch (erro) {
      console.error('Erro na requisição:', erro);
      alert('Erro de conexão com o backend.');
    }
  };

  const handleEditar = (questao: Questao) => {
    setEditandoId(questao.id);
    setTopico(questao.topico);
    setEnunciado(questao.enunciado);
    setCodigo(questao.codigo_typescript || '');
    setDificuldade(questao.nivel_dificuldade);
    setSemestre(questao.ano);
    setTipoQuestao(questao.tipo_questao || 'Implementação');
    
    // Tratamento para jogar o objeto JSON da tabela de volta como string no campo de texto
    setTabelaEnunciado(questao.tabela_enunciado ? JSON.stringify(questao.tabela_enunciado, null, 2) : '');

    // Desmembrando a Origem do Banco para os selects
    let oBase = ORIGENS_BASE[0];
    let oCurso = CURSOS_DISPONIVEIS[0];
    if (questao.origem) {
      if (questao.origem.endsWith(' - IPI')) {
        oCurso = 'IPI';
        oBase = questao.origem.replace(' - IPI', '');
      } else if (questao.origem.endsWith(' - TSI')) {
        oCurso = 'TSI';
        oBase = questao.origem.replace(' - TSI', '');
      } else {
        oBase = questao.origem; // Caso fuja do padrão
      }
    }
    setOrigemBase(oBase);
    setOrigemCurso(oCurso);
  };

  const handleExcluir = async (id: number) => {
    if (!window.confirm('Tem certeza que deseja remover esta questão?')) return;
    try {
      const resposta = await fetch(`http://localhost:3333/api/questoes/${id}`, {
        method: 'DELETE',
      });
      if (resposta.ok) {
        carregarQuestoes();
      }
    } catch (erro) {
      console.error('Erro ao excluir:', erro);
    }
  };

  const limparFormulario = () => {
    setEditandoId(null);
    setTopico('');
    setEnunciado('');
    setCodigo('');
    setDificuldade('Fácil');
    setSemestre('');
    setOrigemBase(ORIGENS_BASE[0]);
    setOrigemCurso(CURSOS_DISPONIVEIS[0]);
    setTipoQuestao('Implementação');
    setTabelaEnunciado('');
  };

  return (
    <>
      <style>{`
        body, html { margin: 0; padding: 0; width: 100%; background-color: #121418; font-family: system-ui, -apple-system, sans-serif; }
        * { box-sizing: border-box; font-family: inherit; }
        .btn-primario { background-color: #36a860; color: #121418; border: none; padding: 10px 12px; border-radius: 6px; font-size: 14px; font-weight: bold; cursor: pointer; transition: opacity 0.2s; display: inline-flex; align-items: center; justify-content: center; }
        .btn-primario:hover { opacity: 0.8; }
        .btn-secundario { background-color: transparent; color: #a0aab5; border: 1px solid #2a2d35; padding: 8px 16px; border-radius: 6px; font-size: 14px; font-weight: bold; cursor: pointer; transition: background-color 0.2s; display: inline-flex; align-items: center; justify-content: center; }
        .btn-secundario:hover { background-color: #2a2d35; color: #fff; }
        .btn-link-editar { background: transparent; color: #36a860; border: none; padding: 0; font-size: 13px; font-weight: bold; cursor: pointer; transition: opacity 0.2s; }
        .btn-link-editar:hover { text-decoration: underline; opacity: 0.8; }
        .btn-link-excluir { background: transparent; color: #e74c3c; border: none; padding: 0; font-size: 13px; font-weight: bold; cursor: pointer; transition: opacity 0.2s; }
        .btn-link-excluir:hover { text-decoration: underline; opacity: 0.8; }
        .badge { font-size: 12px; font-weight: 600; display: inline-flex; align-items: center; gap: 8px; color: #e0e0e0; line-height: 1; }
        .badge::before { content: ''; display: block; width: 8px; height: 8px; border-radius: 50%; position: relative; top: -1px; }
        .badge-facil::before { background-color: #2ecc71; box-shadow: 0 0 8px rgba(46, 204, 113, 0.4); }
        .badge-media::before { background-color: #f39c12; box-shadow: 0 0 8px rgba(243, 156, 18, 0.4); }
        .badge-dificil::before { background-color: #e74c3c; box-shadow: 0 0 8px rgba(231, 76, 60, 0.4); }
        
        .form-container-fixo {
          background-color: #1a1d24; padding: 25px; border-radius: 12px; flex: 1 1 320px;
          max-width: 420px; width: 100%; box-shadow: 0 10px 30px rgba(0,0,0,0.5);
          position: sticky; top: 25px; align-self: flex-start; max-height: calc(100vh - 50px); overflow-y: auto;
        }
        .form-container-fixo::-webkit-scrollbar { width: 6px; }
        .form-container-fixo::-webkit-scrollbar-track { background: #1a1d24; }
        .form-container-fixo::-webkit-scrollbar-thumb { background: #2a2d35; border-radius: 4px; }
        .form-container-fixo::-webkit-scrollbar-thumb:hover { background: #3a3d45; }
        
        @media (max-width: 960px) {
          .header-admin { flex-direction: row !important; flex-wrap: wrap; padding: 15px 20px !important; }
          .header-admin > div:nth-child(1) { flex: unset !important; width: 50%; justify-content: flex-start !important; }
          .header-admin > div:nth-child(3) { flex: unset !important; width: 50%; justify-content: flex-end !important; }
          .header-admin > div:nth-child(2) { flex: unset !important; width: 100%; justify-content: center !important; margin-top: 15px; order: 3; text-align: center; }
          .container-principal { padding: 20px 15px !important; }
        }
        @media (max-width: 768px) {
          .container-principal { flex-direction: column; align-items: center !important; }
          .form-container-fixo { position: static; max-width: 100%; padding: 20px; max-height: unset; overflow-y: visible; }
          .tabela-container { max-width: 100% !important; width: 100%; padding: 20px 15px !important; }
        }
      `}</style>

      <div style={{ backgroundColor: '#121418', minHeight: '100vh', color: '#e0e0e0', display: 'flex', flexDirection: 'column' }}>
        {/* HEADER */}
        <header className="header-admin" style={{ backgroundColor: '#1a1d24', padding: '15px 5vw', display: 'flex', alignItems: 'center', borderBottom: '1px solid #2a2d35' }}>
          <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-start' }}>
             <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#fff', textAlign: 'center' }}>[Logo IFPE]</span>
          </div>
          <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
            <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#fff', textAlign: 'center' }}>Painel Administrativo</span>
          </div>
          <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
            <button onClick={onVoltar} style={{ backgroundColor: 'transparent', color: '#a0aab5', border: '1px solid #2a2d35', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }}>
              Voltar
            </button>
          </div>
        </header>

        {/* CONTAINER PRINCIPAL */}
        <div className="container-principal" style={{ flex: 1, padding: '25px 5vw', display: 'flex', gap: '25px', alignItems: 'flex-start', justifyContent: 'center', flexWrap: 'wrap' }}>
          
          {/* FORMULÁRIO (FIXO) */}
          <div className="form-container-fixo">
            <h2 style={{ color: '#fff', marginBottom: '20px', fontSize: '20px', marginTop: 0 }}>
              {editandoId ? 'Editar Questão' : 'Cadastrar Nova Questão'}
            </h2>
            <form onSubmit={handleSalvar} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              
              <div>
                <label style={{ display: 'block', marginBottom: '4px', color: '#a0aab5', fontSize: '13px' }}>Tópico da Questão:</label>
                <select value={topico} onChange={(e) => setTopico(e.target.value)} required style={{ width: '100%', padding: '8px 10px', backgroundColor: '#121418', border: '1px solid #2a2d35', color: '#fff', borderRadius: '6px', fontFamily: 'inherit', boxSizing: 'border-box', fontSize: '14px' }}>
                  <option value="" disabled>Selecione um tópico</option>
                  {TOPICOS_DISPONIVEIS.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '4px', color: '#a0aab5', fontSize: '13px' }}>Tipo da Questão:</label>
                  <select value={tipoQuestao} onChange={(e) => setTipoQuestao(e.target.value)} style={{ width: '100%', padding: '8px 10px', backgroundColor: '#121418', border: '1px solid #2a2d35', color: '#fff', borderRadius: '6px', fontFamily: 'inherit', boxSizing: 'border-box', fontSize: '14px' }}>
                    <option value="Implementação">Implementação</option>
                    <option value="Execução de Código">Execução de Código</option>
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '4px', color: '#a0aab5', fontSize: '13px' }}>Dificuldade:</label>
                  <select value={dificuldade} onChange={(e) => setDificuldade(e.target.value)} style={{ width: '100%', padding: '8px 10px', backgroundColor: '#121418', border: '1px solid #2a2d35', color: '#fff', borderRadius: '6px', fontFamily: 'inherit', boxSizing: 'border-box', fontSize: '14px' }}>
                    <option value="Fácil">Fácil</option>
                    <option value="Média">Média</option>
                    <option value="Difícil">Difícil</option>
                  </select>
                </div>
              </div>

              {/* SEÇÃO DE ORIGEM - DOIS CAMPOS SEPARADOS */}
              <div style={{ border: '1px solid #2a2d35', padding: '10px', borderRadius: '6px', backgroundColor: '#16191f' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: '#a0aab5', fontSize: '13px', fontWeight: 'bold' }}>Fonte da Questão:</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <select value={origemBase} onChange={(e) => setOrigemBase(e.target.value)} style={{ width: '100%', padding: '8px 10px', backgroundColor: '#121418', border: '1px solid #2a2d35', color: '#fff', borderRadius: '6px', fontFamily: 'inherit', boxSizing: 'border-box', fontSize: '13px' }}>
                    {ORIGENS_BASE.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                  
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <select value={origemCurso} onChange={(e) => setOrigemCurso(e.target.value)} style={{ flex: 1, padding: '8px 10px', backgroundColor: '#121418', border: '1px solid #2a2d35', color: '#fff', borderRadius: '6px', fontFamily: 'inherit', boxSizing: 'border-box', fontSize: '13px' }}>
                      {CURSOS_DISPONIVEIS.map(c => <option key={c} value={c}>Curso {c}</option>)}
                    </select>
                    
                    <input type="text" value={semestre} onChange={(e) => setSemestre(e.target.value)} placeholder="Ano (Ex: 2025.1)" required style={{ flex: 1, padding: '8px 10px', backgroundColor: '#121418', border: '1px solid #2a2d35', color: '#fff', borderRadius: '6px', fontFamily: 'inherit', boxSizing: 'border-box', fontSize: '13px' }} />
                  </div>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '4px', color: '#a0aab5', fontSize: '13px' }}>Enunciado (Use Enter p/ quebrar linha):</label>
                <textarea value={enunciado} onChange={(e) => setEnunciado(e.target.value)} rows={3} required style={{ width: '100%', padding: '8px 10px', backgroundColor: '#121418', border: '1px solid #2a2d35', color: '#fff', borderRadius: '6px', fontFamily: 'inherit', resize: 'vertical', boxSizing: 'border-box', fontSize: '14px' }} />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '4px', color: '#a0aab5', fontSize: '13px' }}>Tabela (Formato Matriz JSON - Opcional):</label>
                <textarea 
                  value={tabelaEnunciado} 
                  onChange={(e) => setTabelaEnunciado(e.target.value)} 
                  rows={2} 
                  placeholder='Ex: [["A", "B"], ["1", "2"]]'
                  style={{ width: '100%', padding: '8px 10px', backgroundColor: '#121418', border: '1px solid #2a2d35', color: '#e0e0e0', borderRadius: '6px', fontFamily: 'monospace', resize: 'vertical', boxSizing: 'border-box', fontSize: '13px' }} 
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '4px', color: '#a0aab5', fontSize: '13px' }}>Código TypeScript (Opcional):</label>
                <textarea value={codigo} onChange={(e) => setCodigo(e.target.value)} rows={2} style={{ width: '100%', padding: '8px 10px', backgroundColor: '#121418', border: '1px solid #2a2d35', color: '#36a860', borderRadius: '6px', fontFamily: 'monospace', resize: 'vertical', boxSizing: 'border-box', fontSize: '13px' }} />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '5px' }}>
                <button type="submit" className="btn-primario" style={{ flex: 1 }}>
                  {editandoId ? 'Atualizar' : 'Salvar'}
                </button>
                {editandoId && (
                  <button type="button" onClick={limparFormulario} className="btn-secundario" style={{ flex: 1 }}>
                    Cancelar
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* TABELA DE QUESTÕES */}
          <div className="tabela-container" style={{ backgroundColor: '#1a1d24', padding: '25px', borderRadius: '12px', flex: '2 1 450px', width: '100%', maxWidth: '100%', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
            <h2 style={{ color: '#fff', marginBottom: '20px', fontSize: '20px', marginTop: 0 }}>Banco de Questões</h2>
            <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch', paddingBottom: '10px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #2a2d35', color: '#a0aab5', fontSize: '13px' }}>
                    <th style={{ padding: '10px 8px' }}>ID</th>
                    <th style={{ padding: '10px 8px' }}>Tópico</th>
                    <th style={{ padding: '10px 8px' }}>Tipo</th>
                    <th style={{ padding: '10px 8px' }}>Origem/Ano</th>
                    <th style={{ padding: '10px 8px' }}>Dificuldade</th>
                    <th style={{ padding: '10px 8px' }}>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {questoes.length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{ padding: '20px', textAlign: 'center', color: '#a0aab5' }}>Nenhuma questão encontrada.</td>
                    </tr>
                  ) : (
                    questoes.map((q) => (
                      <tr key={q.id} style={{ borderBottom: '1px solid #2a2d35', fontSize: '13px' }}>
                        <td style={{ padding: '12px 8px', color: '#a0aab5' }}>#{q.id}</td>
                        <td style={{ padding: '12px 8px', fontWeight: 'bold', color: '#e0e0e0' }}>{q.topico}</td>
                        <td style={{ padding: '12px 8px', color: '#a0aab5' }}>{q.tipo_questao || 'N/A'}</td>
                        <td style={{ padding: '12px 8px', color: '#a0aab5' }}>{q.origem} - {q.ano}</td>
                        <td style={{ padding: '12px 8px' }}>
                          <span className={ q.nivel_dificuldade === 'Fácil' ? 'badge badge-facil' : q.nivel_dificuldade === 'Média' ? 'badge badge-media' : 'badge badge-dificil' }>
                            {q.nivel_dificuldade}
                          </span>
                        </td>
                        <td style={{ padding: '12px 8px' }}>
                          <div style={{ display: 'flex', gap: '15px' }}>
                            <button onClick={() => handleEditar(q)} className="btn-link-editar">
                              Editar
                            </button>
                            <button onClick={() => handleExcluir(q.id)} className="btn-link-excluir">
                              Excluir
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}