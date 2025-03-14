const express = require('express');
const { verifyToken } = require('../middlewares/auth.middleware');

const router = express.Router();

// Todas as rotas abaixo requerem autenticação
router.use(verifyToken);

// Rotas temporárias
router.get('/', (req, res) => {
  res.json({ message: 'API de estoque disponível' });
});

module.exports = router;
