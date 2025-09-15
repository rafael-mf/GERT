// Script de verificação completa para produção
const { sequelize } = require('./src/config/database');
const { Chamado, ChamadoPeca, Peca, Usuario, Cliente } = require('./src/models');

async function verificarConectividade() {
  console.log('🔍 Verificando conectividade com banco de dados...');
  try {
    await sequelize.authenticate();
    console.log('✅ Conexão com banco estabelecida');
    return true;
  } catch (error) {
    console.error('❌ Erro na conexão:', error.message);
    return false;
  }
}

async function verificarAssociacoes() {
  console.log('🔗 Verificando associações Sequelize...');
  try {
    // Teste 1: Chamado com peças
    const chamadoComPecas = await Chamado.findAll({
      limit: 1,
      include: [{
        model: ChamadoPeca,
        as: 'pecas',
        include: [{ model: Peca, as: 'peca' }]
      }]
    });
    console.log('✅ Associação Chamado->Pecas funcionando');

    // Teste 2: Peças com chamados
    const pecaComChamados = await Peca.findAll({
      limit: 1,
      include: [{
        model: ChamadoPeca,
        as: 'chamadosPecas',
        include: [{ model: Chamado, as: 'chamado' }]
      }]
    });
    console.log('✅ Associação Peca->Chamados funcionando');

    return true;
  } catch (error) {
    console.error('❌ Erro nas associações:', error.message);
    return false;
  }
}

async function verificarTabelas() {
  console.log('📊 Verificando tabelas e estrutura...');
  const tabelas = [
    'usuarios', 'clientes', 'chamados', 'chamados_pecas',
    'pecas', 'dispositivos', 'servicos', 'tecnicos'
  ];

  for (const tabela of tabelas) {
    try {
      const [results] = await sequelize.query(`SELECT COUNT(*) as count FROM ${tabela}`);
      console.log(`✅ Tabela ${tabela}: ${results[0].count} registros`);
    } catch (error) {
      console.error(`❌ Erro na tabela ${tabela}:`, error.message);
      return false;
    }
  }
  return true;
}

async function verificarUsuarioAdmin() {
  console.log('👤 Verificando usuário admin...');
  try {
    const admin = await Usuario.findOne({ where: { email: 'admin@gert.com' } });
    if (admin) {
      console.log('✅ Usuário admin encontrado');
      return true;
    } else {
      console.log('❌ Usuário admin não encontrado');
      return false;
    }
  } catch (error) {
    console.error('❌ Erro ao verificar admin:', error.message);
    return false;
  }
}

async function verificarEstruturaBanco() {
  console.log('🏗️ Verificando estrutura do banco...');
  try {
    // Verificar se as tabelas têm as colunas esperadas
    const [chamadosColumns] = await sequelize.query('DESCRIBE chamados');
    const colunasEsperadas = ['id', 'titulo', 'cliente_id', 'status_id'];
    const colunasPresentes = chamadosColumns.map(col => col.Field);

    for (const coluna of colunasEsperadas) {
      if (!colunasPresentes.includes(coluna)) {
        console.error(`❌ Coluna ${coluna} não encontrada na tabela chamados`);
        return false;
      }
    }

    console.log('✅ Estrutura da tabela chamados OK');
    return true;
  } catch (error) {
    console.error('❌ Erro ao verificar estrutura:', error.message);
    return false;
  }
}

async function executarVerificacoes() {
  console.log('🚀 Iniciando verificações completas do sistema GERT...\n');

  const resultados = {
    conectividade: await verificarConectividade(),
    associacoes: await verificarAssociacoes(),
    tabelas: await verificarTabelas(),
    admin: await verificarUsuarioAdmin(),
    estrutura: await verificarEstruturaBanco()
  };

  console.log('\n📋 RESUMO DAS VERIFICAÇÕES:');
  console.log('='.repeat(50));

  const total = Object.keys(resultados).length;
  const sucesso = Object.values(resultados).filter(r => r).length;

  Object.entries(resultados).forEach(([teste, resultado]) => {
    const status = resultado ? '✅' : '❌';
    console.log(`${status} ${teste}: ${resultado ? 'OK' : 'FALHA'}`);
  });

  console.log('='.repeat(50));
  console.log(`🎯 Status Geral: ${sucesso}/${total} verificações passaram`);

  if (sucesso === total) {
    console.log('🎉 SISTEMA TOTALMENTE FUNCIONAL!');
    process.exit(0);
  } else {
    console.log('⚠️ SISTEMA COM PROBLEMAS - VERIFICAR LOGS ACIMA');
    process.exit(1);
  }
}

// Executar verificações se chamado diretamente
if (require.main === module) {
  executarVerificacoes().catch(error => {
    console.error('💥 ERRO CRÍTICO:', error);
    process.exit(1);
  });
}

module.exports = {
  executarVerificacoes,
  verificarConectividade,
  verificarAssociacoes,
  verificarTabelas,
  verificarUsuarioAdmin,
  verificarEstruturaBanco
};