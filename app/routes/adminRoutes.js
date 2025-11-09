const express = require('express');
const adminRouter = express.Router();
const devAuth = require('../middlewares/devAuth');

// Order Controller
const { 
    showAllAdminOrders, 
    showAdminOrderDetails, 
    alterOrderStatus 
} = require('../controllers/orderController');

// Product Controller 
const { 
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

// ROTAS DE ADMIN (FUNCIONÁRIO) 

// - Order

// REQUISIÇÃO -> /admin/orders ou /admin/orders?status=preparando
adminRouter.get('/admin/orders', devAuth, showAllAdminOrders);

// REQUISIÇÃO -> /admin/orders/1
adminRouter.get('/admin/orders/:id', devAuth, showAdminOrderDetails);

// REQUISIÇÃO -> /admin/orders/1
// Body: { "statusPedido": "Preparando" }
adminRouter.patch('/admin/orders/:id', devAuth, alterOrderStatus);

// ------------------------------------------------------------------------------------------------------------

// ROTAS DE ADMIN (SUPERVISOR) 

// - Product

// REQUISIÇÃO -> /admin/products ou /admin/products?categoria=bolo              
adminRouter.get('/admin/products', devAuth, showAdminProducts);

// REQUISIÇÃO -> /admin/products                    
// Body: { "categoria": "Bebidas", "descricao": "Suco de laranja 100% natural, garrafa de 1L.", "imagem": "/imagens/produtos/suco-laranja-1l.jpg", "nome": "Suco de Laranja Natural", "preco": 12.50 }        
adminRouter.post('/admin/products', devAuth, addProduct);

// REQUISIÇÃO -> /admin/products/1                
// Body: { "categoria": "bolo", "descricao": "Bolo de fubá cremoso", "imagem": "http://example.com/images/bolo_fuba.jpg", "nome": "Bolo de Fubá", "preco": 20, "disponivel": 1 }         
adminRouter.put('/admin/products/:id', devAuth, updateProduct);

// REQUISIÇÃO -> /admin/products/1                
adminRouter.delete('/admin/products/:id', devAuth, deleteProduct);

// REQUISIÇÃO -> /admin/products/1
// Body: { disponivel: false }
adminRouter.patch('/admin/products/:id', devAuth, alterProductAvailability);

// ------------------------------------------------------------------------------------------------------------

// - User

// REQUISIÇÃO -> /admin/users ou /admin/users?tipo=funcionario                 
adminRouter.get('/admin/users', devAuth, showAllUsers);

// REQUISIÇÃO -> /admin/users/1                 
adminRouter.get('/admin/users/:id', devAuth, showUserDetails);

// REQUISIÇÃO -> /admin/users/add               
// Body: { "cpf": "124.456.789-00", "nome": "Pedro Silva", "senha": "senhaSegura123!", "tipo": "cliente", "telefone": "19912345678", "email": "pedro.silva@email.com" }  
adminRouter.post('/admin/users', devAuth, addUser);

// REQUISIÇÃO -> /admin/users/update/1                 
// Body: { "nome": "Pedro Mario", "email": "pedro.mario@email.com", "telefone": "12312312312", "tipo": "supervisor" }
adminRouter.put('/admin/users/:id', devAuth, updateUser);

// REQUISIÇÃO -> /admin/users/delete/1                 
adminRouter.delete('/admin/users/:id', devAuth, deleteUser);

module.exports = adminRouter;