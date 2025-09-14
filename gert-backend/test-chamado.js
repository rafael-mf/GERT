const { Chamado, sequelize } = require('./src/models');

async function testChamado() {
  try {
    console.log('Testando conexão com banco...');
    await sequelize.authenticate();
    console.log('Conexão OK');

    console.log('Buscando chamado ID 1...');
    const chamado = await Chamado.findByPk(1);
    console.log('Chamado encontrado:', chamado ? 'SIM' : 'NÃO');

    if (chamado) {
      console.log('Dados:', chamado.toJSON());
    } else {
      console.log('Chamado não encontrado!');
    }
  } catch (error) {
    console.error('Erro:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    await sequelize.close();
  }
}

testChamado();