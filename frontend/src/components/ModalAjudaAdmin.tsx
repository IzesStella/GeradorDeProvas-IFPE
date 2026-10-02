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
          <h2 style={{ margin: 0, color: '#fff', fontSize: '18px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ backgroundColor: '#36a860', color: '#121418', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
            </div>
            Guia de Cadastro de Questões
          </h2>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#a0aab5', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', padding: '5px', transition: 'color 0.2s' }} onMouseOver={(e) => e.currentTarget.style.color = '#fff'} onMouseOut={(e) => e.currentTarget.style.color = '#a0aab5'}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* CORPO DO MODAL */}
        <div style={{ padding: '30px', color: '#a0aab5', fontSize: '14px', lineHeight: '1.6' }}>
          
          {/* COMO CADASTRAR */}
          <h3 style={{ color: '#fff', borderBottom: '1px solid #2a2d35', paddingBottom: '10px', margin: '0 0 15px 0', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '16px', fontWeight: 600 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#36a860" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="3" y1="9" x2="21" y2="9"></line>
              <line x1="9" y1="21" x2="9" y2="9"></line>
            </svg>
            Como Preencher o Formulário
          </h3>
          <ul style={{ listStyleType: 'none', paddingLeft: 0, margin: '0 0 35px 0' }}>
            <li style={{ marginBottom: '12px', paddingLeft: '16px', position: 'relative' }}>
              <span style={{ position: 'absolute', left: 0, top: '8px', width: '6px', height: '6px', backgroundColor: '#36a860', borderRadius: '50%' }}></span>
              <span style={{ color: '#e0e0e0', fontWeight: 600 }}>Classificação:</span> Defina o assunto da questão (Tópico). Defina se o aluno vai programar (Implementação), fazer teste de mesa (Execução) ou corrigir código (Correção). E o nível de dificuldade. 
            </li>
            <li style={{ marginBottom: '12px', paddingLeft: '16px', position: 'relative' }}>
              <span style={{ position: 'absolute', left: 0, top: '8px', width: '6px', height: '6px', backgroundColor: '#36a860', borderRadius: '50%' }}></span>
              <span style={{ color: '#e0e0e0', fontWeight: 600 }}>Origem:</span> Selecione a fonte original da questão (ex: Miniprova - Arrays) e o curso (IPI ou TSI) correspondente. O campo "Ano" ajuda a organizar a cronologia, mantendo a rastreabilidade entre o material original e o sistema.
            </li>
            <li style={{ paddingLeft: '16px', position: 'relative' }}>
              <span style={{ position: 'absolute', left: 0, top: '8px', width: '6px', height: '6px', backgroundColor: '#36a860', borderRadius: '50%' }}></span>
              <span style={{ color: '#e0e0e0', fontWeight: 600 }}>Conteúdo:</span> O enunciado deve conter a descrição clara da questão. Nunca use LaTeX (códigos com $) para contas matemáticas. Use formatação em texto puro (ex: x² + y² = z). A Tabela e o Código TypeScript são opcionais e só devem ser preenchidos se a questão exigir.
            </li>
          </ul>

          {/* TABELA DE DIFICULDADES */}
          <h3 style={{ color: '#fff', borderBottom: '1px solid #2a2d35', paddingBottom: '10px', margin: '0 0 15px 0', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '16px', fontWeight: 600 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#36a860" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="20" x2="12" y2="10"></line>
              <line x1="18" y1="20" x2="18" y2="4"></line>
              <line x1="6" y1="20" x2="6" y2="16"></line>
            </svg>
            Critérios e Exemplos de Dificuldade
          </h3>
          
          <div style={{ overflowX: 'auto', border: '1px solid #2a2d35', borderRadius: '8px', marginTop: '15px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
              <thead>
                <tr style={{ backgroundColor: '#2a2d35', color: '#fff' }}>
                  <th style={{ padding: '12px', borderBottom: '1px solid #3a3d45', width: '15%', fontWeight: 600 }}>Nível</th>
                  <th style={{ padding: '12px', borderBottom: '1px solid #3a3d45', width: '40%', fontWeight: 600 }}>Critério</th>
                  <th style={{ padding: '12px', borderBottom: '1px solid #3a3d45', width: '45%', fontWeight: 'normal' }}>Exemplo Real no Banco</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid #2a2d35' }}>
                  <td style={{ padding: '12px', color: '#2ecc71', fontWeight: 600 }}>Fácil</td>
                  <td style={{ padding: '12px', color: '#a0aab5', lineHeight: '1.5' }}>Geralmente encontradas em Miniprovas, são focadas na aplicação direta da sintaxe e dos fundamentos do tópico avaliado. O objetivo central é testar a compreensão inicial e a estruturação básica do algoritmo.</td>
                  <td style={{ padding: '12px', color: '#e0e0e0', lineHeight: '1.5' }}>
                    <span style={{ fontStyle: 'italic' }}>"Implemente um programa capaz de imprimir o valor de um balde de pipoca em um Cinema de acordo com seu tamanho. Os valores são os seguintes: balde grande - R$25,00, balde médio - R$18,00 e balde pequeno - R$12,00."</span>
                    <div style={{ fontSize: '13px', color: '#7a8490', marginTop: '8px' }}>Origem: Miniprova - Execução Condicional - TSI / Ano: 2024.01</div>
                  </td>
                </tr>
                <tr style={{ borderBottom: '1px solid #2a2d35' }}>
                  <td style={{ padding: '12px', color: '#f39c12', fontWeight: 600 }}>Média</td>
                  <td style={{ padding: '12px', color: '#a0aab5', lineHeight: '1.5' }}>Exigem a combinação simultânea de conceitos lógicos. Diferente do nível fácil, o foco não é testar a sintaxe, mas sim a capacidade do aluno de estruturar e acompanhar o fluxo do código.</td>
                  <td style={{ padding: '12px', color: '#e0e0e0', lineHeight: '1.5' }}>
                    <span style={{ fontStyle: 'italic' }}>"Implemente um programa capaz de imprimir os n primeiros números de uma Progressão Aritmética (PA). Fórmula para o n-ésimo número de uma PA: an = a1+(n-1).r."</span>
                    <div style={{ fontSize: '13px', color: '#7a8490', marginTop: '8px' }}>Origem: Primeira Avaliação Individual - TSI / Ano: 2024.02</div>
                  </td>
                </tr>
                <tr style={{ borderBottom: '1px solid #2a2d35' }}>
                  <td style={{ padding: '12px', color: '#e74c3c', fontWeight: 600 }}>Difícil</td>
                  <td style={{ padding: '12px', color: '#a0aab5', lineHeight: '1.5' }}>Demanda maior capacidade de abstração e foca nos conceitos de nível avançado da ementa. A diferença para o nível médio está na profundidade do raciocínio lógico, exigindo a construção de soluções mais trabalhosas para serem pensadas e organizadas.</td>
                  <td style={{ padding: '12px', color: '#e0e0e0', lineHeight: '1.5' }}>
                    <span style={{ fontStyle: 'italic' }}>"Implemente subprogramas capazes de realizar as seguintes operações: - Dado um array de uma dimensão e um número n como parâmetros, retornar quantas vezes o número n ocorre no array; - Dados dois arrays de uma dimensão como parâmetro, retornar aquele que possui mais números pares."</span>
                    <div style={{ fontSize: '13px', color: '#7a8490', marginTop: '8px' }}>Origem: Avaliação Individual Final - IPI / Ano: 2024.02</div>
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: '12px', color: '#c0392b', fontWeight: 600 }}>Muito Difícil</td>
                  <td style={{ padding: '12px', color: '#a0aab5', lineHeight: '1.5' }}>Questões com perfil de desafio ou questão extra. Cobram a resolução de problemas obedecendo a restrições específicas estipuladas no enunciado.</td>
                  <td style={{ padding: '12px', color: '#e0e0e0', lineHeight: '1.5' }}>
                    <span style={{ fontStyle: 'italic' }}>"Implemente um subprograma capaz de, dado um número ímpar n, imprimir um padrão losangular de n linhas [...] Observação: soluções que utilizem laços valem até 2 pontos, soluções sem a utilização de laços, valem até 10 pontos."</span>
                    <div style={{ fontSize: '13px', color: '#7a8490', marginTop: '8px' }}>Origem: Primeira Recuperação Individual - IPI / Ano: 2024.01</div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

        </div>

        {/* FOOTER DO MODAL */}
        <div style={{ padding: '20px 30px', borderTop: '1px solid #2a2d35', display: 'flex', justifyContent: 'flex-end', backgroundColor: '#1a1d24', borderBottomLeftRadius: '12px', borderBottomRightRadius: '12px' }}>
          <button onClick={onClose} style={{ backgroundColor: '#36a860', color: '#121418', border: 'none', padding: '10px 24px', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, fontSize: '14px', transition: 'opacity 0.2s' }} onMouseOver={(e) => e.currentTarget.style.opacity = '0.8'} onMouseOut={(e) => e.currentTarget.style.opacity = '1'}>
            ENTENDI, FECHAR
          </button>
        </div>

      </div>
    </div>
  );
}