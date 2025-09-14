const categoriaPecaService = require('../services/categoria-peca.service');

class CategoriaPecaController {
  async getAllCategorias(req, res, next) {
    try {
      const categorias = await categoriaPecaService.getAllCategorias();
      res.json(categorias);
    } catch (error) {
      next(error);
    }
  }

  async getCategoriaById(req, res, next) {
    try {
      const categoria = await categoriaPecaService.getCategoriaById(req.params.id);
      res.json(categoria);
    } catch (error) {
      if (error.message === 'Categoria não encontrada') {
        return res.status(404).json({ message: error.message });
      }
      next(error);
    }
  }

  async createCategoria(req, res, next) {
    try {
      const novaCategoria = await categoriaPecaService.createCategoria(req.body);
      res.status(201).json(novaCategoria);
    } catch (error) {
      if (error.message.includes('já cadastrada')) {
        return res.status(400).json({ message: error.message });
      }
      next(error);
    }
  }

  async updateCategoria(req, res, next) {
    try {
      const categoriaAtualizada = await categoriaPecaService.updateCategoria(req.params.id, req.body);
      res.json(categoriaAtualizada);
    } catch (error) {
      if (error.message === 'Categoria não encontrada') {
        return res.status(404).json({ message: error.message });
      }
      if (error.message.includes('já cadastrada')) {
        return res.status(400).json({ message: error.message });
      }
      next(error);
    }
  }

  async deleteCategoria(req, res, next) {
    try {
      const result = await categoriaPecaService.deleteCategoria(req.params.id);
      res.json(result);
    } catch (error) {
      if (error.message === 'Categoria não encontrada') {
        return res.status(404).json({ message: error.message });
      }
      next(error);
    }
  }
}

module.exports = new CategoriaPecaController();