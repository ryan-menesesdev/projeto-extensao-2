const dbConn = require("../../config/dbConnection");
const { getAllUsers, getUserById, addUser, updateUser, deleteUser } = require("../models/userModel");
const bcrypt = require('bcrypt');

module.exports = {
    showAllUsers: (req, res) => {
        const { tipo } = req.query;
        
        const db = dbConn();

        getAllUsers(db, tipo, (error, result) => {
            db.end();

            if (error) {
                console.error("Erro no CONTROLLER ao listar usuários:", error);
                return res.status(500).render('error');
            }

            res.status(200).render('admin/employees', { users: result });
        });
    },

    showUserDetails: (req, res) => {
      
        const { id } = req.params;

        const db = dbConn();

        getUserById(db, id, (error, result) => {
            db.end();
            
            if (error) {
                console.error("Erro no CONTROLLER ao buscar usuário por ID:", error);
                return res.status(500).render('error');
            }
            
            res.status(200).json({ user: result });
        });
    },
    
    addUser: async (req, res) => {
        const { cpf, nome, senha, tipo, telefone, email } = req.body;
        
        try {
            const hashedPassword = await bcrypt.hash(senha, 10);

            const userData = {
                cpf, 
                nome, 
                senha: hashedPassword, 
                tipo, 
                telefone, 
                email
            };

            const db = dbConn();
            
            addUser(db, userData, (error, result) => {
                db.end();
                
                if (error) {
                    if (error.code === 'ER_DUP_ENTRY') {
                        const errorMap = {};
                        const msg = "";

                        if (msg.includes('email')) {
                            errorMap.email = 'Este e-mail já está cadastrado no sistema.';
                        } else if (msg.includes('cpf')) {
                            errorMap.cpf = 'Este CPF já está cadastrado.';
                        } else {
                            const msgGenerica = 'E-mail ou CPF já existentes no sistema.';
                            errorMap.email = msgGenerica;
                            errorMap.cpf = msgGenerica;
                        }

                        return res.render('admin/add-user', { 
                            errors: errorMap,
                            formData: req.body
                        });
                    }

                    console.error("Erro no CONTROLLER ao ADICIONAR usuário:", error);
                    return res.render('admin/add-user', { 
                        errors: { nome: 'Erro interno ao salvar usuário.' },
                        formData: req.body
                    });
                }

                res.redirect('/admin/users');
            });

        } catch (error) {
            console.error("Erro ao gerar hash da senha:", error);
            return res.render('admin/add-user', { 
                errors: { senha: 'Erro de segurança ao processar senha.' },
                formData: req.body
            });
        }
    },
    updateUser: (req, res) => {
        const { id } = req.params;

        const userData = {
            nome: req.body.nome,
            email: req.body.email,
            telefone: req.body.telefone,
            tipo: req.body.tipo
        };

        const db = dbConn();
        updateUser(db, id, userData, (error, result) => {
            db.end();

            if (error) {
                if (error.code === 'ER_DUP_ENTRY') {
                    const errorMap = {};
                    const msg = "";

                    if (msg.includes('email')) {
                        errorMap.email = 'Este e-mail já está cadastrado no sistema.';
                    }

                    return res.render('admin/edit-user', { 
                        errors: errorMap,
                        formData: req.body
                    });
                }
            }

            res.redirect('/admin/users');
        });
    },

    deleteUser: (req, res) => {
        const { id } = req.params;
        const db = dbConn();
        deleteUser(db, id, (error, result) => {
            db.end();
            if (error) {
                console.error("Erro no CONTROLLER ao DELETAR usuário:", error);
                return res.status(500).render('error');
            }

            res.redirect('/admin/users');
        });
    }
};