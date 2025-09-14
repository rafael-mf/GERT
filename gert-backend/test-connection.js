// Teste de conexão com banco Railway
const { Sequelize } = require('sequelize');
require('dotenv').config();

async function testConnection() {
  const mysqlUrl = process.env.MYSQL_URL || 'mysql://root:UEWlLLIsCABDnxsfTeNQzJrBrPMDaRci@centerbeam.proxy.rlwy.net:51636/railway';
  
  console.log('🔄 Testando conexão com:', mysqlUrl.replace(/:[^:]*@/, ':****@'));
  
  const sequelize = new Sequelize(mysqlUrl, {
    dialect: 'mysql',
    logging: console.log,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      },
      connectTimeout: 60000
    }
  });

  try {
    await sequelize.authenticate();
    console.log('✅ Conexão estabelecida com sucesso!');
    
    // Testar uma query simples
    const [results] = await sequelize.query('SHOW TABLES');
    console.log('📊 Tabelas encontradas:', results.length);
    console.log('📋 Primeiras tabelas:', results.slice(0, 5).map(r => Object.values(r)[0]));
    
  } catch (error) {
    console.log('❌ Erro de conexão:');
    console.log('   Tipo:', error.name);
    console.log('   Mensagem:', error.message);
    console.log('   Código:', error.code);
  } finally {
    await sequelize.close();
    console.log('🔐 Conexão fechada');
  }
}

testConnection();