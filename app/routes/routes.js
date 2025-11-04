// app/routes/routes.js
const express = require('express');
const router = express.Router();

// Cart Controller
const { getCart, addProductToCart, updateCartItemQuantity, removeCartItem, finalizeCheckout } = require('../controllers/cartController');

// Order Controller
const { listOrders, getOrderById, showAllAdminOrders, showAdminOrderDetails, alterOrderStatus } = require('../controllers/orderController');

// Product Controller 
const { 
    listProducts, 
    getProductById, 
    alterProductAvailability,
    showAdminProducts,
    showAddProductForm,
    addProduct,
    showEditProductForm,
    updateProduct,
    deleteProduct
} = require('../controllers/productController');

// User Controller 
const { 
    showAllUsers, 
    showUserDetails,
    showAddUserForm,
    addUser,
    showEditUserForm,
    updateUser,
    deleteUser
} = require('../controllers/userController');


//MIDDLEWARE DE AUTENTICAÇÃO 

// Criar Header com key 'x-dev-role' e valor com 'funcionario' ou 'supervisor' para simular validação
function devAuth(req, res, next) {
    const role = req.headers['x-dev-role'] || req.query.asRole;
    if (role) {
        req.user = { id: 1, role: role };
    }
    next();
}


// ROTAS PÚBLICAS (CLIENTE) 


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

//ROTAS DE ADMIN (SUPERVISOR) 

// Admin: Pedidos 
// REQUISIÇÃO -> /admin/orders ou /admin/orders?status=preparando
router.get('/admin/orders', devAuth, showAllAdminOrders);

// REQUISIÇÃO -> /admin/orders/1
router.get('/admin/orders/:id', devAuth, showAdminOrderDetails);

// REQUISIÇÃO -> /admin/orders/1
// Body: { "statusPedido": "Preparando" }
router.patch('/admin/orders/:id', devAuth, alterOrderStatus);

// Admin: Produto

// REQUISIÇÃO -> /admin/products
router.get('/admin/products', devAuth, showAdminProducts);
// REQUISIÇÃO -> /admin/products/add 
router.get('/admin/products/add', devAuth, showAddProductForm);
// REQUISIÇÃO -> /admin/products/add 
router.post('/admin/products/add', devAuth, addProduct);
// REQUISIÇÃO -> /admin/products/edit/1 
router.get('/admin/products/edit/:id', devAuth, showEditProductForm);
// REQUISIÇÃO -> /admin/products/update/1 
router.post('/admin/products/update/:id', devAuth, updateProduct);
// REQUISIÇÃO -> /admin/products/delete/1 
router.post('/admin/products/delete/:id', devAuth, deleteProduct);
// REQUISIÇÃO -> /admin/products/1
// Body: { disponivel: false }
router.patch('/admin/products/:id', devAuth, alterProductAvailability);


// Admin: Usuários (Users)

// REQUISIÇÃO -> /admin/users
router.get('/admin/users', devAuth, showAllUsers);
// REQUISIÇÃO -> /admin/users/add 
router.get('/admin/users/add', devAuth, showAddUserForm);
// REQUISIÇÃO -> /admin/users/add 
router.post('/admin/users/add', devAuth, addUser);
// REQUISIÇÃO -> /admin/users/edit/1 
router.get('/admin/users/edit/:id', devAuth, showEditUserForm);
// REQUISIÇÃO -> /admin/users/update/1 
router.post('/admin/users/update/:id', devAuth, updateUser);
// REQUISIÇÃO -> /admin/users/delete/1 
router.post('/admin/users/delete/:id', devAuth, deleteUser);
// REQUISIÇÃO -> /admin/users/1 (Rota dinâmica /:id deve ser a ÚLTIMA)
router.get('/admin/users/:id', devAuth, showUserDetails);


module.exports = router;

