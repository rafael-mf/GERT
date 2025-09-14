const express = require('express');
const tecnicoController = require('../controllers/tecnico.controller');
const { verifyToken, isAdmin } = require('../middlewares/auth.middleware');

const router = express.Router();

// Todas as rotas de técnicos requerem que o usuário seja um admin
router.use(verifyToken, isAdmin);

router.get('/', tecnicoController.getAll);
router.post('/', tecnicoController.create);
router.get('/:id', tecnicoController.getById);
router.put('/:id', tecnicoController.update);
// A rota de delete pode ser adicionada aqui se necessário
// router.delete('/:id', tecnicoController.delete);

module.exports = router;