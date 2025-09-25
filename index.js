const express = require('express');
const routes = require('./app/routes/routes');

const app = express();
const port = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', './app/views');

app.use(express.urlencoded({ extended: true }));

routes.listProducts(app);
routes.error(app);

app.listen(port, () => {
    console.log('Servidor rodando na porta: ' + port);
});

