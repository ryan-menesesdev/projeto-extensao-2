const Joi = require('joi');

const userUpdateSchema = Joi.object({
    nome: Joi.string()
        .min(3)
        .max(200)
        .required()
        .messages({
            'string.empty': 'O nome completo é obrigatório',
            'string.min': 'O nome deve ter no mínimo 3 caracteres',
            'string.max': 'O nome deve ter no máximo 200 caracteres'
        }),
    telefone: Joi.string()
        .pattern(/^[0-9]+$/)
        .min(10)
        .max(11)
        .required()
        .messages({
            'string.empty': 'O telefone é obrigatório',
            'string.pattern.base': 'Apenas números são permitidos no telefone',
            'string.min': 'Telefone inválido (mínimo 10 dígitos)',
            'string.max': 'Telefone inválido (máximo 11 dígitos)'
        }),

    email: Joi.string()
        .pattern(/@(gmail|outlook|hotmail|live|yahoo)\.com/)
        .required()
        .messages({
            'string.empty': 'O e-mail é obrigatório',
            'string.email': 'Informe um e-mail válido',
            'string.pattern.base': 'Use um e-mail popular (Gmail, Outlook, Hotmail, Yahoo, etc.)'
        }),
    tipo: Joi.string()
        .valid('funcionario', 'supervisor')
        .required()
        .messages({
            'any.only': 'Selecione um tipo de usuário válido',
            'any.required': 'O tipo de usuário é obrigatório'
        })
});

module.exports = userUpdateSchema;