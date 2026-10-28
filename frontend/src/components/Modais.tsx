import { useState, type ReactNode } from 'react';
import { IconeFechar, IconeInformacao } from './Icones';
import './Modais.css';

interface ModalProps {
  titulo: string;
  aoFechar: () => void;
  largo?: boolean;
  abas?: ReactNode;
  children: ReactNode;
}

// Estrutura comum dos modais (Sobre e Guia de cadastro): fundo escuro, topo com título,
// abas opcionais, conteúdo com rolagem e botão "Entendi"
function Modal({ titulo, aoFechar, largo = false, abas, children }: ModalProps) {
  return (
    <div className="modal-fundo" onClick={aoFechar}>
      <div className={`modal ${largo ? 'largo' : ''}`} lang="pt-BR" role="dialog" aria-modal="true" aria-label={titulo} onClick={(e) => e.stopPropagation()}>
        <div className={`modal-topo ${abas ? 'com-abas' : ''}`}>
          <b aria-hidden="true">?</b>
          <h2>{titulo}</h2>
          <button type="button" className="modal-fechar" onClick={aoFechar} aria-label="Fechar">
            <IconeFechar />
          </button>
        </div>

        {abas && <div className="modal-abas" role="tablist">{abas}</div>}

        <div className="modal-corpo">{children}</div>

        <div className="modal-rodape">
          <button type="button" className="modal-botao" onClick={aoFechar}>Entendi</button>
        </div>
      </div>
    </div>
  );
}

// ---------- Modal Sobre ----------

const NIVEIS_SOBRE = [
  { nome: 'Fácil', classe: 'nivel-facil', texto: 'Muito presentes nas Miniprovas, são focadas na aplicação direta da sintaxe e dos fundamentos do tópico avaliado. Focam na fixação de um único conceito por vez. Embora utilizem conceitos anteriores (como um laço que contém um if), o objetivo central é testar a compreensão inicial e a estruturação básica do algoritmo.' },
  { nome: 'Média', classe: 'nivel-media', texto: 'Questões que exigem a combinação simultânea de conceitos lógicos. O estudante precisa unir e aplicar diferentes estruturas em conjunto, como, por exemplo, utilizar condicionais operando dentro de laços. Diferente do nível fácil, o foco não é apenas testar a sintaxe, mas sim a capacidade do aluno de estruturar e acompanhar o fluxo do código.' },
  { nome: 'Difícil', classe: 'nivel-dificil', texto: 'Demanda maior capacidade de abstração e foca nos conceitos de nível avançado da ementa. A diferença para o nível médio não está nos assuntos abordados, mas sim na profundidade do raciocínio lógico. O nível difícil exige a construção de soluções mais trabalhosas para serem pensadas e organizadas, além da resolução de testes de mesa mais longos.' },
  { nome: 'Muito Difícil', classe: 'nivel-muito-dificil', texto: 'Questões das avaliações finais projetadas para valer a nota máxima. Cobram a resolução de problemas sob restrições estipuladas no enunciado (como, por exemplo, implementar um subprograma utilizando apenas recursão, sem a utilização de laços).' }
];

interface ModalSobreProps {
  aberto: boolean;
  aoFechar: () => void;
}

