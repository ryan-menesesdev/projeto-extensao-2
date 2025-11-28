const Joi = require('joi');

const loginSchema = Joi.object({
    email: Joi.string()
        .email()
        .required()
        .messages({
            'string.empty': 'O e-mail é obrigatório',
            'string.email': 'Informe um e-mail válido'
        }),

    senha: Joi.string()
        .required()
        .messages({
            'string.empty': 'A senha é obrigatória'
        })
});

module.exports = loginSchema;