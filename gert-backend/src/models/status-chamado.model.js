const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const StatusChamado = sequelize.define('StatusChamado', {
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
  tableName: 'status_chamados',
  timestamps: false
});

module.exports = { StatusChamado };
