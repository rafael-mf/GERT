// gert-backend/tests/peca.controller.test.js
const pecaController = require('../src/controllers/peca.controller');

// Mock do serviço
jest.mock('../src/services/peca.service', () => ({
  getAllPecas: jest.fn(),
  getPecaById: jest.fn(),
  createPeca: jest.fn(),
  updatePeca: jest.fn(),
  deletePeca: jest.fn()
}));

const pecaService = require('../src/services/peca.service');

describe('PecaController', () => {
  let mockReq, mockRes, mockNext;

  beforeEach(() => {
    mockReq = {
      params: {},
      query: {},
      body: {}
    };
    mockRes = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    };
    mockNext = jest.fn();
    jest.clearAllMocks();
  });

  describe('getAllPecas', () => {
    it('should return pecas successfully', async () => {
      const mockResult = {
        totalItems: 2,
        totalPages: 1,
        currentPage: 1,
        pecas: [{ id: 1, nome: 'Peça 1' }]
      };

      pecaService.getAllPecas.mockResolvedValue(mockResult);

      await pecaController.getAllPecas(mockReq, mockRes, mockNext);

      expect(pecaService.getAllPecas).toHaveBeenCalledWith({});
      expect(mockRes.json).toHaveBeenCalledWith(mockResult);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should call next with error if service throws', async () => {
      const error = new Error('Database error');
      pecaService.getAllPecas.mockRejectedValue(error);

      await pecaController.getAllPecas(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
      expect(mockRes.json).not.toHaveBeenCalled();
    });
  });

  describe('getPecaById', () => {
    it('should return peca successfully', async () => {
      const mockPeca = { id: 1, nome: 'Peça 1' };
      mockReq.params.id = '1';

      pecaService.getPecaById.mockResolvedValue(mockPeca);

      await pecaController.getPecaById(mockReq, mockRes, mockNext);

      expect(pecaService.getPecaById).toHaveBeenCalledWith('1');
      expect(mockRes.json).toHaveBeenCalledWith(mockPeca);
    });

    it('should return 404 if peca not found', async () => {
      const error = new Error('Peça não encontrada');
      mockReq.params.id = '999';

      pecaService.getPecaById.mockRejectedValue(error);

      await pecaController.getPecaById(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Peça não encontrada' });
      expect(mockNext).not.toHaveBeenCalled();
    });
  });

  describe('createPeca', () => {
    it('should create peca successfully', async () => {
      const pecaData = { nome: 'Nova Peça', codigo: 'PEC001' };
      const mockCreatedPeca = { id: 1, ...pecaData };
      mockReq.body = pecaData;

      pecaService.createPeca.mockResolvedValue(mockCreatedPeca);

      await pecaController.createPeca(mockReq, mockRes, mockNext);

      expect(pecaService.createPeca).toHaveBeenCalledWith(pecaData);
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith(mockCreatedPeca);
    });

    it('should return 400 if codigo already exists', async () => {
      const error = new Error('Código da peça já cadastrado');
      mockReq.body = { nome: 'Peça', codigo: 'PEC001' };

      pecaService.createPeca.mockRejectedValue(error);

      await pecaController.createPeca(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Código da peça já cadastrado' });
    });
  });
});