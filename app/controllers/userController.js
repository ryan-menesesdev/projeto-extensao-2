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
                return res.status(500).json({ error: 'Erro interno do servidor.'});
            }

            res.status(200).render('admin/employees', { users: result });
        });
    },

    showUserDetails: (req, res) => {
        
        if (!req.user || req.user.role !== 'supervisor') {
            return res.status(401).json({ error: 'Você não tem acesso a essa funcionalidade'});
        }
      
        const { id } = req.params;

        const db = dbConn();

        getUserById(db, id, (error, result) => {
            db.end();
            
            if (error) {
                console.error("Erro no CONTROLLER ao buscar usuário por ID:", error);
                return res.status(500).json({ error: 'Erro interno do servidor.'});
            }

            if (!result) {
                return res.status(400).json({ error: 'Usuário não encontrado.' });
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
                        return res.render('add-user', { 
                            errorMessage: 'Erro: Este Email ou CPF já está cadastrado no sistema.' 
                        });
                    }
                    console.error("Erro no CONTROLLER ao ADICIONAR usuário:", error);
                    return res.status(500).send("Erro interno ao cadastrar usuário.");
                }

                res.redirect('/admin/users');
            });

        } catch (error) {
            console.error("Erro ao gerar hash da senha:", error);
            return res.status(500).send("Erro interno de segurança.");
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
                    console.log("Email duplicado na edição");
                    return res.send("Erro: Email já utilizado por outro usuário. <a href='/admin/users'>Voltar</a>");
                }
                console.error("Erro no CONTROLLER ao ATUALIZAR usuário:", error);
                return res.status(500).send("Erro interno.");
            }

            if (result.affectedRows === 0) {
                return res.status(404).send('Usuário não encontrado.');
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

                return res.status(500).json({ error: 'Erro interno do servidor.' });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Usuário não encontrado.' });
            }

            res.redirect('/admin/users');
        });
    }
};