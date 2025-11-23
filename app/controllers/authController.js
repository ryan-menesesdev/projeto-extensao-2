const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');
const dbConn = require('../../config/dbConnection');
const UsersModel = require('../models/userModel');

require('dotenv').config();

module.exports = {
    authUser: async (req, res) => {
        console.log('[Authenticate User Controller]');

        const { email, senha } = req.body;

        if (!email || !senha) {
            return res.status(400).json({ status: 'error', code: 400, message: 'E-mail e senha são obrigatórios.' });
        }

        const db = dbConn();
        UsersModel.findByEmail(db, email, async (err, user) => {
            db.end();
            if (err) {
                console.error('[Auth User DB Error]', err);
                return res.status(500).json({ status: 'error', code: 500, message: 'Erro interno ao autenticar usuário.' });
            }

            if (!user) {
                return res.status(401).json({ status: 'error', code: 401, message: 'E-mail ou senha incorretos.' });
            }

            try {
                const match = await bcrypt.compare(senha, user.senha);
                if (!match) {
                    return res.status(401).json({ status: 'error', code: 401, message: 'E-mail ou senha incorretos.' });
                }

                const payload = { id: user.id, email: user.email, tipo: user.tipo };

                const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

                const safeUser = {
                    id: user.id,
                    nome: user.nome,
                    tipo: user.tipo,
                    telefone: user.telefone,
                    email: user.email
                };

                res.cookie('authToken', token, { 
                    httpOnly: true, 
                    maxAge: 3600000 
                });

                return res.status(200).render('client/index', {
                    status: 'success',
                    code: 200,
                    message: 'Autenticação bem-sucedida.',
                    token,
                    user: { safeUser },
                    isAuthenticated: true,
                });
            } catch (e) {
                console.error('[Auth Error]', e);
                return res.status(500).json({ status: 'error', code: 500, message: 'Erro ao processar autenticação.' });
            }
        });
    },
    logout: (req, res) => {
        console.log('[Logout User Controller]');

        res.clearCookie('authToken');

        return res.redirect('/');
    },
    register: async (req, res) => {
        const { cpf, nome, senha, telefone, email } = req.body;

        if (!cpf || !nome || !senha || !telefone || !email) {
            return res.status(400).json({ status: 'error', code: 400, message: 'cpf, nome, senha, telefone e email são obrigatórios.' });
        }

        const userData = {
            cpf,
            nome,
            senha: null,
            tipo: 'cliente',
            telefone,
            email
        };

        try {
            const hashed = await bcrypt.hash(senha, 10);
            userData.senha = hashed;
        } catch (err) {
            console.error('Erro ao hashear senha:', err);
            return res.status(500).json({ status: 'error', code: 500, message: 'Erro interno ao processar senha.' });
        }

        const db = dbConn();
        UsersModel.addUser(db, userData, (error, result) => {
            db.end();
            if (error) {
                if (error.code === 'ER_DUP_ENTRY') {
                    return res.status(400).json({ status: 'error', code: 400, message: 'Email ou CPF já cadastrado.' });
                }
                console.error('Erro ao criar usuário:', error);
                return res.status(500).json({ status: 'error', code: 500, message: 'Erro interno ao criar usuário.' });
            }

            return res.status(201).render('login', {
                status: 'success',
                code: 201,
                message: 'Usuário registrado com sucesso.',
                userId: result.insertId
            });
        });
    }
};