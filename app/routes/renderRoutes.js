const express = require('express');
const renderRouter = express.Router();

// ROTAS DE RENDERIZAÇÃO

renderRouter.get('/', (req, res) => {
    res.render('client/index');
});

renderRouter.get('/about', (req, res) => {
    res.render('client/about');
});

renderRouter.get('/contact', (req, res) => {
    res.render('client/contact');
});

renderRouter.get('/team', (req, res) => {
    res.render('client/team');
});

renderRouter.get('/login', (req, res) => {
    res.render('client/login');
});

renderRouter.get('/register', (req, res) => {
    res.render('client/register');
});

module.exports = renderRouter;