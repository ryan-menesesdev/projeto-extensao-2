module.exports = {
    getAllProducts: (db, callback) => {
        console.log('LER TODOS PRODUTOS do banco de dados');
        const sql = 'SELECT * FROM produto';
        db.query(sql, callback);
    }
}