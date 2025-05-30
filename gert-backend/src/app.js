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
