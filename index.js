const express = require('express');
const routes = require('./app/routes/routes');

const app = express();
const port = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', './app/views');

app.use(express.urlencoded({ extended: true }));

// Middleware para simular autenticação de usuário
app.use((req, res, next) => {
  // Simula um login de SUPERVISOR (Pode ver tudo)
  req.user = { id: 6, nome: 'Thiago Supervisor Teste', role: 'supervisor' };

  
  next(); 
});



routes.listProducts(app);
routes.getProductById(app);
routes.listCart(app);
routes.listOrders(app);
routes.getOrderById(app);

routes.adminListOrders(app);
routes.adminGetOrderById(app);
routes.adminListUsers(app);
routes.adminGetUserById(app);

// A rota de erro deve ser a última
routes.error(app);

app.listen(port, () => {
    console.log('Servidor rodando na porta: ' + port);
});