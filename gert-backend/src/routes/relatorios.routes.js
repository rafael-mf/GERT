const express = require('express');
const { verifyToken, isTecnico } = require('../middlewares/auth.middleware');
const relatorioController = require('../controllers/relatorio.controller');
const { cacheMiddleware } = require('../middlewares/cache.middleware');

const router = express.Router();

// Todas as rotas abaixo requerem autenticação
router.use(verifyToken);

/**
 * @swagger
 * /api/relatorios/chamados:
 *   get:
 *     summary: Relatório de chamados
 *     tags: [Relatórios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: dataInicio
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: dataFinal
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: statusId
 *         schema:
 *           type: integer
 *       - in: query
 *         name: prioridadeId
 *         schema:
 *           type: integer
 *       - in: query
 *         name: tecnicoId
 *         schema:
 *           type: integer
 *       - in: query
 *         name: clienteId
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Relatório de chamados
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 periodo:
 *                   type: object
 *                 estatisticas:
 *                   type: object
 *                 chamadosPorPrioridade:
 *                   type: object
 *                 chamadosPorTecnico:
 *                   type: object
 *                 chamados:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Chamado'
 */

/**
 * @swagger
 * /api/relatorios/financeiro:
 *   get:
 *     summary: Relatório financeiro
 *     tags: [Relatórios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: dataInicio
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: dataFinal
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: tecnicoId
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Relatório financeiro
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 periodo:
 *                   type: object
 *                 estatisticas:
 *                   type: object
 *                 receitaPorTecnico:
 *                   type: object
 *                 chamados:
 *                   type: array
 *                   items:
 *                     type: object
 */

/**
 * @swagger
 * /api/relatorios/dashboard:
 *   get:
 *     summary: Estatísticas do dashboard
 *     tags: [Relatórios]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Estatísticas do dashboard
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalChamados:
 *                   type: integer
 *                 totalReceita:
 *                   type: string
 *                 chamadosMes:
 *                   type: integer
 *                 chamadosPorStatus:
 *                   type: array
 *                   items:
 *                     type: object
 */
router.get('/chamados', isTecnico, cacheMiddleware(600000), relatorioController.getRelatorioChamados);
router.get('/financeiro', isTecnico, cacheMiddleware(600000), relatorioController.getRelatorioFinanceiro);
router.get('/tecnicos', isTecnico, cacheMiddleware(600000), relatorioController.getRelatorioTecnicos);
router.get('/dashboard', isTecnico, cacheMiddleware(120000), relatorioController.getDashboardStats);

module.exports = router;