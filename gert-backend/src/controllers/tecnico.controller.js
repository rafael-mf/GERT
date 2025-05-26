// File: gert-backend/src/controllers/tecnico.controller.js
const tecnicoService = require('../services/tecnico.service');

class TecnicoController {
  async getAllTecnicos(req, res, next) {
    try {
      const result = await tecnicoService.getAllTecnicos(req.query);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async getTecnicoById(req, res, next) {
    try {
      const tecnico = await tecnicoService.getTecnicoById(req.params.id);
      res.json(tecnico);
    } catch (error) {
      if (error.message === 'Técnico não encontrado') {
        return res.status(404).json({ message: error.message });
      }
      next(error);
    }
  }

  async createTecnico(req, res, next) {
    try {
      const novoTecnico = await tecnicoService.createTecnico(req.body);
      res.status(201).json(novoTecnico);
    } catch (error) {
      if (error.message.includes('obrigatórios') || error.name === 'SequelizeUniqueConstraintError') {
        return res.status(400).json({ message: error.message || 'Email de usuário já existe.' });
      }
      next(error);
    }
  }

  async updateTecnico(req, res, next) {
    try {
      const tecnicoAtualizado = await tecnicoService.updateTecnico(req.params.id, req.body);
      res.json(tecnicoAtualizado);
    } catch (error) {
      if (error.message === 'Técnico não encontrado') {
        return res.status(404).json({ message: error.message });
      }
      if (error.name === 'SequelizeUniqueConstraintError') {
        return res.status(400).json({ message: 'Email de usuário já existe para outro técnico.' });
      }
      next(error);
    }
  }

  async deleteTecnico(req, res, next) {
    try {
      const result = await tecnicoService.deleteTecnico(req.params.id);
      res.json(result);
    } catch (error) {
      if (error.message === 'Técnico não encontrado') {
        return res.status(404).json({ message: error.message });
      }
      next(error);
    }
  }
}

module.exports = new TecnicoController();