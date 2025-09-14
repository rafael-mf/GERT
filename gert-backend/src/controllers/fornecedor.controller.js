const fornecedorService = require('../services/fornecedor.service');

class FornecedorController {
  async getAllFornecedores(req, res, next) {
    try {
      const result = await fornecedorService.getAllFornecedores(req.query);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async getFornecedorById(req, res, next) {
    try {
      const fornecedor = await fornecedorService.getFornecedorById(req.params.id);
      res.json(fornecedor);
    } catch (error) {
      if (error.message === 'Fornecedor não encontrado') {
        return res.status(404).json({ message: error.message });
      }
      next(error);
    }
  }

  async createFornecedor(req, res, next) {
    try {
      const novoFornecedor = await fornecedorService.createFornecedor(req.body);
      res.status(201).json(novoFornecedor);
    } catch (error) {
      if (error.message.includes('já cadastrado')) {
        return res.status(400).json({ message: error.message });
      }
      next(error);
    }
  }

  async updateFornecedor(req, res, next) {
    try {
      const fornecedorAtualizado = await fornecedorService.updateFornecedor(req.params.id, req.body);
      res.json(fornecedorAtualizado);
    } catch (error) {
      if (error.message === 'Fornecedor não encontrado') {
        return res.status(404).json({ message: error.message });
      }
      if (error.message.includes('já cadastrado')) {
        return res.status(400).json({ message: error.message });
      }
      next(error);
    }
  }

  async deleteFornecedor(req, res, next) {
    try {
      const result = await fornecedorService.deleteFornecedor(req.params.id);
      res.json(result);
    } catch (error) {
      if (error.message === 'Fornecedor não encontrado') {
        return res.status(404).json({ message: error.message });
      }
      next(error);
    }
  }
}

module.exports = new FornecedorController();