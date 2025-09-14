const { Cliente, Dispositivo } = require('../models');
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
      // Inclui os dispositivos associados, com suas categorias.
      // A associação 'hasMany' deve estar definida no modelo Cliente.
      include: [{
        model: Dispositivo,
        as: 'dispositivos',
        include: [{
            model: require('../models').CategoriaDispositivo, // Importação direta para garantir
            as: 'categoria'
        }]
      }, {
        model: require('../models').Chamado,
        as: 'chamados',
        include: [{
          model: require('../models').StatusChamado,
          as: 'status'
        }, {
          model: Dispositivo,
          as: 'dispositivo'
        }]
      }]
    });
    if (!cliente) {
      throw new Error('Cliente não encontrado');
    }
    return cliente;
  }

  async createCliente(dadosCliente) {
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
    await cliente.destroy();
    return { message: 'Cliente excluído com sucesso' };
  }

  // --- MÉTODO MOVIDO PARA DENTRO DA CLASSE ---
  async createDispositivoForCliente(clienteId, dispositivoData) {
    // Garante que o dispositivo seja associado ao cliente correto
    dispositivoData.clienteId = clienteId;
    const novoDispositivo = await Dispositivo.create(dispositivoData);
    return novoDispositivo;
  }
}

// --- EXPORTAÇÃO ÚNICA E CORRETA ---
module.exports = new ClienteService();