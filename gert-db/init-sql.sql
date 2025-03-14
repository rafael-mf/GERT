-- Criação do banco de dados
CREATE DATABASE IF NOT EXISTS gert;
USE gert;

-- Tabela de usuários do sistema
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    cargo VARCHAR(50) NOT NULL,
    ativo BOOLEAN DEFAULT TRUE,
    data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    ultimo_acesso DATETIME
);

-- Tabela de clientes
CREATE TABLE clientes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    cpf_cnpj VARCHAR(20) UNIQUE,
    email VARCHAR(100),
    telefone VARCHAR(20),
    endereco VARCHAR(200),
    cidade VARCHAR(50),
    estado CHAR(2),
    cep VARCHAR(10),
    observacoes TEXT,
    data_cadastro DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de categorias de dispositivos
CREATE TABLE categorias_dispositivos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(50) NOT NULL,
    descricao TEXT
);

-- Tabela de dispositivos
CREATE TABLE dispositivos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cliente_id INT NOT NULL,
    categoria_id INT NOT NULL,
    marca VARCHAR(50) NOT NULL,
    modelo VARCHAR(100) NOT NULL,
    numero_serie VARCHAR(100),
    especificacoes TEXT,
    data_cadastro DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cliente_id) REFERENCES clientes(id),
    FOREIGN KEY (categoria_id) REFERENCES categorias_dispositivos(id)
);

-- Tabela de status dos chamados
CREATE TABLE status_chamados (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(50) NOT NULL,
    descricao TEXT,
    cor VARCHAR(7) DEFAULT '#000000'
);

-- Tabela de prioridades
CREATE TABLE prioridades (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(50) NOT NULL,
    descricao TEXT,
    cor VARCHAR(7) DEFAULT '#000000'
);

-- Tabela de técnicos
CREATE TABLE tecnicos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    especialidade VARCHAR(100),
    disponivel BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

-- Tabela de serviços oferecidos
CREATE TABLE servicos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    descricao TEXT,
    valor_base DECIMAL(10,2) NOT NULL,
    tempo_estimado INT, -- em minutos
    ativo BOOLEAN DEFAULT TRUE
);

-- Tabela de chamados
CREATE TABLE chamados (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cliente_id INT NOT NULL,
    dispositivo_id INT NOT NULL,
    tecnico_id INT,
    prioridade_id INT NOT NULL,
    status_id INT NOT NULL,
    titulo VARCHAR(100) NOT NULL,
    descricao TEXT NOT NULL,
    diagnostico TEXT,
    solucao TEXT,
    valor_total DECIMAL(10,2),
    data_abertura DATETIME DEFAULT CURRENT_TIMESTAMP,
    data_prevista DATETIME,
    data_fechamento DATETIME,
    FOREIGN KEY (cliente_id) REFERENCES clientes(id),
    FOREIGN KEY (dispositivo_id) REFERENCES dispositivos(id),
    FOREIGN KEY (tecnico_id) REFERENCES tecnicos(id),
    FOREIGN KEY (prioridade_id) REFERENCES prioridades(id),
    FOREIGN KEY (status_id) REFERENCES status_chamados(id)
);

-- Tabela de serviços prestados em chamados
CREATE TABLE chamados_servicos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    chamado_id INT NOT NULL,
    servico_id INT NOT NULL,
    valor DECIMAL(10,2) NOT NULL,
    observacoes TEXT,
    FOREIGN KEY (chamado_id) REFERENCES chamados(id),
    FOREIGN KEY (servico_id) REFERENCES servicos(id)
);

-- Tabela de atualizações dos chamados
CREATE TABLE chamados_atualizacoes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    chamado_id INT NOT NULL,
    usuario_id INT NOT NULL,
    status_anterior INT,
    status_novo INT,
    comentario TEXT,
    data_atualizacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (chamado_id) REFERENCES chamados(id),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    FOREIGN KEY (status_anterior) REFERENCES status_chamados(id),
    FOREIGN KEY (status_novo) REFERENCES status_chamados(id)
);

-- Tabela de categorias de peças
CREATE TABLE categorias_pecas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(50) NOT NULL,
    descricao TEXT
);

-- Tabela de peças/estoque
CREATE TABLE pecas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    categoria_id INT NOT NULL,
    codigo VARCHAR(50) NOT NULL UNIQUE,
    nome VARCHAR(100) NOT NULL,
    descricao TEXT,
    marca VARCHAR(50),
    modelo VARCHAR(100),
    compatibilidade TEXT,
    preco_custo DECIMAL(10,2),
    preco_venda DECIMAL(10,2),
    estoque_minimo INT DEFAULT 1,
    estoque_atual INT DEFAULT 0,
    localizacao VARCHAR(50),
    ativo BOOLEAN DEFAULT TRUE,
    data_cadastro DATETIME DEFAULT CURRENT_TIMESTAMP,
    ultimo_inventario DATETIME,
    FOREIGN KEY (categoria_id) REFERENCES categorias_pecas(id)
);

