const dbConn = require("../../config/dbConnection");
const { getAllUsers, getUserById,  } = require("../models/userModel");


const validateUser = (data, isEdit = false) => {
    if (!data.nome || data.nome.trim() === "") return "Nome é obrigatório.";
    if (!data.email || !data.email.includes('@')) return "Email inválido.";
    if (!isEdit && (!data.senha || data.senha.length < 6)) return "Senha deve ter pelo menos 6 caracteres.";
    return null; // Sem erros
}

module.exports = {
    showAllUsers: (req, res) => {
       
        if (!req.user || req.user.role !== 'supervisor') {
            return res.status(401).json({ error: 'Você não tem acesso a essa funcionalidade'});
            
            return res.status(403).send('<h1>Acesso Negado</h1><p>Você não tem permissão para ver esta página.</p>');
        }
        
        const db = dbConn();

        getAllUsers(db, (error, users) => {
            db.end();

            if (error) {
                console.error("Erro no CONTROLLER ao listar usuários:", error);
                return res.status(500).json({ error: 'Erro interno do servidor.'});
            }

            res.status(200).json({ users: users });
        });
    },

    showUserDetails: (req, res) => {
        
        if (!req.user || req.user.role !== 'supervisor') {
            return res.status(401).json({ error: 'Você não tem acesso a essa funcionalidade'});
        }
      
        const { id } = req.params;

        const db = dbConn();

        getUserById(db, id, (error, user) => {
            db.end();
            
            if (error) {
                console.error("Erro no CONTROLLER ao buscar usuário por ID:", error);
                return res.status(500).json({ error: 'Erro interno do servidor.'});
            }

            if (!user) {
                return res.status(400).json({ error: 'Usuário não encontrado.' });
            }
            
            res.status(200).json({ user: user });
        });
    }
};