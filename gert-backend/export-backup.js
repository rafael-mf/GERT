/**
 * EXPORTAÇÃO COMPLETA DO BANCO DE DADOS - SEM MYSQLDUMP
 * Exporta estrutura e dados diretamente usando Node.js
 */

const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

// Configurações do banco
const DB_CONFIG = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_NAME || 'gert',
  multipleStatements: true
};

const OUTPUT_FILE = path.join(__dirname, 'backup-database.sql');

async function exportDatabase() {
  let connection;
  
  try {
    console.log('🚀 INICIANDO EXPORTAÇÃO DO BANCO DE DADOS...\n');
    console.log('📋 Configurações:');
    console.log(`   Host: ${DB_CONFIG.host}`);
    console.log(`   Database: ${DB_CONFIG.database}`);
    console.log(`   Arquivo: ${OUTPUT_FILE}\n`);

    // Conectar ao banco
    connection = await mysql.createConnection(DB_CONFIG);
    console.log('✅ Conectado ao banco de dados\n');

    let sqlOutput = '';
    
    // Cabeçalho do arquivo SQL
    sqlOutput += `-- =====================================================\n`;
    sqlOutput += `-- BACKUP DO BANCO DE DADOS: ${DB_CONFIG.database}\n`;
    sqlOutput += `-- Data: ${new Date().toLocaleString('pt-BR')}\n`;
    sqlOutput += `-- =====================================================\n\n`;
    sqlOutput += `/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;\n`;
    sqlOutput += `/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;\n`;
    sqlOutput += `/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;\n`;
    sqlOutput += `/*!40101 SET NAMES utf8mb4 */;\n`;
    sqlOutput += `/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;\n`;
    sqlOutput += `/*!40103 SET TIME_ZONE='+00:00' */;\n`;
    sqlOutput += `/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;\n`;
    sqlOutput += `/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;\n`;
    sqlOutput += `/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;\n\n`;

    // Obter lista de todas as tabelas
    const [tables] = await connection.query('SHOW TABLES');
    const tableList = tables.map(row => Object.values(row)[0]);
    
    console.log(`📊 Encontradas ${tableList.length} tabelas:\n`);

    // Para cada tabela
    for (const tableName of tableList) {
      console.log(`   Exportando: ${tableName}...`);
      
      // 1. DROP TABLE
      sqlOutput += `-- Tabela: ${tableName}\n`;
      sqlOutput += `DROP TABLE IF EXISTS \`${tableName}\`;\n`;
      
      // 2. CREATE TABLE
      const [createResult] = await connection.query(`SHOW CREATE TABLE \`${tableName}\``);
      sqlOutput += createResult[0]['Create Table'] + ';\n\n';
      
      // 3. INSERT DATA
      const [rows] = await connection.query(`SELECT * FROM \`${tableName}\``);
      
      if (rows.length > 0) {
        sqlOutput += `-- Dados da tabela ${tableName}\n`;
        sqlOutput += `INSERT INTO \`${tableName}\` VALUES\n`;
        
        const values = rows.map(row => {
          const valueString = Object.values(row).map(val => {
            if (val === null) return 'NULL';
            if (val instanceof Date) return `'${val.toISOString().slice(0, 19).replace('T', ' ')}'`;
            if (typeof val === 'string') {
              // Escapar aspas simples e caracteres especiais
              const escaped = val.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n').replace(/\r/g, '\\r');
              return `'${escaped}'`;
            }
            return val;
          }).join(', ');
          return `(${valueString})`;
        }).join(',\n');
        
        sqlOutput += values + ';\n\n';
      } else {
        sqlOutput += `-- Tabela ${tableName} está vazia\n\n`;
      }
    }

    sqlOutput += `\n/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;\n`;
    sqlOutput += `/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;\n`;
    sqlOutput += `/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;\n`;
    sqlOutput += `/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;\n`;
    sqlOutput += `/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;\n`;
    sqlOutput += `/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;\n`;
    sqlOutput += `/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;\n`;

    // Salvar arquivo com encoding UTF-8 BOM para compatibilidade
    fs.writeFileSync(OUTPUT_FILE, '\ufeff' + sqlOutput, 'utf8');
    
    const stats = fs.statSync(OUTPUT_FILE);
    console.log('\n✅ EXPORTAÇÃO CONCLUÍDA COM SUCESSO!');
    console.log(`📦 Arquivo: ${OUTPUT_FILE}`);
    console.log(`📊 Tamanho: ${(stats.size / 1024).toFixed(2)} KB`);
    console.log(`📋 Tabelas exportadas: ${tableList.length}\n`);
    
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📋 PRÓXIMOS PASSOS NA OUTRA MÁQUINA:\n');
    console.log('1. Copie o arquivo backup-database.sql');
    console.log('2. Copie também: gert-backend/ e gert-frontend/');
    console.log('3. Execute na outra máquina:\n');
    console.log('   cd gert-backend');
    console.log('   node import-backup.js\n');
    console.log('4. Ou importe manualmente:');
    console.log('   mysql -u root -p gert_db < backup-database.sql\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  } catch (error) {
    console.error('\n❌ ERRO ao exportar banco de dados:');
    console.error(error.message);
    console.error('\n⚠️  Verifique:');
    console.error('   - MySQL está rodando?');
    console.error('   - Credenciais corretas no .env?');
    console.error('   - Banco de dados "gert_db" existe?');
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Executar exportação
exportDatabase();
