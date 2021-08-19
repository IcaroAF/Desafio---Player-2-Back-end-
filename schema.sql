DROP TABLE IF EXISTS empresas;

CREATE TABLE IF NOT EXISTS empresas (
  	cnpj varchar(14) PRIMARY KEY UNIQUE,
  	razao_social text NOT NULL,
  	nome_fantasia text NOT NULL,
  	cep varchar(8) NOT NULL,
  	municipio text NOT NULL,
  	estado text NOT NULL,
  	telefone text NOT NULL,
  	email text NOT NULL,
  	senha text NOT NULL,
  	data_cadastro timestamp DEFAULT CURRENT_TIMESTAMP
);