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
      const dadosChamado = {
        ...req.body,
        usuarioCriadorId: req.usuario?.id
      };
      const novoChamado = await chamadoService.createChamado(dadosChamado);
      res.status(201).json(novoChamado);
    } catch (error) {
      next(error);
    }
  }

  async updateChamado(req, res, next) {
    try {
      const usuarioId = req.user?.id; // ID do usuário autenticado
      const chamadoAtualizado = await chamadoService.updateChamado(req.params.id, req.body, usuarioId);
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

  // --- CORREÇÃO AQUI: movido para dentro da classe ---
  async getCategoriasDispositivo(req, res, next) {
    try {
      const categorias = await chamadoService.getCategoriasDispositivo();
      res.json(categorias);
    } catch (error) {
      next(error);
    }
  }

  async addServicoAoChamado(req, res, next) {
    try {
      const { servicoId, valor, observacoes } = req.body;
      const dadosServico = { servicoId, valor, observacoes };
      const chamadoServico = await chamadoService.addServicoAoChamado(
        req.params.id,
        dadosServico,
        req.usuario?.id
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
      const result = await chamadoService.removeServicoDoChamado(
        req.params.id, // chamadoId
        req.params.chamadoServicoId,
        req.usuario?.id
      );
      res.json(result);
    } catch (error) {
      if (error.message === 'Serviço do chamado não encontrado') {
        return res.status(404).json({ message: error.message });
      }
      next(error);
    }
  }

  // === MÉTODOS PARA PEÇAS USADAS ===
  async addPecaUsada(req, res, next) {
    try {
      const { chamadoId } = req.params;
      const pecaUsada = await chamadoService.addPecaUsadaAoChamado(
        chamadoId, 
        req.body,
        req.usuario?.id
      );
      res.status(201).json(pecaUsada);
    } catch (error) {
      next(error);
    }
  }

  async updatePecaUsada(req, res, next) {
    try {
      const { pecaUsadaId } = req.params;
      const pecaUsada = await chamadoService.updatePecaUsada(pecaUsadaId, req.body);
      res.json(pecaUsada);
    } catch (error) {
      if (error.message === 'Peça usada não encontrada') {
        return res.status(404).json({ message: error.message });
      }
      next(error);
    }
  }

  async removePecaUsada(req, res, next) {
    try {
      const result = await chamadoService.removePecaUsadaDoChamado(
        req.params.pecaUsadaId,
        req.usuario?.id
      );
      res.json(result);
    } catch (error) {
      if (error.message === 'Peça usada não encontrada') {
        return res.status(404).json({ message: error.message });
      }
      next(error);
    }
  }

  // === MÉTODO PARA FECHAR CHAMADO ===
  async fecharChamado(req, res, next) {
    try {
      const { id } = req.params;
      const dadosFechamento = {
        ...req.body,
        usuarioId: req.usuario?.id
      };
      const chamado = await chamadoService.fecharChamado(id, dadosFechamento);
      res.json(chamado);
    } catch (error) {
      if (error.message === 'Chamado não encontrado') {
        return res.status(404).json({ message: error.message });
      }
      next(error);
    }
  }
}

module.exports = new ChamadoController();