export function ModalSobre({ aberto, aoFechar }: ModalSobreProps) {
  const [aba, setAba] = useState<'como' | 'agradecimentos'>('como');

  if (!aberto) return null;

  const fechar = () => { setAba('como'); aoFechar(); };

  const abas = (
    <>
      <button type="button" role="tab" aria-selected={aba === 'como'} className={`modal-aba ${aba === 'como' ? 'selecionado' : ''}`} onClick={() => setAba('como')}>Como funciona</button>
      <button type="button" role="tab" aria-selected={aba === 'agradecimentos'} className={`modal-aba ${aba === 'agradecimentos' ? 'selecionado' : ''}`} onClick={() => setAba('agradecimentos')}>Agradecimentos</button>
    </>
  );

  return (
    <Modal titulo="Sobre o sistema" aoFechar={fechar} abas={abas}>
      {aba === 'como' ? (
        <>
          <p className="sobre-intro">
            Este sistema foi desenvolvido especialmente para os estudantes do 1º período dos cursos de Sistemas para Internet (TSI) e Informática para Internet (IPI) do Instituto Federal de Pernambuco - <em>Campus</em> Igarassu.
          </p>
          <p>
            O objetivo é auxiliar no estudo do componente curricular de Lógica de Programação, utilizando um banco de questões que segue os modelos das avaliações adotadas pelo docente.
          </p>

          <div className="modal-bloco">
            <div className="modal-secao">Modelos de avaliação</div>
            <div className="sobre-modelos">
              <div className="sobre-modelo">
                <strong>Miniprovas</strong>
                <em>2 questões</em>
                <span>Avaliações semanais. O sistema sempre gerará uma questão de Implementação (onde você deve escrever o código do zero) e uma de Execução (onde você faz o teste de mesa para descobrir a saída do console).</span>
              </div>
              <div className="sobre-modelo">
                <strong>Avaliações maiores</strong>
                <em>6 a 7 questões</em>
                <span>Avaliação da Primeira Unidade e Avaliação da 2ª Unidade / Final. Englobam os assuntos correspondentes a cada ciclo (a primeira vai até Subprogramas; a segunda engloba Vetores, Arrays e Tipos).</span>
              </div>
              <div className="sobre-modelo">
                <strong>Modelo Livre</strong>
                <em>até 12 questões</em>
                <span>Você seleciona manualmente os tópicos, as dificuldades e a quantidade desejada. O limite existe para manter o equilíbrio da prova.</span>
              </div>
            </div>
          </div>

          <div className="modal-bloco">
            <div className="modal-secao">
              Critérios de dificuldade
              <small>As questões são classificadas com base no nível de abstração exigido.</small>
            </div>
            <div className="modal-lista sobre-niveis">
              {NIVEIS_SOBRE.map(nivel => (
                <div key={nivel.nome} className="modal-item">
                  <span className={`modal-nivel ${nivel.classe}`}>{nivel.nome}</span>
                  <span>{nivel.texto}</span>
                </div>
              ))}
            </div>

            <div className="sobre-nota">
              <IconeInformacao />
              <div className="modal-justificado">
                <strong>Aviso importante</strong>
                Se você solicitar uma dificuldade que não está cadastrada para aquele tópico específico, dependendo dos filtros, o sistema mostrará um aviso ou fará automaticamente um ajuste para as dificuldades disponíveis.
              </div>
            </div>
          </div>
        </>
      ) : (
         <div className="sobre-agradecimento">
          <p>
            O Igara.log está hospedado no servidor do PET Conexão Periferia, grupo do Programa de Educação Tutorial que atua no combate à desinformação na região atendida pelo <em>Campus</em> Igarassu. Agradeço ao grupo pelo apoio na hospedagem, que permite que esta ferramenta de estudo esteja disponível de forma contínua e gratuita a todos os estudantes.
          </p>
        </div>
      )}
    </Modal>
  );
}

// ---------- Modal Guia de cadastro ----------

const CAMPOS_GUIA = [
  { nome: 'Classificação', texto: 'Defina o assunto da questão (Tópico). Defina se o aluno vai programar (Implementação), fazer teste de mesa (Execução) ou corrigir código (Correção). E o nível de dificuldade.' },
  { nome: 'Origem', texto: 'Selecione a fonte original da questão (ex: Miniprova - Arrays) e o curso (IPI ou TSI) correspondente. O campo "Ano" ajuda a organizar a cronologia, mantendo a rastreabilidade entre o material original e o sistema.' },
  { nome: 'Conteúdo', texto: 'O enunciado deve conter a descrição clara da questão. Nunca use LaTeX (códigos com $) para contas matemáticas. Use formatação em texto puro (ex: x² + y² = z). A Tabela e o Código TypeScript são opcionais e só devem ser preenchidos se a questão exigir.' }
];

