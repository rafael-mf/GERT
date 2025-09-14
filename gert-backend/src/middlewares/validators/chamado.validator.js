// gert-backend/src/middlewares/validators/chamado.validator.js
const Joi = require('joi');

const chamadoSchema = Joi.object({
  clienteId: Joi.number().integer().required().messages({
    'number.base': 'Cliente é obrigatório',
    'number.integer': 'Cliente deve ser um número inteiro',
    'any.required': 'Cliente é obrigatório'
  }),
  dispositivoId: Joi.number().integer().required().messages({
    'number.base': 'Dispositivo é obrigatório',
    'number.integer': 'Dispositivo deve ser um número inteiro',
    'any.required': 'Dispositivo é obrigatório'
  }),
  tecnicoId: Joi.number().integer().optional(),
  prioridadeId: Joi.number().integer().required().messages({
    'number.base': 'Prioridade é obrigatória',
    'number.integer': 'Prioridade deve ser um número inteiro',
    'any.required': 'Prioridade é obrigatória'
  }),
  statusId: Joi.number().integer().required().messages({
    'number.base': 'Status é obrigatório',
    'number.integer': 'Status deve ser um número inteiro',
    'any.required': 'Status é obrigatório'
  }),
  titulo: Joi.string().min(1).max(100).required().messages({
    'string.empty': 'Título é obrigatório',
    'string.min': 'Título deve ter pelo menos 1 caractere',
    'string.max': 'Título deve ter no máximo 100 caracteres',
    'any.required': 'Título é obrigatório'
  }),
  descricao: Joi.string().min(1).max(1000).required().messages({
    'string.empty': 'Descrição é obrigatória',
    'string.min': 'Descrição deve ter pelo menos 1 caractere',
    'string.max': 'Descrição deve ter no máximo 1000 caracteres',
    'any.required': 'Descrição é obrigatória'
  }),
  motivo: Joi.string().max(500).optional().messages({
    'string.max': 'Motivo deve ter no máximo 500 caracteres'
  }),
  diagnostico: Joi.string().max(1000).allow('').optional(),
  solucao: Joi.string().max(1000).allow('').optional(),
  valorTotal: Joi.number().min(0).precision(2).optional(),
  dataPrevista: Joi.date().optional(),
  dataFechamento: Joi.date().optional()
});

const validateChamado = (req, res, next) => {
  const { error } = chamadoSchema.validate(req.body, { abortEarly: false });

  if (error) {
    const errors = error.details.map(detail => ({
      field: detail.path.join('.'),
      message: detail.message
    }));

    return res.status(400).json({
      message: 'Erro de validação',
      errors
    });
  }

  next();
};

module.exports = {
  validateChamado
};