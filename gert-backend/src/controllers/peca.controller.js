const pecaService = require('../services/peca.service');

class PecaController {
  async getAllPecas(req, res, next) {
    try {
      const result = await pecaService.getAllPecas(req.query);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async getPecaById(req, res, next) {
    try {
      const peca = await pecaService.getPecaById(req.params.id);
      res.json(peca);
    } catch (error) {
      if (error.message === 'Peça não encontrada') {
        return res.status(404).json({ message: error.message });
      }
      next(error);
    }
  }

  async createPeca(req, res, next) {
    try {
      const novaPeca = await pecaService.createPeca(req.body);
      res.status(201).json(novaPeca);
    } catch (error) {
      if (error.message.includes('já cadastrado')) {
        return res.status(400).json({ message: error.message });
      }
      next(error);
    }
  }

  async updatePeca(req, res, next) {
    try {
      const pecaAtualizada = await pecaService.updatePeca(req.params.id, req.body);
      res.json(pecaAtualizada);
    } catch (error) {
      if (error.message === 'Peça não encontrada') {
        return res.status(404).json({ message: error.message });
      }
      if (error.message.includes('já cadastrado')) {
        return res.status(400).json({ message: error.message });
      }
      next(error);
    }
  }

  async deletePeca(req, res, next) {
    try {
      const result = await pecaService.deletePeca(req.params.id);
      res.json(result);
    } catch (error) {
      if (error.message === 'Peça não encontrada') {
        return res.status(404).json({ message: error.message });
      }
      next(error);
    }
  }

  async getPecasPorCategoria(req, res, next) {
    try {
      const pecas = await pecaService.getPecasPorCategoria(req.params.categoriaId);
      res.json(pecas);
    } catch (error) {
      next(error);
    }
  }

  async getPecasComEstoqueBaixo(req, res, next) {
    try {
      const pecas = await pecaService.getPecasComEstoqueBaixo();
      res.json(pecas);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new PecaController();