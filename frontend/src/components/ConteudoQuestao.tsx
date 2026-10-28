import type { CSSProperties } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import './ConteudoQuestao.css';

// Partes que mostram o conteúdo de uma questão: enunciado (com tabela) e código.
// Usadas no simulado, no PDF e no painel.

interface EnunciadoProps {
  texto: string;
  tabela?: string[][] | null;
}

// Linhas sem letras minúsculas e com símbolos (ex.: desenhos feitos com X, # ou *)
// aparecem em fonte de largura fixa, para o desenho não ficar torto
const ehDesenho = (linha: string) => linha.trim().length > 0 && !/[a-z]/.test(linha) && /[X#*\-+[\]()=]/.test(linha);

// Texto do enunciado, linha por linha, seguido da tabela (quando a questão tem uma)
export function Enunciado({ texto, tabela }: EnunciadoProps) {
  return (
    <>
      {(texto ?? '').split('\n').map((linha, indice) => (
        <span key={indice} className={`enunciado-linha ${ehDesenho(linha) ? 'desenho' : ''}`}>{linha}</span>
      ))}
      <TabelaEnunciado linhas={tabela} />
    </>
  );
}

// A primeira linha da tabela vira o cabeçalho
function TabelaEnunciado({ linhas }: { linhas?: string[][] | null }) {
  if (!Array.isArray(linhas) || linhas.length === 0) return null;
  const [cabecalho, ...corpo] = linhas;

  return (
    <div className="tabela-enunciado-area bloco-inquebravel">
      <table className="tabela-enunciado">
        <thead>
          <tr>{cabecalho.map((celula, i) => <th key={i}>{String(celula)}</th>)}</tr>
        </thead>
        <tbody>
          {corpo.map((linha, i) => (
            <tr key={i}>{linha.map((celula, j) => <td key={j}>{String(celula)}</td>)}</tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Paleta de cores dos códigos, igual à dos materiais da disciplina (base: tema VS Code escuro)
const CORES: Record<string, string> = {
  'keyword': '#3695D7',
  'builtin': '#3695D7',
  'number': '#82B384',
  'string': '#939393',
  'comment': '#5EA63D',
  'punctuation': '#FFF500',
  'function': '#ffffff',
  'class-name': '#ffffff',
  'variable': '#ffffff',
  'parameter': '#ffffff',
  'property': '#ffffff',
  'operator': '#ffffff'
};

const temaCodigo = JSON.parse(JSON.stringify(vscDarkPlus));
Object.keys(temaCodigo).forEach((token) => {
  if (temaCodigo[token].fontStyle === 'italic' && token !== 'comment') temaCodigo[token].fontStyle = 'normal';
});
Object.entries(CORES).forEach(([token, cor]) => {
  temaCodigo[token] = { ...temaCodigo[token], color: cor, fontStyle: token === 'comment' ? 'italic' : 'normal' };
});

interface BlocoCodigoProps {
  codigo: string;
  numerarLinhas?: boolean;
  estilo?: CSSProperties;
}

// Trecho de código TypeScript com realce de sintaxe (usado no simulado, no PDF e no painel)
export function BlocoCodigo({ codigo, numerarLinhas = false, estilo }: BlocoCodigoProps) {
  return (
    <SyntaxHighlighter
      language="typescript"
      style={temaCodigo}
      showLineNumbers={numerarLinhas}
      customStyle={{ margin: 0, fontFamily: "Consolas, 'Courier New', monospace", backgroundColor: '#1e1e1e', color: '#ffffff', ...estilo }}
    >
      {codigo}
    </SyntaxHighlighter>
  );
}