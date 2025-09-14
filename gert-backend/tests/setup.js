// gert-backend/tests/setup.js
// Setup file for Jest tests

// Mock do Sequelize
jest.mock('sequelize', () => {
  const SequelizeMock = {
    define: jest.fn(),
    authenticate: jest.fn(),
    sync: jest.fn(),
    Op: {
      and: jest.fn(),
      or: jest.fn(),
      like: jest.fn(),
      gte: jest.fn(),
      lte: jest.fn()
    }
  };

  const mockInstance = {
    findAll: jest.fn(),
    findByPk: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
    count: jest.fn(),
    findAndCountAll: jest.fn()
  };

  SequelizeMock.define.mockReturnValue(mockInstance);

  const DataTypesMock = {
    INTEGER: 'INTEGER',
    STRING: jest.fn().mockReturnValue('STRING'),
    TEXT: 'TEXT',
    DECIMAL: jest.fn().mockReturnValue('DECIMAL'),
    DATE: 'DATE',
    BOOLEAN: 'BOOLEAN'
  };

  return {
    Sequelize: jest.fn().mockImplementation(() => SequelizeMock),
    DataTypes: DataTypesMock,
    Op: SequelizeMock.Op
  };
});

// Mock do bcryptjs
jest.mock('bcryptjs', () => ({
  hash: jest.fn().mockResolvedValue('hashed_password'),
  compare: jest.fn().mockResolvedValue(true)
}));

// Mock do jsonwebtoken
jest.mock('jsonwebtoken', () => ({
  sign: jest.fn().mockReturnValue('mock_token'),
  verify: jest.fn().mockReturnValue({ id: 1, nome: 'Test User' })
}));