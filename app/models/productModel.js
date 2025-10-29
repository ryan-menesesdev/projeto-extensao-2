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
    getAllAdminProducts: (db, callback) => {
        console.log('LER TODOS PRODUTOS (ADMIN) do banco de dados');
        const sql = 'SELECT * FROM produto ORDER BY nome ASC';
        db.query(sql, callback);
    },

    


    getAdminProductById: (db, id, callback) => {
        console.log('LER PRODUTO (ADMIN) POR ID do banco de dados');
        const sql = 'SELECT * FROM produto WHERE id = ?';
        db.query(sql, [id], (error, results) => {
            if (error) {
                return callback(error, null);
            }
            
            callback(null, results[0]); 
        });
    },

    
    createProduct: (db, productData, callback) => {
        console.log('CRIAR PRODUTO no banco de dados');
        const { categoria, descricao, imagem, nome, preco, disponivel } = productData;
        const sql = `
            INSERT INTO produto (categoria, descricao, imagem, nome, preco, disponivel) 
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        db.query(sql, [categoria, descricao, imagem, nome, preco, disponivel], callback);
    },

    
    updateProductById: (db, id, productData, callback) => {
        console.log('ATUALIZAR PRODUTO no banco de dados');
        const { categoria, descricao, imagem, nome, preco, disponivel } = productData;
        const sql = `
            UPDATE produto 
            SET categoria = ?, descricao = ?, imagem = ?, nome = ?, preco = ?, disponivel = ?
            WHERE id = ?
        `;
        db.query(sql, [categoria, descricao, imagem, nome, preco, disponivel, id], callback);
    },

    
    deleteProductById: (db, id, callback) => {
        console.log('DELETAR PRODUTO no banco de dados');
        const sql = 'DELETE FROM produto WHERE id = ?';
        db.query(sql, [id], callback);
    }
}