const Joi = require('joi');

const userSchema = Joi.object({
    nome: Joi.string()
        .min(3)
        .max(200)
        .required()
        .messages({
            'string.empty': 'O nome completo é obrigatório',
            'string.min': 'O nome deve ter no mínimo 3 caracteres',
            'string.max': 'O nome deve ter no máximo 200 caracteres'
        }),

    cpf: Joi.string()
        .pattern(/^[0-9]+$/)
        .length(11)
        .required()
        .messages({
            'string.empty': 'O CPF é obrigatório',
            'string.pattern.base': 'Apenas números são permitidos no CPF',
            'string.length': 'O CPF deve ter exatamente 11 dígitos'
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

    senha: Joi.string()
        .min(8)
        .pattern(new RegExp('^(?=.*[0-9])(?=.*[!@#$%^&*])'))
        .required()
        .messages({
            'string.empty': 'A senha é obrigatória',
            'string.min': 'A senha deve ter no mínimo 8 caracteres',
            'string.pattern.base': 'A senha deve conter pelo menos 1 número e 1 caractere especial (!@#$%)'
        }),

    tipo: Joi.string()
        .valid('funcionario', 'supervisor')
        .required()
        .messages({
            'any.only': 'Selecione um tipo de usuário válido',
            'any.required': 'O tipo de usuário é obrigatório'
        })
});

module.exports = userSchema;