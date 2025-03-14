const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Servico = sequelize.define('Servico', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nome: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  descricao: {
    type: DataTypes.TEXT
  },
  valorBase: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    field: 'valor_base'
  },
  tempoEstimado: {
    type: DataTypes.INTEGER,
    field: 'tempo_estimado'
  },
  ativo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'servicos',
  timestamps: false
});

module.exports = { Servico };
