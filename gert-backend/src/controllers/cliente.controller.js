// File: gert-backend/src/controllers/cliente.controller.js
const clienteService = require('../services/cliente.service');

class ClienteController {
  async getAllClientes(req, res, next) {
    try {
      const result = await clienteService.getAllClientes(req.query);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async getClienteById(req, res, next) {
    try {
      const cliente = await clienteService.getClienteById(req.params.id);
      res.json(cliente);
    } catch (error) {
      if (error.message === 'Cliente não encontrado') {
        return res.status(404).json({ message: error.message });
      }
      next(error);
    }
  }

  async createCliente(req, res, next) {
    try {
      const novoCliente = await clienteService.createCliente(req.body);
      res.status(201).json(novoCliente);
    } catch (error) {
       if (error.message.includes('já cadastrado')) {
        return res.status(400).json({ message: error.message });
      }
      next(error);
    }
  }

  async updateCliente(req, res, next) {
    try {
      const clienteAtualizado = await clienteService.updateCliente(req.params.id, req.body);
      res.json(clienteAtualizado);
    } catch (error) {
      if (error.message === 'Cliente não encontrado') {
        return res.status(404).json({ message: error.message });
      }
      if (error.message.includes('já cadastrado')) {
        return res.status(400).json({ message: error.message });
      }
      next(error);
    }
  }

  async deleteCliente(req, res, next) {
    try {
      const result = await clienteService.deleteCliente(req.params.id);
      res.json(result);
    } catch (error) {
      if (error.message === 'Cliente não encontrado') {
        return res.status(404).json({ message: error.message });
      }
      next(error);
    }
  }
}

module.exports = new ClienteController();