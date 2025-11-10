/**
 * Utilitário para validação e sanitização de query parameters
 */

/**
 * Verifica se um valor é válido para uso em filtros
 * @param {any} value - Valor a ser validado
 * @returns {boolean} - true se o valor é válido
 */
function isValidValue(value) {
  // Retorna false se:
  // - valor é undefined ou null
  // - valor é uma string vazia após trim
  // - valor é a string literal 'undefined' ou 'null'
  if (value === undefined || value === null) return false;
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (trimmed === '' || trimmed === 'undefined' || trimmed === 'null') return false;
  }
  return true;
}

/**
 * Sanitiza um termo de busca removendo espaços extras
 * @param {string} searchTerm - Termo de busca
 * @returns {string|null} - Termo sanitizado ou null se inválido
 */
function sanitizeSearchTerm(searchTerm) {
  if (!isValidValue(searchTerm)) return null;
  return String(searchTerm).trim();
}

/**
 * Converte um valor para inteiro se válido
 * @param {any} value - Valor a ser convertido
 * @returns {number|null} - Número convertido ou null se inválido
 */
function parseIntSafe(value) {
  if (!isValidValue(value)) return null;
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? null : parsed;
}

/**
 * Converte um valor para boolean de forma segura
 * @param {any} value - Valor a ser convertido
 * @returns {boolean} - Valor booleano
 */
function parseBooleanSafe(value) {
  if (value === true || value === 'true' || value === '1' || value === 1) {
    return true;
  }
  return false;
}

/**
 * Valida e converte uma data
 * @param {any} dateValue - Valor da data
 * @returns {Date|null} - Data válida ou null
 */
function parseDateSafe(dateValue) {
  if (!isValidValue(dateValue)) return null;
  const date = new Date(dateValue);
  return isNaN(date.getTime()) ? null : date;
}

/**
 * Constrói um objeto where com validação para filtros comuns
 * @param {Object} filters - Objeto com filtros
 * @param {Object} config - Configuração de quais filtros aplicar
 * @returns {Object} - Objeto where do Sequelize
 */
function buildWhereClause(filters, config = {}) {
  const where = {};
  
  // Filtros numéricos (IDs)
  const numericFilters = ['statusId', 'prioridadeId', 'tecnicoId', 'clienteId', 'categoriaId', 'dispositivoId'];
  numericFilters.forEach(field => {
    if (config[field] !== false && filters[field]) {
      const value = parseIntSafe(filters[field]);
      if (value !== null) {
        where[field] = value;
      }
    }
  });

  // Filtros booleanos
  const booleanFilters = ['ativo', 'disponivel'];
  booleanFilters.forEach(field => {
    if (config[field] !== false && filters[field] !== undefined) {
      where[field] = parseBooleanSafe(filters[field]);
    }
  });

  return where;
}

/**
 * Extrai parâmetros de paginação validados
 * @param {Object} queryParams - Query params da requisição
 * @returns {Object} - Objeto com page, limit e offset
 */
function getPaginationParams(queryParams) {
  const page = Math.max(1, parseInt(queryParams.page, 10) || 1);
  const limit = Math.max(1, Math.min(100, parseInt(queryParams.limit, 10) || 10)); // Max 100 itens
  const offset = (page - 1) * limit;
  
  return { page, limit, offset };
}

module.exports = {
  isValidValue,
  sanitizeSearchTerm,
  parseIntSafe,
  parseBooleanSafe,
  parseDateSafe,
  buildWhereClause,
  getPaginationParams
};
