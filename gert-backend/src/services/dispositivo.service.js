const { Dispositivo, Cliente, CategoriaDispositivo } = require('../models');
const { Op } = require('sequelize');

class DispositivoService {
  async getAllDispositivos(queryParams) {
    const { searchTerm, clienteId, page = 1, limit = 10 } = queryParams;
    
    // Validar paginação
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10) || 10));
    const offset = (pageNum - 1) * limitNum;
    
    const where = {};

    if (searchTerm && searchTerm !== 'undefined' && searchTerm !== 'null' && searchTerm.trim() !== '') {
      const termo = searchTerm.trim();
      where[Op.or] = [
        { marca: { [Op.like]: `%${termo}%` } },
        { modelo: { [Op.like]: `%${termo}%` } },
        { numeroSerie: { [Op.like]: `%${termo}%` } },
      ];
    }

    if (clienteId && clienteId !== 'undefined' && clienteId !== 'null' && clienteId !== '') {
      where.clienteId = parseInt(clienteId, 10);
    }

    const { count, rows } = await Dispositivo.findAndCountAll({
      where,
      limit: limitNum,
      offset: offset,
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
      totalPages: Math.ceil(count / limitNum),
      currentPage: pageNum,
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