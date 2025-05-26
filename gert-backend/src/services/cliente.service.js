// File: gert-backend/src/services/cliente.service.js
const { Cliente, Dispositivo } = require('../models'); // Assumindo que models/index.js exporta tudo
const { Op } = require('sequelize');

class ClienteService {
  async getAllClientes(queryParams) {
    const { searchTerm, page = 1, limit = 10 } = queryParams;
    const offset = (page - 1) * limit;
    const where = {};

    if (searchTerm) {
      where[Op.or] = [
        { nome: { [Op.like]: `%${searchTerm}%` } },
        { email: { [Op.like]: `%${searchTerm}%` } },
        { cpfCnpj: { [Op.like]: `%${searchTerm}%` } },
        { telefone: { [Op.like]: `%${searchTerm}%` } },
      ];
    }

    const { count, rows } = await Cliente.findAndCountAll({
      where,
      limit: parseInt(limit, 10),
      offset: parseInt(offset, 10),
      order: [['nome', 'ASC']],
    });
    return { totalItems: count, totalPages: Math.ceil(count / limit), currentPage: parseInt(page, 10), clientes: rows };
  }

  async getClienteById(id) {
    const cliente = await Cliente.findByPk(id, {
      include: [{ model: Dispositivo, as: 'dispositivos' }] // Se definida a associação no modelo Cliente
    });
    if (!cliente) {
      throw new Error('Cliente não encontrado');
    }
    return cliente;
  }

  async createCliente(dadosCliente) {
    // Validações adicionais podem ser inseridas aqui
    if (dadosCliente.cpfCnpj) {
        const existingCliente = await Cliente.findOne({ where: { cpfCnpj: dadosCliente.cpfCnpj } });
        if (existingCliente) {
            throw new Error('CPF/CNPJ já cadastrado.');
        }
    }
    return await Cliente.create(dadosCliente);
  }

  async updateCliente(id, dadosCliente) {
    const cliente = await Cliente.findByPk(id);
    if (!cliente) {
      throw new Error('Cliente não encontrado');
    }
    if (dadosCliente.cpfCnpj && dadosCliente.cpfCnpj !== cliente.cpfCnpj) {
        const existingCliente = await Cliente.findOne({ where: { cpfCnpj: dadosCliente.cpfCnpj } });
        if (existingCliente) {
            throw new Error('CPF/CNPJ já cadastrado para outro cliente.');
        }
    }
    await cliente.update(dadosCliente);
    return cliente;
  }

  async deleteCliente(id) {
    const cliente = await Cliente.findByPk(id);
    if (!cliente) {
      throw new Error('Cliente não encontrado');
    }
    // Adicionar verificação se o cliente possui chamados ou dispositivos antes de excluir
    // Por enquanto, vamos deletar diretamente.
    await cliente.destroy();
    return { message: 'Cliente excluído com sucesso' };
  }
}

module.exports = new ClienteService();