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

            callback(null, results.length > 0 ? results[0] : null);
        });
    }
};