const jwt = require('jsonwebtoken');
const { Usuario } = require('../models/usuario.model');

const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Token não fornecido' });
    }
    
    const token = authHeader.split(' ')[1];
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const usuario = await Usuario.findByPk(decoded.id);
    
    if (!usuario) {
      return res.status(401).json({ message: 'Usuário não encontrado' });
    }
    
    if (!usuario.ativo) {
      return res.status(401).json({ message: 'Usuário desativado' });
    }
    
    req.usuario = usuario;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expirado' });
    }
    return res.status(401).json({ message: 'Token inválido' });
  }
};

const isAdmin = (req, res, next) => {
  if (req.usuario && req.usuario.cargo === 'Administrador') {
    return next();
  }
  
  return res.status(403).json({ message: 'Acesso negado: requer privilégios de administrador' });
};

const isTecnico = (req, res, next) => {
  if (req.usuario && (req.usuario.cargo === 'Técnico' || req.usuario.cargo === 'Administrador')) {
    return next();
  }
  
  return res.status(403).json({ message: 'Acesso negado: requer privilégios de técnico' });
};

module.exports = {
  verifyToken,
  isAdmin,
  isTecnico
};
