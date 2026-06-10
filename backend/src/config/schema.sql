CREATE TABLE questoes (
    id SERIAL PRIMARY KEY,
    topico VARCHAR(255),
    enunciado TEXT,
    codigo_typescript TEXT,
    nivel_dificuldade VARCHAR(50),
    easter_egg_conteudo TEXT,
    origem VARCHAR(255),
    ano INTEGER,
    ativo BOOLEAN DEFAULT true
);