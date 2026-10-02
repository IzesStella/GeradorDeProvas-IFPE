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
          <h2 style={{ margin: 0, color: '#fff', fontSize: '18px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ backgroundColor: '#36a860', color: '#121418', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
            </div>
            Sobre o Sistema
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
          
          <p style={{ marginTop: 0, fontSize: '15px', color: '#e0e0e0', fontWeight: 500, lineHeight: '1.5' }}>
            Este sistema foi desenvolvido especialmente para os estudantes do 1º período dos cursos de Sistemas para Internet (TSI) e Informática para Internet (IPI) do IFPE Campus Igarassu. 
          </p>
          <p style={{ marginBottom: '30px' }}>
            O objetivo é auxiliar no treinamento do componente curricular de Lógica de Programação, utilizando um banco de questões que segue os modelos das avaliações adotadas pelo professor.
          </p>
          
          {/* SEÇÃO 1: COMO USAR */}
          <h3 style={{ color: '#fff', borderBottom: '1px solid #2a2d35', paddingBottom: '10px', margin: '0 0 15px 0', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '16px', fontWeight: 600 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#36a860" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="3" y1="9" x2="21" y2="9"></line>
              <line x1="9" y1="21" x2="9" y2="9"></line>
            </svg>
            Modelos de Avaliação
          </h3>
          <ul style={{ listStyleType: 'none', paddingLeft: 0, margin: '0 0 35px 0' }}>
            <li style={{ marginBottom: '12px', paddingLeft: '16px', position: 'relative' }}>
              <span style={{ position: 'absolute', left: 0, top: '8px', width: '6px', height: '6px', backgroundColor: '#36a860', borderRadius: '50%' }}></span>
              <span style={{ color: '#e0e0e0', fontWeight: 600 }}>Miniprovas:</span> São avaliações semanais contendo 2 questões. O sistema sempre gerará uma questão de <em>Implementação</em> (onde você deve escrever o código do zero) e uma de <em>Execução</em> (onde você faz o teste de mesa para descobrir a saída do console).
            </li>
            <li style={{ marginBottom: '12px', paddingLeft: '16px', position: 'relative' }}>
              <span style={{ position: 'absolute', left: 0, top: '8px', width: '6px', height: '6px', backgroundColor: '#36a860', borderRadius: '50%' }}></span>
              <span style={{ color: '#e0e0e0', fontWeight: 600 }}>Avaliações Maiores (1ª, 2ª Unidade e Final):</span> Geram provas completas de 6 questões englobando os assuntos correspondentes a cada ciclo (ex: a 1ª Unidade vai até Subprogramas; a 2ª Unidade engloba Vetores, Arrays e Tipos).
            </li>
            <li style={{ paddingLeft: '16px', position: 'relative' }}>
              <span style={{ position: 'absolute', left: 0, top: '8px', width: '6px', height: '6px', backgroundColor: '#36a860', borderRadius: '50%' }}></span>
              <span style={{ color: '#e0e0e0', fontWeight: 600 }}>Modelo Livre:</span> Você seleciona manualmente os tópicos, as dificuldades e a quantidade desejada. Para manter o equilíbrio da prova, há um limite máximo de 12 questões.
            </li>
          </ul>

          {/* SEÇÃO 2: DIFICULDADES */}
          <h3 style={{ color: '#fff', borderBottom: '1px solid #2a2d35', paddingBottom: '10px', margin: '0 0 15px 0', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '16px', fontWeight: 600 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#36a860" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="20" x2="12" y2="10"></line>
              <line x1="18" y1="20" x2="18" y2="4"></line>
              <line x1="6" y1="20" x2="6" y2="16"></line>
            </svg>
            Critérios de Dificuldade
          </h3>
          <p style={{ marginBottom: '20px' }}>As questões são classificadas com base no nível de abstração exigido:</p>
          <ul style={{ listStyleType: 'none', paddingLeft: 0, margin: 0 }}>
            <li style={{ marginBottom: '16px', display: 'flex', gap: '12px' }}>
              <span style={{ color: '#2ecc71', fontWeight: 600, minWidth: '100px' }}>Fácil</span> 
              <span>Muito presentes nas Miniprovas, são focadas na aplicação direta da sintaxe e dos fundamentos do tópico avaliado. Focam na fixação de um único conceito por vez. Embora utilizem conceitos anteriores (como um laço que contém um if), o objetivo central é testar a compreensão inicial e a estruturação básica do algoritmo.</span>
            </li>
            <li style={{ marginBottom: '16px', display: 'flex', gap: '12px' }}>
              <span style={{ color: '#f39c12', fontWeight: 600, minWidth: '100px' }}>Média</span> 
              <span>Questões que exigem a combinação simultânea de conceitos lógicos. O estudante precisa unir e aplicar diferentes estruturas em conjunto, como, por exemplo, utilizar condicionais operando dentro de laços. Diferente do nível fácil, o foco não é apenas testar a sintaxe, mas sim a capacidade do aluno de estruturar e acompanhar o fluxo do código.</span>
            </li>
            <li style={{ marginBottom: '16px', display: 'flex', gap: '12px' }}>
              <span style={{ color: '#e74c3c', fontWeight: 600, minWidth: '100px' }}>Difícil</span> 
              <span>Demanda maior capacidade de abstração e foca nos conceitos de nível avançado da ementa. A diferença para o nível médio não está nos assuntos abordados, mas sim na profundidade do raciocínio lógico. O nível difícil exige a construção de soluções mais trabalhosas para serem pensadas e organizadas, além da resolução de testes de mesa mais longos.</span>
            </li>
            <li style={{ display: 'flex', gap: '12px' }}>
              <span style={{ color: '#c0392b', fontWeight: 600, minWidth: '100px' }}>Muito Difícil</span> 
              <span>Questões das avaliações finais projetadas para valer a nota máxima. Cobram a resolução de problemas sob restrições estipuladas no enunciado (como, por exemplo, implementar um subprograma utilizando apenas recursão, sem a utilização de laços).</span>
            </li>
          </ul>

          {/* CARD DE AVISO */}
          <div style={{ backgroundColor: '#121418', padding: '16px', borderRadius: '6px', marginTop: '30px', border: '1px solid #2a2d35', borderLeft: '4px solid #36a860', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#36a860" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: '1px' }}>
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="16" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
            <div>
              <span style={{ color: '#e0e0e0', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Aviso importante</span>
              <span style={{ color: '#a0aab5' }}>Se você solicitar uma dificuldade que não está cadastrada para aquele tópico específico, dependendo dos filtros, o sistema mostrará um aviso ou fará automaticamente um ajuste para as dificuldades disponíveis.</span>
            </div> 
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