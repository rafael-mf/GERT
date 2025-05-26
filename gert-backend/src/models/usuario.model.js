const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const bcrypt = require('bcryptjs');

const Usuario = sequelize.define('Usuario', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nome: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  senha: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  cargo: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  ativo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  dataCriacao: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  ultimoAcesso: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'usuarios',
  timestamps: false,
  hooks: {
    beforeCreate: async (usuario) => {
      if (usuario.senha) {
        usuario.senha = await bcrypt.hash(usuario.senha, 10);
      }
    },
    beforeUpdate: async (usuario) => {
      if (usuario.changed('senha')) {
        usuario.senha = await bcrypt.hash(usuario.senha, 10);
      }
    }
  }
});

// Método para verificar senha
// Em gert-backend/src/models/usuario.model.js
// Em gert-backend/src/models/usuario.model.js
Usuario.prototype.verificarSenha = async function (senhaRecebida) {
  console.log('--- DENTRO DE verificarSenha ---');
  console.log('Senha recebida (original):', senhaRecebida);
  console.log('Comprimento da senha recebida:', senhaRecebida.length);
  let charCodes = [];
  for (let i = 0; i < senhaRecebida.length; i++) {
    charCodes.push(senhaRecebida.charCodeAt(i));
  }
  console.log('Char codes da senha recebida:', charCodes.join(', ')); // Para "admin123" deve ser: 97, 100, 109, 105, 110, 49, 50, 51

  console.log('Hash armazenado no this.senha:', this.senha);
  const match = await bcrypt.compare(senhaRecebida, this.senha);
  console.log('Resultado da comparação (bcrypt.compare):', match);
  console.log('--- FIM DE verificarSenha ---');
  return match;
};

module.exports = { Usuario };
