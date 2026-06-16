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
  // Estados do Formulário
  const [topico, setTopico] = useState(''); // Começa vazio para forçar a seleção
  const [enunciado, setEnunciado] = useState('');
  const [codigo, setCodigo] = useState('');
  const [dificuldade, setDificuldade] = useState('Fácil');
  const [semestre, setSemestre] = useState('');
  const [origem, setOrigem] = useState('');
  
  // Estados para a Tabela e Edição
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
          overflow-x: hidden;
          background-color: #121418;
        }
        * {
          box-sizing: border-box;
        }
        @media (max-width: 768px) {
          .header-admin {
            flex-direction: column;
            gap: 20px;
          }
          .header-admin > div {
            justify-content: center !important;
            width: 100%;
          }
          .container-principal {
            padding: 20px 5vw !important;
            flex-direction: column;
          }
        }
      `}</style>

      <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', backgroundColor: '#121418', minHeight: '100vh', color: '#e0e0e0', display: 'flex', flexDirection: 'column' }}>
        
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
            <button onClick={onVoltar} style={{ backgroundColor: 'transparent', color: '#f44336', border: '1px solid #f44336', padding: '8px 15px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', fontFamily: 'inherit', transition: 'background-color 0.2s' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(244, 67, 54, 0.1)'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
              Voltar
            </button>
          </div>
        </header>

        {/* CONTAINER PRINCIPAL */}
        <div className="container-principal" style={{ flex: 1, padding: '40px 5vw', display: 'flex', gap: '30px', alignItems: 'flex-start', justifyContent: 'center', flexWrap: 'wrap' }}>
          
          {/* FORMULÁRIO */}
          <div style={{ backgroundColor: '#1a1d24', padding: '30px', borderRadius: '12px', flex: '1 1 350px', maxWidth: '500px', width: '100%', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
            <h2 style={{ color: '#fff', marginBottom: '25px', fontSize: '22px' }}>
              {editandoId ? 'Editar Questão' : 'Cadastrar Nova Questão'}
            </h2>
            
            <form onSubmit={handleSalvar} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              
              {/* CAMPO DE TÓPICO ATUALIZADO PARA DROPDOWN */}
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
                <textarea value={codigo} onChange={(e) => setCodigo(e.target.value)} rows={3} style={{ width: '100%', padding: '10px', backgroundColor: '#121418', border: '1px solid #2a2d35', color: '#2ecc71', borderRadius: '8px', fontFamily: 'monospace', resize: 'vertical', boxSizing: 'border-box' }} />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '5px' }}>
                <button type="submit" style={{ flex: 1, backgroundColor: '#2ecc71', color: '#121418', border: 'none', padding: '12px', borderRadius: '8px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', fontFamily: 'inherit', transition: 'opacity 0.2s' }} onMouseOver={(e) => e.currentTarget.style.opacity = '0.8'} onMouseOut={(e) => e.currentTarget.style.opacity = '1'}>
                  {editandoId ? 'Atualizar' : 'Salvar'}
                </button>
                {editandoId && (
                  <button type="button" onClick={limparFormulario} style={{ flex: 1, backgroundColor: 'transparent', color: '#a0aab5', border: '1px solid #a0aab5', padding: '12px', borderRadius: '8px', fontSize: '15px', cursor: 'pointer', fontFamily: 'inherit' }}>
                    Cancelar
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* TABELA DE QUESTÕES */}
          <div style={{ backgroundColor: '#1a1d24', padding: '30px', borderRadius: '12px', flex: '2 1 450px', width: '100%', maxWidth: '100%', boxShadow: '0 10px 30px rgba(0,0,0,0.5)', overflowX: 'auto' }}>
            <h2 style={{ color: '#fff', marginBottom: '25px', fontSize: '22px' }}>Banco de Questões</h2>
            
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
                        <td style={{ padding: '12px 8px', color: '#a0aab5' }}>#{q.id}</td>
                        <td style={{ padding: '12px 8px', fontWeight: 'bold', color: '#e0e0e0' }}>{q.topico}</td>
                        <td style={{ padding: '12px 8px', color: '#a0aab5' }}>{q.origem} - {q.ano}</td>
                        <td style={{ padding: '12px 8px' }}>
                          <span style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '11px', backgroundColor: q.nivel_dificuldade === 'Fácil' ? '#1b4332' : q.nivel_dificuldade === 'Média' ? '#7a4f01' : '#5c1a1b', color: '#fff', whiteSpace: 'nowrap' }}>
                            {q.nivel_dificuldade}
                          </span>
                        </td>
                        <td style={{ padding: '12px 8px', display: 'flex', gap: '10px' }}>
                          <button onClick={() => handleEditar(q)} style={{ backgroundColor: 'transparent', color: '#3498db', border: 'none', cursor: 'pointer', fontWeight: 'bold', padding: '0' }}>Editar</button>
                          <button onClick={() => handleExcluir(q.id)} style={{ backgroundColor: 'transparent', color: '#e74c3c', border: 'none', cursor: 'pointer', fontWeight: 'bold', padding: '0' }}>Excluir</button>
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