// gert-backend/src/routes/dashboard.routes.js
const express = require('express');
const { verifyToken } = require('../middlewares/auth.middleware');
const dashboardController = require('../controllers/dashboard.controller');

const router = express.Router();

// Todas as rotas abaixo requerem autenticação
router.use(verifyToken);

// Rota principal do dashboard que busca as estatísticas
router.get('/', dashboardController.getStats);

module.exports = router;