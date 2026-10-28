// Modelo Livre: escolhe as questões em três etapas e embaralha o resultado.
// "topicos" são os tópicos marcados na tela (Laços inclui as partes 1 e 2 das miniprovas).
export function montarModeloLivre(questoes: any[], topicos: string[], dificuldades: string[], quantidade: number) {
  const sorteio: Sorteio = {
    simulado: [],
    restantes: embaralhar(questoes),
    quantidade,
    topicoDe: (q) => topicos.find(t => q.topico === t || q.topico.startsWith(`${t} - `)) ?? q.topico
  };

  incluirUmaPorDificuldade(sorteio, dificuldades);
  incluirUmaPorTopico(sorteio, topicos);
  completarAlternandoTopicos(sorteio);

  return embaralhar(sorteio.simulado);
}

interface Sorteio {
  simulado: any[];
  restantes: any[];
  quantidade: number;
  topicoDe: (questao: any) => string;
}

const cheio = (s: Sorteio) => s.simulado.length >= s.quantidade;
const jaTemTopico = (s: Sorteio, topico: string) => s.simulado.some(q => s.topicoDe(q) === topico);

// Etapa 1: uma questão de cada nível de dificuldade escolhido. Dá preferência a tópicos
// que ainda não apareceram, para sobrar vaga para os outros tópicos na etapa 2.
function incluirUmaPorDificuldade(s: Sorteio, dificuldades: string[]) {
  for (const nivel of embaralhar(dificuldades)) {
    if (cheio(s)) return;
    const retirou = retirar(s, q => q.nivel_dificuldade === nivel && !jaTemTopico(s, s.topicoDe(q)));
    if (!retirou) retirar(s, q => q.nivel_dificuldade === nivel);
  }
}

// Etapa 2: uma questão de cada tópico escolhido que ainda não apareceu
function incluirUmaPorTopico(s: Sorteio, topicos: string[]) {
  for (const topico of embaralhar(topicos)) {
    if (cheio(s)) return;
    if (!jaTemTopico(s, topico)) retirar(s, q => s.topicoDe(q) === topico);
  }
}

// Etapa 3: completa as vagas alternando entre os tópicos (round-robin)
function completarAlternandoTopicos(s: Sorteio) {
  const filasPorTopico = new Map<string, any[]>();
  for (const questao of s.restantes) {
    const topico = s.topicoDe(questao);
    filasPorTopico.set(topico, [...(filasPorTopico.get(topico) ?? []), questao]);
  }

  const filas = [...filasPorTopico.values()];
  while (!cheio(s) && filas.some(fila => fila.length > 0)) {
    for (const fila of filas) {
      if (cheio(s)) break;
      const questao = fila.shift();
      if (questao) s.simulado.push(questao);
    }
  }
}

// Move para o simulado a primeira questão restante que atende à condição
function retirar(s: Sorteio, condicao: (q: any) => boolean) {
  const indice = s.restantes.findIndex(condicao);
  if (indice === -1) return false;
  s.simulado.push(...s.restantes.splice(indice, 1));
  return true;
}

function embaralhar<T>(lista: T[]) {
  return [...lista].sort(() => Math.random() - 0.5);
}