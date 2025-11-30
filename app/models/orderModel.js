module.exports = {
  
    getOrdersByUserId: (db, userId, status, callback) => {
        let sql = `
            SELECT 
                p.id,
                p.criadoEm,
                p.statusPedido,
                pag.metodoPagamento,
                pag.statusPagamento,
                COALESCE(SUM(prod.preco * pp.quantidade), 0) AS valorTotal
            FROM pedido p
            JOIN pagamento pag ON p.idPagamento = pag.id
            LEFT JOIN produto_pedido pp ON p.id = pp.idPedido
            LEFT JOIN produto prod ON pp.idProduto = prod.id
            WHERE p.idUsuario = ?
        `;

        const params = [userId];

        if (status) {
            sql += ' AND p.statusPedido = ?';
            params.push(status);
        }

        sql += ' GROUP BY p.id ORDER BY p.criadoEm DESC';

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
    },

    getAllOrders: (db, status, callback) => {
        let sql = `
            SELECT 
                p.id, 
                p.statusPedido,
                p.criadoEm,
                u.nome AS nomeCliente,
                pg.metodoPagamento,
                pg.statusPagamento
            FROM pedido AS p
            JOIN usuario AS u ON p.idUsuario = u.id
            JOIN pagamento AS pg ON p.idPagamento = pg.id
        `;
        
        const params = [];

        if (status) {
            sql += ' WHERE p.statusPedido = ?';
            params.push(status);
        }

        sql += ' ORDER BY p.criadoEm DESC';
        
        db.query(sql, params, callback);
    },

    getAdminOrderById: (db, orderId, callback) => {
        const detailsSql = `
            SELECT 
                p.id, 
                p.statusPedido,
                p.criadoEm,
                u.nome AS nomeCliente,
                u.email AS emailCliente,
                u.telefone AS telefoneCliente,
                pg.metodoPagamento,
                pg.statusPagamento
            FROM pedido AS p
            JOIN usuario AS u ON p.idUsuario = u.id
            JOIN pagamento AS pg ON p.idPagamento = pg.id
            WHERE p.id = ?
        `;

        db.query(detailsSql, [orderId], (error, detailsResult) => {
            if (error || detailsResult.length === 0) {
                return callback(error, null);
            }

            const productsSql = `
                SELECT
                    pr.nome,
                    pr.preco,
                    pp.quantidade
                FROM produto_pedido AS pp
                JOIN produto AS pr ON pp.idProduto = pr.id
                WHERE pp.idPedido = ?
            `;

            db.query(productsSql, [orderId], (error, productsResult) => {
                if (error) {
                    return callback(error, null);
                }

                const finalResult = {
                    details: detailsResult[0],
                    products: productsResult
                };

                callback(null, finalResult);
            });
        });
    },
    alterOrderStatus: (db, id, status, callback) => {
        const sql = 'UPDATE pedido SET statusPedido = ? WHERE id = ?'; 
        const params = [status, id];
        
        db.query(sql, params, callback);
    },
    getOrderOwnerEmail: (db, orderId, callback) => {
        const sql = 'SELECT u.email, u.nome FROM pedido p JOIN usuario u ON p.idUsuario = u.id WHERE p.id = ?';
        db.query(sql, [orderId], callback);
    }
};