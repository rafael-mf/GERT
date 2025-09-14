const { Chamado, Cliente, Tecnico, Usuario, StatusChamado, Prioridade } = require('../models');
const { Op } = require('sequelize');

class RelatorioService {
  async getRelatorioChamados(filtros) {
    const {
      dataInicio,
      dataFinal,
      statusId,
      prioridadeId,
      tecnicoId,
      clienteId
    } = filtros;

    const where = {};

    // Filtros de data
    if (dataInicio && dataFinal) {
      where.dataAbertura = {
        [Op.between]: [new Date(dataInicio), new Date(dataFinal)]
      };
    }

    // Outros filtros
    if (statusId) where.statusId = statusId;
    if (prioridadeId) where.prioridadeId = prioridadeId;
    if (tecnicoId) where.tecnicoId = tecnicoId;
    if (clienteId) where.clienteId = clienteId;

    const chamados = await Chamado.findAll({
      where,
      include: [
        { model: Cliente, as: 'cliente', attributes: ['id', 'nome'] },
        { model: Tecnico, as: 'tecnico', include: [{ model: Usuario, as: 'usuario', attributes: ['nome'] }] },
        { model: StatusChamado, as: 'status', attributes: ['nome'] },
        { model: Prioridade, as: 'prioridade', attributes: ['nome'] }
      ],
      order: [['dataAbertura', 'DESC']]
    });

    // Calcular estatísticas
    const totalChamados = chamados.length;
    const chamadosAbertos = chamados.filter(c => c.statusId === 1).length; // Assumindo status 1 = Aberto
    const chamadosFechados = chamados.filter(c => c.statusId === 3).length; // Assumindo status 3 = Fechado
    const chamadosEmAndamento = chamados.filter(c => c.statusId === 2).length; // Assumindo status 2 = Em Andamento

    // Calcular tempo médio de atendimento
    const chamadosComTempo = chamados.filter(c => c.dataFechamento);
    let tempoMedioAtendimento = '0h';
    if (chamadosComTempo.length > 0) {
      const tempoTotalHoras = chamadosComTempo.reduce((total, chamado) => {
        const inicio = new Date(chamado.dataAbertura);
        const fim = new Date(chamado.dataFechamento);
        const horas = (fim - inicio) / (1000 * 60 * 60);
        return total + horas;
      }, 0);
      const mediaHoras = tempoTotalHoras / chamadosComTempo.length;
      tempoMedioAtendimento = `${mediaHoras.toFixed(1)}h`;
    }

    // Chamados por prioridade
    const chamadosPorPrioridade = chamados.reduce((acc, chamado) => {
      const prioridade = chamado.prioridade?.nome || 'Não definida';
      acc[prioridade] = (acc[prioridade] || 0) + 1;
      return acc;
    }, {});

    // Chamados por técnico
    const chamadosPorTecnico = chamados.reduce((acc, chamado) => {
      const tecnico = chamado.tecnico?.usuario?.nome || 'Não atribuído';
      acc[tecnico] = (acc[tecnico] || 0) + 1;
      return acc;
    }, {});

    return {
      periodo: {
        dataInicio,
        dataFinal
      },
      estatisticas: {
        totalChamados,
        chamadosAbertos,
        chamadosFechados,
        chamadosEmAndamento,
        tempoMedioAtendimento
      },
      chamadosPorPrioridade,
      chamadosPorTecnico,
      chamados: chamados.map(chamado => ({
        id: chamado.id,
        titulo: chamado.titulo,
        cliente: chamado.cliente?.nome,
        tecnico: chamado.tecnico?.usuario?.nome,
        status: chamado.status?.nome,
        prioridade: chamado.prioridade?.nome,
        dataAbertura: chamado.dataAbertura,
        dataFechamento: chamado.dataFechamento,
        valorTotal: chamado.valorTotal
      }))
    };
  }

