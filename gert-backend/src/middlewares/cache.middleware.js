// gert-backend/src/middlewares/cache.middleware.js
const cache = new Map();

const cacheMiddleware = (duration = 300000) => { // 5 minutos por padrão
  return (req, res, next) => {
    // Só fazer cache para GET requests
    if (req.method !== 'GET') {
      return next();
    }

    // Criar chave única baseada na URL e query parameters
    const key = `${req.originalUrl}`;

    // Verificar se existe no cache
    const cachedResponse = cache.get(key);
    if (cachedResponse && (Date.now() - cachedResponse.timestamp) < duration) {
      console.log(`Cache hit for: ${key}`);
      return res.json(cachedResponse.data);
    }

    // Interceptar a resposta para armazenar no cache
    const originalJson = res.json;
    res.json = function(data) {
      // Armazenar no cache
      cache.set(key, {
        data: data,
        timestamp: Date.now()
      });

      console.log(`Cache stored for: ${key}`);
      return originalJson.call(this, data);
    };

    next();
  };
};

// Função para limpar cache específico
const clearCache = (pattern) => {
  for (const [key] of cache) {
    if (key.includes(pattern)) {
      cache.delete(key);
      console.log(`Cache cleared for pattern: ${pattern}`);
    }
  }
};

// Função para limpar todo o cache
const clearAllCache = () => {
  cache.clear();
  console.log('All cache cleared');
};

// Limpeza automática de cache expirado a cada 10 minutos
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of cache) {
    if (now - value.timestamp > 600000) { // 10 minutos
      cache.delete(key);
    }
  }
}, 600000);

module.exports = {
  cacheMiddleware,
  clearCache,
  clearAllCache
};