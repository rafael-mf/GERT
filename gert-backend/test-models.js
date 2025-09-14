// Teste rápido de modelos após correção
const { sequelize } = require('./src/config/database');
const { Usuario } = require('./src/models/usuario.model');
const { Cliente } = require('./src/models/cliente.model');

async function testarModelos() {
  try {
    console.log('🔄 Testando conexão...');
    await sequelize.authenticate();
    console.log('✅ Conexão OK');
    
    console.log('🔄 Testando modelo Usuario...');
    const usuarios = await Usuario.findAll({ limit: 1 });
    console.log('✅ Usuario modelo OK, registros:', usuarios.length);
    
    console.log('🔄 Testando modelo Cliente...');
    const clientes = await Cliente.findAll({ limit: 1 });
    console.log('✅ Cliente modelo OK, registros:', clientes.length);
    
    console.log('🎉 Todos os modelos funcionando!');
    
  } catch (error) {
    console.log('❌ Erro:', error.message);
    console.log('🔧 Stack:', error.stack);
  } finally {
    await sequelize.close();
  }
}

testarModelos();