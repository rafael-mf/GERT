const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Prioridade = sequelize.define('Prioridade', {
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
  },
  cor: {
    type: DataTypes.STRING(7),
    defaultValue: '#000000'
  }
}, {
  tableName: 'prioridades',
  timestamps: false
});

module.exports = { Prioridade };
