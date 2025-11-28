const express = require('express');
const adminRouter = express.Router();

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
} = require('../controllers/productController');

// User Controller 
const { 
    showAllUsers, 
    showUserDetails,
    addUser,
    updateUser,
    deleteUser
} = require('../controllers/userController');

const isAuth = require('../middlewares/isAuth');
const requireRoles = require('../middlewares/requireRoles');
const { validateProduct, validateProductUpdate } = require('../validators/productValidator');
const { validateUser, validateUserUpdate } = require('../validators/userValidator');

const permitOrder = requireRoles(['supervisor', 'funcionario']);
const permitSuper = requireRoles(['supervisor']);

// ROTAS DE ADMIN (FUNCIONÁRIO) 

// - Order

adminRouter.get('/admin/orders', isAuth, permitOrder, showAllAdminOrders);
adminRouter.get('/admin/orders/:id', isAuth, permitOrder, showAdminOrderDetails);
adminRouter.patch('/admin/orders/:id', isAuth, permitOrder, alterOrderStatus);

// ------------------------------------------------------------------------------------------------------------

// ROTAS DE ADMIN (SUPERVISOR) 

// - Product
     
adminRouter.get('/admin/products', isAuth, permitSuper, showAdminProducts);
adminRouter.post('/admin/products', isAuth, permitSuper, validateProduct, addProduct);       
adminRouter.put('/admin/products/:id', isAuth, permitSuper, validateProductUpdate, updateProduct);           
adminRouter.patch('/admin/products/:id', isAuth, permitSuper, alterProductAvailability);

// ------------------------------------------------------------------------------------------------------------

// - User
                
adminRouter.get('/admin/users', isAuth, permitSuper, showAllUsers);         
adminRouter.get('/admin/users/:id', isAuth, permitSuper, showUserDetails);
adminRouter.post('/admin/users', isAuth, permitSuper, validateUser, addUser);
adminRouter.put('/admin/users/:id', isAuth, permitSuper, validateUserUpdate, updateUser);           
adminRouter.delete('/admin/users/:id', isAuth, permitSuper, deleteUser);

module.exports = adminRouter;