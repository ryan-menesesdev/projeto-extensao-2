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
            res.render('listaUser', { user: user });
        });
    },

    showAddUserForm: (req, res) => {
        if (!req.user || req.user.role !== 'supervisor') {
            return res.status(403).send('<h1>Acesso Negado</h1>');
        }
        res.status(200).render('addUsuario');
    },


    showEditUserForm: (req, res) => {
        if (!req.user || req.user.role !== 'supervisor') {
            return res.status(403).send('<h1>Acesso Negado</h1>');
        }
        
        const { id } = req.params;
        const db = dbConn();
        getUserById(db, id, (error, user) => { 
            db.end();
            if (error) {
                console.error("Erro no CONTROLLER ao buscar usuário (admin) por ID:", error);
                return res.status(500).render('error.ejs');
            }
            if (!user) {
                console.error(`Usuário com ID ${id} não encontrado para edição.`);
                return res.status(404).render('error.ejs');
            }
            res.status(200).render('editaUsuario', { user: user });
        });
    },

    
    addUser: (req, res) => {
        if (!req.user || req.user.role !== 'supervisor') {
        const errorMsg = validateUser(req.body);
        
        
        if (errorMsg) {
            return res.status(400).send(`Erro de validação: ${errorMsg}`);
        }

        
        const { nome, email, senha, telefone, tipo } = req.body;

        const userData = {
            nome: nome,
            email: email,
            senha_hash: senha,
            telefone: telefone || '',
            tipo: tipo
        };

        
        const db = dbConn();
        createUser(db, userData, (error, result) => {
        
        });
            }
    },
    updateUser: (req, res) => {
        if (!req.user || req.user.role !== 'supervisor') {
            return res.status(403).send('<h1>Acesso Negado</h1>');
        }

        const { id } = req.params;
        
        
        const errorMsg = validateUser(req.body, true); 
        if (errorMsg) {
            return res.status(400).send(`Erro de validação: ${errorMsg}`);
        }

        
        const userData = {
            nome: req.body.nome,
            email: req.body.email,
            telefone: req.body.telefone || '',
            tipo: req.body.tipo
        };

        const db = dbConn();
        updateUserById(db, id, userData, (error, result) => {
            db.end();
            if (error) {
                console.error("Erro no CONTROLLER ao atualizar usuário:", error);
                 if (error.code === 'ER_DUP_ENTRY') {
                     return res.status(409).send('Erro: Já existe um usuário com esse email.');
                }
                return res.status(500).render('error.ejs');
            }
            if (result.affectedRows === 0) {
                console.error(`Usuário com ID ${id} não encontrado para atualização.`);
                return res.status(404).render('error.ejs');
            }
            console.log(`Usuário ID ${id} atualizado.`);
            res.redirect('/admin/users');
        });
    },

    deleteUser: (req, res) => {
        if (!req.user || req.user.role !== 'supervisor') {
            return res.status(403).send('<h1>Acesso Negado</h1>');
        }

        const { id } = req.params;

        const db = dbConn();
        deleteUserById(db, id, (error, result) => {
            db.end();
            if (error) {
                console.error("Erro no CONTROLLER ao deletar usuário:", error);
                
                if (error.code === 'ER_ROW_IS_REFERENCED_2') {
                    return res.status(400).send('Erro: Não é possível deletar este usuário pois ele possui pedidos associados.');
                }
                return res.status(500).render('error.ejs');
            }
            if (result.affectedRows === 0) {
                console.error(`Usuário com ID ${id} não encontrado para deleção.`);
                return res.status(404).render('error.ejs');
            }
            console.log(`Usuário ID ${id} deletado.`);
            res.redirect('/admin/users');
        });
    }
};