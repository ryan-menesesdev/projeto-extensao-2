const express = require('express');
const clientRouter = express.Router();

const { register } = require('../controllers/authController')

// Cart Controller
const { 
    getCart, 
    addProductToCart, 
    updateCartItemQuantity, 
    removeCartItem, 
    finalizeCheckout 
} = require('../controllers/cartController');

// Order Controller
const { 
    listOrders, 
    getOrderById, 
} = require('../controllers/orderController');

// Product Controller 
const { 
    listProducts, 
    getProductById, 
} = require('../controllers/productController');
const isAuth = require('../middlewares/isAuth');

// ROTAS PÚBLICAS (CLIENTE) 

clientRouter.post('/register', register);

// - Product

// REQUISIÇÃO -> /products ou /products?categoria=bolo
clientRouter.get('/products', listProducts);

// REQUISIÇÃO -> /products/1
clientRouter.get('/products/:id', getProductById);

// ------------------------------------------------------------------------------------------------------------

// - Order

// REQUISIÇÃO -> /orders?userId=1 
clientRouter.get('/orders', isAuth, listOrders);

// REQUISIÇÃO -> /orders/1?userId=1
clientRouter.get('/orders/:id', isAuth, getOrderById);

// ------------------------------------------------------------------------------------------------------------

// - Cart

// REQUISIÇÃO -> /cart?userId=1
clientRouter.get('/cart', isAuth, getCart);

// REQUISIÇÃO -> /cart/add
// Body: { "userId": 1, "productId": 3 }
clientRouter.post('/cart/add', isAuth, addProductToCart);

// REQUISIÇÃO -> PUT /cart/products/1 
// Body: { "userId": 1, "quantity": 3 }
clientRouter.put('/cart/products/:productId', isAuth, updateCartItemQuantity);

// REQUISIÇÃO -> DELETE /cart/products/1 
// Body: { "userId": 1 }
clientRouter.delete('/cart/products/:productId', isAuth, removeCartItem);

// ------------------------------------------------------------------------------------------------------------

// - Payment

// REQUISIÇÃO -> POST /payment
// Body: { "userId": 1, "metodoPagamento": "pix" }
clientRouter.post('/payment', isAuth, finalizeCheckout);

module.exports = clientRouter;

