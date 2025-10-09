const dbConn = require("../../config/dbConnection");
const { getAllUsers, getUserById } = require("../models/userModel");

module.exports = {
    showAllUsers: (req, res) => {
       
        if (!req.user || req.user.role !== 'supervisor') {
            // Se não for supervisor, nega o acesso
            return res.status(403).send('<h1>Acesso Negado</h1><p>Você não tem permissão para ver esta página.</p>');
        }
        

        const db = dbConn();
        getAllUsers(db, (error, users) => {
            db.end();
            if (error) {
                console.error("Erro no CONTROLLER ao listar usuários:", error);
                return res.status(500).render('error');
            }
            res.render('admin/users-list', { users: users });
        });
    },

    showUserDetails: (req, res) => {
        
        if (!req.user || req.user.role !== 'supervisor') {
            return res.status(403).send('<h1>Acesso Negado</h1><p>Você não tem permissão para ver esta página.</p>');
        }
      

        const { id } = req.params;
        const db = dbConn();
        getUserById(db, id, (error, user) => {
            db.end();
            
            if (error) {
                console.error("Erro no CONTROLLER ao buscar usuário por ID:", error);
                return res.status(500).render('error');
            }
            if (!user) {
                return res.status(404).render('error');
            }
            res.render('admin/user-details', { user: user });
        });
    }
};