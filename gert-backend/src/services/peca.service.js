const { Peca, CategoriaPeca } = require('../models');
const { Op } = require('sequelize');

class PecaService {
  async getAllPecas(queryParams) {
    const {
      categoriaId,
      searchTerm,
      estoqueBaixo,
      page = 1,
      limit = 10,
    } = queryParams;

    const offset = (page - 1) * limit;
    const where = {};

    if (categoriaId) where.categoriaId = categoriaId;
    if (estoqueBaixo === 'true') {
      where[Op.and] = [
        { estoqueAtual: { [Op.lte]: sequelize.col('estoqueMinimo') } },
        { ativo: true }
      ];
    } else {
      where.ativo = true;
    }

    if (searchTerm) {
      where[Op.or] = [
        { nome: { [Op.like]: `%${searchTerm}%` } },
        { codigo: { [Op.like]: `%${searchTerm}%` } },
        { marca: { [Op.like]: `%${searchTerm}%` } },
        { modelo: { [Op.like]: `%${searchTerm}%` } },
      ];
    }

    const { count, rows } = await Peca.findAndCountAll({
      where,
      include: [
        {
          model: CategoriaPeca,
          as: 'categoria',
          attributes: ['id', 'nome']
        }
      ],
      limit: parseInt(limit, 10),
      offset: parseInt(offset, 10),
      order: [['nome', 'ASC']],
      distinct: true,
    });

    return {
      totalItems: count,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page, 10),
      pecas: rows
    };
  }

  async getPecaById(id) {
    const peca = await Peca.findByPk(id, {
      include: [
        {
          model: CategoriaPeca,
          as: 'categoria',
          attributes: ['id', 'nome']
        }
      ]
    });

    if (!peca) {
      throw new Error('Peça não encontrada');
    }

    return peca;
  }

  async createPeca(dadosPeca) {
    // Verificar se código já existe
    const pecaExistente = await Peca.findOne({
      where: { codigo: dadosPeca.codigo }
    });

    if (pecaExistente) {
      throw new Error('Código da peça já cadastrado');
    }

    // Verificar se categoria existe
    const categoria = await CategoriaPeca.findByPk(dadosPeca.categoriaId);
    if (!categoria) {
      throw new Error('Categoria não encontrada');
    }

    return await Peca.create({
      ...dadosPeca,
      dataCadastro: new Date(),
      ativo: true
    });
  }

  async updatePeca(id, dadosPeca) {
    const peca = await Peca.findByPk(id);
    if (!peca) {
      throw new Error('Peça não encontrada');
    }

    // Verificar código único se foi alterado
    if (dadosPeca.codigo && dadosPeca.codigo !== peca.codigo) {
      const pecaExistente = await Peca.findOne({
        where: { codigo: dadosPeca.codigo }
      });
      if (pecaExistente) {
        throw new Error('Código da peça já cadastrado para outra peça');
      }
    }

    // Verificar categoria se foi alterada
    if (dadosPeca.categoriaId) {
      const categoria = await CategoriaPeca.findByPk(dadosPeca.categoriaId);
      if (!categoria) {
        throw new Error('Categoria não encontrada');
      }
    }

    await peca.update(dadosPeca);
    return await this.getPecaById(id);
  }

  async deletePeca(id) {
    const peca = await Peca.findByPk(id);
    if (!peca) {
      throw new Error('Peça não encontrada');
    }

    // Verificar se a peça está sendo usada em chamados
    // Por enquanto, vamos permitir exclusão lógica
    await peca.update({ ativo: false });

    return { message: 'Peça excluída com sucesso' };
  }

  async getPecasPorCategoria(categoriaId) {
    return await Peca.findAll({
      where: { categoriaId, ativo: true },
      include: [
        {
          model: CategoriaPeca,
          as: 'categoria',
          attributes: ['id', 'nome']
        }
      ],
      order: [['nome', 'ASC']]
    });
  }

  async getPecasComEstoqueBaixo() {
    return await Peca.findAll({
      where: {
        [Op.and]: [
          { estoqueAtual: { [Op.lte]: sequelize.col('estoqueMinimo') } },
          { ativo: true }
        ]
      },
      include: [
        {
          model: CategoriaPeca,
          as: 'categoria',
          attributes: ['id', 'nome']
        }
      ],
      order: [['nome', 'ASC']]
    });
  }

  async atualizarEstoque(id, quantidade, tipo) {
    const peca = await Peca.findByPk(id);
    if (!peca) {
      throw new Error('Peça não encontrada');
    }

    let novoEstoque = peca.estoqueAtual;

    if (tipo === 'entrada') {
      novoEstoque += quantidade;
    } else if (tipo === 'saida') {
      if (novoEstoque < quantidade) {
        throw new Error('Estoque insuficiente');
      }
      novoEstoque -= quantidade;
    } else {
      throw new Error('Tipo de movimento inválido');
    }

    await peca.update({
      estoqueAtual: novoEstoque,
      ultimoInventario: new Date()
    });

    return await this.getPecaById(id);
  }
}

module.exports = new PecaService();