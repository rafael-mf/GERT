const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  
  // Erros específicos do Sequelize
  if (err.name === 'SequelizeValidationError') {
    return res.status(400).json({
      message: 'Erro de validação',
      errors: err.errors.map(e => ({ field: e.path, message: e.message }))
    });
  }
  
  if (err.name === 'SequelizeUniqueConstraintError') {
    return res.status(400).json({
      message: 'Erro de restrição única',
      errors: err.errors.map(e => ({ field: e.path, message: e.message }))
    });
  }
  
  if (err.name === 'SequelizeForeignKeyConstraintError') {
    return res.status(400).json({
      message: 'Erro de chave estrangeira',
      error: 'A operação não pode ser concluída devido a restrições de integridade referencial'
    });
  }
  
  // Erro padrão
  return res.status(err.statusCode || 500).json({
    message: err.message || 'Erro interno do servidor'
  });
};

module.exports = {
  errorHandler
};
