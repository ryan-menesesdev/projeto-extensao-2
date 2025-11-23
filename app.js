require('dotenv').config();

const express = require('express');
const cookieParser = require('cookie-parser');
const methodOverride = require('method-override');
const authRouter = require('./app/routes/authRoutes')
const renderRouter = require('./app/routes/renderRoutes');
const adminRenderRouter = require('./app/routes/adminRenderRoutes');
const clientRouter = require('./app/routes/clientRoutes');
const adminRouter = require('./app/routes/adminRoutes');
const authData = require('./app/middlewares/authData');
const loadCart = require('./app/middlewares/loadCart');

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

app.use(authData);
app.use(loadCart);

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.set('views', './app/views');

app.use(authRouter);
app.use(renderRouter);
app.use(adminRenderRouter);
app.use(clientRouter);
app.use(adminRouter);

app.use((req, res) => {
    res.status(404).json( { error: 'Rota não encontrada' });
});

module.exports = app;