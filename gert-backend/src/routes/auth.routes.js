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

// Em gert-backend/src/routes/auth.routes.js
// ... (outras importações)
const bcrypt = require('bcryptjs'); // Adicione esta linha

// ... (outras rotas)

// Rota de teste TEMPORÁRIA para gerar hash
router.get('/test-hash/:passwordToHash', async (req, res) => {
  try {
    const password = req.params.passwordToHash;
    const saltRounds = 10;
    const hash = await bcrypt.hash(password, saltRounds);
    res.json({ password, hash });
  } catch (error) {
    res.status(500).json({ message: "Erro ao gerar hash", error: error.message });
  }
});

module.exports = router;

module.exports = router;
