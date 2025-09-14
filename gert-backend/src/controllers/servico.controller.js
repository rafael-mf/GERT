const servicoService = require('../services/servico.service');

class ServicoController {
  async getAllServicos(req, res, next) {
    try {
      const result = await servicoService.getAllServicos(req.query);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async getServicoById(req, res, next) {
    try {
      const servico = await servicoService.getServicoById(req.params.id);
      res.json(servico);
    } catch (error) {
      if (error.message === 'Serviço não encontrado') {
        return res.status(404).json({ message: error.message });
      }
      next(error);
    }
  }

  async createServico(req, res, next) {
    try {
      const novoServico = await servicoService.createServico(req.body);
      res.status(201).json(novoServico);
    } catch (error) {
      if (error.message.includes('já cadastrado')) {
        return res.status(400).json({ message: error.message });
      }
      next(error);
    }
  }

  async updateServico(req, res, next) {
    try {
      const servicoAtualizado = await servicoService.updateServico(req.params.id, req.body);
      res.json(servicoAtualizado);
    } catch (error) {
      if (error.message === 'Serviço não encontrado') {
        return res.status(404).json({ message: error.message });
      }
      if (error.message.includes('já cadastrado')) {
        return res.status(400).json({ message: error.message });
      }
      next(error);
    }
  }

  async deleteServico(req, res, next) {
    try {
      await servicoService.deleteServico(req.params.id);
      res.json({ message: 'Serviço excluído com sucesso' });
    } catch (error) {
      if (error.message === 'Serviço não encontrado') {
        return res.status(404).json({ message: error.message });
      }
      next(error);
    }
  }

  // Método auxiliar para obter apenas serviços ativos (usado pelos chamados)
  async getServicosAtivos(req, res, next) {
    try {
      const servicos = await servicoService.getServicosAtivos();
      res.json(servicos);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ServicoController();