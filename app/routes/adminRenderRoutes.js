const express = require('express');
const adminRenderRouter = express.Router();

adminRenderRouter.get('/home', (req, res) => {
    res.render('admin-home', {
        usuario: {
            nome: req.user.nome,
            tipo: req.user.tipo
        }
    });
});

adminRenderRouter.get('/pedidos', (req, res) => {
    res.render('admin-orders', {
        usuario: {
            nome: req.user.nome || 'Usuário',
            tipo: req.user.role
        }
    });
});

module.exports = adminRenderRouter;