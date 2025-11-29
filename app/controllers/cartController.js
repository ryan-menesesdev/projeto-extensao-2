const dbConn = require('../../config/dbConnection');
const { getCartItemsByUserId, addOrUpdateProductInCart, updateItemQuantityInCart, createOrderFromCart, removeItemFromCart } = require('../models/cartModel');

module.exports = {
    getCart: (req, res) => {
        const userId = req.user.id;

        const db = dbConn();

        getCartItemsByUserId(db, userId, (error, result) => {
            if (error) {
                console.error("Erro no CONTROLLER ao buscar CARRINHO: ", error);
                return res.status(500).render('error');
            }

            res.status(200).render('client/cart', { cart: result });
        });
    },
    addProductToCart: (req, res) => {
        const userId = req.user.id;
        const { productId } = req.body;

        const quantity = 1;

        const db = dbConn();

        addOrUpdateProductInCart(db, { userId, productId, quantity }, (error, result) => {
            if (error) {
                console.error('Erro no CONTROLLER ao ADICIONAR AO CARRINHO: ', error);
                return res.status(500).render('error');
            }

            res.redirect(req.get('referer'));
        });
    },
    updateCartItemQuantity: (req, res) => {
        const { productId } = req.params;
        const { quantity } = req.body;

        const userId = req.user.id;

        const qty = parseInt(quantity, 10);

        const db = dbConn();
        const data = {
            userId,
            productId: parseInt(productId, 10),
            quantity: qty,
        };

        updateItemQuantityInCart(db, data, (error, result) => {
            if (error) {
                console.error('Erro no CONTROLLER ao ATUALIZAR QUANTIDADE: ', error);
                return res.status(500).render('error');
            }

            res.redirect('/cart');
        });
    },

    removeCartItem: (req, res) => {
        const { productId } = req.params;
        const userId = req.user.id;

        const db = dbConn();

        const data = {
            userId,
            productId: productId,
        };

        removeItemFromCart(db, data, (error, result) => {
            if (error) {
                console.error('Erro no CONTROLLER ao REMOVER ITEM: ', error);
                return res.status(500).render('error');
            }

            res.redirect('/cart');
        });
    },
    finalizeCheckout: (req, res) => {
        const userId = req.user.id;

        const { metodoPagamento } = req.body;

        const db = dbConn();
        const data = { userId, metodoPagamento };

        createOrderFromCart(db, data, (error, result) => {
            if (error) {
                console.error('Erro no CONTROLLER ao finalizar pagamento: ', error);
                return res.status(500).render('error');
            }

            res.redirect('/payment')
        });
    },
}