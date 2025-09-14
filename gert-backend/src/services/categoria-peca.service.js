const { CategoriaPeca } = require('../models');

class CategoriaPecaService {
  async getAllCategorias() {
    return await CategoriaPeca.findAll({
      where: { ativo: true },
      order: [['nome', 'ASC']]
    });
  }

  async getCategoriaById(id) {
    const categoria = await CategoriaPeca.findByPk(id);

    if (!categoria) {
      throw new Error('Categoria não encontrada');
    }

    return categoria;
  }

  async createCategoria(dadosCategoria) {
    // Verificar se nome já existe
    const categoriaExistente = await CategoriaPeca.findOne({
      where: { nome: dadosCategoria.nome }
    });

    if (categoriaExistente) {
      throw new Error('Categoria já cadastrada');
    }

    return await CategoriaPeca.create({
      ...dadosCategoria,
      ativo: true
    });
  }

  async updateCategoria(id, dadosCategoria) {
    const categoria = await CategoriaPeca.findByPk(id);
    if (!categoria) {
      throw new Error('Categoria não encontrada');
    }

    // Verificar nome único se foi alterado
    if (dadosCategoria.nome && dadosCategoria.nome !== categoria.nome) {
      const categoriaExistente = await CategoriaPeca.findOne({
        where: { nome: dadosCategoria.nome }
      });
      if (categoriaExistente) {
        throw new Error('Categoria já cadastrada com este nome');
      }
    }

    await categoria.update(dadosCategoria);
    return await this.getCategoriaById(id);
  }

  async deleteCategoria(id) {
    const categoria = await CategoriaPeca.findByPk(id);
    if (!categoria) {
      throw new Error('Categoria não encontrada');
    }

    // Verificar se há peças nesta categoria
    const { Peca } = require('../models');
    const pecasCount = await Peca.count({
      where: { categoriaId: id, ativo: true }
    });

    if (pecasCount > 0) {
      throw new Error('Não é possível excluir categoria com peças cadastradas');
    }

    await categoria.update({ ativo: false });
    return { message: 'Categoria excluída com sucesso' };
  }
}

module.exports = new CategoriaPecaService();