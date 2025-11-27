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
const requireRoles = require('../middlewares/requireRoles');

const permitClient = requireRoles(['cliente']);

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
clientRouter.get('/orders', isAuth, permitClient, listOrders);

// REQUISIÇÃO -> /orders/1?userId=1
clientRouter.get('/orders/:id', isAuth, permitClient, getOrderById);

// ------------------------------------------------------------------------------------------------------------

// - Cart

// REQUISIÇÃO -> /cart?userId=1
clientRouter.get('/cart', isAuth, permitClient, getCart);

// REQUISIÇÃO -> /cart/add
// Body: { "userId": 1, "productId": 3 }
clientRouter.post('/cart/add', isAuth, permitClient, addProductToCart);

// REQUISIÇÃO -> PUT /cart/products/1 
// Body: { "userId": 1, "quantity": 3 }
clientRouter.put('/cart/products/:productId', isAuth, permitClient, updateCartItemQuantity);

// REQUISIÇÃO -> DELETE /cart/products/1 
// Body: { "userId": 1 }
clientRouter.delete('/cart/products/:productId', isAuth, permitClient, removeCartItem);

// ------------------------------------------------------------------------------------------------------------

// - Payment

// REQUISIÇÃO -> POST /payment
// Body: { "userId": 1, "metodoPagamento": "pix" }
clientRouter.post('/payment', isAuth, permitClient, finalizeCheckout);

module.exports = clientRouter;