const NIVEIS_GUIA = [
  {
    nome: 'Fácil', classe: 'nivel-facil',
    criterio: 'Geralmente encontradas em Miniprovas, são focadas na aplicação direta da sintaxe e dos fundamentos do tópico avaliado. O objetivo central é testar a compreensão inicial e a estruturação básica do algoritmo.',
    exemplo: '"Implemente um programa capaz de imprimir o valor de um balde de pipoca em um Cinema de acordo com seu tamanho. Os valores são os seguintes: balde grande - R$25,00, balde médio - R$18,00 e balde pequeno - R$12,00."',
    fonte: 'Miniprova - Execução Condicional - TSI · 2024.01'
  },
  {
    nome: 'Média', classe: 'nivel-media',
    criterio: 'Exigem a combinação simultânea de conceitos lógicos. Diferente do nível fácil, o foco não é testar a sintaxe, mas sim a capacidade do aluno de estruturar e acompanhar o fluxo do código.',
    exemplo: '"Implemente um programa capaz de imprimir os n primeiros números de uma Progressão Aritmética (PA). Fórmula para o n-ésimo número de uma PA: an = a1+(n-1).r."',
    fonte: 'Primeira Avaliação Individual - TSI · 2024.02'
  },
  {
    nome: 'Difícil', classe: 'nivel-dificil',
    criterio: 'Demanda maior capacidade de abstração e foca nos conceitos de nível avançado da ementa. A diferença para o nível médio está na profundidade do raciocínio lógico, exigindo a construção de soluções mais trabalhosas para serem pensadas e organizadas.',
    exemplo: '"Implemente subprogramas capazes de realizar as seguintes operações: - Dado um array de uma dimensão e um número n como parâmetros, retornar quantas vezes o número n ocorre no array; - Dados dois arrays de uma dimensão como parâmetro, retornar aquele que possui mais números pares."',
    fonte: 'Avaliação Individual Final - IPI · 2024.02'
  },
  {
    nome: 'Muito Difícil', classe: 'nivel-muito-dificil',
    criterio: 'Questões com perfil de desafio ou questão extra. Cobram a resolução de problemas obedecendo a restrições específicas estipuladas no enunciado.',
    exemplo: '"Implemente um subprograma capaz de, dado um número ímpar n, imprimir um padrão losangular de n linhas [...] Observação: soluções que utilizem laços valem até 2 pontos, soluções sem a utilização de laços, valem até 10 pontos."',
    fonte: 'Primeira Recuperação Individual - IPI · 2024.01'
  }
];

interface ModalAjudaAdminProps {
  aberto: boolean;
  aoFechar: () => void;
}

export function ModalAjudaAdmin({ aberto, aoFechar }: ModalAjudaAdminProps) {
  if (!aberto) return null;

  return (
    <Modal titulo="Guia de cadastro de questões" aoFechar={aoFechar} largo>
      <div className="modal-secao">Como preencher o formulário</div>
      <div className="modal-lista guia-campos">
        {CAMPOS_GUIA.map(campo => (
          <div key={campo.nome} className="modal-item">
            <strong>{campo.nome}</strong>
            <span>{campo.texto}</span>
          </div>
        ))}
      </div>

      <div className="modal-bloco">
        <div className="modal-secao">Critérios e exemplos de dificuldade</div>
        <div className="guia-colunas">
          <span>Nível</span>
          <span>Critério</span>
          <span>Exemplo real no banco</span>
        </div>
        <div className="modal-lista guia-niveis">
          {NIVEIS_GUIA.map(nivel => (
            <div key={nivel.nome} className="modal-item">
              <span className={`modal-nivel ${nivel.classe}`}>{nivel.nome}</span>
              <span>{nivel.criterio}</span>
              <div className="guia-exemplo">
                {nivel.exemplo}
                <small>{nivel.fonte}</small>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
}