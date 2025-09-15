// Script melhorado para popular o banco sem duplicatas
const { sequelize } = require('./src/config/database');
const {
  Usuario, StatusChamado, Prioridade, CategoriaDispositivo,
  CategoriaPeca, Servico
} = require('./src/models');
const bcrypt = require('bcryptjs');

async function verificarEInserirDadosIniciais() {
  console.log('🔍 Verificando e inserindo dados iniciais...');

  try {
    // 1. Verificar e criar usuário admin
    console.log('👤 Verificando usuário admin...');
    const adminExistente = await Usuario.findOne({ where: { email: 'admin@gert.com' } });
    if (!adminExistente) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await Usuario.create({
        nome: 'Administrador',
        email: 'admin@gert.com',
        senha: hashedPassword,
        cargo: 'admin',
        ativo: true
      });
      console.log('✅ Usuário admin criado');
    } else {
      console.log('⚠️ Usuário admin já existe');
    }

    // 2. Verificar e criar status de chamados
    console.log('📊 Verificando status de chamados...');
    const statusPadrao = [
      { nome: 'Aberto', descricao: 'Chamado recém-criado, aguardando triagem', cor: '#FF0000' },
      { nome: 'Em análise', descricao: 'Chamado em análise pelo técnico', cor: '#FFA500' },
      { nome: 'Aguardando aprovação', descricao: 'Orçamento enviado, aguardando aprovação do cliente', cor: '#FFFF00' },
      { nome: 'Em andamento', descricao: 'Serviço em execução', cor: '#0000FF' },
      { nome: 'Aguardando peça', descricao: 'Serviço aguardando chegada de peça', cor: '#800080' },
      { nome: 'Concluído', descricao: 'Serviço finalizado', cor: '#008000' },
      { nome: 'Cancelado', descricao: 'Chamado cancelado', cor: '#808080' }
    ];

    for (const status of statusPadrao) {
      const existente = await StatusChamado.findOne({ where: { nome: status.nome } });
      if (!existente) {
        await StatusChamado.create(status);
        console.log(`✅ Status "${status.nome}" criado`);
      } else {
        console.log(`⚠️ Status "${status.nome}" já existe`);
      }
    }

    // 3. Verificar e criar prioridades
    console.log('🎯 Verificando prioridades...');
    const prioridadesPadrao = [
      { nome: 'Baixa', descricao: 'Problema não crítico', cor: '#00FF00' },
      { nome: 'Média', descricao: 'Problema com impacto moderado', cor: '#FFFF00' },
      { nome: 'Alta', descricao: 'Problema crítico que precisa de atenção imediata', cor: '#FF0000' }
    ];

    for (const prioridade of prioridadesPadrao) {
      const existente = await Prioridade.findOne({ where: { nome: prioridade.nome } });
      if (!existente) {
        await Prioridade.create(prioridade);
        console.log(`✅ Prioridade "${prioridade.nome}" criada`);
      } else {
        console.log(`⚠️ Prioridade "${prioridade.nome}" já existe`);
      }
    }

    // 4. Verificar e criar categorias de dispositivos
    console.log('📱 Verificando categorias de dispositivos...');
    const categoriasDispositivoPadrao = [
      { nome: 'Smartphone', descricao: 'Telefones celulares e smartphones' },
      { nome: 'Notebook', descricao: 'Notebooks e laptops' },
      { nome: 'Desktop', descricao: 'Computadores de mesa' },
      { nome: 'Tablet', descricao: 'Tablets e iPads' },
      { nome: 'Impressora', descricao: 'Impressoras e multifuncionais' }
    ];

    for (const categoria of categoriasDispositivoPadrao) {
      const existente = await CategoriaDispositivo.findOne({ where: { nome: categoria.nome } });
      if (!existente) {
        await CategoriaDispositivo.create(categoria);
        console.log(`✅ Categoria de dispositivo "${categoria.nome}" criada`);
      } else {
        console.log(`⚠️ Categoria de dispositivo "${categoria.nome}" já existe`);
      }
    }

    // 5. Verificar e criar categorias de peças
    console.log('🔧 Verificando categorias de peças...');
    const categoriasPecaPadrao = [
      { nome: 'Tela', descricao: 'Displays e telas de reposição' },
      { nome: 'Bateria', descricao: 'Baterias e fontes de alimentação' },
      { nome: 'Memória', descricao: 'Módulos de memória RAM' },
      { nome: 'Armazenamento', descricao: 'HDs, SSDs e unidades de armazenamento' },
      { nome: 'Placa-mãe', descricao: 'Placas-mãe e componentes principais' }
    ];

    for (const categoria of categoriasPecaPadrao) {
      const existente = await CategoriaPeca.findOne({ where: { nome: categoria.nome } });
      if (!existente) {
        await CategoriaPeca.create(categoria);
        console.log(`✅ Categoria de peça "${categoria.nome}" criada`);
      } else {
        console.log(`⚠️ Categoria de peça "${categoria.nome}" já existe`);
      }
    }

    // 6. Verificar e criar serviços padrão
    console.log('🛠️ Verificando serviços padrão...');
    const servicosPadrao = [
      { nome: 'Manutenção Preventiva', descricao: 'Limpeza e verificação geral do equipamento', valorBase: 50.00, tempoEstimado: 60, ativo: true },
      { nome: 'Formatação e Reinstalação', descricao: 'Formatação completa e reinstalação do sistema operacional', valorBase: 80.00, tempoEstimado: 120, ativo: true },
      { nome: 'Troca de Tela', descricao: 'Substituição da tela quebrada ou danificada', valorBase: 150.00, tempoEstimado: 90, ativo: true },
      { nome: 'Troca de Bateria', descricao: 'Substituição da bateria do dispositivo', valorBase: 70.00, tempoEstimado: 30, ativo: true },
      { nome: 'Recuperação de Dados', descricao: 'Recuperação de arquivos perdidos ou corrompidos', valorBase: 200.00, tempoEstimado: 180, ativo: true }
    ];

    for (const servico of servicosPadrao) {
      const existente = await Servico.findOne({ where: { nome: servico.nome } });
      if (!existente) {
        await Servico.create(servico);
        console.log(`✅ Serviço "${servico.nome}" criado`);
      } else {
        console.log(`⚠️ Serviço "${servico.nome}" já existe`);
      }
    }

    console.log('\n🎉 Verificação e população concluída!');
    console.log('📋 Resumo:');
    console.log('   - Dados verificados sem duplicatas');
    console.log('   - Sistema pronto para uso');

  } catch (error) {
    console.error('❌ Erro durante a verificação/população:', error.message);
    throw error;
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  verificarEInserirDadosIniciais()
    .then(() => {
      console.log('✅ Script executado com sucesso');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Script falhou:', error);
      process.exit(1);
    })
    .finally(() => {
      sequelize.close();
    });
}

module.exports = { verificarEInserirDadosIniciais };