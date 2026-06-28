interface ModalAjudaAdminProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ModalAjudaAdmin({ isOpen, onClose }: ModalAjudaAdminProps) {
  if (!isOpen) return null;

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.75)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <div style={{ backgroundColor: '#1a1d24', borderRadius: '12px', width: '100%', maxWidth: '850px', maxHeight: '90vh', overflowY: 'auto', border: '1px solid #2a2d35', boxShadow: '0 20px 50px rgba(0,0,0,0.5)', display: 'flex', flexDirection: 'column' }}>
        
        {/* HEADER DO MODAL */}
        <div style={{ padding: '20px 30px', borderBottom: '1px solid #2a2d35', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, backgroundColor: '#1a1d24', zIndex: 10 }}>
          <h2 style={{ margin: 0, color: '#fff', fontSize: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ backgroundColor: '#36a860', color: '#121418', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
            </div>
            Guia de Cadastro de Questões
          </h2>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#a0aab5', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', padding: '5px' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* CORPO DO MODAL */}
        <div style={{ padding: '30px', color: '#a0aab5', fontSize: '14px', lineHeight: '1.6' }}>
          
          {/* COMO CADASTRAR */}
          <h3 style={{ color: '#fff', borderBottom: '1px solid #2a2d35', paddingBottom: '8px', marginTop: 0, display: 'flex', alignItems: 'center', gap: '8px', fontSize: '16px' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#36a860" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
            Como Preencher o Formulário
          </h3>
          <ul style={{ paddingLeft: '20px', marginBottom: '25px' }}>
            <li style={{ marginBottom: '8px' }}>
              <strong style={{ color: '#e0e0e0' }}>Classificação:</strong> Defina o assunto da questão (Tópico). Defina se o aluno vai programar (Implementação), fazer teste de mesa (Execução) ou corrigir código (Correção). E o nível de dificuldade. 
            </li>
            <li style={{ marginBottom: '8px' }}>
              <strong style={{ color: '#e0e0e0' }}>Origem:</strong> Selecione a fonte original da questão (ex: Miniprova - Arrays) e o curso (IPI ou TSI) correspondente. O campo "Ano" ajuda a organizar a cronologia, mantendo a rastreabilidade entre o material original e o sistema.
            </li>
            <li style={{ marginBottom: '8px' }}>
              <strong style={{ color: '#e0e0e0' }}>Conteúdo:</strong> O enunciado deve conter a descrição clara da questão. Nunca use LaTeX (códigos com $) para contas matemáticas. Use formatação em texto puro (ex: x² + y² = z). A Tabela e o Código TypeScript são opcionais e só devem ser preenchidos se a questão exigir.
            </li>
          </ul>

          {/* TABELA DE DIFICULDADES */}
          <h3 style={{ color: '#fff', borderBottom: '1px solid #2a2d35', paddingBottom: '8px', marginTop: '30px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '16px' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f39c12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
            </svg>
            Critérios e Exemplos de Dificuldade
          </h3>
          
          <div style={{ overflowX: 'auto', border: '1px solid #2a2d35', borderRadius: '8px', marginTop: '15px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
              <thead>
                <tr style={{ backgroundColor: '#2a2d35', color: '#fff' }}>
                  <th style={{ padding: '12px', borderBottom: '1px solid #3a3d45', width: '15%' }}>Nível</th>
                  <th style={{ padding: '12px', borderBottom: '1px solid #3a3d45', width: '40%' }}>Critério Pedagógico</th>
                  <th style={{ padding: '12px', borderBottom: '1px solid #3a3d45', width: '45%' }}>Exemplo Real no Banco</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid #2a2d35' }}>
                  <td style={{ padding: '12px', color: '#2ecc71', fontWeight: 'bold' }}>Fácil</td>
                  <td style={{ padding: '12px', color: '#a0aab5' }}>Implementação direta, aplicação básica de sintaxe ou lógica simples, sem cruzamento complexo de estruturas.</td>
                  <td style={{ padding: '12px', color: '#e0e0e0', fontStyle: 'italic' }}>
                    "Implemente um programa capaz de computar as raízes de uma equação do segundo grau no formato: ax² + bx + c = 0."
                  </td>
                </tr>
                <tr style={{ borderBottom: '1px solid #2a2d35' }}>
                  <td style={{ padding: '12px', color: '#f39c12', fontWeight: 'bold' }}>Média</td>
                  <td style={{ padding: '12px', color: '#a0aab5' }}>Questões de execução (teste de mesa) ou mistura de conceitos básicos.</td>
                  <td style={{ padding: '12px', color: '#e0e0e0', fontStyle: 'italic' }}>
                    "Qual a saída no console do programa abaixo? (Apresentando variáveis a, b, c, d sendo reatribuídas e operadas com módulo % e lógicas)."
                  </td>
                </tr>
                <tr style={{ borderBottom: '1px solid #2a2d35' }}>
                  <td style={{ padding: '12px', color: '#e74c3c', fontWeight: 'bold' }}>Difícil</td>
                  <td style={{ padding: '12px', color: '#a0aab5' }}>Problemas que exigem abstração, manipulação de vetores/arrays ou lógica mais complexa.</td>
                  <td style={{ padding: '12px', color: '#e0e0e0', fontStyle: 'italic' }}>
                    "Implemente um programa que receba as notas de 10 alunos, armazene num vetor e imprima a média daqueles que ficaram acima de 7."
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: '12px', color: '#c0392b', fontWeight: 'bold' }}>Muito Difícil</td>
                  <td style={{ padding: '12px', color: '#a0aab5' }}>Questões integrando subprogramas, recursão, matrizes e regras de negócio específicas com múltiplas amarrações.</td>
                  <td style={{ padding: '12px', color: '#e0e0e0', fontStyle: 'italic' }}>
                    "Sem utilizar laços, implemente um subprograma capaz de imprimir todos os elementos de uma diagonal de um array de 3 dimensões."
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

        </div>

        {/* FOOTER DO MODAL */}
        <div style={{ padding: '20px 30px', borderTop: '1px solid #2a2d35', display: 'flex', justifyContent: 'flex-end' }}>
          <button onClick={onClose} style={{ backgroundColor: '#36a860', color: '#121418', border: 'none', padding: '10px 24px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px', transition: 'background-color 0.2s' }}>
            ENTENDI, FECHAR
          </button>
        </div>

      </div>
    </div>
  );
}