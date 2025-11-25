const jwt = require('jsonwebtoken');
const dbConn = require('../../config/dbConnection');
const UsersModel = require('../models/userModel');

const isAuth = (req, res, next) => {

    const authHeader = req.headers['authorization'] || req.cookies.authToken;
    let token = null;

    if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
    } else if (req.cookies && req.cookies.authToken) {
        token = req.cookies.authToken;
    }

    if (!token) {
        if (!req.xhr && !req.headers.accept?.includes('json')) {
            return res.redirect('/login');
        }
        return res.status(401).json({ status: 'error', code: 401, message: 'Token não fornecido.' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            res.clearCookie('authToken');

            if (!req.xhr && !req.headers.accept?.includes('json')) {
                return res.redirect('/login');
            }

            return res.status(401).json({ status: 'error', code: 401, message: 'Token inválido.' });
        }

        req.user = decoded; 

        const db = dbConn();
        UsersModel.getUserById(db, decoded.id, (dbErr, result) => {
            db.end();

            if (dbErr) {
                console.log('[isAuth] Erro DB:', dbErr);
                return next();
            }

            let userFromDb = null;
            
            userFromDb = result[0]; 

            if (userFromDb) {
                req.user = {
                    ...req.user, 
                    nome: userFromDb.nome,
                    telefone: userFromDb.telefone,
                    email: userFromDb.email,
                    tipo: userFromDb.tipo 
                };
            } else {
                console.log(`[isAuth] Usuário ID ${decoded.id} no token, mas não encontrado no DB.`);
            }

            return next();
        });
    });
};

module.exports = isAuth;