// gert-backend/src/controllers/dashboard.controller.js
const dashboardService = require('../services/dashboard.service');

class DashboardController {
  async getStats(req, res, next) {
    try {
      const { startDate, endDate } = req.query;
      const stats = await dashboardService.getStats({ startDate, endDate });
      res.json(stats);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new DashboardController();