const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const { Cliente } = require('./cliente.model');
const { CategoriaDispositivo } = require('./categoria-dispositivo.model');

const Dispositivo = sequelize.define('Dispositivo', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  clienteId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'cliente_id',
    references: {
      model: Cliente,
      key: 'id'
    }
  },
  categoriaId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'categoria_id',
    references: {
      model: CategoriaDispositivo,
      key: 'id'
    }
  },
  marca: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  modelo: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  numeroSerie: {
    type: DataTypes.STRING(100),
    field: 'numero_serie'
  },
  especificacoes: {
    type: DataTypes.TEXT
  },
  dataCadastro: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'data_cadastro'
  }
}, {
  tableName: 'dispositivos',
  timestamps: false
});

// Associações
Dispositivo.belongsTo(Cliente, { foreignKey: 'clienteId', as: 'cliente' });
Dispositivo.belongsTo(CategoriaDispositivo, { foreignKey: 'categoriaId', as: 'categoria' });

module.exports = { Dispositivo };
