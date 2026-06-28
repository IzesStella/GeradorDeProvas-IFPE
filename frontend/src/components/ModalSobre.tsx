interface ModalSobreProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ModalSobre({ isOpen, onClose }: ModalSobreProps) {
  if (!isOpen) return null;

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.75)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <div style={{ backgroundColor: '#1a1d24', borderRadius: '12px', width: '100%', maxWidth: '750px', maxHeight: '90vh', overflowY: 'auto', border: '1px solid #2a2d35', boxShadow: '0 20px 50px rgba(0,0,0,0.5)', display: 'flex', flexDirection: 'column' }}>
        
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
            Sobre
          </h2>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#a0aab5', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', padding: '5px' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* CORPO DO MODAL */}
        <div style={{ padding: '30px', color: '#a0aab5', fontSize: '15px', lineHeight: '1.6' }}>
          
          <p style={{ marginTop: 0, fontSize: '16px', color: '#e0e0e0' }}>
            Este sistema foi desenvolvido especialmente para os estudantes do <strong>1º período</strong> dos cursos de <strong>Sistemas para Internet (TSI)</strong> e <strong>Informática para Internet (IPI)</strong> do IFPE Campus Igarassu. 
          </p>
          <p>
            O objetivo é auxiliar no treinamento do componente curricular de Lógica de Programação, utilizando um banco de questões que segue os modelos das avaliações adotadas pelo professor.
          </p>
          
          {/* SEÇÃO 1: COMO USAR */}
          <h3 style={{ color: '#fff', borderBottom: '1px solid #2a2d35', paddingBottom: '8px', marginTop: '30px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2ecc71" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
            Modelos de Avaliação
          </h3>
          <ul style={{ paddingLeft: '20px', margin: '15px 0' }}>
            <li style={{ marginBottom: '12px' }}>
              <strong style={{ color: '#e0e0e0' }}>Miniprovas:</strong> São avaliações semanais contendo <strong>2 questões</strong>. O sistema sempre gerará uma questão de <em>Implementação</em> (onde você deve escrever o código do zero) e uma de <em>Execução</em> (onde você faz o teste de mesa para descobrir a saída do console).
            </li>
            <li style={{ marginBottom: '12px' }}>
              <strong style={{ color: '#e0e0e0' }}>Avaliações Maiores (1ª, 2ª Unidade e Final):</strong> Geram provas completas de 6 questões englobando os assuntos correspondentes a cada ciclo (ex: a 1ª Unidade vai até Subprogramas; a 2ª Unidade engloba Vetores, Arrays e Tipos).
            </li>
            <li style={{ marginBottom: '12px' }}>
              <strong style={{ color: '#e0e0e0' }}>Modelo Livre:</strong> Você seleciona manualmente os tópicos, as dificuldades e a quantidade desejada. Para manter o equilíbrio da prova, há um <strong>limite máximo de 12 questões</strong>.
            </li>
          </ul>

          {/* SEÇÃO 2: DIFICULDADES */}
          <h3 style={{ color: '#fff', borderBottom: '1px solid #2a2d35', paddingBottom: '8px', marginTop: '30px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f39c12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
            </svg>
            Critérios de Dificuldade
          </h3>
          <p>As questões são classificadas com base no nível de abstração exigido:</p>
          <ul style={{ listStyleType: 'none', paddingLeft: 0 }}>
            <li style={{ marginBottom: '10px', display: 'flex', gap: '10px' }}>
              <span style={{ color: '#2ecc71', fontWeight: 'bold', minWidth: '110px' }}>Fácil:</span> 
              <span>Questões de implementação direta, exigindo a aplicação básica da sintaxe e lógica inicial do assunto selecionado (ex: criar uma função simples ou um laço básico).</span>
            </li>
            <li style={{ marginBottom: '10px', display: 'flex', gap: '10px' }}>
              <span style={{ color: '#f39c12', fontWeight: 'bold', minWidth: '110px' }}>Média:</span> 
              <span>Questões de Execução (teste de mesa) que exigem rastreamento mental do código, ou implementações que começam a cruzar mais de um conceito (ex: Laços + Condicionais).</span>
            </li>
            <li style={{ marginBottom: '10px', display: 'flex', gap: '10px' }}>
              <span style={{ color: '#e74c3c', fontWeight: 'bold', minWidth: '110px' }}>Difícil:</span> 
              <span>Problemas que exigem forte abstração matemática ou manipulação avançada de estruturas combinadas (ex: Subprogramas manipulando Arrays).</span>
            </li>
            <li style={{ display: 'flex', gap: '10px' }}>
              <span style={{ color: '#c0392b', fontWeight: 'bold', minWidth: '110px' }}>Muito Difícil:</span> 
              <span>Questões de alto nível das avaliações, que valem 10 pontos, e que geralmente exige a criação de algoritmos completos e robustos com múltiplas restrições.</span>
            </li>
          </ul>

          <div style={{ backgroundColor: '#121418', padding: '15px', borderRadius: '8px', marginTop: '25px', borderLeft: '4px solid #36a860', display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#36a860" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: '2px' }}>
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="16" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
            <div>
              <strong style={{ color: '#e0e0e0', display: 'block', marginBottom: '5px' }}>Aviso:</strong>
             
            </div> Se você solicitar uma dificuldade que não está cadastrada para aquele tópico específico, dependendo dos filtros, o sistema mostrará um aviso ou fará automaticamente um ajuste para as dificuldades disponíveis.
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