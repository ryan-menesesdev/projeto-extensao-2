const express = require('express');
const routes = require('./app/routes/routes.js'); 

const app = express();
const port = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', './app/views');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

app.use(router);

app.use((req, res) => {
    res.status(404).json( { error: 'Rota não encontrada' });
});



routes.listProducts(app);
routes.getProductById(app);
routes.listCart(app);
routes.listOrders(app);
routes.getOrderById(app);


routes.adminListOrders(app);
routes.adminGetOrderById(app);

routes.adminListProducts(app); 
routes.adminShowAddProductForm(app); 
routes.adminAddProduct(app);           
routes.adminShowEditProductForm(app);  
routes.adminUpdateProduct(app);     
routes.adminDeleteProduct(app);       



routes.adminListUsers(app);    
routes.adminShowAddUserForm(app);    
routes.adminAddUser(app);            
routes.adminShowEditProductForm(app); 
routes.adminUpdateUser(app);         
routes.adminDeleteUser(app);          


routes.adminGetUserById(app);          

routes.error(app);


app.listen(port, () => {
    console.log('Servidor rodando na porta: ' + port);
});
