-- Schema para Railway (usa database 'railway' existente)
-- NÃO criar database, apenas usar o existente

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

-- Tabela de prioridades
CREATE TABLE prioridades (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(50) NOT NULL,
    descricao TEXT,
    cor VARCHAR(7) DEFAULT '#000000'
);

-- Tabela de status de chamados
CREATE TABLE status_chamados (
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

-- Tabela de chamados
CREATE TABLE chamados (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cliente_id INT NOT NULL,
    dispositivo_id INT NOT NULL,
    tecnico_id INT,
    prioridade_id INT NOT NULL,
    status_id INT NOT NULL,
    titulo VARCHAR(200) NOT NULL,
    descricao_problema TEXT NOT NULL,
    descricao_solucao TEXT,
    valor_orcamento DECIMAL(10,2),
    valor_final DECIMAL(10,2),
    tempo_estimado INT,
    tempo_real INT,
    data_abertura DATETIME DEFAULT CURRENT_TIMESTAMP,
    data_atribuicao DATETIME,
    data_inicio DATETIME,
    data_conclusao DATETIME,
    satisfacao_cliente INT,
    observacoes_internas TEXT,
    FOREIGN KEY (cliente_id) REFERENCES clientes(id),
    FOREIGN KEY (dispositivo_id) REFERENCES dispositivos(id),
    FOREIGN KEY (tecnico_id) REFERENCES tecnicos(id),
    FOREIGN KEY (prioridade_id) REFERENCES prioridades(id),
    FOREIGN KEY (status_id) REFERENCES status_chamados(id)
);

-- Tabela de atualizações de chamados (corrigida)
DROP TABLE IF EXISTS chamado_atualizacoes;
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

-- Tabela de fornecedores
CREATE TABLE fornecedores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    cnpj VARCHAR(20) UNIQUE,
    email VARCHAR(100),
    telefone VARCHAR(20),
    endereco VARCHAR(200),
    cidade VARCHAR(50),
    estado CHAR(2),
    cep VARCHAR(10),
    contato_principal VARCHAR(100),
    observacoes TEXT,
    data_cadastro DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de categorias de peças
CREATE TABLE categorias_pecas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(50) NOT NULL,
    descricao TEXT
);

-- Tabela de peças (corrigida)
DROP TABLE IF EXISTS pecas;
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

-- Tabela de serviços
CREATE TABLE servicos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    descricao TEXT,
    valor_base DECIMAL(10,2) NOT NULL,
    tempo_estimado INT,
    ativo BOOLEAN DEFAULT TRUE
);

-- Tabela de peças usadas em chamados (corrigida)
DROP TABLE IF EXISTS pecas_usadas;
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

-- Tabela de serviços realizados em chamados (corrigida)
DROP TABLE IF EXISTS chamado_servicos;
CREATE TABLE chamados_servicos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    chamado_id INT NOT NULL,
    servico_id INT NOT NULL,
    valor DECIMAL(10,2) NOT NULL,
    observacoes TEXT,
    FOREIGN KEY (chamado_id) REFERENCES chamados(id),
    FOREIGN KEY (servico_id) REFERENCES servicos(id)
);

-- Inserção de dados iniciais

-- Categorias de dispositivos
INSERT INTO categorias_dispositivos (nome, descricao) VALUES
('Smartphone', 'Telefones celulares e smartphones'),
('Tablet', 'Tablets e dispositivos similares'),
('Notebook', 'Laptops e notebooks'),
('Desktop', 'Computadores de mesa'),
('Impressora', 'Impressoras e multifuncionais'),
('Outros', 'Outros tipos de dispositivos');

-- Prioridades
INSERT INTO prioridades (nome, descricao, cor) VALUES
('Baixa', 'Problema não crítico', '#28a745'),
('Normal', 'Problema com impacto moderado', '#ffc107'),
('Alta', 'Problema crítico que precisa de atenção imediata', '#fd7e14'),
('Urgente', 'Problema urgente que requer ação imediata', '#dc3545');

-- Status de chamados
INSERT INTO status_chamados (nome, descricao, cor) VALUES
('Aberto', 'Chamado recém-criado, aguardando triagem', '#007bff'),
('Atribuído', 'Chamado atribuído a um técnico', '#6f42c1'),
('Em Andamento', 'Serviço em execução pelo técnico', '#fd7e14'),
('Aguardando Peça', 'Serviço aguardando chegada de peça', '#6c757d'),
('Concluído', 'Serviço finalizado com sucesso', '#28a745'),
('Cancelado', 'Chamado cancelado', '#dc3545'),
('Entregue', 'Dispositivo entregue ao cliente após conclusão do serviço', '#28a745');

-- Usuário administrador padrão (senha: Admin@123)
INSERT INTO usuarios (nome, email, senha, cargo) VALUES
('Administrador', 'admin@gert.com', '$2a$10$XyB4jAoQ/y4bvOBE/qB53e4nOIJC.bhYjQBIM8ZwxXoCQW2hjTjiG', 'Administrador');

-- Categorias de peças
INSERT INTO categorias_pecas (nome, descricao) VALUES
('Telas', 'Telas e displays'),
('Baterias', 'Baterias e fontes de alimentação'),
('Conectores', 'Conectores e cabos'),
('Placas', 'Placas-mãe e circuitos'),
('Outros', 'Outros componentes');

-- Serviços padrão
INSERT INTO servicos (nome, descricao, valor_base, tempo_estimado) VALUES
('Troca de Tela', 'Substituição de tela danificada', 150.00, 60),
('Troca de Bateria', 'Substituição de bateria', 80.00, 30),
('Limpeza Interna', 'Limpeza e manutenção interna', 50.00, 45),
('Formatação', 'Formatação e instalação do sistema', 100.00, 120),
('Diagnóstico', 'Diagnóstico de problemas', 30.00, 30);