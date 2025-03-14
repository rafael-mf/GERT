const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const { Usuario } = require('./usuario.model');

const Tecnico = sequelize.define('Tecnico', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  usuarioId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'usuario_id',
    references: {
      model: Usuario,
      key: 'id'
    }
  },
  especialidade: {
    type: DataTypes.STRING(100)
  },
  disponivel: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'tecnicos',
  timestamps: false
});

// Associações
Tecnico.belongsTo(Usuario, { foreignKey: 'usuarioId', as: 'usuario' });

module.exports = { Tecnico };
