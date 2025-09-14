const { updateProfileSchema, changePasswordSchema } = require('./validators/auth.validator');

const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });

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
};

module.exports = {
  validate,
  validateUpdateProfile: validate(updateProfileSchema),
  validateChangePassword: validate(changePasswordSchema)
};