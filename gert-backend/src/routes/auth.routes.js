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
