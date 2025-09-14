const express = require('express');
const chamadoController = require('../controllers/chamado.controller');
const chamadoAtualizacaoController = require('../controllers/chamado-atualizacao.controller');
const { verifyToken, isTecnico, isAdmin } = require('../middlewares/auth.middleware');
const { validateChamado } = require('../middlewares/validators/chamado.validator');
const { cacheMiddleware } = require('../middlewares/cache.middleware');
const { auditMiddleware } = require('../middlewares/audit.middleware');

const router = express.Router();

// Todas as rotas de chamados requerem autenticação
router.use(verifyToken);

// Aplicar middleware de auditoria para chamados
router.use(auditMiddleware('chamado'));

/**
 * @swagger
 * /api/chamados:
 *   get:
 *     summary: Listar chamados com filtros e paginação
 *     tags: [Chamados]
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
 *         name: searchTerm
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de chamados
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 chamados:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Chamado'
 *                 totalItems:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *                 currentPage:
 *                   type: integer
 *   post:
 *     summary: Criar novo chamado
 *     tags: [Chamados]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Chamado'
 *     responses:
 *       201:
 *         description: Chamado criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Chamado'
 *       400:
 *         description: Dados inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/', isTecnico, cacheMiddleware(300000), chamadoController.getAllChamados);
router.post('/', isTecnico, validateChamado, chamadoController.createChamado);

/**
 * @swagger
 * /api/chamados/{id}:
 *   get:
 *     summary: Obter chamado por ID
 *     tags: [Chamados]
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
 *         description: Dados do chamado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Chamado'
 *       404:
 *         description: Chamado não encontrado
 *   put:
 *     summary: Atualizar chamado
 *     tags: [Chamados]
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
 *             $ref: '#/components/schemas/Chamado'
 *     responses:
 *       200:
 *         description: Chamado atualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Chamado'
 *       404:
 *         description: Chamado não encontrado
 *   delete:
 *     summary: Excluir chamado
 *     tags: [Chamados]
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
 *         description: Chamado excluído
 *       404:
 *         description: Chamado não encontrado
 */
router.get('/:id', isTecnico, chamadoController.getChamadoById);
router.put('/:id', isTecnico, chamadoController.updateChamado);
router.delete('/:id', isAdmin, chamadoController.deleteChamado);

/**
 * @swagger
 * /api/chamados/aux/clientes:
 *   get:
 *     summary: Listar clientes para preenchimento de formulário
 *     tags: [Chamados]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de clientes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Cliente'
 */
router.get('/aux/clientes', isTecnico, chamadoController.getClientes);

/**
 * @swagger
 * /api/chamados/aux/dispositivos/cliente/{clienteId}:
 *   get:
 *     summary: Listar dispositivos por cliente
 *     tags: [Chamados]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: clienteId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de dispositivos do cliente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Dispositivo'
 *       404:
 *         description: Cliente não encontrado
 */
router.get('/aux/dispositivos/cliente/:clienteId', isTecnico, chamadoController.getDispositivosPorCliente);

/**
 * @swagger
 * /api/chamados/aux/prioridades:
 *   get:
 *     summary: Listar prioridades para preenchimento de formulário
 *     tags: [Chamados]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de prioridades
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Prioridade'
 */
router.get('/aux/prioridades', isTecnico, chamadoController.getPrioridades);

/**
 * @swagger
 * /api/chamados/aux/status:
 *   get:
 *     summary: Listar status de chamados para preenchimento de formulário
 *     tags: [Chamados]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de status de chamados
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/StatusChamado'
 */
router.get('/aux/status', isTecnico, chamadoController.getStatusChamados);

/**
 * @swagger
 * /api/chamados/aux/tecnicos:
 *   get:
 *     summary: Listar técnicos para preenchimento de formulário
 *     tags: [Chamados]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de técnicos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Tecnico'
 */
router.get('/aux/tecnicos', isTecnico, chamadoController.getTecnicos);

/**
 * @swagger
 * /api/chamados/aux/servicos:
 *   get:
 *     summary: Listar serviços para preenchimento de formulário
 *     tags: [Chamados]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de serviços
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Servico'
 */
router.get('/aux/servicos', isTecnico, chamadoController.getServicos);

/**
 * @swagger
 * /api/chamados/aux/categorias-dispositivo:
 *   get:
 *     summary: Listar categorias de dispositivo para preenchimento de formulário
 *     tags: [Chamados]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de categorias de dispositivo
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CategoriaDispositivo'
 */
router.get('/aux/categorias-dispositivo', isTecnico, chamadoController.getCategoriasDispositivo);

// === ROTAS PARA FECHAR CHAMADOS ===
router.put('/:id/fechar', isTecnico, chamadoController.fecharChamado);

/**
 * @swagger
 * /api/chamados/{chamadoId}/fechar:
 *   put:
 *     summary: Fechar chamado
 *     tags: [Chamados]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: chamadoId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - diagnostico
 *               - solucao
 *             properties:
 *               diagnostico:
 *                 type: string
 *               solucao:
 *                 type: string
 *               valorTotal:
 *                 type: number
 *     responses:
 *       200:
 *         description: Chamado fechado com sucesso
 *       400:
 *         description: Dados inválidos ou chamado não pode ser fechado
 *       404:
 *         description: Chamado não encontrado
 */
router.put('/:chamadoId/fechar', isTecnico, chamadoController.fecharChamado);

// === ROTAS PARA PEÇAS USADAS ===
router.put('/pecas-usadas/:pecaUsadaId', isTecnico, chamadoController.updatePecaUsada);
router.delete('/pecas-usadas/:pecaUsadaId', isTecnico, chamadoController.removePecaUsada);

