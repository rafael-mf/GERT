const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const { Chamado } = require('./chamado.model');
const { Peca } = require('./peca.model');

const ChamadoPeca = sequelize.define('ChamadoPeca', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  chamadoId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'chamado_id',
    references: {
      model: Chamado,
      key: 'id'
    }
  },
  pecaId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'peca_id',
    references: {
      model: Peca,
      key: 'id'
    }
  },
  quantidade: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  valorUnitario: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    field: 'valor_unitario'
  },
  dataUtilizacao: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'data_utilizacao'
  }
}, {
  tableName: 'chamados_pecas',
  timestamps: false
});

// Associações
// ChamadoPeca.belongsTo(Chamado, { foreignKey: 'chamadoId', as: 'chamado' });
// ChamadoPeca.belongsTo(Peca, { foreignKey: 'pecaId', as: 'peca' });
// Chamado.hasMany(ChamadoPeca, { foreignKey: 'chamadoId', as: 'pecas' });
// Movido para index.js para evitar problemas de carregamento

module.exports = { ChamadoPeca };
