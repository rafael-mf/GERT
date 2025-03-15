require('dotenv').config();
const bcrypt = require('bcryptjs');
const { sequelize } = require('../config/database');
const { Usuario } = require('../models/usuario.model');
const { Tecnico } = require('../models/tecnico.model');

async function seedUsers() {
  try {
    // Conectar ao banco de dados
    await sequelize.authenticate();
    console.log('Conexão com o banco de dados estabelecida com sucesso.');

    // Criar usuários de teste
    const adminPassword = await bcrypt.hash('admin123', 10);
    const tecnicoPassword = await bcrypt.hash('tecnico123', 10);
    const atendentePassword = await bcrypt.hash('atendente123', 10);

    // Verificar se já existe o admin
    const adminExists = await Usuario.findOne({ where: { email: 'admin@sistema.com' } });
    
    if (!adminExists) {
      await Usuario.create({
        nome: 'Administrador',
        email: 'admin@sistema.com',
        senha: adminPassword,
        cargo: 'Administrador',
        ativo: true,
        dataCriacao: new Date(),
        ultimoAcesso: null
      }, { hooks: false }); // Desabilitar hooks para evitar hash duplo
      console.log('Usuário administrador criado com sucesso.');
    } else {
      console.log('Usuário administrador já existe.');
    }

    // Criar usuário técnico
    const tecnicoExists = await Usuario.findOne({ where: { email: 'tecnico@sistema.com' } });
    
    if (!tecnicoExists) {
      const novoTecnico = await Usuario.create({
        nome: 'Técnico Teste',
        email: 'tecnico@sistema.com',
        senha: tecnicoPassword,
        cargo: 'Técnico',
        ativo: true,
        dataCriacao: new Date(),
        ultimoAcesso: null
      }, { hooks: false }); // Desabilitar hooks para evitar hash duplo
      
      // Criar registro na tabela de técnicos
      await Tecnico.create({
        usuarioId: novoTecnico.id,
        especialidade: 'Manutenção de Smartphones',
        disponivel: true
      });
      
      console.log('Usuário técnico criado com sucesso.');
    } else {
      console.log('Usuário técnico já existe.');
    }

    // Criar usuário atendente
    const atendenteExists = await Usuario.findOne({ where: { email: 'atendente@sistema.com' } });
    
    if (!atendenteExists) {
      await Usuario.create({
        nome: 'Atendente Teste',
        email: 'atendente@sistema.com',
        senha: atendentePassword,
        cargo: 'Atendente',
        ativo: true,
        dataCriacao: new Date(),
        ultimoAcesso: null
      }, { hooks: false }); // Desabilitar hooks para evitar hash duplo
      console.log('Usuário atendente criado com sucesso.');
    } else {
      console.log('Usuário atendente já existe.');
    }

    console.log('Usuários de teste criados com sucesso!');
    console.log('===============================');
    console.log('Credenciais:');
    console.log('Admin: admin@sistema.com / admin123');
    console.log('Técnico: tecnico@sistema.com / tecnico123');
    console.log('Atendente: atendente@sistema.com / atendente123');
    console.log('===============================');

  } catch (error) {
    console.error('Erro ao criar usuários de teste:', error);
  } finally {
    process.exit();
  }
}

// Executar o script
seedUsers();