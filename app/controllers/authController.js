const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dbConn = require('../../config/dbConnection');
const UsersModel = require('../models/userModel');

require('dotenv').config();

module.exports = {
    authUser: async (req, res) => {
    console.log('[Authenticate User Controller]');
    const { email, senha } = req.body;

    const db = dbConn();
    UsersModel.findByEmail(db, email, async (err, result) => {        
        if (err) {
            console.error('[Auth User DB Error]', err);

            return res.status(500).render('login', {
                errors: { email: 'Erro interno. Tente novamente mais tarde.' },
                formData: req.body
            });
        }

        const invalidCredentialsError = () => {
            return res.status(401).render('login', {
                errors: { senha: 'E-mail ou senha incorretos.' }, 
                formData: req.body
            });
        };

        if (!result) {
            return invalidCredentialsError();
        }

        try {
            const match = await bcrypt.compare(senha, result.senha);

            if (!match) {
                return invalidCredentialsError();
            }

            const payload = { id: result.id, email: result.email, tipo: result.tipo };
            const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

            res.cookie('authToken', token, { 
                httpOnly: true, 
                maxAge: 3600000 
            });

            if(result.tipo === 'funcionario' || result.tipo === 'supervisor') {
                return res.redirect('/admin/home');
            }

            return res.redirect('/');
            
        } catch (e) {
            console.error('[Auth Error]', e);
            return res.status(500).render('login', {
                errors: { email: 'Erro ao processar autenticação.' },
                formData: req.body
            });
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
            return res.status(500).render('register', {
                errors: { nome: 'Erro interno ao processar senha. Tente novamente.' },
                formData: req.body
            });
        }

        const db = dbConn();

        UsersModel.addUser(db, userData, (error, result) => {
            if (error) {
                if (error.code === 'ER_DUP_ENTRY') {
                    const errorMap = {};

                    const msg = error.sqlMessage || error.message || "";

                    if (msg.includes('email')) {
                        errorMap.email = 'Este e-mail já está cadastrado em nosso sistema.';
                    } else if (msg.includes('cpf')) {
                        errorMap.cpf = 'Este CPF já está cadastrado.';
                    } else {
                        errorMap.email = 'E-mail ou CPF já cadastrados.';
                    }

                    return res.status(400).render('register', {
                        errors: errorMap,    
                        formData: req.body  
                    });
                }

                console.error('Erro ao criar usuário:', error);
                return res.status(500).render('register', {
                    errors: { nome: 'Erro interno ao salvar no banco. Tente mais tarde.' },
                    formData: req.body
                });
            }

            return res.status(201).render('login', {
                status: 'success',
                code: 201,
                message: 'Usuário registrado com sucesso! Faça seu login.',
                userId: result.insertId
            });
        });
    }
};