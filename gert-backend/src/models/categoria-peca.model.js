const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const CategoriaPeca = sequelize.define('CategoriaPeca', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nome: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  descricao: {
    type: DataTypes.TEXT
  }
}, {
  tableName: 'categorias_pecas',
  timestamps: false
});

module.exports = { CategoriaPeca };
