// gert-backend/src/controllers/chamado-atualizacao.controller.js
const chamadoAtualizacaoService = require('../services/chamado-atualizacao.service');

class ChamadoAtualizacaoController {
  async getAtualizacoesByChamado(req, res, next) {
    try {
      const atualizacoes = await chamadoAtualizacaoService.getAtualizacoesByChamado(req.params.chamadoId);
      res.json(atualizacoes);
    } catch (error) {
      next(error);
    }
  }

  async createAtualizacao(req, res, next) {
    try {
      const { chamadoId, usuarioId, statusAnterior, statusNovo, comentario } = req.body;
      const atualizacao = await chamadoAtualizacaoService.registrarAtualizacao(
        chamadoId,
        usuarioId,
        statusAnterior,
        statusNovo,
        comentario
      );
      res.status(201).json(atualizacao);
    } catch (error) {
      next(error);
    }
  }

  async registrarComentario(req, res, next) {
    try {
      const { chamadoId, usuarioId, comentario } = req.body;
      const atualizacao = await chamadoAtualizacaoService.registrarComentario(
        chamadoId,
        usuarioId,
        comentario
      );
      res.status(201).json(atualizacao);
    } catch (error) {
      next(error);
    }
  }

  async getAtualizacaoById(req, res, next) {
    try {
      const atualizacao = await chamadoAtualizacaoService.getAtualizacaoById(req.params.id);
      res.json(atualizacao);
    } catch (error) {
      if (error.message === 'Atualização não encontrada') {
        return res.status(404).json({ message: error.message });
      }
      next(error);
    }
  }
}

module.exports = new ChamadoAtualizacaoController();