module.exports = {
    getCartItemsByUserId: (db, userId, callback) => {
        const sql = `
            SELECT
                p.id,
                p.nome,
                p.preco,
                p.imagem,
                cp.quantidade
            FROM carrinho c
            JOIN carrinho_produto cp ON c.id = cp.idCarrinho
            JOIN produto p ON cp.idProduto = p.id
            WHERE c.idUsuario = ?;
        `;

        db.query(sql, [userId], callback);
    },
    addOrUpdateProductInCart: (db, data, callback) => {
        const { userId, productId, quantity } = data;
        let cartId;

        db.getConnection((err, connection) => {
            if (err) {
                return callback(err);
            }

            connection.beginTransaction((error) => {
                if (error) {
                    connection.release(); 
                    return callback(error);
                }

                const findCartSql = 'SELECT id FROM carrinho WHERE idUsuario = ?';

                connection.query(findCartSql, [userId], (error, result) => {
                    if (error) {
                        return connection.rollback(() => {
                            connection.release();
                            callback(error);
                        });
                    }

                    const proceedToAddItem = (idDoCarrinho) => {
                        const addProductSql = `
                            INSERT INTO carrinho_produto (idCarrinho, idProduto, quantidade)
                            VALUES (?, ?, ?)
                            ON DUPLICATE KEY UPDATE quantidade = quantidade + VALUES(quantidade);
                        `;

                        connection.query(addProductSql, [idDoCarrinho, productId, quantity], (error, result) => {
                            if (error) {
                                return connection.rollback(() => {
                                    connection.release();
                                    callback(error);
                                });
                            }

                            const updateCartSql = 'UPDATE carrinho SET atualizadoEm = NOW() WHERE id = ?';
                            connection.query(updateCartSql, [idDoCarrinho], (error, result) => {
                                if (error) {
                                    return connection.rollback(() => {
                                        connection.release();
                                        callback(error);
                                    });
                                }

                                connection.commit((error) => {
                                    if (error) {
                                        return connection.rollback(() => {
                                            connection.release();
                                            callback(error);
                                        });
                                    }
                                    connection.release();
                                    callback(null, result);
                                });
                            });
                        });
                    };

                    if (result.length > 0) {
                        cartId = result[0].id;
                        proceedToAddItem(cartId);
                    } else {
                        const createCartSql = 'INSERT INTO carrinho (idUsuario, atualizadoEm) VALUES (?, NOW())';
                        connection.query(createCartSql, [userId], (error, result) => {
                            if (error) {
                                return connection.rollback(() => {
                                    connection.release();
                                    callback(error);
                                });
                            }
                            cartId = result.insertId;
                            proceedToAddItem(cartId);
                        });
                    }
                });
            });
        });
    },
    updateItemQuantityInCart: (db, data, callback) => {
        const { userId, productId, quantity } = data;

        const sql = `
        UPDATE carrinho_produto cp
        JOIN carrinho c ON cp.idCarrinho = c.id
        SET
            cp.quantidade = ?
        WHERE
            c.idUsuario = ? AND cp.idProduto = ?;
        `;

        const updateTimestampSql = "UPDATE carrinho SET atualizadoEm = NOW() WHERE idUsuario = ?";
        
        db.query(sql, [quantity, userId, productId], (err, result) => {
            if(err) {
                return callback(err);
            }

            if (result.affectedRows > 0) {
                db.query(updateTimestampSql, [userId], (timestampErr, timestampResult) => {
                    if (timestampErr) {
                        console.error("Falha ao atualizar timestamp do carrinho:", timestampErr);
                    }
                    callback(null, result);
                });
            } else {
                callback(null, result);
            }
        });
    },
    removeItemFromCart: (db, data, callback) => {
        const { userId, productId } = data;

        const sql = `
        DELETE cp
        FROM carrinho_produto cp
        JOIN carrinho c ON cp.idCarrinho = c.id
        WHERE
            c.idUsuario = ? AND cp.idProduto = ?;
        `;

        const updateTimestampSql = "UPDATE carrinho SET atualizadoEm = NOW() WHERE idUsuario = ?";

        db.query(sql, [userId, productId], (error, result) => {
            if(error) {
                return callback(error);
            }

            if (result.affectedRows > 0) {
                db.query(updateTimestampSql, [userId], (timestampErr, timestampResult) => {
                    if (timestampErr) {
                        console.error("Falha ao atualizar timestamp do carrinho:", timestampErr);
                    }
                    callback(null, result);
                });
            } else {
                callback(null, result);
            }
        });
    },
    createOrderFromCart: (db, data, callback) => {
        const { userId, metodoPagamento } = data;

        const statusPagamento = 'Aprovado';
        const statusPedido = 'emAnalise'; 

        let cartId;
        let paymentId;
        let orderId;

        db.getConnection((err, connection) => {
            if (err) {
                return callback(err);
            }

            connection.beginTransaction((err) => {
                if (err) {
                    connection.release();
                    return callback(err);
                }

                const rollback = (error) => {
                    connection.rollback(() => {
                        connection.release();
                        callback(error);
                    });
                };

                const findCartSql = 'SELECT id FROM carrinho WHERE idUsuario = ?';
                connection.query(findCartSql, [userId], (err, cartResult) => {
                    if (err) return rollback(err);

                    cartId = cartResult[0].id;

                    const findItemsSql = 'SELECT 1 FROM carrinho_produto WHERE idCarrinho = ? LIMIT 1';
                    connection.query(findItemsSql, [cartId], (err, itemResult) => {
                        if (err) return rollback(err);

                        const createPaymentSql = 'INSERT INTO pagamento (metodoPagamento, statusPagamento) VALUES (?, ?)';
                        connection.query(createPaymentSql, [metodoPagamento, statusPagamento], (err, paymentResult) => {
                            if (err) return rollback(err);

                            paymentId = paymentResult.insertId;

                            const createOrderSql = 'INSERT INTO pedido (idUsuario, idPagamento, statusPedido) VALUES (?, ?, ?)';
                            connection.query(createOrderSql, [userId, paymentId, statusPedido], (err, orderResult) => {
                                if (err) return rollback(err);

                                orderId = orderResult.insertId;

                                const copyItemsSql = `
                                    INSERT INTO produto_pedido (idPedido, idProduto, quantidade)
                                    SELECT ?, idProduto, quantidade
                                    FROM carrinho_produto
                                    WHERE idCarrinho = ?
                                `;

                                connection.query(copyItemsSql, [orderId, cartId], (err, copyResult) => {
                                    if (err) return rollback(err);

                                    const clearCartSql = 'DELETE FROM carrinho_produto WHERE idCarrinho = ?';
                                    connection.query(clearCartSql, [cartId], (err, deleteResult) => {
                                        if (err) return rollback(err);

                                        connection.commit((err) => {
                                            if (err) return rollback(err);
                                            
                                            connection.release(); 
                                            callback(null, { orderId: orderId });
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    },
}