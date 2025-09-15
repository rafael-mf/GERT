// gert-backend/src/models/chamado-atualizacao.model.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const ChamadoAtualizacao = sequelize.define('ChamadoAtualizacao', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
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
  usuarioId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'usuario_id',
    references: {
      model: 'usuarios',
      key: 'id'
    }
  },
  statusAnteriorId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'status_anterior',
    references: {
      model: 'status_chamados',
      key: 'id'
    }
  },
  statusNovoId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'status_novo',
    references: {
      model: 'status_chamados',
      key: 'id'
    }
  },
  comentario: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  dataAtualizacao: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'data_atualizacao'
  }
}, {
  tableName: 'chamados_atualizacoes',
  timestamps: false,
});

ChamadoAtualizacao.associate = (models) => {
  ChamadoAtualizacao.belongsTo(models.Chamado, {
    foreignKey: 'chamadoId',
    as: 'chamado'
  });
  ChamadoAtualizacao.belongsTo(models.Usuario, {
    foreignKey: 'usuarioId',
    as: 'usuario'
  });
  ChamadoAtualizacao.belongsTo(models.StatusChamado, {
    foreignKey: 'statusAnteriorId',
    as: 'statusAnterior'
  });
  ChamadoAtualizacao.belongsTo(models.StatusChamado, {
    foreignKey: 'statusNovoId',
    as: 'statusNovo'
  });
};

module.exports = { ChamadoAtualizacao };