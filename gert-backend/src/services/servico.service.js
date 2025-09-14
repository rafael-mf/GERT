const { Servico } = require('../models');

class ServicoService {
  async getAllServicos(query = {}) {
    const { page = 1, limit = 10, search = '' } = query;
    const offset = (page - 1) * limit;

    const where = {};
    if (search) {
      where.nome = { [require('sequelize').Op.iLike]: `%${search}%` };
    }

    const { count, rows } = await Servico.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['nome', 'ASC']]
    });

    return {
      servicos: rows,
      totalItems: count,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page)
    };
  }

  async getServicoById(id) {
    const servico = await Servico.findByPk(id);
    if (!servico) {
      throw new Error('Serviço não encontrado');
    }
    return servico;
  }

  async createServico(dadosServico) {
    // Verificar se já existe um serviço com o mesmo nome
    const servicoExistente = await Servico.findOne({
      where: { nome: dadosServico.nome }
    });

    if (servicoExistente) {
      throw new Error('Serviço com este nome já cadastrado');
    }

    return await Servico.create(dadosServico);
  }

  async updateServico(id, dadosServico) {
    const servico = await Servico.findByPk(id);
    if (!servico) {
      throw new Error('Serviço não encontrado');
    }

    // Verificar se o nome já existe em outro serviço
    if (dadosServico.nome) {
      const servicoExistente = await Servico.findOne({
        where: {
          nome: dadosServico.nome,
          id: { [require('sequelize').Op.ne]: id }
        }
      });

      if (servicoExistente) {
        throw new Error('Serviço com este nome já cadastrado');
      }
    }

    return await servico.update(dadosServico);
  }

  async deleteServico(id) {
    const servico = await Servico.findByPk(id);
    if (!servico) {
      throw new Error('Serviço não encontrado');
    }

    // Verificar se o serviço está sendo usado em chamados
    const { ChamadoServico, Chamado, StatusChamado } = require('../models');

    // Buscar chamados que usam este serviço e estão fechados
    const chamadosComServico = await ChamadoServico.findAll({
      where: { servicoId: id },
      include: [{
        model: Chamado,
        as: 'chamado',
        include: [{
          model: StatusChamado,
          as: 'status',
          where: { nome: { [require('sequelize').Op.in]: ['Concluído', 'Fechado', 'Cancelado'] } }
        }]
      }]
    });

    if (chamadosComServico.length > 0) {
      throw new Error('Não é possível excluir este serviço pois ele está sendo usado em chamados fechados');
    }

    await servico.destroy();
  }

  // Método para obter apenas serviços ativos (usado pelos chamados)
  async getServicosAtivos() {
    return await Servico.findAll({
      where: { ativo: true },
      attributes: ['id', 'nome', 'valorBase'],
      order: [['nome', 'ASC']]
    });
  }
}

module.exports = new ServicoService();