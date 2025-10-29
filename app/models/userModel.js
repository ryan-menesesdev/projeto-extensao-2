module.exports = {
    getAllUsers: (db, callback) => {
        const sql = 'SELECT id, cpf, nome, tipo, telefone, email FROM usuario';
        db.query(sql, callback);
    },

    getUserById: (db, id, callback) => {
        const sql = 'SELECT id, cpf, nome, tipo, telefone, email FROM usuario WHERE id = ?';
        const params = [id];

        db.query(sql, params, (error, results) => {
            if (error) {
                return callback(error, null);
            }
            // Retorna apenas o primeiro objeto do array, ou null se não encontrar
            callback(null, results.length > 0 ? results[0] : null);
        });
    },

    //coisas que add aqui

    createUser: (db, userData, callback) => {
        console.log('CRIAR USUÁRIO no banco de dados');
        const { cpf, nome, senha, tipo, telefone, email } = userData;
        const sql = `
            INSERT INTO usuario (cpf, nome, senha, tipo, telefone, email) 
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        db.query(sql, [cpf, nome, senha, tipo, telefone, email], callback);
    },

    updateUserById: (db, id, userData, callback) => {
        console.log('ATUALIZAR USUÁRIO no banco de dados');
        const { cpf, nome, senha, tipo, telefone, email } = userData;
        const sql = `
            UPDATE usuario 
            SET cpf = ?, nome = ?, senha = ?, telefone = ?, tipo = ?
            WHERE id = ?
        `;
        db.query(sql, [cpf, nome, senha, tipo, telefone, email, id], callback);
    },

    deleteUserById: (db, id, callback) => {
        console.log('DELETAR USUÁRIO no banco de dados');
        const sql = 'DELETE FROM usuario WHERE id = ?';
        db.query(sql, [id], callback);
    }
};