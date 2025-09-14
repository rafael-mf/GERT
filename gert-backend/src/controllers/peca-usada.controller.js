const chamadoService = require('../services/chamado.service');

class PecaUsadaController {
  async addPeca(req, res, next) {
    try {
      const { chamadoId } = req.params;
      const usuarioId = req.usuario?.id;

      const peca = await chamadoService.addPecaUsadaAoChamado(
        chamadoId,
        req.body,
        usuarioId
      );

      res.status(201).json(peca);
    } catch (error) {
      next(error);
    }
  }

  async updatePeca(req, res, next) {
    try {
      const { pecaUsadaId } = req.params;
      const usuarioId = req.usuario?.id;

      const peca = await chamadoService.updatePecaUsada(
        pecaUsadaId,
        req.body
      );

      // Registrar atualização no histórico
      if (usuarioId) {
        const chamadoAtualizacaoService = require('../services/chamado-atualizacao.service');
        await chamadoAtualizacaoService.registrarComentario(
          peca.chamadoId,
          usuarioId,
          `Peça atualizada: ${peca.nome}`
        );
      }

      res.json(peca);
    } catch (error) {
      next(error);
    }
  }

  async removePeca(req, res, next) {
    try {
      const { pecaUsadaId } = req.params;
      const usuarioId = req.usuario?.id;

      const result = await chamadoService.removePecaUsadaDoChamado(
        pecaUsadaId,
        usuarioId
      );

      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  // Método para reabrir chamado
  async reabrirChamado(req, res, next) {
    try {
      const { chamadoId } = req.params;
      const usuarioId = req.usuario?.id;
      const { comentario } = req.body;

      const chamado = await chamadoService.reabrirChamado(
        chamadoId,
        usuarioId,
        comentario
      );

      res.json(chamado);
    } catch (error) {
      if (error.message.includes('Apenas o técnico responsável')) {
        return res.status(403).json({ message: error.message });
      }
      next(error);
    }
  }
}

module.exports = new PecaUsadaController();