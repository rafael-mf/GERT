// File: gert-backend/src/routes/tecnicos.routes.js
const express = require('express');
const tecnicoController = require('../controllers/tecnico.controller');
const { verifyToken, isAdmin } = require('../middlewares/auth.middleware'); // Apenas Admin gerencia técnicos

const router = express.Router();

router.use(verifyToken);
router.use(isAdmin); // Apenas Administradores podem gerenciar técnicos

router.get('/', tecnicoController.getAllTecnicos);
router.post('/', tecnicoController.createTecnico);
router.get('/:id', tecnicoController.getTecnicoById);
router.put('/:id', tecnicoController.updateTecnico);
router.delete('/:id', tecnicoController.deleteTecnico);

module.exports = router;