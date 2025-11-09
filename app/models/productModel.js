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
    getAllAdminProducts: (db, categoria, callback) => {
        let sql = 'SELECT * FROM produto';

        const params = [];

        if(categoria) {
            sql += ' WHERE categoria = ?';
            params.push(categoria);
        }

        db.query(sql, params, callback);
    },
    alterProductAvailability: (db, disponivel, id, callback) => {
        const sql = 'UPDATE produto SET disponivel = ? WHERE id = ?'; 
        const params = [disponivel, id];
        
        db.query(sql, params, callback);
    },
    createProduct: (db, productData, callback) => {
        const sql = 'INSERT INTO produto SET ?';
        db.query(sql, productData, callback);
    },
    updateProductById: (db, id, productData, callback) => {
        const sql = 'UPDATE produto SET ? WHERE id = ?'; 
        const params = [productData, id];
            
        db.query(sql, params, callback);
    },
    deleteProductById: (db, id, callback) => {
        const sql = 'DELETE FROM produto WHERE id = ?';
        const params = [id];

        db.query(sql, params, callback);
    },
}