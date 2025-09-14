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

// Middleware de tratamento de erros
app.use(errorHandler);

module.exports = app;
