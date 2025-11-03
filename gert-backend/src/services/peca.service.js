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

    // Validar paginação
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10) || 10));
    const offset = (pageNum - 1) * limitNum;
    
    const where = {};

    if (categoriaId && categoriaId !== 'undefined' && categoriaId !== 'null' && categoriaId !== '') {
      where.categoriaId = parseInt(categoriaId, 10);
    }
    
    if (estoqueBaixo === 'true' || estoqueBaixo === true) {
      where[Op.and] = [
        { estoqueAtual: { [Op.lte]: sequelize.col('estoqueMinimo') } },
        { ativo: true }
      ];
    } else {
      where.ativo = true;
    }

    if (searchTerm && searchTerm !== 'undefined' && searchTerm !== 'null' && searchTerm.trim() !== '') {
      const termo = searchTerm.trim();
      where[Op.or] = [
        { nome: { [Op.like]: `%${termo}%` } },
        { codigo: { [Op.like]: `%${termo}%` } },
        { marca: { [Op.like]: `%${termo}%` } },
        { modelo: { [Op.like]: `%${termo}%` } },
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
      limit: limitNum,
      offset: offset,
      order: [['nome', 'ASC']],
      distinct: true,
    });

    return {
      totalItems: count,
      totalPages: Math.ceil(count / limitNum),
      currentPage: pageNum,
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