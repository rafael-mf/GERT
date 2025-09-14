// gert-backend/src/middlewares/validators/peca.validator.js
const Joi = require('joi');

const pecaSchema = Joi.object({
  categoriaId: Joi.number().integer().required().messages({
    'number.base': 'Categoria é obrigatória',
    'number.integer': 'Categoria deve ser um número inteiro',
    'any.required': 'Categoria é obrigatória'
  }),
  codigo: Joi.string().min(1).max(50).required().messages({
    'string.empty': 'Código é obrigatório',
    'string.min': 'Código deve ter pelo menos 1 caractere',
    'string.max': 'Código deve ter no máximo 50 caracteres',
    'any.required': 'Código é obrigatório'
  }),
  nome: Joi.string().min(1).max(100).required().messages({
    'string.empty': 'Nome é obrigatório',
    'string.min': 'Nome deve ter pelo menos 1 caractere',
    'string.max': 'Nome deve ter no máximo 100 caracteres',
    'any.required': 'Nome é obrigatório'
  }),
  descricao: Joi.string().max(500).allow('').optional(),
  marca: Joi.string().max(50).allow('').optional(),
  modelo: Joi.string().max(100).allow('').optional(),
  compatibilidade: Joi.string().max(500).allow('').optional(),
  precoCusto: Joi.number().min(0).precision(2).optional(),
  precoVenda: Joi.number().min(0).precision(2).optional(),
  estoqueMinimo: Joi.number().integer().min(0).required().messages({
    'number.base': 'Estoque mínimo deve ser um número',
    'number.integer': 'Estoque mínimo deve ser um número inteiro',
    'number.min': 'Estoque mínimo não pode ser negativo',
    'any.required': 'Estoque mínimo é obrigatório'
  }),
  estoqueAtual: Joi.number().integer().min(0).default(0),
  localizacao: Joi.string().max(100).allow('').optional(),
  ativo: Joi.boolean().default(true)
});

const categoriaPecaSchema = Joi.object({
  nome: Joi.string().min(1).max(100).required().messages({
    'string.empty': 'Nome da categoria é obrigatório',
    'string.min': 'Nome da categoria deve ter pelo menos 1 caractere',
    'string.max': 'Nome da categoria deve ter no máximo 100 caracteres',
    'any.required': 'Nome da categoria é obrigatório'
  }),
  descricao: Joi.string().max(500).allow('').optional(),
  ativo: Joi.boolean().default(true)
});

const validatePeca = (req, res, next) => {
  const { error } = pecaSchema.validate(req.body, { abortEarly: false });

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

const validateCategoriaPeca = (req, res, next) => {
  const { error } = categoriaPecaSchema.validate(req.body, { abortEarly: false });

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
  validatePeca,
  validateCategoriaPeca
};