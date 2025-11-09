const express = require('express');
const router = express.Router();

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
    showAllAdminOrders, 
    showAdminOrderDetails, 
    alterOrderStatus 
} = require('../controllers/orderController');

// Product Controller 
const { 
    listProducts, 
    getProductById, 
    alterProductAvailability,
    showAdminProducts,
    addProduct,
    updateProduct,
    deleteProduct
} = require('../controllers/productController');

// User Controller 
const { 
    showAllUsers, 
    showUserDetails,
    addUser,
    updateUser,
    deleteUser
} = require('../controllers/userController');

// Criar Header com key 'x-dev-role' e valor com 'funcionario' ou 'supervisor' para simular validação
function devAuth(req, res, next) {
    const role = req.headers['x-dev-role'] || req.query.asRole;
        if (role) {
            req.user = { id: 1, role: role };
        }
    next();
}

// ROTAS PÚBLICAS (CLIENTE) 


// - Product

// REQUISIÇÃO -> /products ou /products?categoria=bolo
router.get('/products', listProducts);

// REQUISIÇÃO -> /products/1
router.get('/products/:id', getProductById);


// - Order

// REQUISIÇÃO -> /orders?userId=1 
router.get('/orders', listOrders);

// REQUISIÇÃO -> /orders/1?userId=1
router.get('/orders/:id', getOrderById);


// - Cart

// REQUISIÇÃO -> /cart?userId=1
router.get('/cart', getCart);

// REQUISIÇÃO -> /cart/add
// Body: { "userId": 1, "productId": 3 }
router.post('/cart/add', addProductToCart);

// REQUISIÇÃO -> PUT /cart/products/1 
// Body: { "userId": 1, "quantity": 3 }
router.put('/cart/products/:productId', updateCartItemQuantity);

// REQUISIÇÃO -> DELETE /cart/products/1 
// Body: { "userId": 1 }
router.delete('/cart/products/:productId', removeCartItem);


// - Payment

// REQUISIÇÃO -> POST /payment
// Body: { "userId": 1, "metodoPagamento": "pix" }
router.post('/payment', finalizeCheckout);


// ROTAS DE ADMIN (FUNCIONÁRIO) 


// - Order

// REQUISIÇÃO -> /admin/orders ou /admin/orders?status=preparando
router.get('/admin/orders', devAuth, showAllAdminOrders);

// REQUISIÇÃO -> /admin/orders/1
router.get('/admin/orders/:id', devAuth, showAdminOrderDetails);

// REQUISIÇÃO -> /admin/orders/1
// Body: { "statusPedido": "Preparando" }
router.patch('/admin/orders/:id', devAuth, alterOrderStatus);


// ROTAS DE ADMIN (SUPERVISOR) 


// - Product

// REQUISIÇÃO -> /admin/products ou /admin/products?categoria=bolo              
router.get('/admin/products', devAuth, showAdminProducts);

// REQUISIÇÃO -> /admin/products                    
// Body: { "categoria": "Bebidas", "descricao": "Suco de laranja 100% natural, garrafa de 1L.", "imagem": "/imagens/produtos/suco-laranja-1l.jpg", "nome": "Suco de Laranja Natural", "preco": 12.50 }        
router.post('/admin/products', devAuth, addProduct);

// REQUISIÇÃO -> /admin/products/1                
// Body: { "categoria": "bolo", "descricao": "Bolo de fubá cremoso", "imagem": "http://example.com/images/bolo_fuba.jpg", "nome": "Bolo de Fubá", "preco": 20, "disponivel": 1 }         
router.put('/admin/products/:id', devAuth, updateProduct);

// REQUISIÇÃO -> /admin/products/1                
router.delete('/admin/products/:id', devAuth, deleteProduct);

// REQUISIÇÃO -> /admin/products/1
// Body: { disponivel: false }
router.patch('/admin/products/:id', devAuth, alterProductAvailability);


// - User

// REQUISIÇÃO -> /admin/users ou /admin/users?tipo=funcionario                 
router.get('/admin/users', devAuth, showAllUsers);

// REQUISIÇÃO -> /admin/users/1                 
router.get('/admin/users/:id', devAuth, showUserDetails);

// REQUISIÇÃO -> /admin/users/add               
// Body: { "cpf": "124.456.789-00", "nome": "Pedro Silva", "senha": "senhaSegura123!", "tipo": "cliente", "telefone": "19912345678", "email": "pedro.silva@email.com" }  
router.post('/admin/users', devAuth, addUser);

// REQUISIÇÃO -> /admin/users/update/1                 
// Body: { "nome": "Pedro Mario", "email": "pedro.mario@email.com", "telefone": "12312312312", "tipo": "supervisor" }
router.put('/admin/users/:id', devAuth, updateUser);

// REQUISIÇÃO -> /admin/users/delete/1                 
router.delete('/admin/users/:id', devAuth, deleteUser);

module.exports = router;

