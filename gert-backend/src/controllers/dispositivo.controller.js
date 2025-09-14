const dispositivoService = require('../services/dispositivo.service');

const getAllDispositivos = async (req, res, next) => {
  try {
    const dispositivos = await dispositivoService.getAllDispositivos(req.query);
    res.json(dispositivos);
  } catch (error) {
    next(error);
  }
};

const getDispositivoById = async (req, res, next) => {
  try {
    const dispositivo = await dispositivoService.getDispositivoById(req.params.id);
    res.json(dispositivo);
  } catch (error) {
    next(error);
  }
};

const createDispositivo = async (req, res, next) => {
  try {
    const dispositivo = await dispositivoService.createDispositivo(req.body);
    res.status(201).json(dispositivo);
  } catch (error) {
    next(error);
  }
};

const updateDispositivo = async (req, res, next) => {
  try {
    const dispositivo = await dispositivoService.updateDispositivo(req.params.id, req.body);
    res.json(dispositivo);
  } catch (error) {
    next(error);
  }
};

const deleteDispositivo = async (req, res, next) => {
  try {
    await dispositivoService.deleteDispositivo(req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

const getDispositivosByCliente = async (req, res, next) => {
  try {
    const dispositivos = await dispositivoService.getDispositivosByCliente(req.params.clienteId);
    res.json(dispositivos);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllDispositivos,
  getDispositivoById,
  createDispositivo,
  updateDispositivo,
  deleteDispositivo,
  getDispositivosByCliente
};