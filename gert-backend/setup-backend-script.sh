#!/bin/bash
# Script para configurar a estrutura do backend Node.js + Express + MySQL
# Salve este arquivo como 'setup-backend.sh' e execute-o

# Cores para mensagens no console
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Nome do projeto
PROJECT_NAME="assistencia-api"

echo -e "${BLUE}Criando projeto Node.js...${NC}"
mkdir -p $PROJECT_NAME
cd $PROJECT_NAME

# Inicializar projeto Node.js
npm init -y

# Atualizar package.json com scripts e descrição
node -e "
  const fs = require('fs');
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  
  packageJson.name = '$PROJECT_NAME';
  packageJson.description = 'API para sistema de gerenciamento de chamados técnicos';
  packageJson.main = 'src/server.js';
  packageJson.scripts = {
    ...packageJson.scripts,
    'start': 'node src/server.js',
    'dev': 'nodemon src/server.js',
    'lint': 'eslint src/**/*.js',
    'test': 'jest'
  };
  
  fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2));
"

echo -e "${BLUE}Instalando dependências...${NC}"

# Instalar dependências principais
npm install express mysql2 dotenv cors helmet bcryptjs jsonwebtoken joi sequelize uuid morgan

# Instalar dependências de desenvolvimento
npm install --save-dev nodemon eslint jest

# Criar estrutura de pastas
echo -e "${BLUE}Criando estrutura de pastas...${NC}"
mkdir -p src/{config,controllers,middlewares/validators,models,routes,services,utils}

# Criar arquivo .env
cat > .env << EOF
# Configurações do servidor
NODE_ENV=development
PORT=3000

# Configurações do banco de dados
DB_HOST=localhost
DB_USER=root
DB_PASS=
DB_NAME=assistencia_tecnica
DB_PORT=3306

# Configurações de autenticação
JWT_SECRET=sua_chave_secreta_para_jwt
JWT_EXPIRATION=1d
EOF

# Criar arquivo .env.example
cp .env .env.example

# Criar arquivo .gitignore
cat > .gitignore << EOF
# Dependências
node_modules/
package-lock.json

# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Ambiente
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Diretório de build
dist/
build/

# Diretório de cobertura de testes
coverage/

# Diversos
.DS_Store
.idea/
.vscode/
*.sublime-project
*.sublime-workspace
EOF

# Criar arquivo app.js
cat > src/app.js << EOF
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { errorHandler } = require('./middlewares/error.middleware');
const authRoutes = require('./routes/auth.routes');
const chamadosRoutes = require('./routes/chamados.routes');
const clientesRoutes = require('./routes/clientes.routes');
const estoqueRoutes = require('./routes/estoque.routes');
const tecnicosRoutes = require('./routes/tecnicos.routes');
const dashboardRoutes = require('./routes/dashboard.routes');

const app = express();