-- Tabela de fornecedores
CREATE TABLE fornecedores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    cnpj VARCHAR(20) UNIQUE,
    contato VARCHAR(100),
    email VARCHAR(100),
    telefone VARCHAR(20),
    endereco VARCHAR(200),
    cidade VARCHAR(50),
    estado CHAR(2),
    cep VARCHAR(10),
    site VARCHAR(100),
    observacoes TEXT,
    ativo BOOLEAN DEFAULT TRUE,
    data_cadastro DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de entrada de peças no estoque
CREATE TABLE entrada_estoque (
    id INT AUTO_INCREMENT PRIMARY KEY,
    peca_id INT NOT NULL,
    fornecedor_id INT,
    usuario_id INT NOT NULL,
    quantidade INT NOT NULL,
    preco_unitario DECIMAL(10,2),
    numero_nota VARCHAR(50),
    data_entrada DATETIME DEFAULT CURRENT_TIMESTAMP,
    observacoes TEXT,
    FOREIGN KEY (peca_id) REFERENCES pecas(id),
    FOREIGN KEY (fornecedor_id) REFERENCES fornecedores(id),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

-- Tabela de peças utilizadas em chamados
CREATE TABLE chamados_pecas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    chamado_id INT NOT NULL,
    peca_id INT NOT NULL,
    quantidade INT NOT NULL,
    valor_unitario DECIMAL(10,2) NOT NULL,
    data_utilizacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (chamado_id) REFERENCES chamados(id),
    FOREIGN KEY (peca_id) REFERENCES pecas(id)
);

-- Tabela para log de alterações de estoque
CREATE TABLE log_estoque (
    id INT AUTO_INCREMENT PRIMARY KEY,
    peca_id INT NOT NULL,
    usuario_id INT NOT NULL,
    tipo_movimento ENUM('entrada', 'saida', 'ajuste', 'inventario') NOT NULL,
    quantidade INT NOT NULL,
    estoque_anterior INT NOT NULL,
    estoque_atual INT NOT NULL,
    referencia_id INT,
    referencia_tipo VARCHAR(50),
    data_movimento DATETIME DEFAULT CURRENT_TIMESTAMP,
    observacoes TEXT,
    FOREIGN KEY (peca_id) REFERENCES pecas(id),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

-- Inserção de dados iniciais para status de chamados
INSERT INTO status_chamados (nome, descricao, cor) VALUES 
('Aberto', 'Chamado recém-criado, aguardando triagem', '#FF0000'),
('Em análise', 'Chamado em análise pelo técnico', '#FFA500'),
('Aguardando aprovação', 'Orçamento enviado, aguardando aprovação do cliente', '#FFFF00'),
('Em andamento', 'Serviço em execução', '#0000FF'),
('Aguardando peça', 'Serviço aguardando chegada de peça', '#800080'),
('Concluído', 'Serviço finalizado', '#008000'),
('Cancelado', 'Chamado cancelado', '#808080');

-- Inserção de dados iniciais para prioridades
INSERT INTO prioridades (nome, descricao, cor) VALUES 
('Baixa', 'Problema não crítico', '#00FF00'),
('Média', 'Problema com impacto moderado', '#FFFF00'),
('Alta', 'Problema crítico que precisa de atenção imediata', '#FF0000');

-- Inserção de dados iniciais para categorias de dispositivos
INSERT INTO categorias_dispositivos (nome, descricao) VALUES 
('Smartphone', 'Telefones celulares e smartphones'),
('Notebook', 'Notebooks e laptops'),
('Desktop', 'Computadores de mesa'),
('Tablet', 'Tablets e iPads'),
('Impressora', 'Impressoras e multifuncionais');

-- Inserção de dados iniciais para categorias de peças
INSERT INTO categorias_pecas (nome, descricao) VALUES 
('Tela', 'Displays e telas de reposição'),
('Bateria', 'Baterias e fontes de alimentação'),
('Memória', 'Módulos de memória RAM'),
('Armazenamento', 'HDs, SSDs e unidades de armazenamento'),
('Placa-mãe', 'Placas-mãe e componentes principais');

-- Criação de um usuário administrador inicial
INSERT INTO usuarios (nome, email, senha, cargo, ativo) VALUES 
('Administrador', 'admin@sistema.com', '$2a$10$JfGj1Gm/eIN6KsZy.vU4s.XTCi9tPQbJ.3eFhnUjC8GIlxAQ6K24O', 'Administrador', TRUE);
-- Senha: admin123 (hash BCrypt)

-- Conceder privilégios ao usuário da aplicação
GRANT ALL PRIVILEGES ON gert.* TO 'app_user'@'%';
FLUSH PRIVILEGES;
