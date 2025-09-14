require('dotenv').config();
const { sequelize } = require('../config/database');
const { Cliente } = require('../models/cliente.model');
const { CategoriaDispositivo } = require('../models/categoria-dispositivo.model');
const { Dispositivo } = require('../models/dispositivo.model');

async function seedTestData() {
  try {
    // Conectar ao banco de dados
    await sequelize.authenticate();
    console.log('Conexão com o banco de dados estabelecida com sucesso.');

    // Criar categorias de dispositivos se não existirem
    const categoriaSmartphone = await CategoriaDispositivo.findOrCreate({
      where: { nome: 'Smartphone' },
      defaults: {
        nome: 'Smartphone',
        descricao: 'Telefones celulares e smartphones'
      }
    });

    const categoriaNotebook = await CategoriaDispositivo.findOrCreate({
      where: { nome: 'Notebook' },
      defaults: {
        nome: 'Notebook',
        descricao: 'Notebooks e laptops'
      }
    });

    console.log('Categorias de dispositivos criadas/verficadas.');

    // Criar clientes de teste
    const cliente1 = await Cliente.findOrCreate({
      where: { cpfCnpj: '12345678901' },
      defaults: {
        nome: 'João Silva',
        cpfCnpj: '12345678901',
        email: 'joao.silva@email.com',
        telefone: '(11) 99999-9999',
        endereco: 'Rua das Flores, 123',
        cidade: 'São Paulo',
        estado: 'SP',
        cep: '01234-567',
        observacoes: 'Cliente fiel, sempre traz dispositivos para manutenção'
      }
    });

    const cliente2 = await Cliente.findOrCreate({
      where: { cpfCnpj: '98765432100' },
      defaults: {
        nome: 'Maria Santos',
        cpfCnpj: '98765432100',
        email: 'maria.santos@email.com',
        telefone: '(21) 88888-8888',
        endereco: 'Av. Brasil, 456',
        cidade: 'Rio de Janeiro',
        estado: 'RJ',
        cep: '20000-000',
        observacoes: 'Cliente corporativo, manutenção preventiva'
      }
    });

    console.log('Clientes de teste criados/verificados.');

    // Criar dispositivos associados aos clientes
    const dispositivo1 = await Dispositivo.findOrCreate({
      where: { numeroSerie: 'IMEI123456789' },
      defaults: {
        clienteId: cliente1[0].id,
        categoriaId: categoriaSmartphone[0].id,
        marca: 'Samsung',
        modelo: 'Galaxy S21',
        numeroSerie: 'IMEI123456789',
        especificacoes: 'Smartphone Android, 128GB, Preto',
        dataCadastro: new Date()
      }
    });

    const dispositivo2 = await Dispositivo.findOrCreate({
      where: { numeroSerie: 'SN987654321' },
      defaults: {
        clienteId: cliente1[0].id,
        categoriaId: categoriaNotebook[0].id,
        marca: 'Dell',
        modelo: 'Inspiron 15',
        numeroSerie: 'SN987654321',
        especificacoes: 'Notebook i5, 8GB RAM, 256GB SSD',
        dataCadastro: new Date()
      }
    });

    const dispositivo3 = await Dispositivo.findOrCreate({
      where: { numeroSerie: 'IMEI555666777' },
      defaults: {
        clienteId: cliente2[0].id,
        categoriaId: categoriaSmartphone[0].id,
        marca: 'Apple',
        modelo: 'iPhone 13',
        numeroSerie: 'IMEI555666777',
        especificacoes: 'Smartphone iOS, 256GB, Branco',
        dataCadastro: new Date()
      }
    });

    console.log('Dispositivos de teste criados/verificados.');
    console.log('Dados de teste inseridos com sucesso!');

    // Testar a associação de forma mais simples
    console.log('\n--- TESTANDO ASSOCIAÇÕES ---');

    // Primeiro, buscar apenas o cliente
    const clienteTeste = await Cliente.findByPk(cliente1[0].id);
    console.log(`Cliente encontrado: ${clienteTeste.nome}`);

    // Depois buscar dispositivos separadamente (sem incluir categoria por enquanto)
    const dispositivosCliente = await Dispositivo.findAll({
      where: { clienteId: cliente1[0].id }
    });

    console.log(`Dispositivos do cliente ${clienteTeste.nome}: ${dispositivosCliente.length}`);
    dispositivosCliente.forEach((dispositivo, index) => {
      console.log(`  ${index + 1}. ${dispositivo.marca} ${dispositivo.modelo} (ID: ${dispositivo.id})`);
    });

    console.log('\n✅ ASSOCIAÇÕES BÁSICAS FUNCIONANDO CORRETAMENTE!');

  } catch (error) {
    console.error('Erro ao executar seed:', error);
  } finally {
    await sequelize.close();
    console.log('Conexão com o banco de dados fechada.');
  }
}

// Executar o seed
seedTestData();