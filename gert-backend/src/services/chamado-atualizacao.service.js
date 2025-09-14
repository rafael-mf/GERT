// gert-backend/src/services/chamado-atualizacao.service.js
const { ChamadoAtualizacao, Usuario, StatusChamado } = require('../models');

class ChamadoAtualizacaoService {
  async getAtualizacoesByChamado(chamadoId) {
    const atualizacoes = await ChamadoAtualizacao.findAll({
      where: { chamadoId },
      include: [
        {
          model: Usuario,
          as: 'usuario',
          attributes: ['id', 'nome', 'email']
        },
        {
          model: StatusChamado,
          as: 'statusAnterior',
          attributes: ['id', 'nome', 'cor']
        },
        {
          model: StatusChamado,
          as: 'statusNovo',
          attributes: ['id', 'nome', 'cor']
        }
      ],
      order: [['dataAtualizacao', 'ASC']]
    });

    return atualizacoes;
  }

  async createAtualizacao(dadosAtualizacao) {
    const atualizacao = await ChamadoAtualizacao.create(dadosAtualizacao);
    return await this.getAtualizacaoById(atualizacao.id);
  }

  async getAtualizacaoById(id) {
    const atualizacao = await ChamadoAtualizacao.findByPk(id, {
      include: [
        {
          model: Usuario,
          as: 'usuario',
          attributes: ['id', 'nome', 'email']
        },
        {
          model: StatusChamado,
          as: 'statusAnterior',
          attributes: ['id', 'nome', 'cor']
        },
        {
          model: StatusChamado,
          as: 'statusNovo',
          attributes: ['id', 'nome', 'cor']
        }
      ]
    });

    if (!atualizacao) {
      throw new Error('Atualização não encontrada');
    }

    return atualizacao;
  }

  async registrarAtualizacao(chamadoId, usuarioId, statusAnterior, statusNovo, comentario = null) {
    const dadosAtualizacao = {
      chamadoId,
      usuarioId,
      statusAnteriorId: statusAnterior,
      statusNovoId: statusNovo,
      comentario,
      dataAtualizacao: new Date()
    };

    return await this.createAtualizacao(dadosAtualizacao);
  }

  async registrarComentario(chamadoId, usuarioId, comentario) {
    const dadosAtualizacao = {
      chamadoId,
      usuarioId,
      comentario,
      dataAtualizacao: new Date()
    };

    return await this.createAtualizacao(dadosAtualizacao);
  }
}

module.exports = new ChamadoAtualizacaoService();