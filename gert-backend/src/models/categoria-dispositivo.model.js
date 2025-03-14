const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const CategoriaDispositivo = sequelize.define('CategoriaDispositivo', {
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
  tableName: 'categorias_dispositivos',
  timestamps: false
});

module.exports = { CategoriaDispositivo };
