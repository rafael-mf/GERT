// File: gert-backend/src/services/chamado.service.js
const {
  Chamado,
  Cliente,
  Dispositivo,
  Tecnico,
  Prioridade,
  StatusChamado,
  Servico,
  ChamadoServico,
  Usuario, // For tecnico user details
} = require('../models'); // Assuming models are exported from an index.js in models folder
const { Op } = require('sequelize');

class ChamadoService {
  async getAllChamados(queryParams) {
    const {
      statusId,
      prioridadeId,
      tecnicoId,
      clienteId,
      searchTerm,
      page = 1,
      limit = 10,
    } = queryParams;
    const offset = (page - 1) * limit;
    const where = {};

    if (statusId) where.statusId = statusId;
    if (prioridadeId) where.prioridadeId = prioridadeId;
    if (tecnicoId) where.tecnicoId = tecnicoId;
    if (clienteId) where.clienteId = clienteId;

    if (searchTerm) {
      where[Op.or] = [
        { titulo: { [Op.like]: `%${searchTerm}%` } },
        { descricao: { [Op.like]: `%${searchTerm}%` } },
        { '$cliente.nome$': { [Op.like]: `%${searchTerm}%` } },
        { '$dispositivo.modelo$': { [Op.like]: `%${searchTerm}%` } },
        { '$dispositivo.marca$': { [Op.like]: `%${searchTerm}%` } },
      ];
    }

    const { count, rows } = await Chamado.findAndCountAll({
      where,
      include: [
        { model: Cliente, as: 'cliente', attributes: ['id', 'nome'] },
        { model: Dispositivo, as: 'dispositivo', attributes: ['id', 'marca', 'modelo'] },
        {
          model: Tecnico,
          as: 'tecnico',
          attributes: ['id', 'usuarioId'],
          include: [{ model: Usuario, as: 'usuario', attributes: ['id', 'nome'] }]
        },
        { model: Prioridade, as: 'prioridade', attributes: ['id', 'nome', 'cor'] },
        { model: StatusChamado, as: 'status', attributes: ['id', 'nome', 'cor'] },
      ],
      limit: parseInt(limit, 10),
      offset: parseInt(offset, 10),
      order: [['dataAbertura', 'DESC']],
    });
    return { totalItems: count,totalPages: Math.ceil(count / limit), currentPage: parseInt(page, 10), chamados: rows };
  }

  async getChamadoById(id) {
    const chamado = await Chamado.findByPk(id, {
      include: [
        { model: Cliente, as: 'cliente' },
        { model: Dispositivo, as: 'dispositivo' },
        {
          model: Tecnico,
          as: 'tecnico',
          include: [{ model: Usuario, as: 'usuario', attributes: ['id', 'nome', 'email'] }]
        },
        { model: Prioridade, as: 'prioridade' },
        { model: StatusChamado, as: 'status' },
        {
          model: ChamadoServico,
          as: 'servicos',
          include: [{ model: Servico, as: 'servico' }]
        },
        // Include ChamadoAtualizacao if model is created
      ],
    });
    if (!chamado) {
      throw new Error('Chamado não encontrado');
    }
    return chamado;
  }

  async createChamado(dadosChamado) {
    // Ensure statusId is set, e.g., to a default 'Aberto' status
    if (!dadosChamado.statusId) {
        const statusAberto = await StatusChamado.findOne({ where: { nome: 'Aberto' } });
        if (statusAberto) {
            dadosChamado.statusId = statusAberto.id;
        } else {
            // Fallback if 'Aberto' status is not found (should be seeded)
            throw new Error('Status "Aberto" padrão não encontrado. Verifique os dados iniciais do sistema.');
        }
    }
    return await Chamado.create(dadosChamado);
  }

  async updateChamado(id, dadosChamado) {
    const chamado = await Chamado.findByPk(id);
    if (!chamado) {
      throw new Error('Chamado não encontrado');
    }
    // Prevent changing dataAbertura, clienteId, dispositivoId after creation for simplicity
    const { clienteId, dispositivoId, dataAbertura, ...updatableData } = dadosChamado;
    await chamado.update(updatableData);
    return await this.getChamadoById(id); // Return updated chamado with includes
  }

  async deleteChamado(id) {
    const chamado = await Chamado.findByPk(id);
    if (!chamado) {
      throw new Error('Chamado não encontrado');
    }
    // Instead of deleting, consider changing status to 'Cancelado' or an 'ativo' flag
    // For now, we'll delete it.
    // await chamado.update({ statusId: ID_DO_STATUS_CANCELADO });
    await chamado.destroy();
    return { message: 'Chamado excluído com sucesso' };
  }

  // --- Métodos para entidades relacionadas (Cliente, Dispositivo, Tecnico, etc.) ---
  async getClientes() {
    return await Cliente.findAll({ attributes: ['id', 'nome', 'cpfCnpj'] });
  }

  async getDispositivosPorCliente(clienteId) {
    return await Dispositivo.findAll({
      where: { clienteId },
      attributes: ['id', 'marca', 'modelo', 'numeroSerie']
    });
  }

  async getPrioridades() {
    return await Prioridade.findAll({ attributes: ['id', 'nome', 'cor'] });
  }

  async getStatusChamados() {
    return await StatusChamado.findAll({ attributes: ['id', 'nome', 'cor'] });
  }

  async getTecnicos() {
    return await Tecnico.findAll({
      include: [{ model: Usuario, as: 'usuario', attributes: ['id', 'nome'] }],
      attributes: ['id']
    });
  }

  async getServicos() {
    return await Servico.findAll({ where: { ativo: true }, attributes: ['id', 'nome', 'valorBase'] });
  }

  async addServicoAoChamado(chamadoId, servicoId, valor, observacoes) {
    const chamado = await Chamado.findByPk(chamadoId);
    if (!chamado) throw new Error('Chamado não encontrado');
    const servico = await Servico.findByPk(servicoId);
    if (!servico) throw new Error('Serviço não encontrado');

    const valorServico = valor !== undefined ? valor : servico.valorBase;

    const chamadoServico = await ChamadoServico.create({
      chamadoId,
      servicoId,
      valor: valorServico,
      observacoes
    });
    // Recalcular valor total do chamado
    await this.recalcularValorTotalChamado(chamadoId);
    return chamadoServico;
  }

  async removeServicoDoChamado(chamadoServicoId) {
    const cs = await ChamadoServico.findByPk(chamadoServicoId);
    if (!cs) throw new Error('Serviço do chamado não encontrado');
    const chamadoId = cs.chamadoId;
    await cs.destroy();
    // Recalcular valor total do chamado
    await this.recalcularValorTotalChamado(chamadoId);
    return { message: 'Serviço removido do chamado com sucesso.' };
  }

  async recalcularValorTotalChamado(chamadoId) {
    const chamado = await Chamado.findByPk(chamadoId, {
      include: [{ model: ChamadoServico, as: 'servicos' }]
    });
    if (chamado) {
      let valorTotalServicos = 0;
      if (chamado.servicos) {
        valorTotalServicos = chamado.servicos.reduce((sum, s) => sum + parseFloat(s.valor), 0);
      }
      // Adicionar valor de peças se essa lógica for reintroduzida
      chamado.valorTotal = valorTotalServicos;
      await chamado.save();
    }
  }
}

module.exports = new ChamadoService();