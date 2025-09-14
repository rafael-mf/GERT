// gert-backend/src/middlewares/audit.middleware.js
const fs = require('fs').promises;
const path = require('path');

// Criar diretório de logs se não existir
const logsDir = path.join(__dirname, '../logs');
fs.mkdir(logsDir, { recursive: true }).catch(() => {});

const auditLog = async (action, userId, resource, resourceId, details = {}) => {
  const logEntry = {
    timestamp: new Date().toISOString(),
    action,
    userId,
    resource,
    resourceId,
    details,
    ip: details.ip || 'unknown',
    userAgent: details.userAgent || 'unknown'
  };

  const logFile = path.join(logsDir, `audit-${new Date().toISOString().split('T')[0]}.log`);
  const logLine = JSON.stringify(logEntry) + '\n';

  try {
    await fs.appendFile(logFile, logLine);
    console.log(`Audit log: ${action} on ${resource} by user ${userId}`);
  } catch (error) {
    console.error('Erro ao escrever log de auditoria:', error);
  }
};

const auditMiddleware = (resource) => {
  return (req, res, next) => {
    const originalJson = res.json;
    const originalSend = res.send;

    // Capturar a resposta
    res.json = function(data) {
      // Registrar ação baseada no método HTTP
      const action = getActionFromMethod(req.method, res.statusCode);
      if (action) {
        auditLog(action, req.usuario?.id || 'anonymous', resource, req.params.id || 'list', {
          method: req.method,
          url: req.originalUrl,
          ip: req.ip,
          userAgent: req.get('User-Agent'),
          statusCode: res.statusCode
        });
      }

      return originalJson.call(this, data);
    };

    res.send = function(data) {
      const action = getActionFromMethod(req.method, res.statusCode);
      if (action) {
        auditLog(action, req.usuario?.id || 'anonymous', resource, req.params.id || 'list', {
          method: req.method,
          url: req.originalUrl,
          ip: req.ip,
          userAgent: req.get('User-Agent'),
          statusCode: res.statusCode
        });
      }

      return originalSend.call(this, data);
    };

    next();
  };
};

const getActionFromMethod = (method, statusCode) => {
  if (statusCode < 200 || statusCode >= 300) return null;

  switch (method) {
    case 'GET':
      return 'VIEW';
    case 'POST':
      return 'CREATE';
    case 'PUT':
      return 'UPDATE';
    case 'DELETE':
      return 'DELETE';
    default:
      return 'ACCESS';
  }
};

// Função para consultar logs de auditoria
const getAuditLogs = async (filters = {}) => {
  try {
    const { date, userId, action, resource } = filters;
    const logDate = date || new Date().toISOString().split('T')[0];
    const logFile = path.join(logsDir, `audit-${logDate}.log`);

    const logContent = await fs.readFile(logFile, 'utf8');
    const logs = logContent.trim().split('\n').map(line => JSON.parse(line));

    // Aplicar filtros
    let filteredLogs = logs;
    if (userId) filteredLogs = filteredLogs.filter(log => log.userId === userId);
    if (action) filteredLogs = filteredLogs.filter(log => log.action === action);
    if (resource) filteredLogs = filteredLogs.filter(log => log.resource === resource);

    return filteredLogs;
  } catch (error) {
    console.error('Erro ao ler logs de auditoria:', error);
    return [];
  }
};

module.exports = {
  auditMiddleware,
  auditLog,
  getAuditLogs
};