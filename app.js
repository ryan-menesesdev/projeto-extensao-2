const express = require('express');
const router = require('./app/routes/routes');

const app = express();

app.set('view engine', 'ejs');
app.set('views', './app/views');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(router);

app.use((req, res) => {
    res.status(404).json( { error: 'Rota não encontrada' });
});

module.exports = app;