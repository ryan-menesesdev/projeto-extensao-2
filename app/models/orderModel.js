module.exports = {
    getOrdersByUserId: (db, userId, status, callback) => {
        let sql = `
            SELECT
                p.id,
                p.criadoEm,
                p.statusPedido,
                pag.metodoPagamento,
                pag.statusPagamento
            FROM pedido p
            JOIN pagamento pag ON p.idPagamento = pag.id
            WHERE p.idUsuario = ?
        `;

        const params = [userId];

        if(status) {
            sql += ' AND p.statusPedido = ?';
            params.push(status)
        }

        sql += ' ORDER BY p.criadoEm DESC';

        db.query(sql, params, callback);
    },
    getOrderById: (db, orderId, userId, callback) => {
        const sql = `
            SELECT
                p.id,
                p.criadoEm,
                p.statusPedido,
                pag.metodoPagamento,
                pag.statusPagamento
            FROM pedido p
            JOIN pagamento pag ON p.idPagamento = pag.id
            WHERE p.id = ? AND p.idUsuario = ?;
        `;

        db.query(sql, [orderId, userId], (error, result) => {
            if(error || result.length === 0) {
                return callback(error, null);
            }

            const productsSql = `
                SELECT 
                    prod.id,
                    prod.nome,
                    prod.preco,
                    pp.quantidade
                FROM produto_pedido pp
                JOIN produto prod ON pp.idProduto = prod.id
                WHERE pp.idPedido = ?;
            `;

            db.query(productsSql, [orderId], (error, productsResult) => {
                if(error) {
                    return callback(error, null);
                }

                const finalResult = {
                    details: result[0],
                    products: productsResult,
                };

                callback(null, finalResult);
            });
        });
    }
}