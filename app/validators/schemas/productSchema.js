const Joi = require('joi');

const productSchema = Joi.object({
    nome: Joi.string()
        .min(3)
        .max(200)
        .required()
        .messages({
            'string.empty': 'O nome do produto é obrigatório',
            'string.min': 'O nome deve ter no mínimo 3 caracteres',
            'string.max': 'O nome deve ter no máximo 200 caracteres'
        }),

    preco: Joi.number()
        .precision(2)
        .positive()
        .required()
        .messages({
            'number.base': 'O preço deve ser um número válido',
            'number.positive': 'O preço deve ser maior que zero',
            'any.required': 'O preço é obrigatório'
        }),

    categoria: Joi.string()
        .valid('bolo', 'bebida', 'sobremesa', 'salgado')
        .required()
        .messages({
            'any.only': 'Selecione uma categoria válida',
            'any.required': 'A categoria é obrigatória'
        }),

    imagem: Joi.string()
        .uri()
        .required()
        .messages({
            'string.empty': 'A imagem é obrigatória',
            'string.uri': 'A imagem deve ser uma URL válida (http://...)'
        }),

    descricao: Joi.string()
        .min(10)
        .max(200)
        .required()
        .messages({
            'string.empty': 'A descrição é obrigatória',
            'string.min': 'A descrição deve ser mais detalhada (mínimo 10 caracteres)',
            'string.max': 'A descrição não pode passar de 200 caracteres'
        }),

    disponivel: Joi.any()
        .valid('0', '1', 0, 1)
        .required()
});

module.exports = productSchema;