// gert-backend/src/models/peca-usada.model.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const PecaUsada = sequelize.define('PecaUsada', {
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
      model: 'chamados',
      key: 'id'
    }
  },
  nome: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  descricao: {
    type: DataTypes.TEXT
  },
  numeroSerie: {
    type: DataTypes.STRING(50),
    field: 'numero_serie'
  },
  garantia: {
    type: DataTypes.STRING(50)
  },
  valor: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  dataUtilizacao: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'data_utilizacao'
  }
}, {
  tableName: 'pecas_usadas',
  timestamps: false
});

// Associações serão definidas no index.js para evitar dependências circulares
module.exports = { PecaUsada };