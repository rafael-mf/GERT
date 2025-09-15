const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { errorHandler } = require('./middlewares/error.middleware');
const authRoutes = require('./routes/auth.routes');
const chamadosRoutes = require('./routes/chamados.routes');
const clientesRoutes = require('./routes/clientes.routes');
const dispositivosRoutes = require('./routes/dispositivos.routes');
const estoqueRoutes = require('./routes/estoque.routes');
const tecnicosRoutes = require('./routes/tecnicos.routes');
const servicosRoutes = require('./routes/servicos.routes');
const dashboardRoutes = require('./routes/dashboard.routes');
const relatoriosRoutes = require('./routes/relatorios.routes');
const auditRoutes = require('./routes/audit.routes');
const { swaggerUi, swaggerSpec } = require('./config/swagger');
const { sequelize, Chamado, ChamadoPeca, Peca } = require('./models');

const app = express();

// Configuração do CORS
const allowedOrigins = [
  'http://localhost:4200',           // Desenvolvimento local
  'https://gert-frontend.vercel.app', // Produção Vercel
  process.env.FRONTEND_URL || 'http://localhost:4200'
];

// Adicionar origins do .env se existir
if (process.env.ALLOWED_ORIGINS) {
  allowedOrigins.push(...process.env.ALLOWED_ORIGINS.split(','));
}

const corsOptions = {
  origin: function (origin, callback) {
    // Permitir requests sem origin (mobile apps, etc.)
    if (!origin) return callback(null, true);
    
    // Verificar origins específicas
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    
    // Verificar padrões Vercel
    if (origin.includes('vercel.app')) {
      return callback(null, true);
    }
    
    // Verificar padrões Railway
    if (origin.includes('railway.app')) {
      return callback(null, true);
    }
    
    callback(new Error('Não permitido pelo CORS'));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true
};

// Middlewares
app.use(cors(corsOptions));
app.use(helmet({
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"]
    }
  }
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/chamados', chamadosRoutes);
app.use('/api/clientes', clientesRoutes);
app.use('/api/dispositivos', dispositivosRoutes);
app.use('/api/estoque', estoqueRoutes);
app.use('/api/tecnicos', tecnicosRoutes);
app.use('/api/servicos', servicosRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/relatorios', relatoriosRoutes);
app.use('/api/audit', auditRoutes);

// Documentação Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Rota raiz
app.get('/', (req, res) => {
  res.json({
    message: 'API do Sistema de Assistência Técnica',
    version: '1.0.0',
    documentation: '/api-docs',
    cors: 'configured',
    origin: req.headers.origin || 'no-origin',
    endpoints: {
      auth: '/api/auth',
      chamados: '/api/chamados',
      clientes: '/api/clientes',
      dispositivos: '/api/dispositivos',
      estoque: '/api/estoque',
      tecnicos: '/api/tecnicos',
      servicos: '/api/servicos',
      dashboard: '/api/dashboard',
      relatorios: '/api/relatorios',
      auditoria: '/api/auditoria'
    }
  });
});

// Health check com CORS
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    cors: 'enabled',
    origin: req.headers.origin || 'no-origin',
    environment: process.env.NODE_ENV || 'development'
  });
});

// Status detalhado do sistema
app.get('/api/status', async (req, res) => {
  try {
    const status = {
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      database: {
        connected: false,
        tables: {}
      },
      associations: {
        working: false
      },
      system: {
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        version: process.version
      }
    };

    // Verificar conexão com banco
    try {
      await sequelize.authenticate();
      status.database.connected = true;

      // Verificar tabelas
      const tabelas = ['usuarios', 'clientes', 'chamados', 'pecas'];
      for (const tabela of tabelas) {
        try {
          const [results] = await sequelize.query(`SELECT COUNT(*) as count FROM ${tabela}`);
          status.database.tables[tabela] = results[0].count;
        } catch (error) {
          status.database.tables[tabela] = 'error';
        }
      }
    } catch (error) {
      status.database.error = error.message;
    }

    // Verificar associações
    try {
      await Chamado.findAll({
        limit: 1,
        include: [{
          model: ChamadoPeca,
          as: 'pecas',
          include: [{ model: Peca, as: 'peca' }]
        }]
      });
      status.associations.working = true;
    } catch (error) {
      status.associations.error = error.message;
    }

    // Determinar status geral
    const dbOk = status.database.connected;
    const assocOk = status.associations.working;

    status.overall = (dbOk && assocOk) ? 'healthy' : 'unhealthy';

    res.json(status);
  } catch (error) {
    res.status(500).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      error: error.message
    });
  }
});

// Middleware de tratamento de erros
app.use(errorHandler);

module.exports = app;
