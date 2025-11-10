/**
 * VERIFICAÇÃO DO ARQUIVO DE BACKUP
 * Verifica se os caracteres especiais estão corretos
 */

const fs = require('fs');
const path = require('path');

const BACKUP_FILE = path.join(__dirname, '..', 'backup-database.sql');

console.log('🔍 VERIFICANDO ENCODING DO BACKUP...\n');

try {
  const content = fs.readFileSync(BACKUP_FILE, 'utf8');
  
  console.log('✅ Arquivo lido com sucesso\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📊 VERIFICAÇÃO DE STATUS:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  
  // Extrai os status
  const statusMatch = content.match(/-- Dados da tabela status_chamados[\s\S]*?INSERT INTO `status_chamados` VALUES[\s\S]*?;/);
  if (statusMatch) {
    const lines = statusMatch[0].split('\n').filter(l => l.includes("'"));
    lines.forEach(line => {
      if (line.trim().startsWith('(')) {
        console.log(line.trim());
      }
    });
  }
  
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📊 VERIFICAÇÃO DE PRIORIDADES:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  
  // Extrai as prioridades
  const prioridadesMatch = content.match(/-- Dados da tabela prioridades[\s\S]*?INSERT INTO `prioridades` VALUES[\s\S]*?;/);
  if (prioridadesMatch) {
    const lines = prioridadesMatch[0].split('\n').filter(l => l.includes("'"));
    lines.forEach(line => {
      if (line.trim().startsWith('(')) {
        console.log(line.trim());
      }
    });
  }
  
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('✅ VERIFICAÇÃO CONCLUÍDA');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  
  // Verificar se há caracteres mal codificados
  const problemas = [];
  if (content.includes('Ã')) problemas.push('Encontrado caractere Ã (possível erro de encoding)');
  if (content.includes('Â')) problemas.push('Encontrado caractere  (possível erro de encoding)');
  
  if (problemas.length > 0) {
    console.log('⚠️  ATENÇÃO: Possíveis problemas encontrados:\n');
    problemas.forEach(p => console.log(`   - ${p}`));
    console.log('');
  } else {
    console.log('✅ Nenhum problema de encoding detectado!');
    console.log('✅ Todos os caracteres especiais estão corretos!\n');
  }
  
  const stats = fs.statSync(BACKUP_FILE);
  console.log(`📦 Tamanho do arquivo: ${(stats.size / 1024).toFixed(2)} KB`);
  console.log(`📄 Arquivo: ${BACKUP_FILE}\n`);
  
} catch (error) {
  console.error('❌ Erro ao verificar arquivo:');
  console.error(error.message);
}
