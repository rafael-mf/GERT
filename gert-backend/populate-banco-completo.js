/**
 * Script Completo de População do Banco de Dados
 * Cria dados de teste realistas para todo o sistema GERT
 */

const { sequelize } = require('./src/config/database');
const {
  Usuario,
  Tecnico,
  Cliente,
  Dispositivo,
  StatusChamado,
  Prioridade,
  CategoriaDispositivo,
  CategoriaPeca,
  Peca,
  Servico,
  Chamado,
  ChamadoServico,
  ChamadoPeca,
  ChamadoAtualizacao
} = require('./src/models');
const bcrypt = require('bcryptjs');

// Função para gerar data aleatória
function randomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

// Função para selecionar item aleatório
function randomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

// Função para gerar CPF fake
function generateCPF() {
  const random = () => Math.floor(Math.random() * 9);
  return `${random()}${random()}${random()}.${random()}${random()}${random()}.${random()}${random()}${random()}-${random()}${random()}`;
}

// Função para gerar telefone fake
function generatePhone() {
  return `(${Math.floor(Math.random() * 90) + 10}) ${Math.floor(Math.random() * 90000) + 10000}-${Math.floor(Math.random() * 9000) + 1000}`;
}

async function popularBancoCompleto() {
  console.log('🚀 INICIANDO POPULAÇÃO COMPLETA DO BANCO DE DADOS');
  console.log('=' .repeat(60));

  try {
    // Limpar contador
    let totalCriado = 0;

    // ========================================
    // 1. DADOS BÁSICOS (TABELAS DE APOIO)
    // ========================================
    
    console.log('\n📊 1. Criando Status de Chamados...');
    const statusData = [
      { nome: 'Aberto', descricao: 'Chamado recém-criado', cor: '#dc3545' },
      { nome: 'Em Análise', descricao: 'Técnico analisando o problema', cor: '#ffc107' },
      { nome: 'Aguardando Aprovação', descricao: 'Orçamento enviado ao cliente', cor: '#17a2b8' },
      { nome: 'Em Andamento', descricao: 'Reparo em execução', cor: '#007bff' },
      { nome: 'Aguardando Peça', descricao: 'Aguardando chegada de componente', cor: '#6c757d' },
      { nome: 'Concluído', descricao: 'Serviço finalizado', cor: '#28a745' },
      { nome: 'Cancelado', descricao: 'Chamado cancelado', cor: '#343a40' }
    ];

    const statusCriados = [];
    for (const status of statusData) {
      const [item, created] = await StatusChamado.findOrCreate({
        where: { nome: status.nome },
        defaults: status
      });
      statusCriados.push(item);
      if (created) totalCriado++;
    }
    console.log(`   ✅ ${statusCriados.length} status disponíveis`);

    console.log('\n🎯 2. Criando Prioridades...');
    const prioridadesData = [
      { nome: 'Baixa', descricao: 'Pode aguardar', cor: '#28a745' },
      { nome: 'Média', descricao: 'Atenção normal', cor: '#ffc107' },
      { nome: 'Alta', descricao: 'Urgente', cor: '#fd7e14' },
      { nome: 'Crítica', descricao: 'Emergência', cor: '#dc3545' }
    ];

    const prioridadesCriadas = [];
    for (const prioridade of prioridadesData) {
      const [item, created] = await Prioridade.findOrCreate({
        where: { nome: prioridade.nome },
        defaults: prioridade
      });
      prioridadesCriadas.push(item);
      if (created) totalCriado++;
    }
    console.log(`   ✅ ${prioridadesCriadas.length} prioridades disponíveis`);

    console.log('\n📱 3. Criando Categorias de Dispositivos...');
    const categoriasDispositivoData = [
      { nome: 'Smartphone', descricao: 'Celulares e smartphones' },
      { nome: 'Notebook', descricao: 'Notebooks e laptops' },
      { nome: 'Desktop', descricao: 'Computadores de mesa' },
      { nome: 'Tablet', descricao: 'Tablets e iPads' },
      { nome: 'Impressora', descricao: 'Impressoras e multifuncionais' },
      { nome: 'Monitor', descricao: 'Monitores e displays' },
      { nome: 'Roteador', descricao: 'Roteadores e switches' }
    ];

    const categoriasDispositivoCriadas = [];
    for (const cat of categoriasDispositivoData) {
      const [item, created] = await CategoriaDispositivo.findOrCreate({
        where: { nome: cat.nome },
        defaults: cat
      });
      categoriasDispositivoCriadas.push(item);
      if (created) totalCriado++;
    }
    console.log(`   ✅ ${categoriasDispositivoCriadas.length} categorias de dispositivos`);

    console.log('\n🔧 4. Criando Categorias de Peças...');
    const categoriasPecaData = [
      { nome: 'Tela/Display', descricao: 'Telas e displays' },
      { nome: 'Bateria', descricao: 'Baterias e fontes' },
      { nome: 'Memória RAM', descricao: 'Módulos de memória' },
      { nome: 'Armazenamento', descricao: 'HDs e SSDs' },
      { nome: 'Placa-Mãe', descricao: 'Placas-mãe' },
      { nome: 'Processador', descricao: 'CPUs e processadores' },
      { nome: 'Periféricos', descricao: 'Cabos, mouse, teclado' },
      { nome: 'Resfriamento', descricao: 'Coolers e dissipadores' }
    ];

    const categoriasPecaCriadas = [];
    for (const cat of categoriasPecaData) {
      const [item, created] = await CategoriaPeca.findOrCreate({
        where: { nome: cat.nome },
        defaults: cat
      });
      categoriasPecaCriadas.push(item);
      if (created) totalCriado++;
    }
    console.log(`   ✅ ${categoriasPecaCriadas.length} categorias de peças`);

    console.log('\n🛠️ 5. Criando Serviços...');
    const servicosData = [
      { nome: 'Manutenção Preventiva', descricao: 'Limpeza e verificação', valorBase: 50.00, tempoEstimado: 60 },
      { nome: 'Formatação', descricao: 'Reinstalação do SO', valorBase: 80.00, tempoEstimado: 120 },
      { nome: 'Troca de Tela', descricao: 'Substituição de display', valorBase: 150.00, tempoEstimado: 90 },
      { nome: 'Troca de Bateria', descricao: 'Substituição de bateria', valorBase: 70.00, tempoEstimado: 30 },
      { nome: 'Recuperação de Dados', descricao: 'Recuperação de arquivos', valorBase: 200.00, tempoEstimado: 180 },
      { nome: 'Upgrade de Hardware', descricao: 'Instalação de componentes', valorBase: 60.00, tempoEstimado: 45 },
      { nome: 'Remoção de Vírus', descricao: 'Limpeza de malware', valorBase: 90.00, tempoEstimado: 90 },
      { nome: 'Configuração de Rede', descricao: 'Setup de rede', valorBase: 100.00, tempoEstimado: 60 },
      { nome: 'Backup de Dados', descricao: 'Backup completo', valorBase: 50.00, tempoEstimado: 120 },
      { nome: 'Instalação de Software', descricao: 'Instalação de programas', valorBase: 40.00, tempoEstimado: 30 }
    ];

    const servicosCriados = [];
    for (const servico of servicosData) {
      const [item, created] = await Servico.findOrCreate({
        where: { nome: servico.nome },
        defaults: { ...servico, ativo: true }
      });
      servicosCriados.push(item);
      if (created) totalCriado++;
    }
    console.log(`   ✅ ${servicosCriados.length} serviços cadastrados`);

    // ========================================
    // 2. USUÁRIOS E TÉCNICOS
    // ========================================

    console.log('\n👤 6. Criando Usuários...');
    const hashedPassword = await bcrypt.hash('Admin@123', 10);

    // Admin
    const [admin] = await Usuario.findOrCreate({
      where: { email: 'admin@gert.com' },
      defaults: {
        nome: 'Administrador do Sistema',
        email: 'admin@gert.com',
        senha: hashedPassword,
        cargo: 'Admin',
        ativo: true
      }
    });

    // Atendentes
    const atendentes = [];
    const nomeAtendentes = ['Ana Silva', 'Carlos Santos', 'Mariana Costa'];
    for (let i = 0; i < nomeAtendentes.length; i++) {
      const [user, created] = await Usuario.findOrCreate({
        where: { email: `atendente${i + 1}@gert.com` },
        defaults: {
          nome: nomeAtendentes[i],
          email: `atendente${i + 1}@gert.com`,
          senha: hashedPassword,
          cargo: 'Atendente',
          ativo: true
        }
      });
      atendentes.push(user);
      if (created) totalCriado++;
    }

    // Técnicos
    console.log('   Criando técnicos...');
    const tecnicosData = [
      { nome: 'João Oliveira', email: 'joao@gert.com', especialidade: 'Hardware' },
      { nome: 'Maria Santos', email: 'maria@gert.com', especialidade: 'Software' },
      { nome: 'Pedro Lima', email: 'pedro@gert.com', especialidade: 'Redes' },
      { nome: 'Julia Ferreira', email: 'julia@gert.com', especialidade: 'Smartphones' },
      { nome: 'Lucas Rodrigues', email: 'lucas@gert.com', especialidade: 'Notebooks' }
    ];

    const tecnicosCriados = [];
    for (const tecData of tecnicosData) {
      const [usuario, userCreated] = await Usuario.findOrCreate({
        where: { email: tecData.email },
        defaults: {
          nome: tecData.nome,
          email: tecData.email,
          senha: hashedPassword,
          cargo: 'Técnico',
          ativo: true
        }
      });

      const [tecnico, tecCreated] = await Tecnico.findOrCreate({
        where: { usuarioId: usuario.id },
        defaults: {
          usuarioId: usuario.id,
          especialidade: tecData.especialidade,
          disponivel: true
        }
      });

      tecnicosCriados.push(tecnico);
      if (userCreated || tecCreated) totalCriado++;
    }
    console.log(`   ✅ ${tecnicosCriados.length} técnicos cadastrados`);

    // ========================================
    // 3. CLIENTES E DISPOSITIVOS
    // ========================================

    console.log('\n👥 7. Criando Clientes e Dispositivos...');
    const clientesData = [
      { nome: 'Empresa Tech Solutions Ltda', tipo: 'PJ', cidade: 'São Paulo', estado: 'SP' },
      { nome: 'José da Silva', tipo: 'PF', cidade: 'Rio de Janeiro', estado: 'RJ' },
      { nome: 'Maria Eduarda Souza', tipo: 'PF', cidade: 'Belo Horizonte', estado: 'MG' },
      { nome: 'Escola Municipal Centro', tipo: 'PJ', cidade: 'Curitiba', estado: 'PR' },
      { nome: 'Carlos Alberto Costa', tipo: 'PF', cidade: 'Porto Alegre', estado: 'RS' },
      { nome: 'Ana Paula Martins', tipo: 'PF', cidade: 'Brasília', estado: 'DF' },
      { nome: 'Comércio de Eletrônicos XYZ', tipo: 'PJ', cidade: 'Fortaleza', estado: 'CE' },
      { nome: 'Roberto Alves Santos', tipo: 'PF', cidade: 'Salvador', estado: 'BA' },
      { nome: 'Consultoria ABC Ltda', tipo: 'PJ', cidade: 'Recife', estado: 'PE' },
      { nome: 'Patricia Fernandes', tipo: 'PF', cidade: 'Manaus', estado: 'AM' },
      { nome: 'Francisco Gomes', tipo: 'PF', cidade: 'Goiânia', estado: 'GO' },
      { nome: 'Isabela Rodrigues', tipo: 'PF', cidade: 'Vitória', estado: 'ES' },
      { nome: 'Escritório Legal & Cia', tipo: 'PJ', cidade: 'Florianópolis', estado: 'SC' },
      { nome: 'Marcos Vinícius Lima', tipo: 'PF', cidade: 'Natal', estado: 'RN' },
      { nome: 'Juliana Castro', tipo: 'PF', cidade: 'João Pessoa', estado: 'PB' }
    ];

    const clientesCriados = [];
    const dispositivosCriados = [];

    for (const clienteData of clientesData) {
      const [cliente, created] = await Cliente.findOrCreate({
        where: { email: `${clienteData.nome.toLowerCase().replace(/\s+/g, '.')}@email.com` },
        defaults: {
          nome: clienteData.nome,
          cpfCnpj: generateCPF(),
          email: `${clienteData.nome.toLowerCase().replace(/\s+/g, '.')}@email.com`,
          telefone: generatePhone(),
          endereco: `Rua Exemplo, ${Math.floor(Math.random() * 1000)}`,
          cidade: clienteData.cidade,
          estado: clienteData.estado,
          cep: `${Math.floor(Math.random() * 90000) + 10000}-${Math.floor(Math.random() * 900) + 100}`,
          observacoes: clienteData.tipo === 'PJ' ? 'Cliente empresarial' : 'Cliente pessoa física'
        }
      });

      clientesCriados.push(cliente);
      if (created) totalCriado++;

      // Criar 1-3 dispositivos para cada cliente
      const numDispositivos = Math.floor(Math.random() * 3) + 1;
      for (let i = 0; i < numDispositivos; i++) {
        const categoria = randomItem(categoriasDispositivoCriadas);
        const marcas = {
          'Smartphone': ['Apple', 'Samsung', 'Xiaomi', 'Motorola'],
          'Notebook': ['Dell', 'Lenovo', 'HP', 'Asus'],
          'Desktop': ['Dell', 'HP', 'Positivo', 'Acer'],
          'Tablet': ['Apple', 'Samsung', 'Lenovo'],
          'Impressora': ['HP', 'Epson', 'Canon', 'Brother']
        };

        const marca = randomItem(marcas[categoria.nome] || ['Genérico']);
        
        const [dispositivo, devCreated] = await Dispositivo.findOrCreate({
          where: {
            clienteId: cliente.id,
            modelo: `${marca} ${categoria.nome} ${Math.floor(Math.random() * 100)}`
          },
          defaults: {
            clienteId: cliente.id,
            categoriaId: categoria.id,
            marca: marca,
            modelo: `${marca} ${categoria.nome} ${Math.floor(Math.random() * 100)}`,
            numeroSerie: `SN${Date.now()}${Math.floor(Math.random() * 1000)}`,
            especificacoes: 'Especificações padrão',
            dataCadastro: randomDate(new Date(2024, 0, 1), new Date())
          }
        });

        dispositivosCriados.push(dispositivo);
        if (devCreated) totalCriado++;
      }
    }
    console.log(`   ✅ ${clientesCriados.length} clientes criados`);
    console.log(`   ✅ ${dispositivosCriados.length} dispositivos criados`);

    // ========================================
    // 4. PEÇAS
    // ========================================

    console.log('\n🔩 8. Criando Peças de Estoque...');
    const pecasData = [
      // Telas
      { categoria: 'Tela/Display', nome: 'Tela iPhone 12', codigo: 'TEL-IP12', marca: 'Apple', preco: 450 },
      { categoria: 'Tela/Display', nome: 'Tela Samsung S21', codigo: 'TEL-SS21', marca: 'Samsung', preco: 380 },
      { categoria: 'Tela/Display', nome: 'Tela Notebook 15.6"', codigo: 'TEL-NB15', marca: 'Genérico', preco: 250 },
      
      // Baterias
      { categoria: 'Bateria', nome: 'Bateria iPhone 11', codigo: 'BAT-IP11', marca: 'Apple', preco: 120 },
      { categoria: 'Bateria', nome: 'Bateria Notebook Dell', codigo: 'BAT-DELL', marca: 'Dell', preco: 180 },
      { categoria: 'Bateria', nome: 'Bateria Motorola G8', codigo: 'BAT-MG8', marca: 'Motorola', preco: 80 },
      
      // Memória
      { categoria: 'Memória RAM', nome: 'RAM 8GB DDR4', codigo: 'RAM-8GB', marca: 'Kingston', preco: 150 },
      { categoria: 'Memória RAM', nome: 'RAM 16GB DDR4', codigo: 'RAM-16GB', marca: 'Corsair', preco: 280 },
      
      // Armazenamento
      { categoria: 'Armazenamento', nome: 'SSD 240GB', codigo: 'SSD-240', marca: 'Kingston', preco: 200 },
      { categoria: 'Armazenamento', nome: 'SSD 480GB', codigo: 'SSD-480', marca: 'Samsung', preco: 350 },
      { categoria: 'Armazenamento', nome: 'HD 1TB', codigo: 'HD-1TB', marca: 'Seagate', preco: 250 },
      
      // Outros
      { categoria: 'Periféricos', nome: 'Cabo HDMI 2m', codigo: 'CAB-HDMI', marca: 'Genérico', preco: 25 },
      { categoria: 'Periféricos', nome: 'Mouse USB', codigo: 'MOU-USB', marca: 'Logitech', preco: 45 },
      { categoria: 'Resfriamento', nome: 'Cooler para CPU', codigo: 'COOL-CPU', marca: 'Cooler Master', preco: 80 }
    ];

    const pecasCriadas = [];
    for (const pecaData of pecasData) {
      const categoria = categoriasPecaCriadas.find(c => c.nome === pecaData.categoria);
      if (!categoria) continue;

      const [peca, created] = await Peca.findOrCreate({
        where: { codigo: pecaData.codigo },
        defaults: {
          categoriaId: categoria.id,
          codigo: pecaData.codigo,
          nome: pecaData.nome,
          descricao: `Peça original de qualidade`,
          marca: pecaData.marca,
          modelo: pecaData.nome,
          precoCusto: pecaData.preco * 0.6,
          precoVenda: pecaData.preco,
          estoqueMinimo: 5,
          estoqueAtual: Math.floor(Math.random() * 50) + 10,
          localizacao: `Prateleira ${Math.floor(Math.random() * 10) + 1}`,
          ativo: true
        }
      });

      pecasCriadas.push(peca);
      if (created) totalCriado++;
    }
    console.log(`   ✅ ${pecasCriadas.length} peças em estoque`);

    // ========================================
    // 5. CHAMADOS
    // ========================================

    console.log('\n📞 9. Criando Chamados (pode demorar um pouco)...');
    const chamadosCriados = [];
    const numChamados = 50; // Criar 50 chamados de teste

    const problemasComuns = [
      'Tela quebrada após queda',
      'Não liga - suspeita de bateria',
      'Sistema operacional lento',
      'Vírus/malware detectado',
      'Sem acesso à internet',
      'Impressora não imprime',
      'Superaquecimento',
      'Barulho estranho no HD',
      'Teclas não funcionam',
      'Problemas no carregamento',
      'Aplicativos travando',
      'Perda de dados - necessário recuperação',
      'Atualização de hardware solicitada',
      'Configuração de rede necessária',
      'Backup de dados urgente'
    ];

    for (let i = 0; i < numChamados; i++) {
      const cliente = randomItem(clientesCriados);
      const dispositivo = randomItem(dispositivosCriados.filter(d => d.clienteId === cliente.id));
      
      if (!dispositivo) continue;

      const status = randomItem(statusCriados);
      const prioridade = randomItem(prioridadesCriadas);
      const tecnico = Math.random() > 0.3 ? randomItem(tecnicosCriados) : null;
      const problema = randomItem(problemasComuns);
      
      const dataAbertura = randomDate(new Date(2024, 6, 1), new Date());
      const emAndamento = ['Em Andamento', 'Aguardando Peça', 'Concluído'].includes(status.nome);
      const concluido = status.nome === 'Concluído';
      
      const dataPrevista = emAndamento ? new Date(dataAbertura.getTime() + Math.random() * 7 * 24 * 60 * 60 * 1000) : null;
      const dataFechamento = concluido ? new Date(dataAbertura.getTime() + Math.random() * 10 * 24 * 60 * 60 * 1000) : null;

      const chamado = await Chamado.create({
        clienteId: cliente.id,
        dispositivoId: dispositivo.id,
        tecnicoId: tecnico ? tecnico.id : null,
        prioridadeId: prioridade.id,
        statusId: status.id,
        titulo: problema,
        descricao: `Cliente relata: ${problema}. Necessário verificação técnica.`,
        diagnostico: emAndamento ? `Diagnóstico inicial realizado. ${problema}.` : null,
        solucao: concluido ? `Problema resolvido com sucesso. ${problema} foi solucionado.` : null,
        valorTotal: concluido ? Math.random() * 500 + 100 : null,
        dataAbertura: dataAbertura,
        dataPrevista: dataPrevista,
        dataFechamento: dataFechamento
      });

      chamadosCriados.push(chamado);
      totalCriado++;

      // Adicionar serviços ao chamado (50% de chance)
      if (Math.random() > 0.5 && emAndamento) {
        const numServicos = Math.floor(Math.random() * 2) + 1;
        for (let j = 0; j < numServicos; j++) {
          const servico = randomItem(servicosCriados);
          await ChamadoServico.create({
            chamadoId: chamado.id,
            servicoId: servico.id,
            valor: servico.valorBase,
            observacoes: 'Serviço padrão'
          });
          totalCriado++;
        }
      }

      // Adicionar peças ao chamado (30% de chance)
      if (Math.random() > 0.7 && emAndamento && pecasCriadas.length > 0) {
        const peca = randomItem(pecasCriadas);
        await ChamadoPeca.create({
          chamadoId: chamado.id,
          pecaId: peca.id,
          quantidade: 1,
          valorUnitario: peca.precoVenda
        });
        totalCriado++;
      }

      // Adicionar atualizações ao chamado
      if (emAndamento || concluido) {
        const numAtualizacoes = Math.floor(Math.random() * 3) + 1;
        for (let j = 0; j < numAtualizacoes; j++) {
          await ChamadoAtualizacao.create({
            chamadoId: chamado.id,
            usuarioId: tecnico ? tecnico.usuarioId : admin.id,
            tipo: randomItem(['comentario', 'mudanca_status']),
            comentario: `Atualização ${j + 1}: ${randomItem(['Em análise', 'Aguardando peça', 'Teste realizado', 'Cliente contatado'])}`,
            statusAnteriorId: statusCriados[0].id,
            statusNovoId: status.id,
            dataAtualizacao: new Date(dataAbertura.getTime() + j * 24 * 60 * 60 * 1000)
          });
          totalCriado++;
        }
      }
    }
    console.log(`   ✅ ${chamadosCriados.length} chamados criados com serviços e peças`);

    // ========================================
    // RESUMO FINAL
    // ========================================

    console.log('\n' + '='.repeat(60));
    console.log('🎉 POPULAÇÃO DO BANCO CONCLUÍDA COM SUCESSO!');
    console.log('='.repeat(60));
    console.log(`\n📊 RESUMO:`);
    console.log(`   • ${statusCriados.length} Status de Chamados`);
    console.log(`   • ${prioridadesCriadas.length} Prioridades`);
    console.log(`   • ${categoriasDispositivoCriadas.length} Categorias de Dispositivos`);
    console.log(`   • ${categoriasPecaCriadas.length} Categorias de Peças`);
    console.log(`   • ${servicosCriados.length} Serviços`);
    console.log(`   • ${tecnicosCriados.length} Técnicos`);
    console.log(`   • ${clientesCriados.length} Clientes`);
    console.log(`   • ${dispositivosCriados.length} Dispositivos`);
    console.log(`   • ${pecasCriadas.length} Peças em Estoque`);
    console.log(`   • ${chamadosCriados.length} Chamados com histórico`);
    console.log(`\n   💾 Total de registros criados: ~${totalCriado}`);
    
    console.log('\n✅ Credenciais de Acesso:');
    console.log('   Admin:     admin@gert.com / 123456');
    console.log('   Técnico:   joao@gert.com / 123456');
    console.log('   Atendente: atendente1@gert.com / 123456');
    
    console.log('\n🚀 Banco pronto para testes!');

  } catch (error) {
    console.error('\n❌ ERRO durante a população:', error);
    console.error(error.stack);
    throw error;
  }
}

// Executar
if (require.main === module) {
  console.log('\n⚠️  ATENÇÃO: Este script irá popular o banco com dados de teste.');
  console.log('    Certifique-se de que está usando um banco de DESENVOLVIMENTO!\n');

  popularBancoCompleto()
    .then(() => {
      console.log('\n✅ Script finalizado com sucesso!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Script falhou:', error.message);
      process.exit(1);
    })
    .finally(() => {
      sequelize.close();
    });
}

module.exports = { popularBancoCompleto };
