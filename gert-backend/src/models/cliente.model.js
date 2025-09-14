const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Cliente = sequelize.define('Cliente', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nome: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  cpfCnpj: {
    type: DataTypes.STRING(20),
    unique: true,
    field: 'cpf_cnpj' // Mapeia para o campo cpf_cnpj no banco
  },
  email: {
    type: DataTypes.STRING(100),
    validate: {
      isEmail: true
    }
  },
  telefone: {
    type: DataTypes.STRING(20)
  },
  endereco: {
    type: DataTypes.STRING(200)
  },
  cidade: {
    type: DataTypes.STRING(50)
  },
  estado: {
    type: DataTypes.STRING(2)
  },
  cep: {
    type: DataTypes.STRING(10)
  },
  observacoes: {
    type: DataTypes.TEXT
  },
  dataCadastro: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'data_cadastro' // Mapeia para o campo data_cadastro no banco
  }
}, {
  tableName: 'clientes',
  timestamps: false
});

module.exports = { Cliente };
