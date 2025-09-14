const express = require('express');
const { verifyToken, isTecnico, isAdmin } = require('../middlewares/auth.middleware');
const pecaController = require('../controllers/peca.controller');
const categoriaPecaController = require('../controllers/categoria-peca.controller');
const fornecedorController = require('../controllers/fornecedor.controller');
const { validatePeca, validateCategoriaPeca } = require('../middlewares/validators/peca.validator');
const { validateFornecedor } = require('../middlewares/validators/fornecedor.validator');
const { cacheMiddleware } = require('../middlewares/cache.middleware');
const { auditMiddleware } = require('../middlewares/audit.middleware');

const router = express.Router();

// Todas as rotas abaixo requerem autenticação
router.use(verifyToken);

// Aplicar middleware de auditoria para recursos de estoque
router.use('/pecas', auditMiddleware('peca'));
router.use('/categorias-pecas', auditMiddleware('categoria-peca'));
router.use('/fornecedores', auditMiddleware('fornecedor'));

// Aplicar cache às rotas de listagem (5 minutos)
router.get('/fornecedores', isTecnico, cacheMiddleware(300000), fornecedorController.getAllFornecedores);
router.get('/pecas', isTecnico, cacheMiddleware(300000), pecaController.getAllPecas);
router.get('/categorias', isTecnico, cacheMiddleware(300000), categoriaPecaController.getAllCategorias);

/**
 * @swagger
 * /api/estoque/fornecedores:
 *   get:
 *     summary: Listar fornecedores
 *     tags: [Fornecedores]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: searchTerm
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de fornecedores
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 fornecedores:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Fornecedor'
 *                 totalItems:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *                 currentPage:
 *                   type: integer
 *   post:
 *     summary: Criar novo fornecedor
 *     tags: [Fornecedores]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Fornecedor'
 *     responses:
 *       201:
 *         description: Fornecedor criado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Fornecedor'
 *       400:
 *         description: Dados inválidos
 */
router.get('/fornecedores', isTecnico, fornecedorController.getAllFornecedores);
router.post('/fornecedores', isTecnico, validateFornecedor, fornecedorController.createFornecedor);

/**
 * @swagger
 * /api/estoque/fornecedores/{id}:
 *   get:
 *     summary: Obter fornecedor por ID
 *     tags: [Fornecedores]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Dados do fornecedor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Fornecedor'
 *   put:
 *     summary: Atualizar fornecedor
 *     tags: [Fornecedores]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Fornecedor'
 *     responses:
 *       200:
 *         description: Fornecedor atualizado
 *   delete:
 *     summary: Excluir fornecedor
 *     tags: [Fornecedores]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Fornecedor excluído
 */
router.get('/fornecedores/:id', isTecnico, fornecedorController.getFornecedorById);
router.put('/fornecedores/:id', isTecnico, validateFornecedor, fornecedorController.updateFornecedor);
router.delete('/fornecedores/:id', isAdmin, fornecedorController.deleteFornecedor);

/**
 * @swagger
 * /api/estoque/pecas:
 *   get:
 *     summary: Listar peças
 *     tags: [Peças]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: categoriaId
 *         schema:
 *           type: integer
 *       - in: query
 *         name: searchTerm
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de peças
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 pecas:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Peca'
 *                 totalItems:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *                 currentPage:
 *                   type: integer
 *   post:
 *     summary: Criar nova peça
 *     tags: [Peças]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Peca'
 *     responses:
 *       201:
 *         description: Peça criada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Peca'
 */
router.get('/pecas', isTecnico, pecaController.getAllPecas);
router.post('/pecas', isTecnico, validatePeca, pecaController.createPeca);

/**
 * @swagger
 * /api/estoque/pecas/{id}:
 *   get:
 *     summary: Obter peça por ID
 *     tags: [Peças]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Dados da peça
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Peca'
 *   put:
 *     summary: Atualizar peça
 *     tags: [Peças]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Peca'
 *     responses:
 *       200:
 *         description: Peça atualizada
 *   delete:
 *     summary: Excluir peça
 *     tags: [Peças]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Peça excluída
 */
router.get('/pecas/:id', isTecnico, pecaController.getPecaById);
router.put('/pecas/:id', isTecnico, validatePeca, pecaController.updatePeca);
router.delete('/pecas/:id', isAdmin, pecaController.deletePeca);

// Rotas auxiliares de peças
router.get('/pecas/categoria/:categoriaId', isTecnico, pecaController.getPecasPorCategoria);
router.get('/pecas/estoque-baixo', isTecnico, pecaController.getPecasComEstoqueBaixo);

// Rotas temporárias para outras funcionalidades de estoque
router.get('/', (req, res) => {
  res.json({
    message: 'API de estoque disponível',
    endpoints: {
      pecas: '/api/estoque/pecas',
      categorias: '/api/estoque/categorias',
      fornecedores: '/api/estoque/fornecedores',
      entradas: '/api/estoque/entradas (pendente)'
    }
  });
});

module.exports = router;
