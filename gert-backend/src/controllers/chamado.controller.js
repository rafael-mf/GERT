// File: gert-backend/src/controllers/chamado.controller.js
const chamadoService = require('../services/chamado.service');

class ChamadoController {
  async getAllChamados(req, res, next) {
    try {
      const result = await chamadoService.getAllChamados(req.query);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async getChamadoById(req, res, next) {
    try {
      const chamado = await chamadoService.getChamadoById(req.params.id);
      res.json(chamado);
    } catch (error) {
      if (error.message === 'Chamado não encontrado') {
        return res.status(404).json({ message: error.message });
      }
      next(error);
    }
  }

  async createChamado(req, res, next) {
    try {
      const novoChamado = await chamadoService.createChamado(req.body);
      res.status(201).json(novoChamado);
    } catch (error) {
      next(error);
    }
  }

  async updateChamado(req, res, next) {
    try {
      const chamadoAtualizado = await chamadoService.updateChamado(req.params.id, req.body);
      res.json(chamadoAtualizado);
    } catch (error) {
      if (error.message === 'Chamado não encontrado') {
        return res.status(404).json({ message: error.message });
      }
      next(error);
    }
  }

  async deleteChamado(req, res, next) {
    try {
      const result = await chamadoService.deleteChamado(req.params.id);
      res.json(result);
    } catch (error) {
      if (error.message === 'Chamado não encontrado') {
        return res.status(404).json({ message: error.message });
      }
      next(error);
    }
  }

  // --- Controllers for related entities (for dropdowns, etc.) ---
  async getClientes(req, res, next) {
    try {
      const clientes = await chamadoService.getClientes();
      res.json(clientes);
    } catch (error) {
      next(error);
    }
  }

  async getDispositivosPorCliente(req, res, next) {
    try {
      const dispositivos = await chamadoService.getDispositivosPorCliente(req.params.clienteId);
      res.json(dispositivos);
    } catch (error) {
      next(error);
    }
  }

   async getPrioridades(req, res, next) {
    try {
      const prioridades = await chamadoService.getPrioridades();
      res.json(prioridades);
    } catch (error) {
      next(error);
    }
  }

  async getStatusChamados(req, res, next) {
    try {
      const status = await chamadoService.getStatusChamados();
      res.json(status);
    } catch (error) {
      next(error);
    }
  }

  async getTecnicos(req, res, next) {
    try {
      const tecnicos = await chamadoService.getTecnicos();
      res.json(tecnicos);
    } catch (error) {
      next(error);
    }
  }

  async getServicos(req, res, next) {
    try {
      const servicos = await chamadoService.getServicos();
      res.json(servicos);
    } catch (error) {
      next(error);
    }
  }

  async addServicoAoChamado(req, res, next) {
    try {
      const { servicoId, valor, observacoes } = req.body;
      const chamadoServico = await chamadoService.addServicoAoChamado(
        req.params.id,
        servicoId,
        valor,
        observacoes
      );
      res.status(201).json(chamadoServico);
    } catch (error) {
      if (error.message.includes('não encontrado')) {
        return res.status(404).json({ message: error.message });
      }
      next(error);
    }
  }

  async removeServicoDoChamado(req, res, next) {
    try {
      const result = await chamadoService.removeServicoDoChamado(req.params.chamadoServicoId);
      res.json(result);
    } catch (error) {
      if (error.message === 'Serviço do chamado não encontrado') {
        return res.status(404).json({ message: error.message });
      }
      next(error);
    }
  }
}

module.exports = new ChamadoController();