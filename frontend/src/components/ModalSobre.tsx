interface ModalSobreProps {
  isOpen: boolean;
  onClose: () => void;
}

const temaAtual = () => {
  try {
    const salvo = localStorage.getItem('tema-gerador-provas');
    if (salvo === 'claro' || salvo === 'escuro') return salvo;
  } catch {
  }
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'escuro' : 'claro';
};

export function ModalSobre({ isOpen, onClose }: ModalSobreProps) {
  if (!isOpen) return null;

  return (
    <div className="mdl-veu" data-tema={temaAtual()} onClick={onClose}>
      <style>{`
        .mdl-veu, .mdl-veu * { box-sizing: border-box; }
        .mdl-veu {
          --u: 1px; --bg: #f3f6f4; --card: #ffffff; --tx: #17211b; --mu: #55625b; --bd: #dce4df; --chip: #eef2ef;
          --g: #1f7a3d; --on: #ffffff; --sombra: 0 20px 50px rgba(23,33,27,.18); --veu: rgba(10,20,14,.45);
        }
        .mdl-veu[data-tema='escuro'] {
          --bg: #121418; --card: #1a1d24; --tx: #e8efea; --mu: #a0aab5; --bd: #2a2d35; --chip: #2a2d35;
          --g: #36a860; --on: #121418; --sombra: 0 20px 50px rgba(0,0,0,.5); --veu: rgba(0,0,0,.6);
        }
        .mdl-veu .d1 { --c: #1f7a3d; --b: #e6f4ea; --t: #17602f; }
        .mdl-veu .d2 { --c: #b7791f; --b: #fff3d6; --t: #8a5a00; }
        .mdl-veu .d3 { --c: #c2501f; --b: #fde8df; --t: #a23a10; }
        .mdl-veu .d4 { --c: #a3203f; --b: #fbe3ea; --t: #8e1d3b; }
        .mdl-veu[data-tema='escuro'] .d1 { --c: #5fd38a; --b: rgba(95,211,138,.14); --t: #7fe3a2; }
        .mdl-veu[data-tema='escuro'] .d2 { --c: #f0b84a; --b: rgba(240,184,74,.14); --t: #f6c866; }
        .mdl-veu[data-tema='escuro'] .d3 { --c: #f08a5d; --b: rgba(240,138,93,.14); --t: #f6a07a; }
        .mdl-veu[data-tema='escuro'] .d4 { --c: #f27a96; --b: rgba(242,122,150,.14); --t: #f79bb1; }

        .mdl-veu { position: fixed; inset: 0; z-index: 999; background: var(--veu); display: flex; align-items: center; justify-content: center; padding: 20px; font-family: system-ui, -apple-system, sans-serif; }
        .mdl { width: 100%; max-width: calc(920 * var(--u)); max-height: 90vh; background: var(--card); border: 1px solid var(--bd); border-radius: 16px; box-shadow: var(--sombra); display: flex; flex-direction: column; font-size: calc(16 * var(--u)); line-height: 1.6; color: var(--mu); text-align: left; }
        .mdl button { font-family: inherit; cursor: pointer; }
        .mdl button:focus-visible { outline: 2px solid var(--g); outline-offset: 2px; }
        .mdl-topo { display: flex; align-items: center; gap: 12px; padding: 18px 24px; border-bottom: 1px solid var(--bd); }
        .mdl-topo b { width: calc(36 * var(--u)); height: calc(36 * var(--u)); border-radius: 50%; background: var(--g); color: var(--on); display: grid; place-items: center; font-size: calc(18 * var(--u)); flex: none; }
        .mdl-topo > div { flex: 1; }
        .mdl-topo h2 { margin: 0; font-size: calc(21 * var(--u)); line-height: 1.2; color: var(--tx); }
        .mdl-topo span { font-size: calc(15 * var(--u)); }
        .mdl-fechar { width: 32px; height: 32px; border-radius: 50%; border: 0; background: var(--chip); color: var(--tx); display: grid; place-items: center; flex: none; padding: 0; transition: 0.2s; }
        .mdl-fechar:hover { background: var(--g); color: var(--on); }
        .mdl-corpo { padding: 26px 28px; overflow-y: auto; }
        .mdl-pe { padding: 16px 24px; border-top: 1px solid var(--bd); display: flex; justify-content: flex-end; }
        .mdl-btn { height: calc(46 * var(--u)); padding: 0 26px; border: 0; border-radius: 10px; background: var(--g); color: var(--on); font-size: calc(16 * var(--u)); font-weight: 700; }
        .mdl-btn:hover { filter: brightness(1.08); }

        .mdl-intro { margin: 0 0 6px; font-size: calc(17 * var(--u)); color: var(--tx); }
        .mdl-intro + p { margin: 0 0 24px; }
        .mdl-bloco { padding: 20px 0; border-top: 1px solid var(--bd); }
        .mdl-bloco:last-child { padding-bottom: 0; }
        .mdl-secao { margin: 0 0 12px; font-size: calc(18 * var(--u)); font-weight: 600; color: var(--tx); }
        .mdl-secao small { display: block; font-size: calc(15 * var(--u)); font-weight: 400; color: var(--mu); }

        .mdl-modelos { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px; }
        .mdl-modelo { border: 1.5px solid var(--bd); border-radius: 10px; padding: 12px 14px; font-size: calc(15 * var(--u)); }
        .mdl-modelo strong { display: block; font-size: calc(17 * var(--u)); color: var(--tx); }
        .mdl-modelo em { display: inline-block; font-style: normal; font-size: calc(13 * var(--u)); font-weight: 600; background: var(--bg); border-radius: 999px; padding: 3px 10px; margin: 6px 0 8px; }
        .mdl-modelo span { display: block; }

        .mdl-niveis { display: grid; gap: 8px; }
        .mdl-nivel { display: grid; grid-template-columns: calc(140 * var(--u)) minmax(0, 1fr); gap: 14px; align-items: start; border: 1.5px solid var(--bd); border-radius: 10px; padding: 12px 14px; font-size: calc(15 * var(--u)); }
        .mdl-dif { display: inline-flex; align-items: center; gap: 7px; justify-self: start; border-radius: 999px; padding: 4px 12px; font-size: calc(13 * var(--u)); font-weight: 600; background: var(--b); color: var(--t); white-space: nowrap; }
        .mdl-dif::before { content: ''; width: 8px; height: 8px; border-radius: 50%; background: var(--c); }

        .mdl-nota { display: flex; gap: 12px; align-items: flex-start; margin-top: 20px; padding: 14px 18px; border: 1px solid var(--bd); border-left: 4px solid var(--g); border-radius: 10px; font-size: calc(15 * var(--u)); }
        .mdl-nota svg { color: var(--g); flex: none; margin-top: 1px; }
        .mdl-nota strong { display: block; color: var(--tx); font-weight: 600; }
        .mdl-corpo p, .mdl-modelo span, .mdl-nivel > span:last-child, .mdl-nota div { text-align: justify; hyphens: auto; }

        @media (min-width: 1700px) { .mdl-veu { --u: 1.15px; } }
        @media (min-width: 2200px) { .mdl-veu { --u: 1.4px; } }
        @media (max-width: 720px) {
          .mdl-veu { padding: 10px; }
          .mdl-modelos, .mdl-nivel { grid-template-columns: 1fr; }
          .mdl-nivel { gap: 8px; }
          .mdl-topo, .mdl-corpo, .mdl-pe { padding-left: 16px; padding-right: 16px; }
        }
      `}</style>

      <div className="mdl" lang="pt-BR" role="dialog" aria-modal="true" aria-labelledby="mdl-sobre-titulo" onClick={(e) => e.stopPropagation()}>

        {/* HEADER DO MODAL */}
        <div className="mdl-topo">
          <b aria-hidden="true">?</b>
          <div>
            <h2 id="mdl-sobre-titulo">Sobre o sistema</h2>
            <span>Como o gerador monta os simulados</span>
          </div>
          <button type="button" className="mdl-fechar" onClick={onClose} aria-label="Fechar">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M18 6 6 18M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        {/* CORPO DO MODAL */}
        <div className="mdl-corpo">
          <p className="mdl-intro">
            Este sistema foi desenvolvido especialmente para os estudantes do 1º período dos cursos de Sistemas para Internet (TSI) e Informática para Internet (IPI) do Instituto Federal de Pernambuco - <em>Campus</em> Igarassu.
          </p>
          <p>
            O objetivo é auxiliar no estudo do componente curricular de Lógica de Programação, utilizando um banco de questões que segue os modelos das avaliações adotadas pelo docente.
          </p>

          {/* SEÇÃO 1: MODELOS */}
          <div className="mdl-bloco">
            <div className="mdl-secao">Modelos de avaliação</div>
            <div className="mdl-modelos">
              <div className="mdl-modelo">
                <strong>Miniprovas</strong>
                <em>2 questões</em>
                <span>Avaliações semanais. O sistema sempre gerará uma questão de Implementação (onde você deve escrever o código do zero) e uma de Execução (onde você faz o teste de mesa para descobrir a saída do console).</span>
              </div>
              <div className="mdl-modelo">
                <strong>Avaliações maiores</strong>
                <em>6 questões</em>
                <span>1ª Unidade, 2ª Unidade e Avaliação Final. Englobam os assuntos correspondentes a cada ciclo (ex: a 1ª Unidade vai até Subprogramas; a 2ª Unidade engloba Vetores, Arrays e Tipos).</span>
              </div>
              <div className="mdl-modelo">
                <strong>Modelo Livre</strong>
                <em>até 12 questões</em>
                <span>Você seleciona manualmente os tópicos, as dificuldades e a quantidade desejada. O limite existe para manter o equilíbrio da prova.</span>
              </div>
            </div>
          </div>

          {/* SEÇÃO 2: DIFICULDADES */}
          <div className="mdl-bloco">
            <div className="mdl-secao">
              Critérios de dificuldade
              <small>As questões são classificadas com base no nível de abstração exigido.</small>
            </div>
            <div className="mdl-niveis">
              <div className="mdl-nivel">
                <span className="mdl-dif d1">Fácil</span>
                <span>Muito presentes nas Miniprovas, são focadas na aplicação direta da sintaxe e dos fundamentos do tópico avaliado. Focam na fixação de um único conceito por vez. Embora utilizem conceitos anteriores (como um laço que contém um if), o objetivo central é testar a compreensão inicial e a estruturação básica do algoritmo.</span>
              </div>
              <div className="mdl-nivel">
                <span className="mdl-dif d2">Média</span>
                <span>Questões que exigem a combinação simultânea de conceitos lógicos. O estudante precisa unir e aplicar diferentes estruturas em conjunto, como, por exemplo, utilizar condicionais operando dentro de laços. Diferente do nível fácil, o foco não é apenas testar a sintaxe, mas sim a capacidade do aluno de estruturar e acompanhar o fluxo do código.</span>
              </div>
              <div className="mdl-nivel">
                <span className="mdl-dif d3">Difícil</span>
                <span>Demanda maior capacidade de abstração e foca nos conceitos de nível avançado da ementa. A diferença para o nível médio não está nos assuntos abordados, mas sim na profundidade do raciocínio lógico. O nível difícil exige a construção de soluções mais trabalhosas para serem pensadas e organizadas, além da resolução de testes de mesa mais longos.</span>
              </div>
              <div className="mdl-nivel">
                <span className="mdl-dif d4">Muito Difícil</span>
                <span>Questões das avaliações finais projetadas para valer a nota máxima. Cobram a resolução de problemas sob restrições estipuladas no enunciado (como, por exemplo, implementar um subprograma utilizando apenas recursão, sem a utilização de laços).</span>
              </div>
            </div>

            {/* CARD DE AVISO */}
            <div className="mdl-nota">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M12 16v-4M12 8h.01"></path>
              </svg>
              <div>
                <strong>Aviso importante</strong>
                Se você solicitar uma dificuldade que não está cadastrada para aquele tópico específico, dependendo dos filtros, o sistema mostrará um aviso ou fará automaticamente um ajuste para as dificuldades disponíveis.
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER DO MODAL */}
        <div className="mdl-pe">
          <button type="button" className="mdl-btn" onClick={onClose}>Entendi</button>
        </div>

      </div>
    </div>
  );
}
