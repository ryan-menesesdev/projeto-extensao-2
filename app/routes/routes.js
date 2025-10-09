const { getCart } = require('../controllers/cartController');
const { listOrders, getOrderById } = require('../controllers/orderController');
const { listProducts } = require('../controllers/productController');
const { getProductById } = require('../controllers/productController');
const { showAllAdminOrders } = require('../controllers/orderController');
const { showAdminOrderDetails } = require('../controllers/orderController');
const { showAllUsers } = require('../controllers/userController');
const { showUserDetails } = require('../controllers/userController');

function devAuth(req, res, next) {
    const role = req.headers['x-dev-role'] || req.query.asRole;
    if (role) {
        req.user = { id: 1, role: role };
    }
    next();
}

module.exports = {
    listProducts: (app) => {
        // REQUISIÇÃO -> /products ou /products?categoria=bolo
        app.get('/products', listProducts);
    },
    getProductById: (app) => {
        // REQUISIÇÃO -> /products/1
        app.get('/products/:id', getProductById);
    },
    listCart: (app) => {
        // REQUISIÇÃO -> /cart?userId=1
        app.get('/cart', getCart);
    },
    listOrders: (app) => {
        // REQUISIÇÃO -> /orders?userId=1 
        app.get('/orders', listOrders);
    },
    getOrderById: (app) => {
        // REQUISIÇÃO -> /orders/1?userId=1
        app.get('/orders/:id', getOrderById);
    },
    adminListOrders: (app) => {
        // REQUISIÇÃO -> /admin/orders ou /admin/orders?status=preparando
        app.get('/admin/orders', devAuth, showAllAdminOrders);
    },
    adminGetOrderById: (app) => {
        // REQUISIÇÃO -> /admin/orders/1
        app.get('/admin/orders/:id', devAuth, showAdminOrderDetails);
    },
    adminListUsers: (app) => {
        // REQUISIÇÃO -> /admin/users
        app.get('/admin/users', devAuth, showAllUsers);
    },
    adminGetUserById: (app) => {
        // REQUISIÇÃO -> /admin/users/1
        app.get('/admin/users/:id', devAuth, showUserDetails);
    },
    error: (app) => {
        app.use((req, res, next) => {
            res.status(404).json( { error: 'Rota não encontrada' });
        });
    }
}