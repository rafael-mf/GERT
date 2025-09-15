// Script para recriar o banco corretamente
const { Sequelize } = require('sequelize');
const fs = require('fs');
const path = require('path');

const mysqlUrl = 'mysql://root:tRBOttVbxihyEFdCrBlrNyWocPIUOVLI@nozomi.proxy.rlwy.net:57096/railway';

console.log('🔄 Recriando banco com estrutura correta...');

const sequelize = new Sequelize(mysqlUrl, {
  dialect: 'mysql',
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    },
    connectTimeout: 60000,
    multipleStatements: true
  }
});

async function recreateDatabase() {
  try {
    console.log('📡 Conectando...');
    await sequelize.authenticate();
    console.log('✅ Conectado!');

    // Dropar todas as tabelas existentes
    console.log('🗑️ Removendo tabelas antigas...');
    const tables = await sequelize.query("SHOW TABLES", { type: Sequelize.QueryTypes.SELECT });
    
    if (tables.length > 0) {
      await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
      for (const table of tables) {
        const tableName = Object.values(table)[0];
        await sequelize.query(`DROP TABLE IF EXISTS ${tableName}`);
        console.log(`❌ Tabela ${tableName} removida`);
      }
      await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
    }

    // Ler e executar o arquivo SQL correto
    console.log('📄 Executando script SQL correto...');
    const sqlFile = path.join(__dirname, '..', 'gert-db', 'railway-init.sql');
    const sqlContent = fs.readFileSync(sqlFile, 'utf8');
    
    const statements = sqlContent.split(';').filter(stmt => stmt.trim());
    
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i].trim();
      if (statement) {
        try {
          await sequelize.query(statement + ';');
          console.log(`✅ Statement ${i + 1}/${statements.length} executado`);
        } catch (error) {
          if (!error.message.includes('already exists')) {
            console.error(`❌ Erro no statement ${i + 1}:`, error.message);
          }
        }
      }
    }

    // Verificar resultado
    console.log('\n🔍 Verificando resultado...');
    const newTables = await sequelize.query("SHOW TABLES", { type: Sequelize.QueryTypes.SELECT });
    console.log(`✅ ${newTables.length} tabelas criadas!`);
    
    // Verificar estrutura das tabelas problemáticas
    console.log('\n🔍 Verificando estruturas...');
    
    const tecnicosColumns = await sequelize.query("DESCRIBE tecnicos", { type: Sequelize.QueryTypes.SELECT });
    console.log('👨‍🔧 Tecnicos:', tecnicosColumns.map(c => c.Field).join(', '));
    
    const servicosColumns = await sequelize.query("DESCRIBE servicos", { type: Sequelize.QueryTypes.SELECT });
    console.log('🛠️ Servicos:', servicosColumns.map(c => c.Field).join(', '));
    
    console.log('\n🎉 BANCO RECRIADO CORRETAMENTE!');
    
  } catch (error) {
    console.error('❌ ERRO:', error.message);
  } finally {
    await sequelize.close();
    console.log('🔐 Conexão fechada');
  }
}

recreateDatabase();