// gert-backend/src/middlewares/validators/fornecedor.validator.js
const Joi = require('joi');

const fornecedorSchema = Joi.object({
  nome: Joi.string().min(1).max(100).required().messages({
    'string.empty': 'Nome é obrigatório',
    'string.min': 'Nome deve ter pelo menos 1 caractere',
    'string.max': 'Nome deve ter no máximo 100 caracteres',
    'any.required': 'Nome é obrigatório'
  }),
  cnpj: Joi.string().pattern(/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/).allow('').optional().messages({
    'string.pattern.base': 'CNPJ deve estar no formato XX.XXX.XXX/XXXX-XX'
  }),
  contato: Joi.string().max(100).allow('').optional(),
  email: Joi.string().email().allow('').optional().messages({
    'string.email': 'Email deve ser válido'
  }),
  telefone: Joi.string().max(20).allow('').optional(),
  endereco: Joi.string().max(500).allow('').optional(),
  cidade: Joi.string().max(100).allow('').optional(),
  estado: Joi.string().length(2).allow('').optional().messages({
    'string.length': 'Estado deve ter 2 caracteres'
  }),
  cep: Joi.string().pattern(/^\d{5}-\d{3}$/).allow('').optional().messages({
    'string.pattern.base': 'CEP deve estar no formato XXXXX-XXX'
  }),
  site: Joi.string().uri().allow('').optional().messages({
    'string.uri': 'Site deve ser uma URL válida'
  }),
  observacoes: Joi.string().max(1000).allow('').optional(),
  ativo: Joi.boolean().default(true)
});

const validateFornecedor = (req, res, next) => {
  const { error } = fornecedorSchema.validate(req.body, { abortEarly: false });

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
  validateFornecedor
};