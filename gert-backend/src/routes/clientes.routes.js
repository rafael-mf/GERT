// File: gert-backend/src/routes/clientes.routes.js
const express = require('express');
const clienteController = require('../controllers/cliente.controller');
const { verifyToken, isAdmin, isTecnico } = require('../middlewares/auth.middleware');

const router = express.Router();

router.use(verifyToken); // Todas as rotas de clientes requerem autenticação

// Acesso para Técnicos e Administradores para visualização e criação
router.get('/', isTecnico, clienteController.getAllClientes);
router.post('/', isTecnico, clienteController.createCliente);
router.get('/:id', isTecnico, clienteController.getClienteById);

// Apenas Administradores podem alterar ou excluir clientes
router.put('/:id', isAdmin, clienteController.updateCliente);
router.delete('/:id', isAdmin, clienteController.deleteCliente);

module.exports = router;