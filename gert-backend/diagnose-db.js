// Script para diagnóstico e correção de problemas de banco de dados
const { sequelize } = require('./src/config/database');

async function diagnoseDatabase() {
  try {
    console.log('🔍 Iniciando diagnóstico do banco de dados...');

    await sequelize.authenticate();
    console.log('✅ Conexão estabelecida');

    // Verificar tabelas existentes
    const [tables] = await sequelize.query("SHOW TABLES");
    const tableNames = tables.map(t => Object.values(t)[0]);
    console.log('📋 Tabelas encontradas:', tableNames.join(', '));

    // Verificar estrutura de tabelas críticas
    const criticalTables = {
      'chamados_pecas': ['id', 'chamado_id', 'peca_id', 'quantidade', 'valor_unitario'],
      'chamados': ['id', 'cliente_id', 'dispositivo_id', 'titulo', 'status_id'],
      'usuarios': ['id', 'nome', 'email', 'cargo']
    };

    for (const [tableName, expectedColumns] of Object.entries(criticalTables)) {
      if (tableNames.includes(tableName)) {
        const [columns] = await sequelize.query(`DESCRIBE ${tableName}`);
        const columnNames = columns.map(col => col.Field);

        console.log(`📊 ${tableName}: ${columnNames.join(', ')}`);

        const missingColumns = expectedColumns.filter(col => !columnNames.includes(col));
        if (missingColumns.length > 0) {
          console.error(`❌ Colunas faltando em ${tableName}:`, missingColumns);
        }
      } else {
        console.error(`❌ Tabela ${tableName} não encontrada!`);
      }
    }

    // Verificar dados essenciais
    const [statusCount] = await sequelize.query("SELECT COUNT(*) as count FROM status_chamados");
    console.log(`📈 Status de chamados: ${statusCount[0].count} registros`);

    const [userCount] = await sequelize.query("SELECT COUNT(*) as count FROM usuarios");
    console.log(`👥 Usuários: ${userCount[0].count} registros`);

    console.log('🎉 Diagnóstico concluído!');

  } catch (error) {
    console.error('❌ Erro no diagnóstico:', error.message);
  } finally {
    await sequelize.close();
  }
}

if (require.main === module) {
  diagnoseDatabase();
}

module.exports = { diagnoseDatabase };