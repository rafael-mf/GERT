require('dotenv').config();
const app = require('./app');
const { sequelize } = require('./config/database');

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    console.log('🔄 Tentando conectar ao banco de dados...');
    console.log('🌍 Ambiente:', process.env.NODE_ENV || 'development');
    console.log('🔗 URL do banco:', process.env.MYSQL_URL ? 'Configurada ✅' : 'Não configurada ❌');
    
    await sequelize.authenticate();
    console.log('✅ Conexão com o banco de dados estabelecida com sucesso.');
    
    // Só sincroniza o banco em ambiente de desenvolvimento
    if (process.env.NODE_ENV === 'development') {
      // Use { force: true } apenas se quiser recriar as tabelas
      await sequelize.sync({ alter: true });
      console.log('📊 Modelos sincronizados com o banco de dados.');
    } else {
      console.log('🏭 Produção: Pulando sincronização do banco.');
    }
    
    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando na porta ${PORT}`);
      console.log(`📖 Documentação: http://localhost:${PORT}/api-docs`);
    });
  } catch (error) {
    console.error('❌ Não foi possível conectar ao banco de dados:', error.name);
    console.error('📋 Detalhes:', error.message);
    console.error('🔧 Verifique suas variáveis de ambiente:');
    console.error('   - MYSQL_URL:', process.env.MYSQL_URL ? '✅ Configurada' : '❌ Não configurada');
    console.error('   - NODE_ENV:', process.env.NODE_ENV || 'development');
    console.error('   - DB_SSL:', process.env.DB_SSL || 'false');
    process.exit(1);
  }
}

startServer();
