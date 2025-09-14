const chamadoService = require('../services/chamado.service');

class ChamadoServicoController {
  async addServico(req, res, next) {
    try {
      const { chamadoId } = req.params;
      const usuarioId = req.usuario?.id;

      const servico = await chamadoService.addServicoAoChamado(
        chamadoId,
        req.body,
        usuarioId
      );

      res.status(201).json(servico);
    } catch (error) {
      if (error.message.includes('já foi adicionado')) {
        return res.status(400).json({ message: error.message });
      }
      next(error);
    }
  }

  async removeServico(req, res, next) {
    try {
      const { chamadoId, chamadoServicoId } = req.params;
      const usuarioId = req.usuario?.id;

      const result = await chamadoService.removeServicoDoChamado(
        chamadoId,
        chamadoServicoId,
        usuarioId
      );

      res.json(result);
    } catch (error) {
      if (error.message.includes('Não é possível remover')) {
        return res.status(400).json({ message: error.message });
      }
      next(error);
    }
  }

  async updateServico(req, res, next) {
    try {
      const { chamadoId, chamadoServicoId } = req.params;
      const usuarioId = req.usuario?.id;

      const servico = await chamadoService.updateServicoDoChamado(
        chamadoId,
        chamadoServicoId,
        req.body
      );

      res.json(servico);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ChamadoServicoController();