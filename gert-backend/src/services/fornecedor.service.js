const { Fornecedor } = require('../models');
const { Op } = require('sequelize');

class FornecedorService {
  async getAllFornecedores(queryParams) {
    const {
      searchTerm,
      page = 1,
      limit = 10,
    } = queryParams;

    const offset = (page - 1) * limit;
    const where = { ativo: true };

    if (searchTerm) {
      where[Op.or] = [
        { nome: { [Op.like]: `%${searchTerm}%` } },
        { cnpj: { [Op.like]: `%${searchTerm}%` } },
        { email: { [Op.like]: `%${searchTerm}%` } },
        { contato: { [Op.like]: `%${searchTerm}%` } },
      ];
    }

    const { count, rows } = await Fornecedor.findAndCountAll({
      where,
      limit: parseInt(limit, 10),
      offset: parseInt(offset, 10),
      order: [['nome', 'ASC']],
      distinct: true,
    });

    return {
      totalItems: count,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page, 10),
      fornecedores: rows
    };
  }

  async getFornecedorById(id) {
    const fornecedor = await Fornecedor.findByPk(id);

    if (!fornecedor) {
      throw new Error('Fornecedor não encontrado');
    }

    return fornecedor;
  }

  async createFornecedor(dadosFornecedor) {
    // Verificar se CNPJ já existe (se fornecido)
    if (dadosFornecedor.cnpj) {
      const fornecedorExistente = await Fornecedor.findOne({
        where: { cnpj: dadosFornecedor.cnpj }
      });

      if (fornecedorExistente) {
        throw new Error('CNPJ já cadastrado');
      }
    }

    return await Fornecedor.create({
      ...dadosFornecedor,
      dataCadastro: new Date(),
      ativo: true
    });
  }

  async updateFornecedor(id, dadosFornecedor) {
    const fornecedor = await Fornecedor.findByPk(id);
    if (!fornecedor) {
      throw new Error('Fornecedor não encontrado');
    }

    // Verificar CNPJ único se foi alterado
    if (dadosFornecedor.cnpj && dadosFornecedor.cnpj !== fornecedor.cnpj) {
      const fornecedorExistente = await Fornecedor.findOne({
        where: { cnpj: dadosFornecedor.cnpj }
      });
      if (fornecedorExistente) {
        throw new Error('CNPJ já cadastrado para outro fornecedor');
      }
    }

    await fornecedor.update(dadosFornecedor);
    return await this.getFornecedorById(id);
  }

  async deleteFornecedor(id) {
    const fornecedor = await Fornecedor.findByPk(id);
    if (!fornecedor) {
      throw new Error('Fornecedor não encontrado');
    }

    // Verificar se o fornecedor está sendo usado em peças
    const { Peca } = require('../models');
    const pecasCount = await Peca.count({
      where: { fornecedorId: id, ativo: true }
    });

    if (pecasCount > 0) {
      throw new Error('Não é possível excluir fornecedor com peças cadastradas');
    }

    await fornecedor.update({ ativo: false });
    return { message: 'Fornecedor excluído com sucesso' };
  }
}

module.exports = new FornecedorService();