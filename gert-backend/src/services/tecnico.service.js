// File: gert-backend/src/services/tecnico.service.js
const { Tecnico, Usuario } = require('../models');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');

class TecnicoService {
  async getAllTecnicos(queryParams) {
    const { searchTerm, page = 1, limit = 10, disponivel } = queryParams;
    const offset = (page - 1) * limit;
    const whereTecnico = {};
    const whereUsuario = {};

    if (disponivel !== undefined) {
        whereTecnico.disponivel = disponivel === 'true' || disponivel === true;
    }

    if (searchTerm) {
      whereUsuario[Op.or] = [
        { nome: { [Op.like]: `%${searchTerm}%` } },
        { email: { [Op.like]: `%${searchTerm}%` } },
      ];
      // Também poderia buscar por especialidade do técnico
      whereTecnico.especialidade = { [Op.like]: `%${searchTerm}%` };
    }

    const includeOptions = [{
        model: Usuario,
        as: 'usuario',
        attributes: ['id', 'nome', 'email', 'ativo', 'cargo'],
        where: Object.keys(whereUsuario).length ? whereUsuario : undefined,
    }];


    const { count, rows } = await Tecnico.findAndCountAll({
      where: Object.keys(whereTecnico).length ? whereTecnico : undefined,
      include: includeOptions,
      limit: parseInt(limit, 10),
      offset: parseInt(offset, 10),
      order: [[{ model: Usuario, as: 'usuario' }, 'nome', 'ASC']],
      distinct: true, // Necessário por causa do include com where
    });
    return { totalItems: count, totalPages: Math.ceil(count / limit), currentPage: parseInt(page, 10), tecnicos: rows };
  }

  async getTecnicoById(id) {
    const tecnico = await Tecnico.findByPk(id, {
      include: [{ model: Usuario, as: 'usuario', attributes: { exclude: ['senha'] } }]
    });
    if (!tecnico) {
      throw new Error('Técnico não encontrado');
    }
    return tecnico;
  }

  async createTecnico(dadosTecnico) {
    const { nome, email, senha, cargo = 'Técnico', ativo = true, especialidade, disponivel = true } = dadosTecnico;

    if (!nome || !email || !senha) {
        throw new Error('Nome, email e senha são obrigatórios para criar o usuário do técnico.');
    }
    // O hook no modelo Usuario cuidará do hash da senha
    const novoUsuario = await Usuario.create({ nome, email, senha, cargo, ativo });

    const novoTecnico = await Tecnico.create({
      usuarioId: novoUsuario.id,
      especialidade,
      disponivel
    });

    return await this.getTecnicoById(novoTecnico.id);
  }

  async updateTecnico(id, dadosTecnico) {
    const tecnico = await Tecnico.findByPk(id, { include: [{ model: Usuario, as: 'usuario' }] });
    if (!tecnico) {
      throw new Error('Técnico não encontrado');
    }

    const { nome, email, senha, ativo, especialidade, disponivel } = dadosTecnico;

    // Atualizar dados do Usuario
    if (tecnico.usuario) {
        if (nome) tecnico.usuario.nome = nome;
        if (email) tecnico.usuario.email = email; // Adicionar validação de unicidade se necessário
        if (senha) tecnico.usuario.senha = await bcrypt.hash(senha, 10); // Hash manual ou deixar o hook fazer
        if (ativo !== undefined) tecnico.usuario.ativo = ativo;
        await tecnico.usuario.save(); // Se a senha for alterada aqui, o hook do modelo Usuario deve re-hashear
    }

    // Atualizar dados do Tecnico
    if (especialidade) tecnico.especialidade = especialidade;
    if (disponivel !== undefined) tecnico.disponivel = disponivel;
    await tecnico.save();

    return await this.getTecnicoById(id);
  }

  async deleteTecnico(id) {
    const tecnico = await Tecnico.findByPk(id);
    if (!tecnico) {
      throw new Error('Técnico não encontrado');
    }
    // Considerar o que acontece com os chamados atribuídos a este técnico
    // Por agora, vamos deletar. Pode ser melhor apenas desativar o usuário associado.
    const usuario = await Usuario.findByPk(tecnico.usuarioId);
    await tecnico.destroy();
    if (usuario) {
        await usuario.destroy(); // Ou apenas usuario.update({ ativo: false });
    }
    return { message: 'Técnico e usuário associado excluídos com sucesso' };
  }
}

module.exports = new TecnicoService();