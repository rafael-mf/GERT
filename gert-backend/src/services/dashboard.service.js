// gert-backend/src/services/dashboard.service.js
const { Chamado, Cliente, Usuario, StatusChamado, Dispositivo, Prioridade, Tecnico, sequelize } = require('../models');
const { Op } = require('sequelize');
const moment = require('moment'); // Certifique-se de ter o moment instalado: npm install moment

class DashboardService {
  async getStats(filters = {}) {
    const { startDate, endDate } = filters;
    const whereClause = {};

    if (startDate && endDate) {
      whereClause.dataAbertura = {
        [Op.gte]: new Date(startDate),
        [Op.lte]: new Date(endDate)
      };
    }

    const statusConcluido = await StatusChamado.findOne({ where: { nome: 'Concluído' }, attributes: ['id'] });
    const statusAberto = await StatusChamado.findOne({ where: { nome: 'Aberto' }, attributes: ['id'] });
    const statusEmAndamento = await StatusChamado.findOne({ where: { nome: 'Em andamento' }, attributes: ['id'] });

    // --- CORREÇÃO AQUI ---
    // Gráfico de Barras: Faturamento nos últimos 6 meses ou no período filtrado
    const faturamentoMensal = await Chamado.findAll({
        attributes: [
            // Usando os nomes de coluna reais do banco de dados (snake_case)
            [sequelize.fn('YEAR', sequelize.col('data_conclusao')), 'ano'],
            [sequelize.fn('MONTH', sequelize.col('data_conclusao')), 'mes'],
            [sequelize.fn('SUM', sequelize.col('valor_final')), 'total']
        ],
        where: {
            statusId: statusConcluido?.id || 0,
            data_conclusao: { // Usando o nome da coluna aqui também por segurança
                [Op.gte]: startDate ? new Date(startDate) : moment().subtract(6, 'months').toDate()
            }
        },
        // Agrupando pelos aliases que criamos em attributes
        group: ['ano', 'mes'],
        order: [
            ['ano', 'ASC'],
            ['mes', 'ASC']
        ],
        raw: true
    }).then(results => {
        const monthNames = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
        return results.map(item => ({
            name: `${monthNames[item.mes - 1]}/${item.ano.toString().substring(2)}`,
            value: parseFloat(item.total)
        }));
    });


    // Gráfico de Pizza: Chamados por Status (com filtro de data)
    const chamadosPorStatus = await Chamado.findAll({
      attributes: [
        [sequelize.col('status.nome'), 'name'],
        [sequelize.fn('COUNT', sequelize.col('Chamado.id')), 'value']
      ],
      where: whereClause,
      include: [{
        model: StatusChamado,
        as: 'status',
        attributes: []
      }],
      group: ['status.id', 'status.nome'],
      raw: true
    });
    
    // Consultas para os cards (com filtro de data)
    const [
      chamadosAbertos,
      chamadosConcluidos,
      chamadosEmAndamento,
      totalClientes,
      faturamento,
      ultimosChamados
    ] = await Promise.all([
        Chamado.count({ where: { ...whereClause, statusId: statusAberto?.id || 0 } }),
        Chamado.count({ where: { ...whereClause, statusId: statusConcluido?.id || 0 } }),
        Chamado.count({ where: { ...whereClause, statusId: statusEmAndamento?.id || 0 } }),
        Cliente.count(),
        Chamado.sum('valorTotal', { where: { ...whereClause, statusId: statusConcluido?.id || 0 } }),
        Chamado.findAll({
          limit: 5,
          order: [['dataAbertura', 'DESC']],
          include: [
            { model: Cliente, as: 'cliente', attributes: ['nome'] },
            { model: StatusChamado, as: 'status', attributes: ['nome', 'cor'] }
          ]
        })
      ]);

    return {
      chamadosAbertos,
      chamadosConcluidos,
      chamadosEmAndamento,
      totalClientes,
      totalFaturamento: faturamento || 0,
      ultimosChamados,
      chamadosPorStatus,
      faturamentoMensal
    };
  }
}

module.exports = new DashboardService();