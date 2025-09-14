const relatorioService = require('../services/relatorio.service');

class RelatorioController {
  async getRelatorioChamados(req, res, next) {
    try {
      const filtros = req.query;
      const relatorio = await relatorioService.getRelatorioChamados(filtros);
      res.json(relatorio);
    } catch (error) {
      next(error);
    }
  }

  async getRelatorioFinanceiro(req, res, next) {
    try {
      const filtros = req.query;
      const relatorio = await relatorioService.getRelatorioFinanceiro(filtros);
      res.json(relatorio);
    } catch (error) {
      next(error);
    }
  }

  async getRelatorioTecnicos(req, res, next) {
    try {
      const filtros = req.query;
      const relatorio = await relatorioService.getRelatorioTecnicos(filtros);
      res.json(relatorio);
    } catch (error) {
      next(error);
    }
  }

  async getDashboardStats(req, res, next) {
    try {
      const stats = await relatorioService.getDashboardStats();
      res.json(stats);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new RelatorioController();