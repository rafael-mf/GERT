// Script de migração robusto para desenvolvimento e produção
const { sequelize } = require('./src/config/database');
const fs = require('fs');
const path = require('path');

async function runMigrations() {
  try {
    console.log('🔄 Iniciando migrações...');

    // Verificar conexão
    await sequelize.authenticate();
    console.log('✅ Conexão com banco estabelecida');

    // Verificar se estamos em produção
    const isProduction = process.env.NODE_ENV === 'production';

    if (isProduction) {
      console.log('🏭 Ambiente de produção detectado');

      // Em produção, apenas verificar se as tabelas existem
      const [tables] = await sequelize.query("SHOW TABLES");
      const tableNames = tables.map(t => Object.values(t)[0]);

      const requiredTables = [
        'usuarios', 'clientes', 'categorias_dispositivos', 'dispositivos',
        'status_chamados', 'prioridades', 'tecnicos', 'servicos',
        'chamados', 'chamados_pecas', 'chamados_servicos',
        'categorias_pecas', 'pecas', 'fornecedores'
      ];

      const missingTables = requiredTables.filter(table => !tableNames.includes(table));

      if (missingTables.length > 0) {
        console.error('❌ Tabelas faltando no banco de produção:', missingTables);
        console.log('🔧 Execute o script populate-db.js para criar as tabelas');
        process.exit(1);
      } else {
        console.log('✅ Todas as tabelas necessárias existem');
      }

    } else {
      console.log('💻 Ambiente de desenvolvimento detectado');

      // Em desenvolvimento, sincronizar modelos
      await sequelize.sync({ alter: true });
      console.log('📊 Modelos sincronizados com sucesso');

      // Popular dados iniciais se necessário
      await populateInitialData();
    }

    console.log('🎉 Migrações concluídas com sucesso!');

  } catch (error) {
    console.error('❌ Erro durante migrações:', error.message);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

async function populateInitialData() {
  try {
    console.log('🌱 Verificando dados iniciais...');

    // Verificar se já existem usuários
    const [users] = await sequelize.query("SELECT COUNT(*) as count FROM usuarios");
    if (users[0].count === 0) {
      console.log('📝 Populando dados iniciais...');

      // Executar script de população
      const populateScript = require('./populate-db.js');
      // Note: O populate-db.js precisa ser adaptado para ser chamado como função
    } else {
      console.log('✅ Dados iniciais já existem');
    }

  } catch (error) {
    console.warn('⚠️  Erro ao verificar/popular dados iniciais:', error.message);
  }
}

// Executar migrações se o script for chamado diretamente
if (require.main === module) {
  runMigrations();
}

module.exports = { runMigrations };