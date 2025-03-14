const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const { CategoriaPeca } = require('./categoria-peca.model');

const Peca = sequelize.define('Peca', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  categoriaId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'categoria_id',
    references: {
      model: CategoriaPeca,
      key: 'id'
    }
  },
  codigo: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  nome: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  descricao: {
    type: DataTypes.TEXT
  },
  marca: {
    type: DataTypes.STRING(50)
  },
  modelo: {
    type: DataTypes.STRING(100)
  },
  compatibilidade: {
    type: DataTypes.TEXT
  },
  precoCusto: {
    type: DataTypes.DECIMAL(10, 2),
    field: 'preco_custo'
  },
  precoVenda: {
    type: DataTypes.DECIMAL(10, 2),
    field: 'preco_venda'
  },
  estoqueMinimo: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
    field: 'estoque_minimo'
  },
  estoqueAtual: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'estoque_atual'
  },
  localizacao: {
    type: DataTypes.STRING(50)
  },
  ativo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  dataCadastro: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'data_cadastro'
  },
  ultimoInventario: {
    type: DataTypes.DATE,
    field: 'ultimo_inventario'
  }
}, {
  tableName: 'pecas',
  timestamps: false
});

// Associações
Peca.belongsTo(CategoriaPeca, { foreignKey: 'categoriaId', as: 'categoria' });

module.exports = { Peca };
