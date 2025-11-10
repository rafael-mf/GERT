// Script para popular o banco com estrutura inicial
const { Sequelize } = require('sequelize');
const fs = require('fs');
const path = require('path');

const mysqlUrl = 'mysql://root:tRBOttVbxihyEFdCrBlrNyWocPIUOVLI@nozomi.proxy.rlwy.net:57096/railway';

console.log('🏗️ Populando banco de dados...');

const sequelize = new Sequelize(mysqlUrl, {
  dialect: 'mysql',
  logging: false, // Sem logs para não poluir
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    },
    connectTimeout: 60000,
    multipleStatements: true // Permite executar múltiplos statements
  }
});

async function populateDatabase() {
  try {
    console.log('📡 Conectando...');
    await sequelize.authenticate();
    console.log('✅ Conectado!');

    // Ler o arquivo SQL
    const sqlFile = path.join(__dirname, '..', 'gert-db', 'railway-init.sql');
    const sqlContent = fs.readFileSync(sqlFile, 'utf8');
    
    console.log('📄 Executando script SQL...');
    
    // Dividir em statements individuais e executar
    const statements = sqlContent.split(';').filter(stmt => stmt.trim());
    
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i].trim();
      if (statement) {
        try {
          await sequelize.query(statement + ';');
          console.log(`✅ Statement ${i + 1}/${statements.length} executado`);
        } catch (error) {
          if (error.message.includes('already exists')) {
            console.log(`⚠️  Statement ${i + 1}: Já existe (ignorando)`);
          } else {
            console.error(`❌ Erro no statement ${i + 1}:`, error.message);
          }
        }
      }
    }

    // Verificar se deu certo
    console.log('\n🔍 Verificando resultado...');
    const tables = await sequelize.query("SHOW TABLES", { type: Sequelize.QueryTypes.SELECT });
    console.log(`✅ ${tables.length} tabelas criadas!`);
    
    // Verificar usuário admin
    const users = await sequelize.query("SELECT * FROM usuarios WHERE cargo = 'admin'", { type: Sequelize.QueryTypes.SELECT });
    console.log(`👤 ${users.length} usuário(s) admin encontrado(s)`);
    
    console.log('\n🎉 BANCO POPULADO COM SUCESSO!');
    console.log('📋 Dados disponíveis:');
    console.log('   - Usuário admin: admin@gert.com / Admin@123');
    console.log('   - Categorias e status pré-cadastrados');
    console.log('   - Serviços padrão configurados');
    
  } catch (error) {
    console.error('❌ ERRO:', error.message);
  } finally {
    await sequelize.close();
    console.log('🔐 Conexão fechada');
  }
}

populateDatabase();