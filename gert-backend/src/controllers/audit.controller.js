// gert-backend/src/controllers/audit.controller.js
const { getAuditLogs } = require('../middlewares/audit.middleware');

const getLogs = async (req, res) => {
  try {
    const { date, userId, action, resource } = req.query;

    const logs = await getAuditLogs({
      date,
      userId,
      action,
      resource
    });

    res.json({
      success: true,
      data: logs,
      count: logs.length
    });
  } catch (error) {
    console.error('Erro ao consultar logs de auditoria:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

const getLogStats = async (req, res) => {
  try {
    const { date } = req.query;
    const logs = await getAuditLogs({ date });

    // Estatísticas básicas
    const stats = {
      total: logs.length,
      byAction: {},
      byResource: {},
      byUser: {},
      recentActivity: logs.slice(-10).reverse() // Últimas 10 ações
    };

    logs.forEach(log => {
      // Contagem por ação
      stats.byAction[log.action] = (stats.byAction[log.action] || 0) + 1;

      // Contagem por recurso
      stats.byResource[log.resource] = (stats.byResource[log.resource] || 0) + 1;

      // Contagem por usuário
      stats.byUser[log.userId] = (stats.byUser[log.userId] || 0) + 1;
    });

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Erro ao consultar estatísticas de auditoria:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

module.exports = {
  getLogs,
  getLogStats
};