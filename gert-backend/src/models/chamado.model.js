const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const { Cliente } = require('./cliente.model');
const { Dispositivo } = require('./dispositivo.model');
const { Tecnico } = require('./tecnico.model');
const { Prioridade } = require('./prioridade.model');
const { StatusChamado } = require('./status-chamado.model');
const { PecaUsada } = require('./peca-usada.model');
const { ChamadoAtualizacao } = require('./chamado-atualizacao.model');

const Chamado = sequelize.define('Chamado', {
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
  dispositivoId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'dispositivo_id',
    references: {
      model: Dispositivo,
      key: 'id'
    }
  },
  tecnicoId: {
    type: DataTypes.INTEGER,
    field: 'tecnico_id',
    references: {
      model: Tecnico,
      key: 'id'
    }
  },
  prioridadeId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'prioridade_id',
    references: {
      model: Prioridade,
      key: 'id'
    }
  },
  statusId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'status_id',
    references: {
      model: StatusChamado,
      key: 'id'
    }
  },
  titulo: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  descricao: {
    type: DataTypes.TEXT,
    allowNull: false,
    field: 'descricao_problema'
  },
  diagnostico: {
    type: DataTypes.TEXT,
    field: 'observacoes_internas'
  },
  solucao: {
    type: DataTypes.TEXT,
    field: 'descricao_solucao'
  },
  valorTotal: {
    type: DataTypes.DECIMAL(10, 2),
    field: 'valor_final'
  },
  dataAbertura: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'data_abertura'
  },
  dataPrevista: {
    type: DataTypes.DATE,
    field: 'data_inicio'
  },
  dataFechamento: {
    type: DataTypes.DATE,
    field: 'data_conclusao'
  }
}, {
  tableName: 'chamados',
  timestamps: false
});

// Associações
Chamado.belongsTo(Cliente, { foreignKey: 'clienteId', as: 'cliente' });
Chamado.belongsTo(Dispositivo, { foreignKey: 'dispositivoId', as: 'dispositivo' });
Chamado.belongsTo(Tecnico, { foreignKey: 'tecnicoId', as: 'tecnico' });
Chamado.belongsTo(Prioridade, { foreignKey: 'prioridadeId', as: 'prioridade' });
Chamado.belongsTo(StatusChamado, { foreignKey: 'statusId', as: 'status' });
Chamado.hasMany(PecaUsada, { foreignKey: 'chamadoId', as: 'pecasUsadas' });
Chamado.hasMany(ChamadoAtualizacao, { foreignKey: 'chamadoId', as: 'atualizacoes' });
// Associações inversas serão definidas no index.js para evitar conflitos

module.exports = { Chamado };
