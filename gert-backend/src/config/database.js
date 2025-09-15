const { Sequelize } = require('sequelize');
require('dotenv').config();

// Configuração usando MYSQL_URL (para Railway) ou variáveis individuais (para local)
let sequelize;

if (process.env.MYSQL_URL) {
  // Produção com MYSQL_URL (Railway, Heroku, etc)
  sequelize = new Sequelize(process.env.MYSQL_URL, {
    dialect: 'mysql',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    dialectOptions: {
      ssl: process.env.DB_SSL === 'true' ? {
        require: true,
        rejectUnauthorized: false
      } : false,
      connectTimeout: 60000
    }
  });
} else {
  // Desenvolvimento com variáveis individuais
  sequelize = new Sequelize(
    process.env.DB_NAME || 'gert',
    process.env.DB_USER || 'root',
    process.env.DB_PASS || 'password',
    {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      dialect: 'mysql',
      logging: process.env.NODE_ENV === 'development' ? console.log : false,
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
      }
    }
  );
}

module.exports = { sequelize };
