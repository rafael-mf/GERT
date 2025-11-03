const {
  Chamado,
  Cliente,
  Dispositivo,
  Tecnico,
  Prioridade,
  StatusChamado,
  Servico,
  ChamadoServico,
  Usuario,
  CategoriaDispositivo,
  Peca,
  ChamadoPeca,
  ChamadoAtualizacao,
  sequelize
} = require('../models');
const { Op } = require('sequelize');
const chamadoAtualizacaoService = require('./chamado-atualizacao.service');

class ChamadoService {
  async getAllChamados(queryParams) {
    const {
      statusId,
      prioridadeId,
      tecnicoId,
      clienteId,
      searchTerm,
      page = 1,
      limit = 10,
    } = queryParams;
    
    // Validar e sanitizar paginação
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10) || 10));
    const offset = (pageNum - 1) * limitNum;
    
    const where = {};

    // Validar e aplicar filtros apenas se tiverem valores válidos
    if (statusId && statusId !== 'undefined' && statusId !== 'null' && statusId !== '') {
      where.statusId = parseInt(statusId, 10);
    }
    if (prioridadeId && prioridadeId !== 'undefined' && prioridadeId !== 'null' && prioridadeId !== '') {
      where.prioridadeId = parseInt(prioridadeId, 10);
    }
    if (tecnicoId && tecnicoId !== 'undefined' && tecnicoId !== 'null' && tecnicoId !== '') {
      where.tecnicoId = parseInt(tecnicoId, 10);
    }
    if (clienteId && clienteId !== 'undefined' && clienteId !== 'null' && clienteId !== '') {
      where.clienteId = parseInt(clienteId, 10);
    }

    if (searchTerm && searchTerm !== 'undefined' && searchTerm !== 'null' && searchTerm.trim() !== '') {
      where[Op.or] = [
        { titulo: { [Op.like]: `%${searchTerm.trim()}%` } },
        { descricao: { [Op.like]: `%${searchTerm.trim()}%` } },
        { '$cliente.nome$': { [Op.like]: `%${searchTerm.trim()}%` } },
        { '$dispositivo.modelo$': { [Op.like]: `%${searchTerm.trim()}%` } },
        { '$dispositivo.marca$': { [Op.like]: `%${searchTerm.trim()}%` } },
      ];
    }

    const { count, rows } = await Chamado.findAndCountAll({
      where,
      include: [
        { model: Cliente, as: 'cliente', attributes: ['id', 'nome'] },
        { model: Dispositivo, as: 'dispositivo', attributes: ['id', 'marca', 'modelo'] },
        {
          model: Tecnico,
          as: 'tecnico',
          attributes: ['id', 'usuarioId'],
          include: [{ model: Usuario, as: 'usuario', attributes: ['id', 'nome'] }]
        },
        { model: Prioridade, as: 'prioridade', attributes: ['id', 'nome', 'cor'] },
        { model: StatusChamado, as: 'status', attributes: ['id', 'nome', 'cor'] },
      ],
      limit: limitNum,
      offset: offset,
      order: [['dataAbertura', 'DESC']],
    });
    return { totalItems: count,totalPages: Math.ceil(count / limitNum), currentPage: pageNum, chamados: rows };
  }

  async getChamadoById(id) {
    const chamado = await Chamado.findByPk(id, {
      include: [
        { model: Cliente, as: 'cliente' },
        { model: Dispositivo, as: 'dispositivo' },
        {
          model: Tecnico,
          as: 'tecnico',
          include: [{ model: Usuario, as: 'usuario', attributes: ['id', 'nome', 'email'] }]
        },
        { model: Prioridade, as: 'prioridade' },
        { model: StatusChamado, as: 'status', attributes: ['id', 'nome', 'cor'] },
        {
          model: ChamadoServico,
          as: 'servicos',
          include: [{ model: Servico, as: 'servico' }]
        },
        {
          model: ChamadoPeca,
          as: 'pecas',
          include: [{ model: Peca, as: 'peca', attributes: ['id', 'nome'] }]
        },
        {
          model: ChamadoAtualizacao,
          as: 'atualizacoes',
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
        },
      ],
    });
    if (!chamado) {
      throw new Error('Chamado não encontrado');
    }
    return chamado;
  }

  async createChamado(dadosChamado) {
    if (!dadosChamado.statusId) {
        const statusAberto = await StatusChamado.findOne({ where: { nome: 'Aberto' } });
        if (statusAberto) {
            dadosChamado.statusId = statusAberto.id;
        } else {
            throw new Error('Status "Aberto" padrão não encontrado. Verifique os dados iniciais do sistema.');
        }
    }

    const chamado = await Chamado.create(dadosChamado);

    // Registrar abertura no histórico se usuário foi informado
    if (dadosChamado.usuarioCriadorId) {
      let comentarioAbertura = 'Chamado aberto';
      
      // Incluir motivo se fornecido
      if (dadosChamado.motivo) {
        comentarioAbertura += ` - Motivo: ${dadosChamado.motivo}`;
      }
      
      await chamadoAtualizacaoService.registrarComentario(
        chamado.id,
        dadosChamado.usuarioCriadorId,
        comentarioAbertura
      );
    }

    return chamado;
  }

  async updateChamado(id, dadosChamado, usuarioId = null) {
    const chamado = await Chamado.findByPk(id);
    if (!chamado) {
      throw new Error('Chamado não encontrado');
    }

    // Capturar status anterior se estiver sendo alterado
    const statusAnterior = dadosChamado.statusId && dadosChamado.statusId !== chamado.statusId ? chamado.statusId : null;

    const { clienteId, dispositivoId, dataAbertura, ...updatableData } = dadosChamado;
    await chamado.update(updatableData);

    // Registrar mudança de status no histórico se houver mudança e usuário informado
    if (statusAnterior && usuarioId) {
      await chamadoAtualizacaoService.registrarAtualizacao(
        id,
        usuarioId,
        statusAnterior,
        dadosChamado.statusId,
        dadosChamado.comentario || null
      );
    }

    return await this.getChamadoById(id);
  }

  async deleteChamado(id) {
    console.log('🗑️ Iniciando exclusão do chamado ID:', id);

    // Excluir registros filhos primeiro para evitar erro de integridade referencial
    const transaction = await sequelize.transaction();

    try {
      // Buscar o chamado dentro da transação
      const chamado = await Chamado.findByPk(id, { transaction });
      if (!chamado) {
        console.log('❌ Chamado não encontrado:', id);
        throw new Error('Chamado não encontrado');
      }

      console.log('✅ Chamado encontrado:', chamado.id);

      // 1. Excluir atualizações do chamado
      const atualizacoesExcluidas = await ChamadoAtualizacao.destroy({
        where: { chamadoId: id },
        transaction
      });
      console.log(`✅ ${atualizacoesExcluidas} atualizações excluídas`);

      // 2. Excluir peças associadas ao chamado
      const pecasExcluidas = await ChamadoPeca.destroy({
        where: { chamadoId: id },
        transaction
      });
      console.log(`✅ ${pecasExcluidas} peças excluídas`);

      // 3. Excluir serviços associados ao chamado
      const servicosExcluidos = await ChamadoServico.destroy({
        where: { chamadoId: id },
        transaction
      });
      console.log(`✅ ${servicosExcluidos} serviços excluídos`);

      // 4. Finalmente, excluir o chamado
      console.log('🗑️ Excluindo chamado principal...');
      if (!chamado || typeof chamado.destroy !== 'function') {
        throw new Error('Objeto chamado inválido para exclusão');
      }

      await chamado.destroy({ transaction });
      console.log('✅ Chamado excluído com sucesso');

      await transaction.commit();
      console.log('🎉 Transação confirmada');
      return { message: 'Chamado excluído com sucesso' };

    } catch (error) {
      console.error('❌ Erro durante exclusão:', error.message);
      await transaction.rollback();
      console.log('🔄 Transação revertida');
      throw new Error(`Erro ao excluir chamado: ${error.message}`);
    }
  }

  // --- Métodos para entidades relacionadas ---
  async getClientes() {
    return await Cliente.findAll({ attributes: ['id', 'nome', 'cpfCnpj'] });
  }

  async getDispositivosPorCliente(clienteId) {
    return await Dispositivo.findAll({
      where: { clienteId },
      attributes: ['id', 'marca', 'modelo', 'numeroSerie']
    });
  }

  async getPrioridades() {
    return await Prioridade.findAll({ attributes: ['id', 'nome', 'cor'] });
  }

  async getStatusChamados() {
    return await StatusChamado.findAll({ attributes: ['id', 'nome', 'cor'] });
  }

  async getTecnicos() {
    return await Tecnico.findAll({
      include: [{ model: Usuario, as: 'usuario', attributes: ['id', 'nome'] }],
      attributes: ['id']
    });
  }

  async getServicos() {
    return await Servico.findAll({ where: { ativo: true }, attributes: ['id', 'nome', 'valorBase'] });
  }

  // 2. Método movido para dentro da classe
  async getCategoriasDispositivo() {
    return await CategoriaDispositivo.findAll({
      order: [['nome', 'ASC']]
    });
  }

  // === MÉTODOS PARA SERVIÇOS NOS CHAMADOS ===
  async addServicoAoChamado(chamadoId, dadosServico, usuarioId = null) {
    const chamado = await Chamado.findByPk(chamadoId);
    if (!chamado) throw new Error('Chamado não encontrado');

    const servico = await Servico.findByPk(dadosServico.servicoId);
    if (!servico) throw new Error('Serviço não encontrado');

    // Verificar se o serviço já foi adicionado ao chamado
    const servicoExistente = await ChamadoServico.findOne({
      where: { chamadoId, servicoId: dadosServico.servicoId }
    });

    if (servicoExistente) {
      throw new Error('Este serviço já foi adicionado ao chamado');
    }

    const chamadoServico = await ChamadoServico.create({
      chamadoId,
      servicoId: dadosServico.servicoId,
      valor: dadosServico.valor || servico.valorBase,
      observacoes: dadosServico.observacoes || null
    });

    await this.recalcularValorTotalChamado(chamadoId);

    // Registrar adição do serviço no histórico
    if (usuarioId) {
      await chamadoAtualizacaoService.registrarComentario(
        chamadoId,
        usuarioId,
        `Serviço adicionado: ${servico.nome} (R$ ${chamadoServico.valor})`
      );
    }

    return chamadoServico;
  }

  async removeServicoDoChamado(chamadoId, chamadoServicoId, usuarioId = null) {
    const chamado = await Chamado.findByPk(chamadoId);
    if (!chamado) throw new Error('Chamado não encontrado');

    // Verificar se o chamado está fechado
    const statusChamado = await StatusChamado.findByPk(chamado.statusId);
    if (statusChamado && ['Concluído', 'Fechado', 'Cancelado'].includes(statusChamado.nome)) {
      throw new Error('Não é possível remover serviços de chamados fechados');
    }

    const chamadoServico = await ChamadoServico.findOne({
      where: { id: chamadoServicoId, chamadoId },
      include: [{ model: Servico, as: 'servico' }]
    });

    if (!chamadoServico) {
      throw new Error('Serviço não encontrado neste chamado');
    }

    // Registrar remoção do serviço no histórico
    if (usuarioId) {
      await chamadoAtualizacaoService.registrarComentario(
        chamadoId,
        usuarioId,
        `Serviço removido: ${chamadoServico.servico.nome}/R$ ${chamadoServico.valor}`
      );
    }

    await chamadoServico.destroy();
    await this.recalcularValorTotalChamado(chamadoId);

    return { message: 'Serviço removido do chamado com sucesso' };
  }

  async updateServicoDoChamado(chamadoId, chamadoServicoId, dadosServico) {
    const chamado = await Chamado.findByPk(chamadoId);
    if (!chamado) throw new Error('Chamado não encontrado');

    const chamadoServico = await ChamadoServico.findOne({
      where: { id: chamadoServicoId, chamadoId }
    });

    if (!chamadoServico) {
      throw new Error('Serviço não encontrado neste chamado');
    }

    await chamadoServico.update(dadosServico);
    await this.recalcularValorTotalChamado(chamadoId);

    return chamadoServico;
  }

  async recalcularValorTotalChamado(chamadoId) {
    const chamado = await Chamado.findByPk(chamadoId, {
      include: [
        { model: ChamadoServico, as: 'servicos' },
        { model: ChamadoPeca, as: 'pecas' }
      ]
    });
    if (chamado) {
      let valorTotal = 0;
      
      // Somar valor dos serviços
      if (chamado.servicos) {
        valorTotal += chamado.servicos.reduce((sum, s) => sum + parseFloat(s.valor), 0);
      }
      
      // Somar valor das peças usadas
      if (chamado.pecas) {
        valorTotal += chamado.pecas.reduce((sum, p) => sum + (parseFloat(p.quantidade) * parseFloat(p.valorUnitario)), 0);
      }
      
      chamado.valorTotal = valorTotal;
      await chamado.save();
    }
  }

  // === MÉTODOS PARA PEÇAS USADAS ===
  async addPecaUsadaAoChamado(chamadoId, dadosPeca, usuarioId = null) {
    const chamado = await Chamado.findByPk(chamadoId);
    if (!chamado) throw new Error('Chamado não encontrado');

    let pecaUsada;

    if (!dadosPeca.pecaId) {
      pecaUsada = await ChamadoPeca.create({
        chamadoId,
        quantidade: dadosPeca.quantidade,
        valorUnitario: dadosPeca.valorUnitario,
        nome: dadosPeca.nome,
        descricao: dadosPeca.descricao,
        marca: dadosPeca.marca,
        modelo: dadosPeca.modelo,
        numeroSerie: dadosPeca.numeroSerie,
        dataUtilizacao: new Date()
      });
    } else {
      pecaUsada = await ChamadoPeca.create({
        chamadoId,
        pecaId: dadosPeca.pecaId,
        quantidade: dadosPeca.quantidade,
        valorUnitario: dadosPeca.valorUnitario
      });
    }

    await this.recalcularValorTotalChamado(chamadoId);

    // Registrar adição da peça no histórico
    if (usuarioId) {
      let comentarioPeca = `Peça adicionada: ${dadosPeca.quantidade} x R$ ${dadosPeca.valorUnitario}`;
      if (dadosPeca.nome) {
        comentarioPeca += ` - ${dadosPeca.nome}`;
      }

      await chamadoAtualizacaoService.registrarComentario(
        chamadoId,
        usuarioId,
        comentarioPeca
      );
    }

    return pecaUsada;
  }

  async removePecaUsadaDoChamado(pecaUsadaId, usuarioId = null) {
    const pecaUsada = await ChamadoPeca.findByPk(pecaUsadaId);
    if (!pecaUsada) throw new Error('Peça usada não encontrada');

    const chamadoId = pecaUsada.chamadoId;

    // Registrar remoção da peça no histórico antes de excluir
    if (usuarioId) {
      let comentarioRemocao = `Peça removida: Qtd ${pecaUsada.quantidade} x R$ ${pecaUsada.valorUnitario}`;
      
      await chamadoAtualizacaoService.registrarComentario(
        chamadoId,
        usuarioId,
        comentarioRemocao
      );
    }

    await pecaUsada.destroy();
    await this.recalcularValorTotalChamado(chamadoId);

    return { message: 'Peça removida do chamado com sucesso.' };
  }

  async updatePecaUsada(pecaUsadaId, dadosPeca) {
    const pecaUsada = await ChamadoPeca.findByPk(pecaUsadaId);
    if (!pecaUsada) throw new Error('Peça usada não encontrada');
    
    await pecaUsada.update(dadosPeca);
    const chamadoId = pecaUsada.chamadoId;
    await this.recalcularValorTotalChamado(chamadoId);
    
    return pecaUsada;
  }

  // === MÉTODO PARA FECHAR CHAMADO ===
  async fecharChamado(chamadoId, dadosFechamento) {
    const chamado = await Chamado.findByPk(chamadoId);
    if (!chamado) throw new Error('Chamado não encontrado');

    // Validações de fechamento
    if (!dadosFechamento.diagnostico || dadosFechamento.diagnostico.trim() === '') {
      throw new Error('Diagnóstico é obrigatório para fechar o chamado');
    }

    if (!dadosFechamento.solucao || dadosFechamento.solucao.trim() === '') {
      throw new Error('Solução é obrigatória para fechar o chamado');
    }

    const statusConcluido = await StatusChamado.findOne({ where: { nome: 'Concluído' } });
    if (!statusConcluido) throw new Error('Status "Concluído" não encontrado');

    // Atualizar chamado com dados de fechamento
    await chamado.update({
      statusId: statusConcluido.id,
      dataFechamento: new Date(),
      diagnostico: dadosFechamento.diagnostico,
      solucao: dadosFechamento.solucao,
      valorTotal: dadosFechamento.valorTotal || chamado.valorTotal
    });

    // Registrar fechamento no histórico com diagnóstico e solução
    if (dadosFechamento.usuarioId) {
      await chamadoAtualizacaoService.registrarComentario(
        chamadoId,
        dadosFechamento.usuarioId,
        `Chamado fechado - Diagnóstico: ${dadosFechamento.diagnostico} | Solução: ${dadosFechamento.solucao}`
      );
    }

    return await this.getChamadoById(chamadoId);
  }

  // === MÉTODO PARA REABRIR CHAMADO ===
  async reabrirChamado(chamadoId, usuarioId, comentario = null) {
    const chamado = await Chamado.findByPk(chamadoId);
    if (!chamado) throw new Error('Chamado não encontrado');

    // Verificar se o chamado está fechado
    const statusAtual = await StatusChamado.findByPk(chamado.statusId);
    if (!statusAtual || !['Concluído', 'Fechado', 'Cancelado'].includes(statusAtual.nome)) {
      throw new Error('Este chamado não está fechado');
    }

    // Verificar permissões: apenas técnico responsável ou admin pode reabrir
    const usuario = await Usuario.findByPk(usuarioId);
    if (!usuario) throw new Error('Usuário não encontrado');

    // Se não for admin, verificar se é o técnico responsável
    if (usuario.cargo !== 'Administrador') {
      if (chamado.tecnicoId !== usuarioId) {
        throw new Error('Apenas o técnico responsável ou um administrador pode reabrir este chamado');
      }
    }

    // Buscar status "Em Andamento" ou "Aberto"
    const statusReaberto = await StatusChamado.findOne({
      where: { nome: { [Op.in]: ['Em Andamento', 'Aberto'] } }
    });

    if (!statusReaberto) {
      throw new Error('Status para reabertura não encontrado');
    }

    // Reabrir chamado
    await chamado.update({
      statusId: statusReaberto.id,
      dataFechamento: null,
      diagnostico: null,
      solucao: null
    });

    // Registrar no histórico
    if (comentario) {
      await chamadoAtualizacaoService.registrarComentario(
        chamadoId,
        usuarioId,
        `Chamado reaberto: ${comentario}`
      );
    } else {
      await chamadoAtualizacaoService.registrarComentario(
        chamadoId,
        usuarioId,
        'Chamado reaberto'
      );
    }

    return await this.getChamadoById(chamadoId);
  }
}

module.exports = new ChamadoService();