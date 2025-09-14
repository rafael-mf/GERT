// gert-backend/src/routes/audit.routes.js
const express = require('express');
const router = express.Router();
const { getLogs, getLogStats } = require('../controllers/audit.controller');
const { verifyToken, isAdmin } = require('../middlewares/auth.middleware');
const { auditMiddleware } = require('../middlewares/audit.middleware');

// Aplicar middleware de auditoria para todas as rotas de auditoria
router.use(auditMiddleware('audit'));

/**
 * @swagger
 * /api/audit/logs:
 *   get:
 *     summary: Consultar logs de auditoria
 *     tags: [Auditoria]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *         description: Data dos logs (YYYY-MM-DD)
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         description: ID do usuário
 *       - in: query
 *         name: action
 *         schema:
 *           type: string
 *           enum: [VIEW, CREATE, UPDATE, DELETE, ACCESS]
 *         description: Tipo de ação
 *       - in: query
 *         name: resource
 *         schema:
 *           type: string
 *         description: Recurso afetado
 *     responses:
 *       200:
 *         description: Logs retornados com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                 count:
 *                   type: number
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/logs', verifyToken, isAdmin, getLogs);

/**
 * @swagger
 * /api/audit/stats:
 *   get:
 *     summary: Estatísticas de auditoria
 *     tags: [Auditoria]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *         description: Data para estatísticas (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Estatísticas retornadas com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: number
 *                     byAction:
 *                       type: object
 *                     byResource:
 *                       type: object
 *                     byUser:
 *                       type: object
 *                     recentActivity:
 *                       type: array
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/stats', verifyToken, isAdmin, getLogStats);

module.exports = router;