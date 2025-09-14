const express = require('express');
const dispositivoController = require('../controllers/dispositivo.controller');
const { verifyToken, isAdmin, isTecnico } = require('../middlewares/auth.middleware');

const router = express.Router();

router.use(verifyToken); // Todas as rotas de dispositivos requerem autenticação

// Acesso para Técnicos e Administradores para visualização
router.get('/', isTecnico, dispositivoController.getAllDispositivos);
router.get('/:id', isTecnico, dispositivoController.getDispositivoById);

// Apenas Administradores podem alterar ou excluir dispositivos
router.post('/', isAdmin, dispositivoController.createDispositivo);
router.put('/:id', isAdmin, dispositivoController.updateDispositivo);
router.delete('/:id', isAdmin, dispositivoController.deleteDispositivo);

// Rota específica para buscar dispositivos de um cliente
router.get('/cliente/:clienteId', isTecnico, dispositivoController.getDispositivosByCliente);

module.exports = router;