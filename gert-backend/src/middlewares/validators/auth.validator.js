const Joi = require('joi');

const updateProfileSchema = Joi.object({
  nome: Joi.string()
    .min(2)
    .max(100)
    .required()
    .messages({
      'string.empty': 'Nome é obrigatório',
      'string.min': 'Nome deve ter pelo menos 2 caracteres',
      'string.max': 'Nome deve ter no máximo 100 caracteres',
      'any.required': 'Nome é obrigatório'
    }),

  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.empty': 'Email é obrigatório',
      'string.email': 'Email deve ter um formato válido',
      'any.required': 'Email é obrigatório'
    }),

  telefone: Joi.string()
    .pattern(/^\(\d{2}\)\s?\d{4,5}-\d{4}$/)
    .allow('')
    .optional()
    .messages({
      'string.pattern.base': 'Telefone deve ter o formato (11) 99999-9999'
    })
});

const changePasswordSchema = Joi.object({
  senhaAtual: Joi.string()
    .required()
    .messages({
      'string.empty': 'Senha atual é obrigatória',
      'any.required': 'Senha atual é obrigatória'
    }),

  novaSenha: Joi.string()
    .min(6)
    .required()
    .messages({
      'string.empty': 'Nova senha é obrigatória',
      'string.min': 'Nova senha deve ter pelo menos 6 caracteres',
      'any.required': 'Nova senha é obrigatória'
    })
});

module.exports = {
  updateProfileSchema,
  changePasswordSchema
};