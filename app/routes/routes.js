const { getCart } = require('../controllers/cartController');

const { 
    listOrders, 
    getOrderById, 
    showAllAdminOrders, 
    showAdminOrderDetails 
} = require('../controllers/orderController');

const { 
    listProducts, 
    getProductById,
    showAdminProducts,
    showAddProductForm,
    showEditProductForm,
    addProduct,
    updateProduct,
    deleteProduct
} = require('../controllers/productController');

const { 
    showAllUsers, 
    showUserDetails,
    showAddUserForm,
    showEditUserForm,
    addUser,
    updateUser,
    deleteUser
} = require('../controllers/userController'); 


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
    },

    //as rotas que eu coloquei novas******

    adminShowAddUserForm: (app) => {
        app.get('/admin/users/add', showAddUserForm);
    },
    adminShowEditUserForm: (app) => {
        app.get('/admin/users/edit/:id', showEditUserForm);
    },
    adminAddUser: (app) => {
        app.post('/admin/users/add', addUser);
    },
    adminUpdateUser: (app) => {
        app.post('/admin/users/update/:id', updateUser);
    },
    adminDeleteUser: (app) => {
        app.post('/admin/users/delete/:id', deleteUser);
    },
}