// === ROTAS PARA SERVIÇOS ===
router.post('/:id/servicos', isTecnico, chamadoController.addServicoAoChamado);
router.delete('/servicos/:chamadoServicoId', isTecnico, chamadoController.removeServicoDoChamado);

/**
 * @swagger
 * /api/chamados/{chamadoId}/atualizacoes:
 *   get:
 *     summary: Obter histórico de atualizações de um chamado
 *     tags: [Chamados]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: chamadoId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Histórico de atualizações
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ChamadoAtualizacao'
 */
router.get('/:chamadoId/atualizacoes', chamadoAtualizacaoController.getAtualizacoesByChamado);

/**
 * @swagger
 * /api/chamados/atualizacoes:
 *   post:
 *     summary: Registrar uma nova atualização em um chamado
 *     tags: [Chamados]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - chamadoId
 *               - usuarioId
 *             properties:
 *               chamadoId:
 *                 type: integer
 *               usuarioId:
 *                 type: integer
 *               statusAnterior:
 *                 type: integer
 *               statusNovo:
 *                 type: integer
 *               comentario:
 *                 type: string
 *     responses:
 *       201:
 *         description: Atualização registrada com sucesso
 */
router.post('/atualizacoes', isTecnico, chamadoAtualizacaoController.createAtualizacao);

/**
 * @swagger
 * /api/chamados/atualizacoes/comentario:
 *   post:
 *     summary: Registrar um comentário em um chamado
 *     tags: [Chamados]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - chamadoId
 *               - usuarioId
 *               - comentario
 *             properties:
 *               chamadoId:
 *                 type: integer
 *               usuarioId:
 *                 type: integer
 *               comentario:
 *                 type: string
 *     responses:
 *       201:
 *         description: Comentário registrado com sucesso
 */
router.post('/atualizacoes/comentario', isTecnico, chamadoAtualizacaoController.registrarComentario);

// === ROTAS PARA SERVIÇOS NOS CHAMADOS ===
const chamadoServicoController = require('../controllers/chamado-servico.controller');

/**
 * @swagger
 * /api/chamados/{chamadoId}/servicos:
 *   post:
 *     summary: Adicionar serviço ao chamado
 *     tags: [Chamados]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: chamadoId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - servicoId
 *             properties:
 *               servicoId:
 *                 type: integer
 *               valor:
 *                 type: number
 *               observacoes:
 *                 type: string
 *     responses:
 *       201:
 *         description: Serviço adicionado com sucesso
 */
router.post('/:chamadoId/servicos', isTecnico, chamadoServicoController.addServico);

/**
 * @swagger
 * /api/chamados/{chamadoId}/servicos/{chamadoServicoId}:
 *   put:
 *     summary: Atualizar serviço no chamado
 *     tags: [Chamados]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: chamadoId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: chamadoServicoId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               valor:
 *                 type: number
 *               observacoes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Serviço atualizado com sucesso
 */
router.put('/:chamadoId/servicos/:chamadoServicoId', isTecnico, chamadoServicoController.updateServico);

/**
 * @swagger
 * /api/chamados/{chamadoId}/servicos/{chamadoServicoId}:
 *   delete:
 *     summary: Remover serviço do chamado
 *     tags: [Chamados]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: chamadoId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: chamadoServicoId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Serviço removido com sucesso
 */
router.delete('/:chamadoId/servicos/:chamadoServicoId', isTecnico, chamadoServicoController.removeServico);

// === ROTAS PARA PEÇAS USADAS NOS CHAMADOS ===
const pecaUsadaController = require('../controllers/peca-usada.controller');

/**
 * @swagger
 * /api/chamados/{chamadoId}/pecas-usadas:
 *   post:
 *     summary: Adicionar peça usada ao chamado
 *     tags: [Chamados]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: chamadoId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *               - valor
 *             properties:
 *               nome:
 *                 type: string
 *               valor:
 *                 type: number
 *               descricao:
 *                 type: string
 *               numeroSerie:
 *                 type: string
 *               garantia:
 *                 type: string
 *     responses:
 *       201:
 *         description: Peça adicionada com sucesso
 */
router.post('/:chamadoId/pecas-usadas', isTecnico, pecaUsadaController.addPeca);

/**
 * @swagger
 * /api/chamados/pecas-usadas/{pecaUsadaId}:
 *   put:
 *     summary: Atualizar peça usada
 *     tags: [Chamados]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: pecaUsadaId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               valor:
 *                 type: number
 *               descricao:
 *                 type: string
 *               numeroSerie:
 *                 type: string
 *               garantia:
 *                 type: string
 *     responses:
 *       200:
 *         description: Peça atualizada com sucesso
 */
router.put('/pecas-usadas/:pecaUsadaId', isTecnico, pecaUsadaController.updatePeca);

/**
 * @swagger
 * /api/chamados/pecas-usadas/{pecaUsadaId}:
 *   delete:
 *     summary: Remover peça usada do chamado
 *     tags: [Chamados]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: pecaUsadaId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Peça removida com sucesso
 */
router.delete('/pecas-usadas/:pecaUsadaId', isTecnico, pecaUsadaController.removePeca);

// === ROTA PARA REABRIR CHAMADO ===
/**
 * @swagger
 * /api/chamados/{chamadoId}/reabrir:
 *   put:
 *     summary: Reabrir chamado
 *     tags: [Chamados]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: chamadoId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               comentario:
 *                 type: string
 *     responses:
 *       200:
 *         description: Chamado reaberto com sucesso
 *       403:
 *         description: Sem permissão para reabrir
 */
router.put('/:chamadoId/reabrir', isTecnico, pecaUsadaController.reabrirChamado);

module.exports = router;