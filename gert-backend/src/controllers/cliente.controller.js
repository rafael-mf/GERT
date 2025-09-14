const clienteService = require('../services/cliente.service');

const getAllClientes = async (req, res, next) => {
  try {
    const clientes = await clienteService.getAllClientes(req.query);
    res.json(clientes);
  } catch (error) {
    next(error);
  }
};

const getClienteById = async (req, res, next) => {
  try {
    const cliente = await clienteService.getClienteById(req.params.id);
    if (!cliente) {
      return res.status(404).json({ message: 'Cliente não encontrado' });
    }
    res.json(cliente);
  } catch (error) {
    next(error);
  }
};

const createCliente = async (req, res, next) => {
  try {
    const cliente = await clienteService.createCliente(req.body);
    res.status(201).json(cliente);
  } catch (error) {
    next(error);
  }
};

const updateCliente = async (req, res, next) => {
  try {
    const cliente = await clienteService.updateCliente(req.params.id, req.body);
    res.json(cliente);
  } catch (error) {
    next(error);
  }
};

const deleteCliente = async (req, res, next) => {
  try {
    await clienteService.deleteCliente(req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

// --- SUA NOVA FUNÇÃO AQUI ---
const createDispositivoForCliente = async (req, res, next) => {
  try {
    const { clienteId } = req.params;
    const dispositivo = await clienteService.createDispositivoForCliente(clienteId, req.body);
    res.status(201).json(dispositivo);
  } catch (error) {
    next(error);
  }
};


// --- EXPORTANDO A NOVA FUNÇÃO JUNTO COM AS OUTRAS ---
module.exports = {
  getAllClientes,
  getClienteById,
  createCliente,
  updateCliente,
  deleteCliente,
  createDispositivoForCliente, // Adicione a nova função aqui
};