  async getRelatorioFinanceiro(filtros) {
    const {
      dataInicio,
      dataFinal,
      tecnicoId
    } = filtros;

    const where = {
      valorTotal: { [Op.not]: null }
    };

    // Filtros de data
    if (dataInicio && dataFinal) {
      where.dataAbertura = {
        [Op.between]: [new Date(dataInicio), new Date(dataFinal)]
      };
    }

    if (tecnicoId) where.tecnicoId = tecnicoId;

    const chamados = await Chamado.findAll({
      where,
      include: [
        { model: Cliente, as: 'cliente', attributes: ['id', 'nome'] },
        { model: Tecnico, as: 'tecnico', include: [{ model: Usuario, as: 'usuario', attributes: ['nome'] }] }
      ],
      order: [['dataAbertura', 'DESC']]
    });

    const totalReceita = chamados.reduce((sum, chamado) => sum + parseFloat(chamado.valorTotal || 0), 0);
    const mediaPorChamado = chamados.length > 0 ? totalReceita / chamados.length : 0;

    // Receita por técnico
    const receitaPorTecnico = chamados.reduce((acc, chamado) => {
      const tecnico = chamado.tecnico?.usuario?.nome || 'Não atribuído';
      acc[tecnico] = (acc[tecnico] || 0) + parseFloat(chamado.valorTotal || 0);
      return acc;
    }, {});

    return {
      periodo: {
        dataInicio,
        dataFinal
      },
      estatisticas: {
        totalReceita: totalReceita.toFixed(2),
        mediaPorChamado: mediaPorChamado.toFixed(2),
        totalChamadosComValor: chamados.length
      },
      receitaPorTecnico,
      chamados: chamados.map(chamado => ({
        id: chamado.id,
        titulo: chamado.titulo,
        cliente: chamado.cliente?.nome,
        tecnico: chamado.tecnico?.usuario?.nome,
        valorTotal: chamado.valorTotal,
        dataAbertura: chamado.dataAbertura
      }))
    };
  }

  async getDashboardStats() {
    // Total de chamados
    const totalChamados = await Chamado.count();

    // Chamados por status
    const chamadosPorStatus = await Chamado.findAll({
      attributes: [
        'statusId',
        [StatusChamado.sequelize.fn('COUNT', StatusChamado.sequelize.col('Chamado.id')), 'count']
      ],
      include: [{ model: StatusChamado, as: 'status', attributes: ['nome'] }],
      group: ['statusId', 'status.id', 'status.nome']
    });

    // Receita total
    const resultado = await Chamado.findAll({
      attributes: [
        [Chamado.sequelize.fn('SUM', Chamado.sequelize.col('valorTotal')), 'totalReceita']
      ],
      where: {
        valorTotal: { [Op.not]: null }
      }
    });

    const totalReceita = resultado[0]?.dataValues?.totalReceita || 0;

    // Chamados do mês atual
    const inicioMes = new Date();
    inicioMes.setDate(1);
    inicioMes.setHours(0, 0, 0, 0);

    const chamadosMes = await Chamado.count({
      where: {
        dataAbertura: {
          [Op.gte]: inicioMes
        }
      }
    });

    return {
      totalChamados,
      totalReceita: parseFloat(totalReceita).toFixed(2),
      chamadosMes,
      chamadosPorStatus: chamadosPorStatus.map(item => ({
        status: item.status?.nome,
        count: parseInt(item.dataValues.count)
      }))
    };
  }

