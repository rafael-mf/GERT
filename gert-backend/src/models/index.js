// File: gert-backend/src/models/index.js
const { sequelize } = require('../config/database');
const { Usuario } = require('./usuario.model');
const { Cliente } = require('./cliente.model');
const { CategoriaDispositivo } = require('./categoria-dispositivo.model');
const { Dispositivo } = require('./dispositivo.model');
const { StatusChamado } = require('./status-chamado.model');
const { Prioridade } = require('./prioridade.model');
const { Tecnico } = require('./tecnico.model');
const { Servico } = require('./servico.model');
const { Chamado } = require('./chamado.model');
const { ChamadoServico } = require('./chamado-servico.model');
const { CategoriaPeca } = require('./categoria-peca.model');
const { Peca } = require('./peca.model');
const { ChamadoPeca } = require('./chamado-peca.model');
const { Fornecedor } = require('./fornecedor.model');
const { ChamadoAtualizacao } = require('./chamado-atualizacao.model');

const models = {
  Usuario,
  Cliente,
  CategoriaDispositivo,
  Dispositivo,
  StatusChamado,
  Prioridade,
  Tecnico,
  Servico,
  Chamado,
  ChamadoServico,
  CategoriaPeca,
  Peca,
  ChamadoPeca,
  Fornecedor,
  ChamadoAtualizacao,
};

// Initialize associations if not already defined within models
Object.values(models)
  .filter(model => typeof model.associate === 'function')
  .forEach(model => model.associate(models));

// Definir associações entre modelos
Cliente.hasMany(Dispositivo, { foreignKey: 'clienteId', as: 'dispositivos' });
Cliente.hasMany(Chamado, { foreignKey: 'clienteId', as: 'chamados' });
Dispositivo.belongsTo(Cliente, { foreignKey: 'clienteId', as: 'cliente' });
Dispositivo.belongsTo(CategoriaDispositivo, { foreignKey: 'categoriaId', as: 'categoria' });

// Associações para ChamadoPeca
ChamadoPeca.belongsTo(Chamado, { foreignKey: 'chamadoId', as: 'chamado' });
ChamadoPeca.belongsTo(Peca, { foreignKey: 'pecaId', as: 'peca' });

module.exports = {
  sequelize,
  ...models,
};