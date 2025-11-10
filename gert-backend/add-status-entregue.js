// Script para adicionar o status "Entregue" ao banco de dados
// Data: 03/11/2025

const { sequelize } = require('./src/config/database');
const { StatusChamado } = require('./src/models');

async function addStatusEntregue() {
  try {
    console.log('🔌 Conectando ao banco de dados...');
    await sequelize.authenticate();
    console.log('✅ Conexão estabelecida com sucesso!');

    // Verificar se o status já existe
    console.log('\n📋 Verificando se status "Entregue" já existe...');
    const statusExistente = await StatusChamado.findOne({
      where: { nome: 'Entregue' }
    });

    if (statusExistente) {
      console.log('⚠️  Status "Entregue" já existe no banco de dados!');
      console.log('   ID:', statusExistente.id);
      console.log('   Nome:', statusExistente.nome);
      console.log('   Descrição:', statusExistente.descricao);
      console.log('   Cor:', statusExistente.cor);
      return;
    }

    // Inserir novo status
    console.log('\n➕ Inserindo status "Entregue"...');
    const novoStatus = await StatusChamado.create({
      nome: 'Entregue',
      descricao: 'Dispositivo entregue ao cliente após conclusão do serviço',
      cor: '#28a745' // Verde Bootstrap success
    });

    console.log('✅ Status "Entregue" inserido com sucesso!');
    console.log('   ID:', novoStatus.id);
    console.log('   Nome:', novoStatus.nome);
    console.log('   Descrição:', novoStatus.descricao);
    console.log('   Cor:', novoStatus.cor);

    // Listar todos os status
    console.log('\n📊 Lista completa de status:');
    const allStatus = await StatusChamado.findAll({
      attributes: ['id', 'nome', 'descricao', 'cor'],
      order: [['id', 'ASC']]
    });

    console.table(allStatus.map(s => ({
      ID: s.id,
      Nome: s.nome,
      Descrição: s.descricao,
      Cor: s.cor
    })));

    console.log('\n🎉 Migração concluída com sucesso!');
    console.log('\n💡 Dica: O status "Entregue" funciona como o "Concluído".');
    console.log('   Use-o para indicar que o dispositivo foi entregue ao cliente.');

  } catch (error) {
    console.error('❌ Erro ao adicionar status:', error);
    throw error;
  } finally {
    await sequelize.close();
    console.log('\n🔌 Conexão fechada.');
  }
}

// Executar migração
addStatusEntregue()
  .then(() => {
    console.log('\n✅ Script finalizado com sucesso!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Script finalizado com erro:', error);
    process.exit(1);
  });
