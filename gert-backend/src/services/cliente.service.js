const { Cliente, Dispositivo } = require('../models');
const { Op } = require('sequelize');

class ClienteService {
  async getAllClientes(queryParams) {
    const { searchTerm, page = 1, limit = 10 } = queryParams;
    
    // Validar paginação
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10) || 10));
    const offset = (pageNum - 1) * limitNum;
    
    const where = {};

    if (searchTerm && searchTerm !== 'undefined' && searchTerm !== 'null' && searchTerm.trim() !== '') {
      const termo = searchTerm.trim();
      where[Op.or] = [
        { nome: { [Op.like]: `%${termo}%` } },
        { email: { [Op.like]: `%${termo}%` } },
        { cpfCnpj: { [Op.like]: `%${termo}%` } },
        { telefone: { [Op.like]: `%${termo}%` } },
      ];
    }

    const { count, rows } = await Cliente.findAndCountAll({
      where,
      limit: limitNum,
      offset: offset,
      order: [['nome', 'ASC']],
    });
    return { totalItems: count, totalPages: Math.ceil(count / limitNum), currentPage: pageNum, clientes: rows };
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
          as: 'status',
          attributes: ['id', 'nome', 'cor']
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