const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
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
        UsersModel.findByEmail(db, email, async (err, result) => {
            db.end();
            if (err) {
                console.error('[Auth User DB Error]', err);
                return res.status(500).json({ status: 'error', code: 500, message: 'Erro interno ao autenticar usuário.' });
            }

            if (!result) {
                return res.status(401).json({ status: 'error', code: 401, message: 'E-mail ou senha incorretos.' });
            }

            try {
                const match = await bcrypt.compare(senha, result.senha);

                if (!match) {
                    return res.status(401).json({ status: 'error', code: 401, message: 'E-mail ou senha incorretos.' });
                }

                const payload = { id: result.id, email: result.email, tipo: result.tipo };

                const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

                const user = {
                    id: result.id,
                    nome: result.nome,
                    tipo: result.tipo,
                    telefone: result.telefone,
                    email: result.email
                };

                res.cookie('authToken', token, { 
                    httpOnly: true, 
                    maxAge: 3600000 
                });

                if(user.tipo === 'funcionario' || user.tipo === 'supervisor') {
                    
                    console.log('=========================== É ADMIN ==========================');

                    return res.redirect('/admin/home');
                }

                return res.redirect('/');
            } catch (e) {
                console.error('[Auth Error]', e);
                return res.status(500).json({ status: 'error', code: 500, message: 'Erro ao processar autenticação.' });
            }
        });
    },
    logout: (req, res) => {
        console.log('[Logout User Controller]');

        res.clearCookie('authToken');

        return res.redirect('/login');
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