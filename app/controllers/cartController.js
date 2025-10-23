const dbConn = require('../../config/dbConnection');
const { getCartItemsByUserId, addOrUpdateProductInCart, updateItemQuantityInCart, createOrderFromCart, removeItemFromCart } = require('../models/cartModel');

module.exports = {
    getCart: (req, res) => {
        const { userId } = req.query;

        if(!userId) {
            return res.status(400).json({ error: "Não existe nenhum Usuário vinculado a esse carrinho" });
        }

        const db = dbConn();

        getCartItemsByUserId(db, userId, (error, result) => {
            db.end();

            if (error) {
                console.error("Erro no CONTROLLER ao buscar CARRINHO: ", error);
                return res.status(500).json({ error: "Erro interno do servidor." });
            }

            res.status(200).json({ cart: result });
        });
    },
    addProductToCart: (req, res) => {
        const { userId, productId } = req.body;

        const quantity = 1;

        if (!userId || !productId) {
            return res.status(400).json({
                error: 'Usuário e produto não encontrados.',
            });
        }

        const db = dbConn();

        const data = { userId, productId, quantity };

        addOrUpdateProductInCart(db, { userId, productId, quantity }, (error, result) => {
                db.end();

                if (error) {
                console.error('Erro no CONTROLLER ao ADICIONAR AO CARRINHO: ', error);
                    return res.status(500).json({ error: 'Erro interno do servidor.' });
                }

                res.status(200).json({ cart: result });
            }
        );
    },
    updateCartItemQuantity: (req, res) => {
        const { productId } = req.params;

        const { userId, quantity } = req.body;

        if (!userId || !quantity) {
        return res
            .status(400)
            .json({ error: 'userId e quantity são obrigatórios no body.' });
        }

        const qty = parseInt(quantity, 10);
        if (isNaN(qty) || qty <= 0) {
            return res.status(400).json({ error: 'quantity deve ser um número positivo maior que zero.' });
        }

        const db = dbConn();
        const data = {
            userId,
            productId: parseInt(productId, 10),
            quantity: qty,
        };

        updateItemQuantityInCart(db, data, (error, result) => {
            db.end();
            if (error) {
                console.error('Erro no CONTROLLER ao ATUALIZAR QUANTIDADE: ', error);
                return res.status(500).json({ error: 'Erro interno do servidor.' });
            }
            
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Item não encontrado no carrinho.' });
            }

            res.status(200).json({ message: 'Quantidade do item atualizada.' });
        });
    },

    removeCartItem: (req, res) => {
        const { productId } = req.params;
        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({ error: 'userId é obrigatório no body.' });
        }

        const db = dbConn();

        const data = {
            userId,
            productId: productId,
        };

        removeItemFromCart(db, data, (error, result) => {
            db.end();
            if (error) {
                console.error('Erro no CONTROLLER ao REMOVER ITEM: ', error);
                return res.status(500).json({ error: 'Erro interno do servidor.' });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Item não encontrado no carrinho.' });
            }

            res.status(200).json({ message: 'Item removido do carrinho.' });
        });
    },
    finalizeCheckout: (req, res) => {
        const { userId, metodoPagamento } = req.body;

        if (!userId || !metodoPagamento) {
            return res.status(400).json({
                error: 'userId e metodoPagamento são obrigatórios.',
            });
        }

        const db = dbConn();
        const data = { userId, metodoPagamento };

        createOrderFromCart(db, data, (error, result) => {
            db.end();

            if (error) {
                if (error.message === 'CARRINHO_VAZIO') {
                    return res.status(400).json({
                        error: 'Não é possível finalizar a compra com um carrinho vazio.',
                    });
                }

                console.error('Erro no CONTROLLER ao finalizar pagamento: ', error);
                return res.status(500).json({ error: 'Erro interno do servidor.' });
            }

            res.status(201).json({ message: 'Pagamento aprovado e pedido criado com sucesso!', orderId: result.orderId });
        });
    },
}