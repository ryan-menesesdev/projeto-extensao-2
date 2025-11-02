const dbConn = require("../../config/dbConnection");
const { 
    getAllUsers, 
    getUserById, 
    createUser,
    updateUserById,
    deleteUserById
} = require("../models/userModel");

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
            res.render('listaUser', { user: user });
        });
    },


    showAddUserForm: (req, res) => {
        if (!req.user || req.user.role !== 'supervisor') {
            return res.status(403).send('<h1>Acesso Negado</h1>');
        }
        // Nome do EJS: 'admin-add-user.ejs'
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
            if (error || !user) {
                console.error("Erro no CONTROLLER ao buscar usuário para editar:", error);
                return res.status(404).render('error');
            }
           
            res.status(200).render('editaUsuario', { user: user });
        });
    },

    
    addUser: (req, res) => {
        if (!req.user || req.user.role !== 'supervisor') {
            return res.status(403).send('<h1>Acesso Negado</h1>');
        }

        // Validação
        const errorMsg = validateUser(req.body);
        if (errorMsg) {
            return res.status(400).send(`Erro de validação: ${errorMsg}`);
        }
        
        const { cpf, nome, senha, tipo, telefone, email } = req.body;

        
        const userData = {
            nome: nome,
            cpf: cpf,
            email: email,
            senha_hash: senha, // A senha é salva diretamente
            telefone: telefone || '',
            tipo: tipo
        };

        const db = dbConn();
        createUser(db, userData, (error, result) => {
            db.end();
            if (error) {
                
                if (error.code === 'ER_DUP_ENTRY') {
                    return res.status(400).send('Erro: Este email já está cadastrado.');
                }
                console.error("Erro no CONTROLLER ao ADICIONAR usuário:", error);
                return res.status(500).render('error');
            }
            res.redirect('/admin/users');
        });
    },

    

    updateUser: (req, res) => {
        if (!req.user || req.user.role !== 'supervisor') {
            return res.status(403).send('<h1>Acesso Negado</h1>');
        }
        
        const { id } = req.params;

        
        if (!req.body.nome || !req.body.email) {
            return res.status(400).send('Nome e Email são obrigatórios.');
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
                if (error.code === 'ER_DUP_ENTRY') {
                    return res.status(400).send('Erro: Este email já está cadastrado.');
                }
                console.error("Erro no CONTROLLER ao ATUALIZAR usuário:", error);
                return res.status(500).render('error');
            }
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
                console.error("Erro no CONTROLLER ao DELETAR usuário:", error);
                return res.status(500).render('error');
            }
            res.redirect('/admin/users');
        });
    }
};