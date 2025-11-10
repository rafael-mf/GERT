/**
 * IMPORTAÇÃO DO BACKUP DO BANCO DE DADOS
 * Importa o arquivo backup-database.sql na outra máquina
 */

const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Configurações do banco na NOVA máquina
const DB_CONFIG = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_NAME || 'gert',
  multipleStatements: true
};

const BACKUP_FILE = path.join(__dirname, '..', 'backup-database.sql');

async function askQuestion(query) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise(resolve => rl.question(query, ans => {
    rl.close();
    resolve(ans);
  }));
}

async function importDatabase() {
  let connection;
  
  try {
    console.log('🚀 INICIANDO IMPORTAÇÃO DO BANCO DE DADOS...\n');
    
    // Verificar se arquivo de backup existe
    if (!fs.existsSync(BACKUP_FILE)) {
      console.error(`❌ ERRO: Arquivo de backup não encontrado!`);
      console.error(`   Esperado em: ${BACKUP_FILE}\n`);
      console.error('   Certifique-se de que o arquivo backup-database.sql');
      console.error('   está na pasta raiz do projeto GERT.\n');
      return;
    }
    
    const stats = fs.statSync(BACKUP_FILE);
    console.log('✅ Arquivo de backup encontrado!');
    console.log(`   Tamanho: ${(stats.size / 1024).toFixed(2)} KB\n`);
    
    console.log('📋 Configurações:');
    console.log(`   Host: ${DB_CONFIG.host}`);
    console.log(`   Database: ${DB_CONFIG.database}`);
    console.log(`   User: ${DB_CONFIG.user}\n`);
    
    const confirm = await askQuestion('⚠️  Isso vai SUBSTITUIR todos os dados! Continuar? (s/n): ');
    
    if (confirm.toLowerCase() !== 's') {
      console.log('\n❌ Importação cancelada pelo usuário.');
      return;
    }

    console.log('\n[1/4] Conectando ao MySQL...');
    
    // Conectar SEM especificar database primeiro
    const rootConnection = await mysql.createConnection({
      host: DB_CONFIG.host,
      port: DB_CONFIG.port,
      user: DB_CONFIG.user,
      password: DB_CONFIG.password,
      multipleStatements: true
    });
    
    console.log('✅ Conectado ao MySQL\n');

    console.log('[2/4] Recriando banco de dados...');
    await rootConnection.query(`DROP DATABASE IF EXISTS \`${DB_CONFIG.database}\``);
    await rootConnection.query(`CREATE DATABASE \`${DB_CONFIG.database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
    await rootConnection.query(`USE \`${DB_CONFIG.database}\``);
    console.log('✅ Banco de dados recriado\n');

    console.log('[3/4] Lendo arquivo de backup...');
    const sqlContent = fs.readFileSync(BACKUP_FILE, 'utf8');
    console.log(`✅ Arquivo lido (${(sqlContent.length / 1024).toFixed(2)} KB)\n`);

    console.log('[4/4] Executando SQL... (isso pode demorar)');
    
    // Dividir em statements individuais (evita problemas com queries grandes)
    const statements = sqlContent
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));
    
    let executed = 0;
    for (const statement of statements) {
      if (statement.trim().length > 0) {
        await rootConnection.query(statement);
        executed++;
        if (executed % 10 === 0) {
          process.stdout.write(`   Executadas ${executed}/${statements.length} queries...\r`);
        }
      }
    }
    
    console.log(`✅ ${executed} queries executadas com sucesso!\n`);

    await rootConnection.end();

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ IMPORTAÇÃO CONCLUÍDA COM SUCESSO!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    console.log('📋 PRÓXIMOS PASSOS:\n');
    console.log('1. Configure o arquivo .env:');
    console.log('   DB_HOST=localhost');
    console.log('   DB_PORT=3306');
    console.log('   DB_USER=root');
    console.log('   DB_PASSWORD=sua_senha');
    console.log('   DB_NAME=gert_db\n');
    console.log('2. Inicie o backend:');
    console.log('   npm start\n');
    console.log('3. Inicie o frontend (outro terminal):');
    console.log('   cd ../gert-frontend');
    console.log('   ng serve\n');
    console.log('4. Acesse: http://localhost:4200');
    console.log('   Login: admin@gert.com');
    console.log('   Senha: Admin@123\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  } catch (error) {
    console.error('\n❌ ERRO ao importar banco de dados:');
    console.error(error.message);
    console.error('\n⚠️  Verifique:');
    console.error('   - MySQL está rodando?');
    console.error('   - Credenciais corretas no .env?');
    console.error('   - Usuário tem permissão para criar databases?');
  }
}

// Executar importação
importDatabase();
