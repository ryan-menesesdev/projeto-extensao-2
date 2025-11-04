const express = require('express');
const router = express.Router();

// Cart Controller
const { getCart, addProductToCart, updateCartItemQuantity, removeCartItem, finalizeCheckout } = require('../controllers/cartController');

// Order Controller
const { listOrders, getOrderById, showAllAdminOrders, showAdminOrderDetails, alterOrderStatus } = require('../controllers/orderController');

// Product Controller
const { listProducts, getProductById, alterProductAvailability } = require('../controllers/productController');

// User Controller
const { showAllUsers, showUserDetails } = require('../controllers/userController');

// Criar Header com key 'x-dev-role' e valor com 'funcionario' ou 'supervisor' para simular validação
function devAuth(req, res, next) {
    const role = req.headers['x-dev-role'] || req.query.asRole;
    if (role) {
        req.user = { id: 1, role: role };
    }
    next();
}

// CLIENTE

// REQUISIÇÃO -> /products ou /products?categoria=bolo
router.get('/products', listProducts);

// REQUISIÇÃO -> /products/1
router.get('/products/:id', getProductById);

// REQUISIÇÃO -> /cart?userId=1
router.get('/cart', getCart);

// REQUISIÇÃO -> /orders?userId=1 
router.get('/orders', listOrders);

// REQUISIÇÃO -> /orders/1?userId=1
router.get('/orders/:id', getOrderById);

// REQUISIÇÃO -> /cart/add
// Body: { "userId": 1, "productId": 3 }
router.post('/cart/add', addProductToCart);

// REQUISIÇÃO -> PUT /cart/products/1 
// Body: { "userId": 1, "quantity": 3 }
router.put('/cart/products/:productId', updateCartItemQuantity);

// REQUISIÇÃO -> DELETE /cart/products/1 
// Body: { "userId": 1 }
router.delete('/cart/products/:productId', removeCartItem);

// REQUISIÇÃO -> POST /payment
// Body: { "userId": 1, "metodoPagamento": "pix" }
router.post('/payment', finalizeCheckout);

// ADMIN

// REQUISIÇÃO -> /admin/orders ou /admin/orders?status=preparando
router.get('/admin/orders', devAuth, showAllAdminOrders);

// REQUISIÇÃO -> /admin/orders/1
// Body: { "userId": 1, "metodoPagamento": "pix" }
router.get('/admin/orders/:id', devAuth, showAdminOrderDetails);

// REQUISIÇÃO -> /admin/orders/1
// Body: { "statusPedido": "Preparando" }
router.patch('/admin/orders/:id', devAuth, alterOrderStatus);

// REQUISIÇÃO -> /admin/products/1
// Body: { disponivel: false }
router.patch('/admin/products/:id', devAuth, alterProductAvailability);

// REQUISIÇÃO -> /admin/users
router.get('/admin/users', devAuth, showAllUsers);

// REQUISIÇÃO -> /admin/users/1
router.get('/admin/users/:id', devAuth, showUserDetails);

router.get('/admin/users', devAuth, showAllUsers);

router.get('/admin/users/add', devAuth, showAddUserForm);

router.post('/admin/users/add', devAuth, addUser);

router.get('/admin/users/edit/:id', devAuth, showEditUserForm);

router.post('/admin/users/update/:id', devAuth, updateUser);

router.post('/admin/users/delete/:id', devAuth, deleteUser);

router.get('/admin/users/:id', devAuth, showUserDetails);

module.exports = router;