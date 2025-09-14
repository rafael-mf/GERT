const tecnicoService = require('../services/tecnico.service');

class TecnicoController {
  async getAll(req, res, next) {
    try {
      const result = await tecnicoService.getAllTecnicos(req.query);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const tecnico = await tecnicoService.getTecnicoById(req.params.id);
      res.json(tecnico);
    } catch (error) {
      if (error.message.includes('não encontrado')) {
        return res.status(404).json({ message: error.message });
      }
      next(error);
    }
  }
  
  async create(req, res, next) {
    try {
      const novoTecnico = await tecnicoService.createTecnico(req.body);
      res.status(201).json(novoTecnico);
    } catch (error) {
      // Retorna 409 (Conflict) se o e-mail já existir
      if (error.message.includes('já está em uso')) {
        return res.status(409).json({ message: error.message });
      }
      next(error);
    }
  }
  
  async update(req, res, next) {
    try {
      const tecnicoAtualizado = await tecnicoService.updateTecnico(req.params.id, req.body);
      res.json(tecnicoAtualizado);
    } catch (error) {
      if (error.message.includes('não encontrado')) {
        return res.status(404).json({ message: error.message });
      }
      if (error.message.includes('já está em uso')) {
        return res.status(409).json({ message: error.message });
      }
      next(error);
    }
  }
}

module.exports = new TecnicoController();