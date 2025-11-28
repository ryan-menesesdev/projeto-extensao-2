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

const { 
    validateRegister
} = require('../validators/clientValidator');

const isAuth = require('../middlewares/isAuth');
const requireRoles = require('../middlewares/requireRoles');

const permitClient = requireRoles(['cliente']);

// ROTAS PÚBLICAS (CLIENTE) 

clientRouter.post('/register', validateRegister, register);

// - Product
clientRouter.get('/products', listProducts);
clientRouter.get('/products/:id', getProductById);

// ------------------------------------------------------------------------------------------------------------

// - Order
clientRouter.get('/orders', isAuth, permitClient, listOrders);
clientRouter.get('/orders/:id', isAuth, permitClient, getOrderById);

// ------------------------------------------------------------------------------------------------------------

// - Cart

clientRouter.get('/cart', isAuth, permitClient, getCart);
clientRouter.post('/cart/add', isAuth, permitClient, addProductToCart);
clientRouter.put('/cart/products/:productId', isAuth, permitClient, updateCartItemQuantity);
clientRouter.delete('/cart/products/:productId', isAuth, permitClient, removeCartItem);

// ------------------------------------------------------------------------------------------------------------

// - Payment

clientRouter.post('/payment', isAuth, permitClient, finalizeCheckout);

module.exports = clientRouter;

