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

        db.beginTransaction((error) => {
            if (error) {
                return callback(error);
            }

            const findCartSql = 'SELECT id FROM carrinho WHERE idUsuario = ?';

            db.query(findCartSql, [userId], (error, result) => {
                if (error) {
                    return db.rollback(() => callback(error));
                }

                if (result.length > 0) {
                    cartId = result[0].id;
                    addProductToCart(cartId);
                } else {
                    const createCartSql = 'INSERT INTO carrinho (idUsuario, atualizadoEm) VALUES (?, NOW())';
                    db.query(createCartSql, [userId], (error, result) => {
                        if (error) {
                            return db.rollback(() => callback(error));
                        }
                        cartId = result.insertId;
                        addProductToCart(cartId); 
                    });
                }
            });

            const addProductToCart = (cartId) => {

                const addProductSql = `
                INSERT INTO carrinho_produto (idCarrinho, idProduto, quantidade)
                VALUES (?, ?, ?)
                ON DUPLICATE KEY UPDATE quantidade = quantidade + VALUES(quantidade);
                `;

                db.query(addProductSql,[cartId, productId, quantity], (error, result) => {
                    if (error) {
                        return db.rollback(() => callback(error));
                    }

                    updateCartTimestamp(cartId, result);
                });
            };

            const updateCartTimestamp = (cartId, productResult) => {
                const updateCartSql = 'UPDATE carrinho SET atualizadoEm = NOW() WHERE id = ?';
                db.query(updateCartSql, [cartId], (error, result) => {
                    if (error) {
                        return db.rollback(() => callback(error));
                    }

                    db.commit((error) => {
                        if (error) {
                            return db.rollback(() => callback(error));
                        }
                        callback(null, productResult);
                    });
                });
            };
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
        const statusPedido = 'Em análise'; 

        let cartId;
        let paymentId;
        let orderId;

        db.beginTransaction((err) => {
            if (err) {
                return callback(err);
            }

            const findCartSql = 'SELECT id FROM carrinho WHERE idUsuario = ?';
            db.query(findCartSql, [userId], (err, cartResult) => {
                if (err) {
                    return db.rollback(() => callback(err))
                };

                if (cartResult.length === 0) {
                    return db.rollback(() =>
                        callback(new Error('Carrinho não encontrado.'))
                    );
                }

                cartId = cartResult[0].id;

                const findItemsSql = 'SELECT 1 FROM carrinho_produto WHERE idCarrinho = ? LIMIT 1';
                
                db.query(findItemsSql, [cartId], (err, itemResult) => {
                    if (err) {
                        return db.rollback(() => callback(err))
                    };

                    if (itemResult.length === 0) {
                        return db.rollback(() => callback(new Error('CARRINHO_VAZIO')));
                    }

                    const createPaymentSql = 'INSERT INTO pagamento (metodoPagamento, statusPagamento) VALUES (?, ?)';
                    db.query(createPaymentSql, [metodoPagamento, statusPagamento], (err, paymentResult) => {
                        if (err) {
                            return db.rollback(() => callback(err))
                        };

                        paymentId = paymentResult.insertId;

                        const createOrderSql = 'INSERT INTO pedido (idUsuario, idPagamento, statusPedido) VALUES (?, ?, ?)';
                        db.query(createOrderSql, [userId, paymentId, statusPedido], (err, orderResult) => {
                            if (err) {
                                return db.rollback(() => callback(err))
                            };

                            orderId = orderResult.insertId;

                            const copyItemsSql = `
                                INSERT INTO produto_pedido (idPedido, idProduto, quantidade)
                                SELECT ?, idProduto, quantidade
                                FROM carrinho_produto
                                WHERE idCarrinho = ?
                            `;

                            db.query(copyItemsSql, [orderId, cartId], (err, copyResult) => {
                                if (err) {
                                    return db.rollback(() => callback(err))
                                };

                                const clearCartSql = 'DELETE FROM carrinho_produto WHERE idCarrinho = ?';
                                db.query(clearCartSql, [cartId], (err, deleteResult) => {
                                    if (err) {
                                        return db.rollback(() => callback(err))
                                    };
                                    db.commit((err) => {
                                        if (err) {
                                            return db.rollback(() => callback(err))
                                        };

                                            callback(null, { orderId: orderId });
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