  async getRelatorioTecnicos(filtros) {
    const {
      dataInicio,
      dataFinal
    } = filtros;

    const where = {};

    // Filtros de data
    if (dataInicio && dataFinal) {
      where.dataAbertura = {
        [Op.between]: [new Date(dataInicio), new Date(dataFinal)]
      };
    }

    // Buscar todos os técnicos
    const tecnicos = await Tecnico.findAll({
      include: [{ 
        model: Usuario, 
        as: 'usuario', 
        attributes: ['nome'] 
      }]
    });

    // Buscar chamados no período
    const chamados = await Chamado.findAll({
      where,
      include: [
        { model: Tecnico, as: 'tecnico', include: [{ model: Usuario, as: 'usuario', attributes: ['nome'] }] },
        { model: StatusChamado, as: 'status', attributes: ['id', 'nome'] }
      ]
    });

    const relatorioTecnicos = await Promise.all(
      tecnicos.map(async (tecnico) => {
        // Chamados do técnico no período
        const chamadosTecnico = chamados.filter(c => c.tecnicoId === tecnico.id);
        const totalChamados = chamadosTecnico.length;
        
        // Chamados por status
        const chamadosConcluidos = chamadosTecnico.filter(c => c.status?.nome === 'Fechado' || c.status?.nome === 'Concluído').length;
        const chamadosAndamento = chamadosTecnico.filter(c => c.status?.nome === 'Em Andamento' || c.status?.nome === 'Em andamento').length;
        const chamadosAtrasados = chamadosTecnico.filter(c => {
          // Considera em atraso se está em andamento há mais de 3 dias
          if (c.status?.nome === 'Em Andamento' || c.status?.nome === 'Em andamento') {
            const diasEmAndamento = (new Date() - new Date(c.dataAbertura)) / (1000 * 60 * 60 * 24);
            return diasEmAndamento > 3;
          }
          return false;
        }).length;

        // Calcular tempo médio de atendimento (apenas chamados fechados)
        const chamadosFechados = chamadosTecnico.filter(c => 
          (c.status?.nome === 'Fechado' || c.status?.nome === 'Concluído') && c.dataFechamento
        );
        
        let tempoMedioHoras = 0;
        if (chamadosFechados.length > 0) {
          const tempoTotalHoras = chamadosFechados.reduce((total, chamado) => {
            const inicio = new Date(chamado.dataAbertura);
            const fim = new Date(chamado.dataFechamento);
            const horas = (fim - inicio) / (1000 * 60 * 60);
            return total + horas;
          }, 0);
          tempoMedioHoras = tempoTotalHoras / chamadosFechados.length;
        }

        // Calcular "rating" baseado na eficiência (% de chamados fechados no prazo)
        const chamadosNoPrazo = chamadosFechados.filter(c => {
          const inicio = new Date(c.dataAbertura);
          const fim = new Date(c.dataFechamento);
          const horas = (fim - inicio) / (1000 * 60 * 60);
          return horas <= 72; // Considera prazo de 72h (3 dias)
        }).length;

        const percentualNoPrazo = chamadosFechados.length > 0 ? 
          (chamadosNoPrazo / chamadosFechados.length) * 100 : 0;

        // Rating de 1 a 5 baseado no percentual de chamados no prazo
        let avaliacaoMedia = 1;
        if (percentualNoPrazo >= 90) avaliacaoMedia = 5;
        else if (percentualNoPrazo >= 75) avaliacaoMedia = 4;
        else if (percentualNoPrazo >= 60) avaliacaoMedia = 3;
        else if (percentualNoPrazo >= 40) avaliacaoMedia = 2;

        return {
          id: tecnico.id,
          nome: tecnico.usuario?.nome,
          totalChamados,
          chamadosConcluidos,
          chamadosAndamento,
          chamadosAtrasados,
          tempoMedioAtendimento: `${tempoMedioHoras.toFixed(1)}h`,
          avaliacaoMedia: parseFloat(avaliacaoMedia.toFixed(1)),
          percentualNoPrazo: parseFloat(percentualNoPrazo.toFixed(1))
        };
      })
    );

    // Estatísticas gerais
    const totalAtendimentos = chamados.length;
    const mediaAtendimentoPorTecnico = tecnicos.length > 0 ? 
      Math.round(totalAtendimentos / tecnicos.length) : 0;

    return {
      periodo: {
        dataInicio,
        dataFinal
      },
      estatisticas: {
        totalTecnicos: tecnicos.length,
        mediaAtendimentoPorTecnico,
        totalAtendimentos
      },
      tecnicos: relatorioTecnicos.filter(t => t.totalChamados > 0) // Só técnicos com chamados no período
    };
  }
}

module.exports = new RelatorioService();