// gert-backend/tests/peca.service.test.js
const pecaService = require('../src/services/peca.service');

// Mock dos modelos
jest.mock('../src/models', () => ({
  Peca: {
    findAndCountAll: jest.fn(),
    findByPk: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn()
  },
  CategoriaPeca: {
    findByPk: jest.fn(),
    findOne: jest.fn()
  }
}));

const { Peca, CategoriaPeca } = require('../src/models');

describe('PecaService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllPecas', () => {
    it('should return paginated pecas', async () => {
      const mockPecas = [
        { id: 1, nome: 'Peça 1', ativo: true },
        { id: 2, nome: 'Peça 2', ativo: true }
      ];

      Peca.findAndCountAll.mockResolvedValue({
        count: 2,
        rows: mockPecas
      });

      const result = await pecaService.getAllPecas({ page: 1, limit: 10 });

      expect(result).toEqual({
        totalItems: 2,
        totalPages: 1,
        currentPage: 1,
        pecas: mockPecas
      });
      expect(Peca.findAndCountAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { ativo: true },
          limit: 10,
          offset: 0
        })
      );
    });
  });

  describe('createPeca', () => {
    it('should create a new peca successfully', async () => {
      const pecaData = {
        categoriaId: 1,
        codigo: 'PEC001',
        nome: 'Peça Teste',
        estoqueMinimo: 5
      };

      const mockCreatedPeca = { id: 1, ...pecaData };

      Peca.findOne.mockResolvedValue(null); // Código não existe
      CategoriaPeca.findByPk.mockResolvedValue({ id: 1, nome: 'Categoria 1' });
      Peca.create.mockResolvedValue(mockCreatedPeca);

      const result = await pecaService.createPeca(pecaData);

      expect(result).toEqual(mockCreatedPeca);
      expect(Peca.create).toHaveBeenCalledWith(
        expect.objectContaining({
          ...pecaData,
          dataCadastro: expect.any(Date),
          ativo: true
        })
      );
    });

    it('should throw error if codigo already exists', async () => {
      const pecaData = {
        categoriaId: 1,
        codigo: 'PEC001',
        nome: 'Peça Teste',
        estoqueMinimo: 5
      };

      Peca.findOne.mockResolvedValue({ id: 2, codigo: 'PEC001' });

      await expect(pecaService.createPeca(pecaData)).rejects.toThrow('Código da peça já cadastrado');
    });
  });

  describe('getPecaById', () => {
    it('should return peca by id', async () => {
      const mockPeca = { id: 1, nome: 'Peça 1', categoria: { id: 1, nome: 'Categoria 1' } };

      Peca.findByPk.mockResolvedValue(mockPeca);

      const result = await pecaService.getPecaById(1);

      expect(result).toEqual(mockPeca);
      expect(Peca.findByPk).toHaveBeenCalledWith(1, expect.any(Object));
    });

    it('should throw error if peca not found', async () => {
      Peca.findByPk.mockResolvedValue(null);

      await expect(pecaService.getPecaById(999)).rejects.toThrow('Peça não encontrada');
    });
  });
});