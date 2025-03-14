const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const { Chamado } = require('./chamado.model');
const { Servico } = require('./servico.model');

const ChamadoServico = sequelize.define('ChamadoServico', {
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
  servicoId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'servico_id',
    references: {
      model: Servico,
      key: 'id'
    }
  },
  valor: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  observacoes: {
    type: DataTypes.TEXT
  }
}, {
  tableName: 'chamados_servicos',
  timestamps: false
});

// Associações
ChamadoServico.belongsTo(Chamado, { foreignKey: 'chamadoId', as: 'chamado' });
ChamadoServico.belongsTo(Servico, { foreignKey: 'servicoId', as: 'servico' });
Chamado.hasMany(ChamadoServico, { foreignKey: 'chamadoId', as: 'servicos' });

module.exports = { ChamadoServico };
