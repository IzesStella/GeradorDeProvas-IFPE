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
}

const TOPICOS_DISPONIVEIS = [
  'Operadores Lógicos',
  'Execução Condicional',
  'Laços',
  'Subprogramas',
  'Tipos e Variáveis',
  'Arrays'
];

export function TelaAdmin({ onVoltar }: TelaAdminProps) {
  const [topico, setTopico] = useState('');
  const [enunciado, setEnunciado] = useState('');
  const [codigo, setCodigo] = useState('');
  const [dificuldade, setDificuldade] = useState('Fácil');
  const [semestre, setSemestre] = useState('');
  const [origem, setOrigem] = useState('');
  
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

    const url = editandoId 
      ? `http://localhost:3333/api/questoes/${editandoId}` 
      : 'http://localhost:3333/api/questoes';
      
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
          easter_egg_conteudo: null,
          origem: origem,
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
    setOrigem(questao.origem || '');
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
    setOrigem('');
  };

  return (
    <>
      <style>{`
        body, html {
          margin: 0;
          padding: 0;
          width: 100%;
          background-color: #121418;
          font-family: system-ui, -apple-system, sans-serif;
        }
        * {
          box-sizing: border-box;
          font-family: inherit;
        }
        
        .btn-primario {
          background-color: #36a860;
          color: #121418;
          border: none;
          padding: 12px;
          border-radius: 6px;
          font-size: 15px;
          font-weight: bold;
          cursor: pointer;
          transition: opacity 0.2s;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
        .btn-primario:hover { opacity: 0.8; }

        .btn-secundario {
          background-color: transparent;
          color: #a0aab5;
          border: 1px solid #2a2d35;
          padding: 8px 16px;
          border-radius: 6px;
          font-size: 14px;
          font-weight: bold;
          cursor: pointer;
          transition: background-color 0.2s;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
        .btn-secundario:hover { background-color: #2a2d35; color: #fff; }

        .btn-link-editar {
          background: transparent;
          color: #36a860; 
          border: none;
          padding: 0;
          font-size: 14px;
          font-weight: bold;
          cursor: pointer;
          transition: opacity 0.2s;
        }
        .btn-link-editar:hover { text-decoration: underline; opacity: 0.8; }

        .btn-link-excluir {
          background: transparent;
          color: #e74c3c; 
          border: none;
          padding: 0;
          font-size: 14px;
          font-weight: bold;
          cursor: pointer;
          transition: opacity 0.2s;
        }
        .btn-link-excluir:hover { text-decoration: underline; opacity: 0.8; }

        .badge {
          font-size: 13px;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: #e0e0e0;
          line-height: 1; 
        }
        .badge::before {
          content: '';
          display: block;
          width: 8px; 
          height: 8px;
          border-radius: 50%;
          position: relative;
          top: -1px;
        }
        
        .badge-facil::before { background-color: #2ecc71; box-shadow: 0 0 8px rgba(46, 204, 113, 0.4); }
        .badge-media::before { background-color: #f39c12; box-shadow: 0 0 8px rgba(243, 156, 18, 0.4); }
        .badge-dificil::before { background-color: #e74c3c; box-shadow: 0 0 8px rgba(231, 76, 60, 0.4); }

        .form-container-fixo {
          background-color: #1a1d24;
          padding: 30px;
          border-radius: 12px;
          flex: 1 1 350px;
          max-width: 500px;
          width: 100%;
          box-shadow: 0 10px 30px rgba(0,0,0,0.5);
          position: sticky;
          top: 30px; 
          align-self: flex-start;
        }

        @media (max-width: 768px) {
          .header-admin { flex-direction: column; gap: 20px; }
          .header-admin > div { justify-content: center !important; width: 100%; }
          .container-principal { padding: 20px 5vw !important; flex-direction: column; }
          .form-container-fixo { position: static; }
        }
      `}</style>

      <div style={{ backgroundColor: '#121418', minHeight: '100vh', color: '#e0e0e0', display: 'flex', flexDirection: 'column' }}>
        
        {/* HEADER */}
        <header className="header-admin" style={{ backgroundColor: '#1a1d24', padding: '15px 5vw', display: 'flex', alignItems: 'center', borderBottom: '1px solid #2a2d35' }}>
          
          <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-start' }}>
            <svg viewBox="0 0 2300 470" height="48" style={{ flexShrink: 0 }}>
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

          <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
            <button 
              onClick={onVoltar} 
              style={{ 
                backgroundColor: 'transparent', 
                color: '#a0aab5', 
                border: '1px solid #2a2d35', 
                padding: '8px 15px', 
                borderRadius: '6px', 
                cursor: 'pointer', 
                fontSize: '14px', 
                fontWeight: 'bold' 
              }}
            >
              Voltar
            </button>
          </div>
        </header>

        {/* CONTAINER PRINCIPAL */}
        <div className="container-principal" style={{ flex: 1, padding: '40px 5vw', display: 'flex', gap: '30px', alignItems: 'flex-start', justifyContent: 'center', flexWrap: 'wrap' }}>
          
          {/* FORMULÁRIO (FIXO) */}
          <div className="form-container-fixo">
            <h2 style={{ color: '#fff', marginBottom: '25px', fontSize: '22px', marginTop: 0 }}>
              {editandoId ? 'Editar Questão' : 'Cadastrar Nova Questão'}
            </h2>
            
            <form onSubmit={handleSalvar} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              
              <div>
                <label style={{ display: 'block', marginBottom: '6px', color: '#a0aab5', fontSize: '14px' }}>Tópico da Questão:</label>
                <select value={topico} onChange={(e) => setTopico(e.target.value)} required style={{ width: '100%', padding: '10px', backgroundColor: '#121418', border: '1px solid #2a2d35', color: '#fff', borderRadius: '8px', fontFamily: 'inherit', boxSizing: 'border-box' }}>
                  <option value="" disabled>Selecione um tópico</option>
                  {TOPICOS_DISPONIVEIS.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '6px', color: '#a0aab5', fontSize: '14px' }}>Nível de Dificuldade:</label>
                <select value={dificuldade} onChange={(e) => setDificuldade(e.target.value)} style={{ width: '100%', padding: '10px', backgroundColor: '#121418', border: '1px solid #2a2d35', color: '#fff', borderRadius: '8px', fontFamily: 'inherit', boxSizing: 'border-box' }}>
                  <option value="Fácil">Fácil</option>
                  <option value="Média">Média</option>
                  <option value="Difícil">Difícil</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '6px', color: '#a0aab5', fontSize: '14px' }}>Origem / Fonte:</label>
                <input type="text" value={origem} onChange={(e) => setOrigem(e.target.value)} placeholder="Ex: Primeira Avaliação Individual - IPI" required style={{ width: '100%', padding: '10px', backgroundColor: '#121418', border: '1px solid #2a2d35', color: '#fff', borderRadius: '8px', fontFamily: 'inherit', boxSizing: 'border-box' }} />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '6px', color: '#a0aab5', fontSize: '14px' }}>Semestre / Ano:</label>
                <input type="text" value={semestre} onChange={(e) => setSemestre(e.target.value)} placeholder="Ex: 2025.1" required style={{ width: '100%', padding: '10px', backgroundColor: '#121418', border: '1px solid #2a2d35', color: '#fff', borderRadius: '8px', fontFamily: 'inherit', boxSizing: 'border-box' }} />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '6px', color: '#a0aab5', fontSize: '14px' }}>Enunciado:</label>
                <textarea value={enunciado} onChange={(e) => setEnunciado(e.target.value)} rows={4} required style={{ width: '100%', padding: '10px', backgroundColor: '#121418', border: '1px solid #2a2d35', color: '#fff', borderRadius: '8px', fontFamily: 'inherit', resize: 'vertical', boxSizing: 'border-box' }} />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '6px', color: '#a0aab5', fontSize: '14px' }}>Código TypeScript (Opcional):</label>
                <textarea value={codigo} onChange={(e) => setCodigo(e.target.value)} rows={3} style={{ width: '100%', padding: '10px', backgroundColor: '#121418', border: '1px solid #2a2d35', color: '#36a860', borderRadius: '8px', fontFamily: 'monospace', resize: 'vertical', boxSizing: 'border-box' }} />
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
          <div style={{ backgroundColor: '#1a1d24', padding: '30px', borderRadius: '12px', flex: '2 1 450px', width: '100%', maxWidth: '100%', boxShadow: '0 10px 30px rgba(0,0,0,0.5)', overflowX: 'auto' }}>
            <h2 style={{ color: '#fff', marginBottom: '25px', fontSize: '22px', marginTop: 0 }}>Banco de Questões</h2>
            
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '500px' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #2a2d35', color: '#a0aab5', fontSize: '14px' }}>
                    <th style={{ padding: '10px 8px' }}>ID</th>
                    <th style={{ padding: '10px 8px' }}>Tópico</th>
                    <th style={{ padding: '10px 8px' }}>Origem/Ano</th>
                    <th style={{ padding: '10px 8px' }}>Dificuldade</th>
                    <th style={{ padding: '10px 8px' }}>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {questoes.length === 0 ? (
                    <tr>
                      <td colSpan={5} style={{ padding: '20px', textAlign: 'center', color: '#a0aab5' }}>Nenhuma questão encontrada.</td>
                    </tr>
                  ) : (
                    questoes.map((q) => (
                      <tr key={q.id} style={{ borderBottom: '1px solid #2a2d35', fontSize: '14px' }}>
                        <td style={{ padding: '14px 8px', color: '#a0aab5' }}>#{q.id}</td>
                        <td style={{ padding: '14px 8px', fontWeight: 'bold', color: '#e0e0e0' }}>{q.topico}</td>
                        <td style={{ padding: '14px 8px', color: '#a0aab5' }}>{q.origem} - {q.ano}</td>
                        <td style={{ padding: '14px 8px' }}>
                          <span className={
                            q.nivel_dificuldade === 'Fácil' ? 'badge badge-facil' : 
                            q.nivel_dificuldade === 'Média' ? 'badge badge-media' : 
                            'badge badge-dificil'
                          }>
                            {q.nivel_dificuldade}
                          </span>
                        </td>
                        <td style={{ padding: '14px 8px' }}>
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