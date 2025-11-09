module.exports = {
    getAllUsers: (db, tipo, callback) => {
        let sql = "SELECT id, nome, tipo, telefone, email FROM usuario";

        const params = [];

        if (tipo) {
            sql += " WHERE tipo = ?";

            params.push(tipo);
        }

        db.query(sql, params, callback);
    },

    getUserById: (db, id, callback) => {
        const sql =
            "SELECT id, nome, tipo, telefone, email FROM usuario WHERE id = ?";
        const params = [id];

        db.query(sql, params, callback);
    },
    addUser: (db, userData, callback) => {
        const sql = "INSERT INTO usuario SET ?";
        db.query(sql, userData, callback);
    },

    updateUser: (db, id, userData, callback) => {
        const sql = "UPDATE usuario SET ? WHERE id = ?";
        const params = [userData, id];
        db.query(sql, params, callback);
    },

    deleteUser: (db, id, callback) => {
        const sql = "DELETE FROM usuario WHERE id = ?";
        const params = [id];
        db.query(sql, params, callback);
    },
};