// Middlewares
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/chamados', chamadosRoutes);
app.use('/api/clientes', clientesRoutes);
app.use('/api/estoque', estoqueRoutes);
app.use('/api/tecnicos', tecnicosRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Rota raiz
app.get('/', (req, res) => {
  res.json({ message: 'API do Sistema de Assistência Técnica' });
});

// Middleware de tratamento de erros
app.use(errorHandler);

module.exports = app;
EOF

# Criar arquivo server.js
cat > src/server.js << EOF
require('dotenv').config();
const app = require('./app');
const { sequelize } = require('./config/database');

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('Conexão com o banco de dados estabelecida com sucesso.');
    
    // Só sincroniza o banco em ambiente de desenvolvimento
    if (process.env.NODE_ENV === 'development') {
      // Use { force: true } apenas se quiser recriar as tabelas
      await sequelize.sync({ alter: true });
      console.log('Modelos sincronizados com o banco de dados.');
    }
    
    app.listen(PORT, () => {
      console.log(\`Servidor rodando na porta \${PORT}\`);
    });
  } catch (error) {
    console.error('Não foi possível conectar ao banco de dados:', error);
  }
}

startServer();
EOF

# Criar arquivo de configuração do banco de dados
cat > src/config/database.js << EOF
const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

module.exports = { sequelize };
EOF

# Criar middleware de autenticação
cat > src/middlewares/auth.middleware.js << EOF
const jwt = require('jsonwebtoken');
const { Usuario } = require('../models/usuario.model');

const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Token não fornecido' });
    }
    
    const token = authHeader.split(' ')[1];
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const usuario = await Usuario.findByPk(decoded.id);
    
    if (!usuario) {
      return res.status(401).json({ message: 'Usuário não encontrado' });
    }
    
    if (!usuario.ativo) {
      return res.status(401).json({ message: 'Usuário desativado' });
    }
    
    req.usuario = usuario;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expirado' });
    }
    return res.status(401).json({ message: 'Token inválido' });
  }
};

const isAdmin = (req, res, next) => {
  if (req.usuario && req.usuario.cargo === 'Administrador') {
    return next();
  }
  
  return res.status(403).json({ message: 'Acesso negado: requer privilégios de administrador' });
};

const isTecnico = (req, res, next) => {
  if (req.usuario && (req.usuario.cargo === 'Técnico' || req.usuario.cargo === 'Administrador')) {
    return next();
  }
  
  return res.status(403).json({ message: 'Acesso negado: requer privilégios de técnico' });
};

module.exports = {
  verifyToken,
  isAdmin,
  isTecnico
};
EOF

# Criar middleware de tratamento de erros
cat > src/middlewares/error.middleware.js << EOF
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  
  // Erros específicos do Sequelize
  if (err.name === 'SequelizeValidationError') {
    return res.status(400).json({
      message: 'Erro de validação',
      errors: err.errors.map(e => ({ field: e.path, message: e.message }))
    });
  }
  
  if (err.name === 'SequelizeUniqueConstraintError') {
    return res.status(400).json({
      message: 'Erro de restrição única',
      errors: err.errors.map(e => ({ field: e.path, message: e.message }))
    });
  }
  
  if (err.name === 'SequelizeForeignKeyConstraintError') {
    return res.status(400).json({
      message: 'Erro de chave estrangeira',
      error: 'A operação não pode ser concluída devido a restrições de integridade referencial'
    });
  }
  
  // Erro padrão
  return res.status(err.statusCode || 500).json({
    message: err.message || 'Erro interno do servidor'
  });
};

module.exports = {
  errorHandler
};
EOF

# Criar modelo de usuário
cat > src/models/usuario.model.js << EOF
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const bcrypt = require('bcryptjs');

const Usuario = sequelize.define('Usuario', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nome: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  senha: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  cargo: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  ativo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  dataCriacao: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  ultimoAcesso: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'usuarios',
  timestamps: false,
  hooks: {
    beforeCreate: async (usuario) => {
      if (usuario.senha) {
        usuario.senha = await bcrypt.hash(usuario.senha, 10);
      }
    },
    beforeUpdate: async (usuario) => {
      if (usuario.changed('senha')) {
        usuario.senha = await bcrypt.hash(usuario.senha, 10);
      }
    }
  }
});

// Método para verificar senha
Usuario.prototype.verificarSenha = async function(senha) {
  return await bcrypt.compare(senha, this.senha);
};

module.exports = { Usuario };
EOF

# Criar modelo de cliente
cat > src/models/cliente.model.js << EOF
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Cliente = sequelize.define('Cliente', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nome: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  cpfCnpj: {
    type: DataTypes.STRING(20),
    unique: true
  },
  email: {
    type: DataTypes.STRING(100),
    validate: {
      isEmail: true
    }
  },
  telefone: {
    type: DataTypes.STRING(20)
  },
  endereco: {
    type: DataTypes.STRING(200)
  },
  cidade: {
    type: DataTypes.STRING(50)
  },
  estado: {
    type: DataTypes.STRING(2)
  },
  cep: {
    type: DataTypes.STRING(10)
  },
  observacoes: {
    type: DataTypes.TEXT
  },
  dataCadastro: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'clientes',
  timestamps: false
});

module.exports = { Cliente };
EOF

# Criar modelo de categorias de dispositivos
cat > src/models/categoria-dispositivo.model.js << EOF
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const CategoriaDispositivo = sequelize.define('CategoriaDispositivo', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nome: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  descricao: {
    type: DataTypes.TEXT
  }
}, {
  tableName: 'categorias_dispositivos',
  timestamps: false
});

module.exports = { CategoriaDispositivo };
EOF

# Criar modelo de dispositivo
cat > src/models/dispositivo.model.js << EOF
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const { Cliente } = require('./cliente.model');
const { CategoriaDispositivo } = require('./categoria-dispositivo.model');

const Dispositivo = sequelize.define('Dispositivo', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  clienteId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'cliente_id',
    references: {
      model: Cliente,
      key: 'id'
    }
  },
  categoriaId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'categoria_id',
    references: {
      model: CategoriaDispositivo,
      key: 'id'
    }
  },
  marca: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  modelo: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  numeroSerie: {
    type: DataTypes.STRING(100),
    field: 'numero_serie'
  },
  especificacoes: {
    type: DataTypes.TEXT
  },
  dataCadastro: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'data_cadastro'
  }
}, {
  tableName: 'dispositivos',
  timestamps: false
});

// Associações
Dispositivo.belongsTo(Cliente, { foreignKey: 'clienteId', as: 'cliente' });
Dispositivo.belongsTo(CategoriaDispositivo, { foreignKey: 'categoriaId', as: 'categoria' });

module.exports = { Dispositivo };
EOF

# Criar modelo de status de chamados
cat > src/models/status-chamado.model.js << EOF
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const StatusChamado = sequelize.define('StatusChamado', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nome: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  descricao: {
    type: DataTypes.TEXT
  },
  cor: {
    type: DataTypes.STRING(7),
    defaultValue: '#000000'
  }
}, {
  tableName: 'status_chamados',
  timestamps: false
});

module.exports = { StatusChamado };
EOF

# Criar modelo de prioridade
cat > src/models/prioridade.model.js << EOF
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Prioridade = sequelize.define('Prioridade', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nome: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  descricao: {
    type: DataTypes.TEXT
  },
  cor: {
    type: DataTypes.STRING(7),
    defaultValue: '#000000'
  }
}, {
  tableName: 'prioridades',
  timestamps: false
});

module.exports = { Prioridade };
EOF

# Criar modelo de técnico
cat > src/models/tecnico.model.js << EOF
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const { Usuario } = require('./usuario.model');

const Tecnico = sequelize.define('Tecnico', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  usuarioId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'usuario_id',
    references: {
      model: Usuario,
      key: 'id'
    }
  },
  especialidade: {
    type: DataTypes.STRING(100)
  },
  disponivel: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'tecnicos',
  timestamps: false
});

// Associações
Tecnico.belongsTo(Usuario, { foreignKey: 'usuarioId', as: 'usuario' });

module.exports = { Tecnico };
EOF

# Criar modelo de serviço
cat > src/models/servico.model.js << EOF
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Servico = sequelize.define('Servico', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nome: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  descricao: {
    type: DataTypes.TEXT
  },
  valorBase: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    field: 'valor_base'
  },
  tempoEstimado: {
    type: DataTypes.INTEGER,
    field: 'tempo_estimado'
  },
  ativo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'servicos',
  timestamps: false
});

module.exports = { Servico };
EOF

# Criar modelo de chamado
cat > src/models/chamado.model.js << EOF
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const { Cliente } = require('./cliente.model');
const { Dispositivo } = require('./dispositivo.model');
const { Tecnico } = require('./tecnico.model');
const { Prioridade } = require('./prioridade.model');
const { StatusChamado } = require('./status-chamado.model');

const Chamado = sequelize.define('Chamado', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  clienteId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'cliente_id',
    references: {
      model: Cliente,
      key: 'id'
    }
  },
  dispositivoId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'dispositivo_id',
    references: {
      model: Dispositivo,
      key: 'id'
    }
  },
  tecnicoId: {
    type: DataTypes.INTEGER,
    field: 'tecnico_id',
    references: {
      model: Tecnico,
      key: 'id'
    }
  },
  prioridadeId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'prioridade_id',
    references: {
      model: Prioridade,
      key: 'id'
    }
  },
  statusId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'status_id',
    references: {
      model: StatusChamado,
      key: 'id'
    }
  },
  titulo: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  descricao: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  diagnostico: {
    type: DataTypes.TEXT
  },
  solucao: {
    type: DataTypes.TEXT
  },
  valorTotal: {
    type: DataTypes.DECIMAL(10, 2),
    field: 'valor_total'
  },
  dataAbertura: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'data_abertura'
  },
  dataPrevista: {
    type: DataTypes.DATE,
    field: 'data_prevista'
  },
  dataFechamento: {
    type: DataTypes.DATE,
    field: 'data_fechamento'
  }
}, {
  tableName: 'chamados',
  timestamps: false
});

// Associações
Chamado.belongsTo(Cliente, { foreignKey: 'clienteId', as: 'cliente' });
Chamado.belongsTo(Dispositivo, { foreignKey: 'dispositivoId', as: 'dispositivo' });
Chamado.belongsTo(Tecnico, { foreignKey: 'tecnicoId', as: 'tecnico' });
Chamado.belongsTo(Prioridade, { foreignKey: 'prioridadeId', as: 'prioridade' });
Chamado.belongsTo(StatusChamado, { foreignKey: 'statusId', as: 'status' });

module.exports = { Chamado };
EOF

# Criar modelo de chamados_servicos
cat > src/models/chamado-servico.model.js << EOF
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const { Chamado } = require('./chamado.model');
const { Servico } = require('./servico.model');

const ChamadoServico = sequelize.define('ChamadoServico', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  chamadoId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'chamado_id',
    references: {
      model: Chamado,
      key: 'id'
    }
  },
  servicoId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'servico_id',
    references: {
      model: Servico,
      key: 'id'
    }
  },
  valor: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  observacoes: {
    type: DataTypes.TEXT
  }
}, {
  tableName: 'chamados_servicos',
  timestamps: false
});

// Associações
ChamadoServico.belongsTo(Chamado, { foreignKey: 'chamadoId', as: 'chamado' });
ChamadoServico.belongsTo(Servico, { foreignKey: 'servicoId', as: 'servico' });
Chamado.hasMany(ChamadoServico, { foreignKey: 'chamadoId', as: 'servicos' });

module.exports = { ChamadoServico };
EOF

# Criar modelo de categoria de peças
cat > src/models/categoria-peca.model.js << EOF
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const CategoriaPeca = sequelize.define('CategoriaPeca', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nome: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  descricao: {
    type: DataTypes.TEXT
  }
}, {
  tableName: 'categorias_pecas',
  timestamps: false
});

module.exports = { CategoriaPeca };
EOF

# Criar modelo de peça
cat > src/models/peca.model.js << EOF
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const { CategoriaPeca } = require('./categoria-peca.model');

const Peca = sequelize.define('Peca', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  categoriaId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'categoria_id',
    references: {
      model: CategoriaPeca,
      key: 'id'
    }
  },
  codigo: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  nome: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  descricao: {
    type: DataTypes.TEXT
  },
  marca: {
    type: DataTypes.STRING(50)
  },
  modelo: {
    type: DataTypes.STRING(100)
  },
  compatibilidade: {
    type: DataTypes.TEXT
  },
  precoCusto: {
    type: DataTypes.DECIMAL(10, 2),
    field: 'preco_custo'
  },
  precoVenda: {
    type: DataTypes.DECIMAL(10, 2),
    field: 'preco_venda'
  },
  estoqueMinimo: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
    field: 'estoque_minimo'
  },
  estoqueAtual: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'estoque_atual'
  },
  localizacao: {
    type: DataTypes.STRING(50)
  },
  ativo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  dataCadastro: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'data_cadastro'
  },
  ultimoInventario: {
    type: DataTypes.DATE,
    field: 'ultimo_inventario'
  }
}, {
  tableName: 'pecas',
  timestamps: false
});

// Associações
Peca.belongsTo(CategoriaPeca, { foreignKey: 'categoriaId', as: 'categoria' });

module.exports = { Peca };
EOF

# Criar modelo de chamado_peca
cat > src/models/chamado-peca.model.js << EOF
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const { Chamado } = require('./chamado.model');
const { Peca } = require('./peca.model');

const ChamadoPeca = sequelize.define('ChamadoPeca', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  chamadoId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'chamado_id',
    references: {
      model: Chamado,
      key: 'id'
    }
  },
  pecaId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'peca_id',
    references: {
      model: Peca,
      key: 'id'
    }
  },
  quantidade: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  valorUnitario: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    field: 'valor_unitario'
  },
  dataUtilizacao: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'data_utilizacao'
  }
}, {
  tableName: 'chamados_pecas',
  timestamps: false
});

// Associações
ChamadoPeca.belongsTo(Chamado, { foreignKey: 'chamadoId', as: 'chamado' });
ChamadoPeca.belongsTo(Peca, { foreignKey: 'pecaId', as: 'peca' });
Chamado.hasMany(ChamadoPeca, { foreignKey: 'chamadoId', as: 'pecas' });

module.exports = { ChamadoPeca };
EOF

# Criar serviço de autenticação
cat > src/services/auth.service.js << EOF
const jwt = require('jsonwebtoken');
const { Usuario } = require('../models/usuario.model');
const { Tecnico } = require('../models/tecnico.model');

class AuthService {
  async login(email, senha) {
    const usuario = await Usuario.findOne({ where: { email } });
    
    if (!usuario) {
      throw new Error('Usuário não encontrado');
    }
    
    if (!usuario.ativo) {
      throw new Error('Usuário inativo');
    }
    
    const senhaValida = await usuario.verificarSenha(senha);
    
    if (!senhaValida) {
      throw new Error('Senha inválida');
    }
    
    // Atualizar último acesso
    await usuario.update({ ultimoAcesso: new Date() });
    
    // Gerar token JWT
    const token = jwt.sign(
      { id: usuario.id, email: usuario.email, cargo: usuario.cargo },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRATION }
    );
    
    // Se for técnico, obter informações adicionais
    let tecnico = null;
    if (usuario.cargo === 'Técnico') {
      tecnico = await Tecnico.findOne({ where: { usuarioId: usuario.id } });
    }
    
    return {
      token,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        cargo: usuario.cargo,
        ultimoAcesso: usuario.ultimoAcesso,
        tecnico: tecnico ? {
          id: tecnico.id,
          especialidade: tecnico.especialidade,
          disponivel: tecnico.disponivel
        } : null
      }
    };
  }
  
  async verificarToken(token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      return { valido: true, dados: decoded };
    } catch (error) {
      return { valido: false, erro: error.message };
    }
  }
}

module.exports = new AuthService();
EOF

# Criar controlador de autenticação
cat > src/controllers/auth.controller.js << EOF
const authService = require('../services/auth.service');

class AuthController {
  async login(req, res, next) {
    try {
      const { email, senha } = req.body;
      
      if (!email || !senha) {
        return res.status(400).json({ message: 'Email e senha são obrigatórios' });
      }
      
      const resultado = await authService.login(email, senha);
      return res.json(resultado);
    } catch (error) {
      if (error.message === 'Usuário não encontrado' || error.message === 'Senha inválida') {
        return res.status(401).json({ message: 'Credenciais inválidas' });
      }
      
      if (error.message === 'Usuário inativo') {
        return res.status(403).json({ message: 'Usuário inativo' });
      }
      
      return next(error);
    }
  }
  
  async verificarToken(req, res) {
    const token = req.body.token || req.query.token;
    
    if (!token) {
      return res.status(400).json({ message: 'Token não fornecido' });
    }
    
    const resultado = await authService.verificarToken(token);
    
    if (resultado.valido) {
      return res.json({ valido: true, usuario: resultado.dados });
    } else {
      return res.status(401).json({ valido: false, message: resultado.erro });
    }
  }
}

module.exports = new AuthController();
EOF

# Criar rotas de autenticação
cat > src/routes/auth.routes.js << EOF
const express = require('express');
const authController = require('../controllers/auth.controller');
const { verifyToken } = require('../middlewares/auth.middleware');

const router = express.Router();

// Rotas públicas
router.post('/login', authController.login);
router.post('/verificar-token', authController.verificarToken);

// Rota protegida para teste
router.get('/perfil', verifyToken, (req, res) => {
  res.json({
    message: 'Rota protegida',
    usuario: {
      id: req.usuario.id,
      nome: req.usuario.nome,
      email: req.usuario.email,
      cargo: req.usuario.cargo
    }
  });
});

module.exports = router;
EOF

# Criar rotas básicas para cada módulo
for route in chamados clientes estoque tecnicos dashboard; do
  cat > src/routes/$route.routes.js << EOF
const express = require('express');
const { verifyToken } = require('../middlewares/auth.middleware');

const router = express.Router();

// Todas as rotas abaixo requerem autenticação
router.use(verifyToken);

// Rotas temporárias
router.get('/', (req, res) => {
  res.json({ message: 'API de $route disponível' });
});

module.exports = router;
EOF
done

echo -e "${GREEN}Backend configurado com sucesso!${NC}"
echo -e "${BLUE}Próximos passos:${NC}"
echo -e "1. Configure o banco de dados MySQL"
echo -e "2. Execute o script SQL para criar as tabelas"
echo -e "3. Inicie o servidor com 'npm run dev'"
echo -e "${GREEN}Bom desenvolvimento!${NC}"
