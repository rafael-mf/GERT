const { Servico } = require('../models');

class ServicoService {
  async getAllServicos(query = {}) {
    const { page = 1, limit = 10, search = '' } = query;
    
    // Validar paginação
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10) || 10));
    const offset = (pageNum - 1) * limitNum;

    const where = {};
    if (search && search !== 'undefined' && search !== 'null' && search.trim() !== '') {
      // Usar LIKE ao invés de iLike para MySQL
      where.nome = { [require('sequelize').Op.like]: `%${search.trim()}%` };
    }

    const { count, rows } = await Servico.findAndCountAll({
      where,
      limit: limitNum,
      offset: offset,
      order: [['nome', 'ASC']]
    });

    return {
      servicos: rows,
      totalItems: count,
      totalPages: Math.ceil(count / limitNum),
      currentPage: pageNum
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
          attributes: ['id', 'nome', 'cor'],
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