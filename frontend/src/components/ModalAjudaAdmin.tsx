interface ModalAjudaAdminProps {
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

export function ModalAjudaAdmin({ isOpen, onClose }: ModalAjudaAdminProps) {
  if (!isOpen) return null;

  return (
    <div className="mda-veu" data-tema={temaAtual()} onClick={onClose}>
      <style>{`
        .mda-veu, .mda-veu * { box-sizing: border-box; }
        .mda-veu {
          --u: 1px; --bg: #f3f6f4; --card: #ffffff; --tx: #17211b; --mu: #55625b; --bd: #dce4df; --chip: #eef2ef;
          --g: #1f7a3d; --on: #ffffff; --sombra: 0 20px 50px rgba(23,33,27,.18); --veu: rgba(10,20,14,.45);
        }
        .mda-veu[data-tema='escuro'] {
          --bg: #121418; --card: #1a1d24; --tx: #e8efea; --mu: #a0aab5; --bd: #2a2d35; --chip: #2a2d35;
          --g: #36a860; --on: #121418; --sombra: 0 20px 50px rgba(0,0,0,.5); --veu: rgba(0,0,0,.6);
        }
        .mda-veu .d1 { --c: #1f7a3d; --b: #e6f4ea; --t: #17602f; }
        .mda-veu .d2 { --c: #b7791f; --b: #fff3d6; --t: #8a5a00; }
        .mda-veu .d3 { --c: #c2501f; --b: #fde8df; --t: #a23a10; }
        .mda-veu .d4 { --c: #a3203f; --b: #fbe3ea; --t: #8e1d3b; }
        .mda-veu[data-tema='escuro'] .d1 { --c: #5fd38a; --b: rgba(95,211,138,.14); --t: #7fe3a2; }
        .mda-veu[data-tema='escuro'] .d2 { --c: #f0b84a; --b: rgba(240,184,74,.14); --t: #f6c866; }
        .mda-veu[data-tema='escuro'] .d3 { --c: #f08a5d; --b: rgba(240,138,93,.14); --t: #f6a07a; }
        .mda-veu[data-tema='escuro'] .d4 { --c: #f27a96; --b: rgba(242,122,150,.14); --t: #f79bb1; }

        .mda-veu { position: fixed; inset: 0; z-index: 999; background: var(--veu); display: flex; align-items: center; justify-content: center; padding: 20px; font-family: system-ui, -apple-system, sans-serif; }
        .mda { width: 100%; max-width: calc(1060 * var(--u)); max-height: 90vh; background: var(--card); border: 1px solid var(--bd); border-radius: 16px; box-shadow: var(--sombra); display: flex; flex-direction: column; font-size: calc(16 * var(--u)); line-height: 1.6; color: var(--mu); text-align: left; }
        .mda button { font-family: inherit; cursor: pointer; }
        .mda button:focus-visible { outline: 2px solid var(--g); outline-offset: 2px; }
        .mda-topo { display: flex; align-items: center; gap: 12px; padding: 18px 24px; border-bottom: 1px solid var(--bd); }
        .mda-topo b { width: calc(36 * var(--u)); height: calc(36 * var(--u)); border-radius: 50%; background: var(--g); color: var(--on); display: grid; place-items: center; font-size: calc(18 * var(--u)); flex: none; }
        .mda-topo > div { flex: 1; }
        .mda-topo h2 { margin: 0; font-size: calc(21 * var(--u)); line-height: 1.2; color: var(--tx); }
        .mda-topo span { font-size: calc(15 * var(--u)); }
        .mda-fechar { width: 32px; height: 32px; border-radius: 50%; border: 0; background: var(--chip); color: var(--tx); display: grid; place-items: center; flex: none; padding: 0; transition: 0.2s; }
        .mda-fechar:hover { background: var(--g); color: var(--on); }
        .mda-corpo { padding: 26px 28px; overflow-y: auto; }
        .mda-pe { padding: 16px 24px; border-top: 1px solid var(--bd); display: flex; justify-content: flex-end; }
        .mda-btn { height: calc(46 * var(--u)); padding: 0 26px; border: 0; border-radius: 10px; background: var(--g); color: var(--on); font-size: calc(16 * var(--u)); font-weight: 700; }
        .mda-btn:hover { filter: brightness(1.08); }

        .mda-secao { margin: 0 0 12px; font-size: calc(18 * var(--u)); font-weight: 600; color: var(--tx); }
        .mda-bloco { margin-top: 20px; padding-top: 20px; border-top: 1px solid var(--bd); }

        .mda-lista { display: grid; gap: 8px; }
        .mda-campo, .mda-nivel { display: grid; gap: 14px; align-items: start; border: 1.5px solid var(--bd); border-radius: 10px; padding: 12px 14px; font-size: calc(15 * var(--u)); }
        .mda-campo { grid-template-columns: calc(140 * var(--u)) minmax(0, 1fr); }
        .mda-campo strong { color: var(--tx); font-size: calc(16 * var(--u)); }
        .mda-nivel, .mda-colunas { grid-template-columns: calc(140 * var(--u)) minmax(0, 1fr) minmax(0, 1.15fr); }
        .mda-colunas { display: grid; gap: 14px; padding: 0 14px 6px; font-size: calc(14 * var(--u)); font-weight: 600; }
        .mda-dif { display: inline-flex; align-items: center; gap: 7px; justify-self: start; border-radius: 999px; padding: 4px 12px; font-size: calc(13 * var(--u)); font-weight: 600; background: var(--b); color: var(--t); white-space: nowrap; }
        .mda-dif::before { content: ''; width: 8px; height: 8px; border-radius: 50%; background: var(--c); }
        .mda-exemplo { background: var(--bg); border-radius: 8px; padding: 10px 12px; color: var(--tx); }
        .mda-exemplo small { display: block; margin-top: 6px; font-size: calc(13 * var(--u)); color: var(--mu); }
        .mda-campo > span, .mda-nivel > span:nth-child(2), .mda-exemplo { text-align: justify; hyphens: auto; }
        .mda-exemplo small { text-align: left; }

        @media (min-width: 1700px) { .mda-veu { --u: 1.15px; } }
        @media (min-width: 2200px) { .mda-veu { --u: 1.4px; } }
        @media (max-width: 720px) {
          .mda-veu { padding: 10px; }
          .mda-campo, .mda-nivel { grid-template-columns: 1fr; gap: 8px; }
          .mda-colunas { display: none; }
          .mda-topo, .mda-corpo, .mda-pe { padding-left: 16px; padding-right: 16px; }
        }
      `}</style>

      <div className="mda" lang="pt-BR" role="dialog" aria-modal="true" aria-labelledby="mda-titulo" onClick={(e) => e.stopPropagation()}>

        {/* HEADER DO MODAL */}
        <div className="mda-topo">
          <b aria-hidden="true">?</b>
          <div>
            <h2 id="mda-titulo">Guia de cadastro de questões</h2>
            <span>Como preencher o formulário e classificar a dificuldade</span>
          </div>
          <button type="button" className="mda-fechar" onClick={onClose} aria-label="Fechar">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M18 6 6 18M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        {/* CORPO DO MODAL */}
        <div className="mda-corpo">

          {/* COMO CADASTRAR */}
          <div className="mda-secao">Como preencher o formulário</div>
          <div className="mda-lista">
            <div className="mda-campo">
              <strong>Classificação</strong>
              <span>Defina o assunto da questão (Tópico). Defina se o aluno vai programar (Implementação), fazer teste de mesa (Execução) ou corrigir código (Correção). E o nível de dificuldade.</span>
            </div>
            <div className="mda-campo">
              <strong>Origem</strong>
              <span>Selecione a fonte original da questão (ex: Miniprova - Arrays) e o curso (IPI ou TSI) correspondente. O campo "Ano" ajuda a organizar a cronologia, mantendo a rastreabilidade entre o material original e o sistema.</span>
            </div>
            <div className="mda-campo">
              <strong>Conteúdo</strong>
              <span>O enunciado deve conter a descrição clara da questão. Nunca use LaTeX (códigos com $) para contas matemáticas. Use formatação em texto puro (ex: x² + y² = z). A Tabela e o Código TypeScript são opcionais e só devem ser preenchidos se a questão exigir.</span>
            </div>
          </div>

          {/* TABELA DE DIFICULDADES */}
          <div className="mda-bloco">
            <div className="mda-secao">Critérios e exemplos de dificuldade</div>
            <div className="mda-colunas">
              <span>Nível</span>
              <span>Critério</span>
              <span>Exemplo real no banco</span>
            </div>
            <div className="mda-lista">
              <div className="mda-nivel">
                <span className="mda-dif d1">Fácil</span>
                <span>Geralmente encontradas em Miniprovas, são focadas na aplicação direta da sintaxe e dos fundamentos do tópico avaliado. O objetivo central é testar a compreensão inicial e a estruturação básica do algoritmo.</span>
                <div className="mda-exemplo">
                  "Implemente um programa capaz de imprimir o valor de um balde de pipoca em um Cinema de acordo com seu tamanho. Os valores são os seguintes: balde grande - R$25,00, balde médio - R$18,00 e balde pequeno - R$12,00."
                  <small>Miniprova - Execução Condicional - TSI · 2024.01</small>
                </div>
              </div>
              <div className="mda-nivel">
                <span className="mda-dif d2">Média</span>
                <span>Exigem a combinação simultânea de conceitos lógicos. Diferente do nível fácil, o foco não é testar a sintaxe, mas sim a capacidade do aluno de estruturar e acompanhar o fluxo do código.</span>
                <div className="mda-exemplo">
                  "Implemente um programa capaz de imprimir os n primeiros números de uma Progressão Aritmética (PA). Fórmula para o n-ésimo número de uma PA: an = a1+(n-1).r."
                  <small>Primeira Avaliação Individual - TSI · 2024.02</small>
                </div>
              </div>
              <div className="mda-nivel">
                <span className="mda-dif d3">Difícil</span>
                <span>Demanda maior capacidade de abstração e foca nos conceitos de nível avançado da ementa. A diferença para o nível médio está na profundidade do raciocínio lógico, exigindo a construção de soluções mais trabalhosas para serem pensadas e organizadas.</span>
                <div className="mda-exemplo">
                  "Implemente subprogramas capazes de realizar as seguintes operações: - Dado um array de uma dimensão e um número n como parâmetros, retornar quantas vezes o número n ocorre no array; - Dados dois arrays de uma dimensão como parâmetro, retornar aquele que possui mais números pares."
                  <small>Avaliação Individual Final - IPI · 2024.02</small>
                </div>
              </div>
              <div className="mda-nivel">
                <span className="mda-dif d4">Muito Difícil</span>
                <span>Questões com perfil de desafio ou questão extra. Cobram a resolução de problemas obedecendo a restrições específicas estipuladas no enunciado.</span>
                <div className="mda-exemplo">
                  "Implemente um subprograma capaz de, dado um número ímpar n, imprimir um padrão losangular de n linhas [...] Observação: soluções que utilizem laços valem até 2 pontos, soluções sem a utilização de laços, valem até 10 pontos."
                  <small>Primeira Recuperação Individual - IPI · 2024.01</small>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* FOOTER DO MODAL */}
        <div className="mda-pe">
          <button type="button" className="mda-btn" onClick={onClose}>Entendi</button>
        </div>

      </div>
    </div>
  );
}
