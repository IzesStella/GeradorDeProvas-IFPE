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

export function TelaAdmin({ onVoltar }: TelaAdminProps) {
  // Estados do Formulário
  const [topico, setTopico] = useState('');
  const [enunciado, setEnunciado] = useState('');
  const [codigo, setCodigo] = useState('');
  const [dificuldade, setDificuldade] = useState('Fácil');
  const [semestre, setSemestre] = useState(''); // O estado volta a ser semestre
  
  // Estados para a Tabela e Edição
  const [questoes, setQuestoes] = useState<Questao[]>([]);
  const [editandoId, setEditandoId] = useState<number | null>(null);

  // Busca as questões assim que a tela abre
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
          origem: 'Cadastro Manual - Painel',
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
    setSemestre(questao.ano); // Puxa o texto do banco de volta para o input
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
  };

  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', backgroundColor: '#121418', minHeight: '100vh', color: '#e0e0e0', display: 'flex', flexDirection: 'column' }}>
      
      {/* Cabeçalho*/}
      <header style={{ backgroundColor: '#1a1d24', padding: '20px 5vw', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #2a2d35', flexWrap: 'wrap', gap: '15px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{ width: '32px', height: '32px', backgroundColor: '#2ecc71', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#121418', fontWeight: 'bold' }}>IF</div>
          <span style={{ fontWeight: 'bold', fontSize: '16px', letterSpacing: '1px' }}>INSTITUTO FEDERAL<br/><span style={{fontSize: '11px', fontWeight: 'normal'}}>Pernambuco</span></span>
        </div>
        <div style={{ fontSize: '18px', fontWeight: 'bold', textAlign: 'center', flex: '1 1 200px' }}>Painel Administrativo</div>
        <button onClick={onVoltar} style={{ backgroundColor: 'transparent', color: '#f44336', border: '1px solid #f44336', padding: '8px 15px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', fontFamily: 'inherit' }}>
          Voltar
        </button>
      </header>

      {/* Container Principal*/}
      <div style={{ flex: 1, padding: '40px 5vw', display: 'flex', gap: '30px', alignItems: 'flex-start', justifyContent: 'center', flexWrap: 'wrap' }}>
        
        {/* Lado Esquerdo: Formulário */}
        <div style={{ backgroundColor: '#1a1d24', padding: '30px', borderRadius: '12px', flex: '1 1 350px', maxWidth: '500px', width: '100%', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
          <h2 style={{ color: '#fff', marginBottom: '25px', fontSize: '22px' }}>
            {editandoId ? 'Editar Questão' : 'Cadastrar Nova Questão'}
          </h2>
          
          <form onSubmit={handleSalvar} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', color: '#a0aab5', fontSize: '14px' }}>Tópico da Questão:</label>
              <input type="text" value={topico} onChange={(e) => setTopico(e.target.value)} required style={{ width: '100%', padding: '10px', backgroundColor: '#121418', border: '1px solid #2a2d35', color: '#fff', borderRadius: '8px', fontFamily: 'inherit', boxSizing: 'border-box' }} />
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
              <label style={{ display: 'block', marginBottom: '6px', color: '#a0aab5', fontSize: '14px' }}>Enunciado:</label>
              <textarea value={enunciado} onChange={(e) => setEnunciado(e.target.value)} rows={4} required style={{ width: '100%', padding: '10px', backgroundColor: '#121418', border: '1px solid #2a2d35', color: '#fff', borderRadius: '8px', fontFamily: 'inherit', resize: 'vertical', boxSizing: 'border-box' }} />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '6px', color: '#a0aab5', fontSize: '14px' }}>Código TypeScript (Opcional):</label>
              <textarea value={codigo} onChange={(e) => setCodigo(e.target.value)} rows={3} style={{ width: '100%', padding: '10px', backgroundColor: '#121418', border: '1px solid #2a2d35', color: '#2ecc71', borderRadius: '8px', fontFamily: 'monospace', resize: 'vertical', boxSizing: 'border-box' }} />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '6px', color: '#a0aab5', fontSize: '14px' }}>Semestre / Ano:</label>
              <input type="text" value={semestre} onChange={(e) => setSemestre(e.target.value)} placeholder="Ex: 2025.1" required style={{ width: '100%', padding: '10px', backgroundColor: '#121418', border: '1px solid #2a2d35', color: '#fff', borderRadius: '8px', fontFamily: 'inherit', boxSizing: 'border-box' }} />
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '5px' }}>
              <button type="submit" style={{ flex: 1, backgroundColor: '#2ecc71', color: '#121418', border: 'none', padding: '12px', borderRadius: '8px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', fontFamily: 'inherit' }}>
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

        {/* Lado Direito: Tabela de Questões */}
        <div style={{ backgroundColor: '#1a1d24', padding: '30px', borderRadius: '12px', flex: '2 1 450px', width: '100%', boxShadow: '0 10px 30px rgba(0,0,0,0.5)', overflowX: 'auto' }}>
          <h2 style={{ color: '#fff', marginBottom: '25px', fontSize: '22px' }}>Banco de Questões</h2>
          
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '400px' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #2a2d35', color: '#a0aab5', fontSize: '14px' }}>
                <th style={{ padding: '10px 8px' }}>ID</th>
                <th style={{ padding: '10px 8px' }}>Tópico</th>
                <th style={{ padding: '10px 8px' }}>Semestre</th>
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
                    <td style={{ padding: '12px 8px', color: '#a0aab5' }}>{q.ano}</td>
                    <td style={{ padding: '12px 8px' }}>
                      <span style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '11px', backgroundColor: q.nivel_dificuldade === 'Fácil' ? '#1b4332' : q.nivel_dificuldade === 'Média' ? '#7a4f01' : '#5c1a1b', color: '#fff' }}>
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
  );
}