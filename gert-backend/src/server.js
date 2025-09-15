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
    
    // Sincronização mais robusta para ambos os ambientes
    if (process.env.NODE_ENV === 'development') {
      // Desenvolvimento: permite alterações na estrutura
      await sequelize.sync({ alter: true });
      console.log('📊 Modelos sincronizados com o banco de dados (desenvolvimento).');
    } else {
      // Produção: apenas verifica se as tabelas existem, sem alterar estrutura
      try {
        await sequelize.authenticate();
        console.log('🏭 Produção: Conexão verificada. Modelos não serão alterados.');
        
        // Opcional: verificar se tabelas essenciais existem
        const [tables] = await sequelize.query("SHOW TABLES");
        const tableNames = tables.map(t => Object.values(t)[0]);
        const requiredTables = ['usuarios', 'clientes', 'chamados', 'dispositivos'];
        
        for (const table of requiredTables) {
          if (!tableNames.includes(table)) {
            console.warn(`⚠️  Tabela '${table}' não encontrada no banco de produção!`);
            console.warn('🔧 Considere executar as migrações manuais ou o script populate-db.js');
          }
        }
      } catch (syncError) {
        console.error('❌ Erro na verificação do banco de produção:', syncError.message);
        // Não para o servidor, apenas loga o erro
      }
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
