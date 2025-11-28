const Joi = require('joi');

const registerSchema = Joi.object({
    nome: Joi.string()
        .min(3)
        .max(200)
        .required()
        .messages({
            'string.empty': 'O nome é obrigatório',
            'string.min': 'O nome deve ter no mínimo 3 caracteres',
            'string.max': 'O nome deve ter no máximo 200 caracteres'
        }),

    email: Joi.string()
        .pattern(/@(gmail|outlook|hotmail|live|yahoo)\.com/)
        .required()
        .messages({
            'string.empty': 'O e-mail é obrigatório',
            'string.email': 'Informe um e-mail válido',
            'string.pattern.base': 'Use um e-mail popular (Gmail, Outlook, Hotmail, Yahoo, etc.)'
        }),

    telefone: Joi.string()
        .pattern(/^[0-9]+$/)
        .min(10)
        .max(11)
        .required()
        .messages({
            'string.empty': 'O telefone é obrigatório',
            'string.pattern.base': 'Apenas números são permitidos',
            'string.min': 'Telefone muito curto (mínimo 10 dígitos)',
            'string.max': 'Telefone muito longo (máximo 11 dígitos)'
        }),

    cpf: Joi.string()
        .pattern(/^[0-9]+$/)
        .length(11)
        .required()
        .messages({
            'string.empty': 'O CPF é obrigatório',
            'string.pattern.base': 'Apenas números são permitidos',
            'string.length': 'O CPF deve ter exatamente 11 dígitos'
        }),

    senha: Joi.string()
        .min(8)
        .pattern(new RegExp('^(?=.*[0-9])(?=.*[!@#$%^&*])'))
        .required()
        .messages({
            'string.empty': 'A senha é obrigatória',
            'string.min': 'A senha deve ter no mínimo 8 caracteres',
            'string.pattern.base': 'A senha deve conter pelo menos 1 número e 1 caractere especial (!@#$%)'
        }),

    'confirm-password': Joi.any()
        .valid(Joi.ref('senha'))
        .required()
        .messages({
            'any.only': 'As senhas não conferem',
            'any.required': 'A confirmação de senha é obrigatória'
        })
});

module.exports = registerSchema;