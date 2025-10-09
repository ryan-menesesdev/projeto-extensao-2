const { getCart } = require('../controllers/cartController');
const { listOrders, getOrderById } = require('../controllers/orderController');
const { listProducts } = require('../controllers/productController');
const { getProductById } = require('../controllers/productController');
const { showAllAdminOrders } = require('../controllers/orderController');
const { showAdminOrderDetails } = require('../controllers/orderController');
const { showAllUsers } = require('../controllers/userController');
const { showUserDetails } = require('../controllers/userController');

module.exports = {
    listProducts: (app) => {
        // REQUISIÇÃO -> /products ou /products?categoria=bolo
        app.get('/products', (req, res) => {
            listProducts(app, req, res);
        });
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
    error: (app) => {
        app.use((req, res, next) => {
            res.status(404).render('error.ejs');
        });
    },
    adminListOrders: (app) => {
        // REQUISIÇÃO -> /admin/orders ou /admin/orders?status=preparando
        app.get('/admin/orders', showAllAdminOrders);
    },
    adminGetOrderById: (app) => {
        // REQUISIÇÃO -> /admin/orders/1
        app.get('/admin/orders/:id', showAdminOrderDetails);
    },
    adminListUsers: (app) => {
        // REQUISIÇÃO -> /admin/users
        app.get('/admin/users', showAllUsers);
    },
    adminGetUserById: (app) => {
        // REQUISIÇÃO -> /admin/users/1
        app.get('/admin/users/:id', showUserDetails);
    }
}