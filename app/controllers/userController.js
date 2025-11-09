const dbConn = require("../../config/dbConnection");
const { getAllUsers, getUserById, addUser, updateUser, deleteUser } = require("../models/userModel");

module.exports = {
    showAllUsers: (req, res) => {
       
        if (!req.user || req.user.role !== 'supervisor') {
            return res.status(401).json({ error: 'Você não tem acesso a essa funcionalidade'});
        }

        const { tipo } = req.query;
        
        const db = dbConn();

        getAllUsers(db, tipo, (error, result) => {
            db.end();

            if (error) {
                console.error("Erro no CONTROLLER ao listar usuários:", error);
                return res.status(500).json({ error: 'Erro interno do servidor.'});
            }

            res.status(200).json({ users: result });
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
    
    addUser: (req, res) => {
        if (!req.user || req.user.role !== 'supervisor') {
            return res.status(403).json({ error: 'Acesso Negado' });
        }

        const { cpf, nome, senha, tipo, telefone, email } = req.body;
        
        const userData = {
            cpf,
            nome,
            senha, 
            tipo,
            telefone,
            email
        };

        const db = dbConn();
        addUser(db, userData, (error, result) => {
            db.end();
            if (error) {
                if (error.code === 'ER_DUP_ENTRY') {
                    return res.status(400).json({ error: 'Erro: Este email ou CPF já está cadastrado.' });
                }
                console.error("Erro no CONTROLLER ao ADICIONAR usuário:", error);
                return res.status(500).json({ error: 'Erro interno do servidor.' });
            }

            res.status(201).json({ message: 'Usuário adicionado com sucesso!', userId: result.insertId });
        });
    },

    updateUser: (req, res) => {
        if (!req.user || req.user.role !== 'supervisor') {
            return res.status(403).json({ error: 'Acesso Negado' });
        }
        
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

                    return res.status(400).json({ error: 'Erro: Este email já está cadastrado.' });
                }
                console.error("Erro no CONTROLLER ao ATUALIZAR usuário:", error);

                return res.status(500).json({ error: 'Erro interno do servidor.' });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Usuário não encontrado.' });
            }

            res.status(200).json({ message: 'Usuário atualizado com sucesso!' });
        });
    },

    deleteUser: (req, res) => {
        if (!req.user || req.user.role !== 'supervisor') {

            return res.status(403).json({ error: 'Acesso Negado' });
        }
        
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

            res.status(200).json({ message: 'Usuário deletado com sucesso!' });
        });
    }
};