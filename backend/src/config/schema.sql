CREATE TABLE questoes (
    id SERIAL PRIMARY KEY,
    topico VARCHAR(255),
    enunciado TEXT,
    codigo_typescript TEXT,
    nivel_dificuldade VARCHAR(50),
    tipo_questao VARCHAR(100),
    tabela_enunciado JSONB,
    easter_egg_conteudo TEXT,
    origem VARCHAR(255),
    ano VARCHAR(20),
    ativo BOOLEAN DEFAULT true
);