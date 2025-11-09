const express = require('express');
const renderRouter = require('./app/routes/renderRoutes');
const clientRouter = require('./app/routes/clientRoutes');
const adminRouter = require('./app/routes/adminRoutes');

const app = express();

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.set('views', './app/views');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(renderRouter);
app.use(clientRouter);
app.use(adminRouter);

app.use((req, res) => {
    res.status(404).json( { error: 'Rota não encontrada' });
});

module.exports = app;