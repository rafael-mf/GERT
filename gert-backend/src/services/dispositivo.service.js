const { Dispositivo, Cliente, CategoriaDispositivo } = require('../models');
const { Op } = require('sequelize');

class DispositivoService {
  async getAllDispositivos(queryParams) {
    const { searchTerm, clienteId, page = 1, limit = 10 } = queryParams;
    const offset = (page - 1) * limit;
    const where = {};

    if (searchTerm) {
      where[Op.or] = [
        { marca: { [Op.like]: `%${searchTerm}%` } },
        { modelo: { [Op.like]: `%${searchTerm}%` } },
        { numeroSerie: { [Op.like]: `%${searchTerm}%` } },
      ];
    }

    if (clienteId) {
      where.clienteId = clienteId;
    }

    const { count, rows } = await Dispositivo.findAndCountAll({
      where,
      limit: parseInt(limit, 10),
      offset: parseInt(offset, 10),
      order: [['dataCadastro', 'DESC']],
      include: [
        {
          model: Cliente,
          as: 'cliente',
          attributes: ['id', 'nome', 'email']
        },
        {
          model: CategoriaDispositivo,
          as: 'categoria',
          attributes: ['id', 'nome']
        }
      ]
    });

    return {
      totalItems: count,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page, 10),
      dispositivos: rows
    };
  }

  async getDispositivoById(id) {
    const dispositivo = await Dispositivo.findByPk(id, {
      include: [
        {
          model: Cliente,
          as: 'cliente',
          attributes: ['id', 'nome', 'email', 'telefone']
        },
        {
          model: CategoriaDispositivo,
          as: 'categoria',
          attributes: ['id', 'nome', 'descricao']
        }
      ]
    });

    if (!dispositivo) {
      throw new Error('Dispositivo não encontrado');
    }

    return dispositivo;
  }

  async createDispositivo(dispositivoData) {
    // Verificar se o cliente existe
    const cliente = await Cliente.findByPk(dispositivoData.clienteId);
    if (!cliente) {
      throw new Error('Cliente não encontrado');
    }

    // Verificar se a categoria existe
    const categoria = await CategoriaDispositivo.findByPk(dispositivoData.categoriaId);
    if (!categoria) {
      throw new Error('Categoria de dispositivo não encontrada');
    }

    return await Dispositivo.create(dispositivoData);
  }

  async updateDispositivo(id, dispositivoData) {
    const dispositivo = await Dispositivo.findByPk(id);
    if (!dispositivo) {
      throw new Error('Dispositivo não encontrado');
    }

    // Verificar se o cliente existe (se foi fornecido)
    if (dispositivoData.clienteId) {
      const cliente = await Cliente.findByPk(dispositivoData.clienteId);
      if (!cliente) {
        throw new Error('Cliente não encontrado');
      }
    }

    // Verificar se a categoria existe (se foi fornecida)
    if (dispositivoData.categoriaId) {
      const categoria = await CategoriaDispositivo.findByPk(dispositivoData.categoriaId);
      if (!categoria) {
        throw new Error('Categoria de dispositivo não encontrada');
      }
    }

    await dispositivo.update(dispositivoData);
    return dispositivo;
  }

  async deleteDispositivo(id) {
    const dispositivo = await Dispositivo.findByPk(id);
    if (!dispositivo) {
      throw new Error('Dispositivo não encontrado');
    }

    // Verificar se o dispositivo tem chamados vinculados
    const { Chamado } = require('../models');
    const chamadosCount = await Chamado.count({
      where: { dispositivoId: id }
    });

    if (chamadosCount > 0) {
      throw new Error('Não é possível excluir o dispositivo pois existem chamados vinculados a ele');
    }

    await dispositivo.destroy();
    return { message: 'Dispositivo excluído com sucesso' };
  }

  async getDispositivosByCliente(clienteId) {
    const cliente = await Cliente.findByPk(clienteId);
    if (!cliente) {
      throw new Error('Cliente não encontrado');
    }

    const dispositivos = await Dispositivo.findAll({
      where: { clienteId },
      include: [
        {
          model: CategoriaDispositivo,
          as: 'categoria',
          attributes: ['id', 'nome']
        }
      ],
      order: [['dataCadastro', 'DESC']]
    });

    return dispositivos;
  }
}

module.exports = new DispositivoService();