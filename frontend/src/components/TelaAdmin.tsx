import React, { useState, useEffect } from 'react';
import { ModalAjudaAdmin } from './ModalAjudaAdmin';

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

const TOPICOS_DISPONIVEIS = [
  'Operadores, Tipos e Variáveis',
  'Operadores Lógicos',
  'Execução Condicional',
  'Laços',
  'Laços - Parte 1',
  'Laços - Parte 2',
  'Subprogramas',
  'Vetores',
  'Arrays',
  'Tipos',
  'Recursão - Unidade 1',
  'Recursão - Unidade 2'
];

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
const ITENS_POR_PAGINA = 12;

export function TelaAdmin({ onVoltar }: TelaAdminProps) {
  const [topico, setTopico] = useState('');
  const [enunciado, setEnunciado] = useState('');
  const [codigo, setCodigo] = useState('');
  const [dificuldade, setDificuldade] = useState('Fácil');
  const [semestre, setSemestre] = useState('');
  const [origemBase, setOrigemBase] = useState('');
  const [origemCurso, setOrigemCurso] = useState(CURSOS_DISPONIVEIS[0]);
  const [tipoQuestao, setTipoQuestao] = useState('Implementação');
  const [tabelaEnunciado, setTabelaEnunciado] = useState('');
  
  const [questoes, setQuestoes] = useState<Questao[]>([]);
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [modalAjudaAberto, setModalAjudaAberto] = useState(false);

  const [termoPesquisa, setTermoPesquisa] = useState('');
  const [paginaAtual, setPaginaAtual] = useState(1);

  useEffect(() => {
    carregarQuestoes();
  }, []);

  useEffect(() => {
    setPaginaAtual(1);
  }, [termoPesquisa]);

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
    if (!origemBase) {
      alert('Por favor, selecione uma fonte para a questão.');
      return;
    }

    let tabelaParseada = null;
    if (tabelaEnunciado.trim() !== '') {
      try {
        tabelaParseada = JSON.parse(tabelaEnunciado);
      } catch (erro) {
        alert('O formato da Tabela do Enunciado é inválido. Certifique-se de usar o padrão JSON (Ex: [["A", "B"], ["1", "2"]]).');
        return;
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
    setTabelaEnunciado(questao.tabela_enunciado ? JSON.stringify(questao.tabela_enunciado, null, 2) : '');

    let oBase = '';
    let oCurso = CURSOS_DISPONIVEIS[0];

    if (questao.origem) {
      if (questao.origem.endsWith(' - IPI')) {
        oCurso = 'IPI';
        oBase = questao.origem.replace(' - IPI', '');
      } else if (questao.origem.endsWith(' - TSI')) {
        oCurso = 'TSI';
        oBase = questao.origem.replace(' - TSI', '');
      } else {
        oBase = questao.origem;
      }
    }
    setOrigemBase(oBase);
    setOrigemCurso(oCurso);
  };

  const handleExcluir = async (id: number) => {
    if (!window.confirm('Tem certeza que deseja remover esta questão?')) return;
    try {
      const resposta = await fetch(`http://localhost:3333/api/questoes/${id}`, { method: 'DELETE' });
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
    setOrigemBase('');
    setOrigemCurso(CURSOS_DISPONIVEIS[0]);
    setTipoQuestao('Implementação');
    setTabelaEnunciado('');
  };

  const questoesFiltradas = questoes.filter((q) => {
    const termo = termoPesquisa.toLowerCase();
    return (
      q.topico.toLowerCase().includes(termo) ||
      q.origem.toLowerCase().includes(termo) ||
      q.ano.toLowerCase().includes(termo) ||
      q.nivel_dificuldade.toLowerCase().includes(termo) ||
      (q.tipo_questao || '').toLowerCase().includes(termo) ||
      q.id.toString().includes(termo)
    );
  });

  const totalPaginas = Math.max(1, Math.ceil(questoesFiltradas.length / ITENS_POR_PAGINA));
  
  if (paginaAtual > totalPaginas) {
    setPaginaAtual(totalPaginas);
  }

  const indexInicial = (paginaAtual - 1) * ITENS_POR_PAGINA;
  const questoesPaginadas = questoesFiltradas.slice(indexInicial, indexInicial + ITENS_POR_PAGINA);

  return (
    <>
      <style>{`
        body, html { margin: 0; padding: 0; width: 100%; background-color: #121418; font-family: system-ui, -apple-system, sans-serif; }
        * { box-sizing: border-box; font-family: inherit; }
        .btn-primario { background-color: #36a860; color: #121418; border: none; padding: 12px 15px; border-radius: 6px; font-size: 15px; font-weight: bold; cursor: pointer; transition: opacity 0.2s; display: flex; align-items: center; justify-content: center; margin-top: 10px;}
        .btn-primario:hover { opacity: 0.8; }
        .btn-secundario { background-color: transparent; color: #a0aab5; border: 1px solid #2a2d35; padding: 12px 15px; border-radius: 6px; font-size: 15px; font-weight: bold; cursor: pointer; transition: background-color 0.2s; display: flex; align-items: center; justify-content: center; margin-top: 10px;}
        .btn-secundario:hover { background-color: #2a2d35; color: #fff; }
        .btn-link-editar { background: transparent; color: #36a860; border: none; padding: 0; font-size: 13px; font-weight: bold; cursor: pointer; transition: opacity 0.2s; }
        .btn-link-editar:hover { text-decoration: underline; opacity: 0.8; }
        .btn-link-excluir { background: transparent; color: #e74c3c; border: none; padding: 0; font-size: 13px; font-weight: bold; cursor: pointer; transition: opacity 0.2s; }
        .btn-link-excluir:hover { text-decoration: underline; opacity: 0.8; }
        
        .badge { font-size: 12px; font-weight: 600; display: inline-flex; align-items: center; gap: 8px; color: #e0e0e0; line-height: 1; }
        .badge::before { content: ''; display: block; width: 8px; height: 8px; border-radius: 50%; position: relative; top: -1px; }
        .badge-facil::before { background-color: #2ecc71; box-shadow: 0 0 8px rgba(46, 204, 113, 0.4); }
        .badge-media::before { background-color: #f39c12; box-shadow: 0 0 8px rgba(243, 156, 18, 0.4); }
        .badge-dificil::before { background-color: #ff331d; box-shadow: 0 0 8px rgba(231, 76, 60, 0.4); }
        .badge-muitodificil::before { background-color: #ff0707; box-shadow: 0 0 8px rgba(192, 57, 43, 0.4); }
        
        .form-container-fixo { background-color: #1a1d24; padding: 25px; border-radius: 12px; flex: 1 1 340px; max-width: 480px; width: 100%; box-shadow: 0 10px 30px rgba(0,0,0,0.5); position: relative; }
        
        .secao-form { background-color: #121418; border: 1px solid #2a2d35; padding: 18px; border-radius: 8px; display: flex; flex-direction: column; gap: 12px; margin-bottom: 15px;}
        .secao-titulo { color: #fff; font-size: 14px; font-weight: bold; margin: 0 0 12px 0; padding-bottom: 8px; border-bottom: 1px solid #2a2d35; display: flex; align-items: center; gap: 8px; }
        .form-label { display: block; margin-bottom: 5px; color: #a0aab5; font-size: 13px; }
        .form-input { width: 100%; padding: 10px 12px; background-color: #1a1d24; border: 1px solid #3a3d45; color: #fff; border-radius: 6px; box-sizing: border-box; font-size: 13px; transition: border-color 0.2s; }
        .form-input:focus { border-color: #36a860; outline: none; }
        .form-input::placeholder { color: #6a737d; }

        .btn-paginacao { background-color: #2a2d35; color: #fff; border: none; width: 32px; height: 32px; border-radius: 6px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: background-color 0.2s; font-weight: bold; }
        .btn-paginacao:disabled { opacity: 0.4; cursor: not-allowed; }
        .btn-paginacao:not(:disabled):hover { background-color: #36a860; color: #121418; }
        
        .tabela-container-principal {
          display: flex;
          flex-direction: column;
          background-color: #1a1d24;
          padding: 25px;
          border-radius: 12px;
          flex: 2 1 450px;
          width: 100%;
          max-width: 100%;
          box-shadow: 0 10px 30px rgba(0,0,0,0.5);
        }

        .input-pesquisa-container { position: relative; width: 280px; max-width: 100%; }
        .input-pesquisa-container svg { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: #6a737d; }

        @media (max-width: 960px) {
          .header-admin { flex-direction: row !important; flex-wrap: wrap; padding: 15px 20px !important; }
          .header-admin > div:nth-child(1) { flex: unset !important; width: 50%; justify-content: flex-start !important; }
          .header-admin > div:nth-child(3) { flex: unset !important; width: 50%; justify-content: flex-end !important; }
          .header-admin > div:nth-child(2) { flex: unset !important; width: 100%; justify-content: center !important; margin-top: 15px; order: 3; text-align: center; }
          .container-principal { padding: 20px 15px !important; }
        }
        @media (max-width: 768px) {
          .container-principal { flex-direction: column !important; align-items: stretch !important; gap: 20px !important;}
          .tabela-container-principal { max-width: 100% !important; width: 100% !important; padding: 20px 15px !important; height: auto !important; }
          .cabecalho-tabela { flex-direction: column; align-items: flex-start !important; gap: 15px; }
          .input-pesquisa-container { width: 100%; }
        }
      `}</style>

      <div style={{ backgroundColor: '#121418', minHeight: '100vh', color: '#e0e0e0', display: 'flex', flexDirection: 'column' }}>
        <header className="header-admin" style={{ backgroundColor: '#1a1d24', padding: '15px 5vw', display: 'flex', alignItems: 'center', borderBottom: '1px solid #2a2d35' }}>
          <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-start' }}>
            <svg viewBox="0 0 2300 470" height="40" style={{ flexShrink: 0, maxWidth: '100%' }}>
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
              <text x="390" y="340" fontFamily="Arial, sans-serif" fontWeight="bold" fontSize="140" fill="#ffffff" letterSpacing="2">INSTITUTO FEDERAL</text>
              <text x="390" y="460" fontFamily="Arial, sans-serif" fontWeight="normal" fontSize="105" fill="#ffffff">Pernambuco</text>
            </svg>
          </div>
          <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
            <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#fff', textAlign: 'center' }}>Painel Administrativo</span>
          </div>
          <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
            <button onClick={onVoltar} style={{ backgroundColor: 'transparent', color: '#a0aab5', border: '1px solid #2a2d35', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }}>
              Voltar
            </button>
            <div 
              onClick={() => setModalAjudaAberto(true)}
              style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#2a2d35', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'bold', cursor: 'pointer', flexShrink: 0, transition: '0.2s', marginLeft: '15px' }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#36a860'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#2a2d35'}
            >
              ?
            </div>
          </div>
        </header>

        <div className="container-principal" style={{ flex: 1, padding: '25px 5vw', display: 'flex', gap: '30px', alignItems: 'stretch', justifyContent: 'center', flexWrap: 'wrap' }}>
          
          <div className="form-container-fixo">
            <h2 style={{ color: '#fff', marginBottom: '20px', fontSize: '22px', marginTop: 0 }}>
              {editandoId ? 'Editar Questão' : 'Cadastrar Nova Questão'}
            </h2>
            <form onSubmit={handleSalvar} style={{ display: 'flex', flexDirection: 'column', height: 'calc(100% - 45px)' }}>
              <div className="secao-form">
                <h3 className="secao-titulo">Classificação</h3>
                <div>
                  <label className="form-label">Tópico da Questão:</label>
                  <select value={topico} onChange={(e) => setTopico(e.target.value)} required className="form-input">
                    <option value="" disabled>Selecione um tópico</option>
                    {TOPICOS_DISPONIVEIS.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div style={{ display: 'flex', gap: '15px' }}>
                  <div style={{ flex: 1 }}>
                    <label className="form-label">Tipo da Questão:</label>
                    <select value={tipoQuestao} onChange={(e) => setTipoQuestao(e.target.value)} className="form-input">
                      <option value="Implementação">Implementação</option>
                      <option value="Execução de Código">Execução de Código</option>
                      <option value="Correção">Correção</option>
                    </select>
                  </div>
                  <div style={{ flex: 1 }}>
                    <label className="form-label">Dificuldade:</label>
                    <select value={dificuldade} onChange={(e) => setDificuldade(e.target.value)} className="form-input">
                      <option value="Fácil">Fácil</option>
                      <option value="Média">Média</option>
                      <option value="Difícil">Difícil</option>
                      <option value="Muito Difícil">Muito Difícil</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="secao-form">
                <h3 className="secao-titulo">Origem</h3>
                <div>
                  <label className="form-label">Fonte da Questão:</label>
                  <select value={origemBase} onChange={(e) => setOrigemBase(e.target.value)} required className="form-input">
                    <option value="" disabled>Selecione uma fonte</option>
                    {ORIGENS_BASE.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
                <div style={{ display: 'flex', gap: '15px' }}>
                  <div style={{ flex: 1 }}>
                    <label className="form-label">Curso:</label>
                    <select value={origemCurso} onChange={(e) => setOrigemCurso(e.target.value)} className="form-input">
                      {CURSOS_DISPONIVEIS.map(c => <option key={c} value={c}>Curso {c}</option>)}
                    </select>
                  </div>
                  <div style={{ flex: 1 }}>
                    <label className="form-label">Período (Ano):</label>
                    <input type="text" value={semestre} onChange={(e) => setSemestre(e.target.value)} placeholder="Ex: 2025.1" required className="form-input" />
                  </div>
                </div>
              </div>

              <div className="secao-form" style={{ flex: 1 }}>
                <h3 className="secao-titulo">Conteúdo</h3>
                <div>
                  <label className="form-label">Enunciado (Use Enter p/ quebrar linha):</label>
                  <textarea value={enunciado} onChange={(e) => setEnunciado(e.target.value)} rows={4} required className="form-input" style={{ resize: 'vertical' }} />
                </div>
                <div>
                  <label className="form-label">Tabela (Formato Matriz JSON - Opcional):</label>
                  <textarea value={tabelaEnunciado} onChange={(e) => setTabelaEnunciado(e.target.value)} rows={2} placeholder='Ex: [["A", "B"], ["1", "2"]]' className="form-input" style={{ fontFamily: 'monospace', resize: 'vertical' }} />
                </div>
                <div>
                  <label className="form-label">Código TypeScript (Opcional):</label>
                  <textarea value={codigo} onChange={(e) => setCodigo(e.target.value)} rows={3} placeholder='let x = 10;' className="form-input" style={{ fontFamily: 'monospace', color: '#36a860', resize: 'vertical' }} />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: 'auto' }}>
                <button type="submit" className="btn-primario" style={{ flex: editandoId ? 1 : 2 }}>
                  {editandoId ? 'Atualizar Questão' : 'Salvar Nova Questão'}
                </button>
                {editandoId && (
                  <button type="button" onClick={limparFormulario} className="btn-secundario" style={{ flex: 1 }}>
                    Cancelar
                  </button>
                )}
              </div>
            </form>
          </div>

          <div className="tabela-container-principal">
            <div className="cabecalho-tabela" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ color: '#fff', margin: 0, fontSize: '20px' }}>Banco de Questões</h2>
              
              <div className="input-pesquisa-container">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
                <input
                  type="text"
                  placeholder="Pesquisar por tópico, ano, tipo..."
                  value={termoPesquisa}
                  onChange={(e) => setTermoPesquisa(e.target.value)}
                  className="form-input"
                  style={{ paddingLeft: '36px', borderRadius: '20px' }}
                />
              </div>
            </div>

            <div style={{ flex: 1, overflowX: 'auto', paddingRight: '5px', display: 'flex', flexDirection: 'column' }}>
              <table style={{ width: '100%', height: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '650px' }}>
                <thead style={{ position: 'sticky', top: 0, backgroundColor: '#1a1d24', zIndex: 1, height: '40px' }}>
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
                  {questoesFiltradas.length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{ padding: '40px', textAlign: 'center', color: '#6a737d' }}>
                        {termoPesquisa ? 'Nenhuma questão encontrada com esses filtros.' : 'Nenhuma questão cadastrada ainda.'}
                      </td>
                    </tr>
                  ) : (
                    questoesPaginadas.map((q, index) => (
                      <tr key={q.id} style={{ borderBottom: index === questoesPaginadas.length - 1 ? 'none' : '1px solid #2a2d35', fontSize: '13px' }}>
                        <td style={{ padding: '12px 8px', color: '#a0aab5' }}>#{q.id}</td>
                        <td style={{ padding: '12px 8px', fontWeight: 'bold', color: '#e0e0e0' }}>{q.topico}</td>
                        <td style={{ padding: '12px 8px', color: '#a0aab5' }}>{q.tipo_questao || 'N/A'}</td>
                        <td style={{ padding: '12px 8px', color: '#a0aab5' }}>{q.origem} ({q.ano})</td>
                        <td style={{ padding: '12px 8px' }}>
                          <span className={
                            q.nivel_dificuldade === 'Fácil' ? 'badge badge-facil' :
                            q.nivel_dificuldade === 'Média' ? 'badge badge-media' : 
                            q.nivel_dificuldade === 'Difícil' ? 'badge badge-dificil' : 'badge badge-muitodificil'
                          }>
                            {q.nivel_dificuldade}
                          </span>
                        </td>
                        <td style={{ padding: '12px 8px' }}>
                          <div style={{ display: 'flex', gap: '15px' }}>
                            <button onClick={() => handleEditar(q)} className="btn-link-editar">Editar</button>
                            <button onClick={() => handleExcluir(q.id)} className="btn-link-excluir">Excluir</button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '15px', borderTop: '1px solid #2a2d35', marginTop: 'auto' }}>
              <div style={{ color: '#a0aab5', fontSize: '13px' }}>
                Mostrando <strong style={{ color: '#fff' }}>{questoesFiltradas.length > 0 ? indexInicial + 1 : 0}</strong> a <strong style={{ color: '#fff' }}>{Math.min(indexInicial + ITENS_POR_PAGINA, questoesFiltradas.length)}</strong> de <strong style={{ color: '#fff' }}>{questoesFiltradas.length}</strong>
              </div>
              
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <button 
                  onClick={() => setPaginaAtual(p => Math.max(1, p - 1))} 
                  disabled={paginaAtual === 1} 
                  className="btn-paginacao"
                  title="Página Anterior"
                >
                  &lt;
                </button>
                <span style={{ color: '#a0aab5', fontSize: '13px', margin: '0 5px' }}>
                  Página <strong style={{ color: '#fff' }}>{paginaAtual}</strong> de {totalPaginas}
                </span>
                <button 
                  onClick={() => setPaginaAtual(p => Math.min(totalPaginas, p + 1))} 
                  disabled={paginaAtual === totalPaginas} 
                  className="btn-paginacao"
                  title="Próxima Página"
                >
                  &gt;
                </button>
              </div>
            </div>
            
          </div>
        </div>
      </div>

      <ModalAjudaAdmin isOpen={modalAjudaAberto} onClose={() => setModalAjudaAberto(false)} />
    </>
  );
}