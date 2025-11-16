const jwt = require('jsonwebtoken');
const dbConn = require('../../config/dbConnection');
const UsersModel = require('../models/userModel');

const isAuth = (req, res, next) => {
    const authHeader = req.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            status: 'error',
            code: 401,
            message: 'Não autorizado. Token não fornecido ou formato inválido.'
        });
    }

    const token = authHeader.split(' ')[1];

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                status: 'error',
                code: 401,
                message: 'Token inválido ou expirado.'
            });
        }

        req.user = decoded;

        const db = dbConn();
        UsersModel.getUserById(db, decoded.id, (dbErr, user) => {
            db.end();
            if (dbErr) {
                console.warn('isAuth: erro ao buscar usuário no DB', dbErr);
                return next();
            }
            if (user) {
                req.user = Object.assign({}, req.user, {
                    nome: user.nome,
                    telefone: user.telefone,
                    email: user.email,
                    tipo: user.tipo
                });
            }
            return next();
        });
    });
};

module.exports = isAuth;