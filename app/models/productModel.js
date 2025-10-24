module.exports = {
    getAllProducts: (db, categoria, callback) => {
        console.log('LER PRODUTOS do banco de dados');

        let sql = 'SELECT * FROM produto WHERE disponivel = TRUE';

        const params = [];

        if(categoria) {
            sql += ' AND categoria = ?';
            params.push(categoria);
        }

        db.query(sql, params, callback);
    },
    getProductById: (db, id, callback) => {
        const sql = 'SELECT * FROM produto WHERE id = ? AND disponivel = TRUE';
        db.query(sql, [id], callback);
    },
    alterProductAvailability: (db, disponivel, id, callback) => {
        const sql = 'UPDATE produto SET disponivel = ? WHERE id = ?'; 
        const params = [disponivel, id];
        
        db.query(sql, params, callback);
    }
}