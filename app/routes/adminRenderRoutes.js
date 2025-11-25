const express = require('express');
const adminRenderRouter = express.Router();

const isAuth = require('../middlewares/isAuth');
const requireRoles = require('../middlewares/requireRoles');

const permitAdmin = requireRoles(['funcionario', 'supervisor']);
const permitSuper = requireRoles(['supervisor']);

adminRenderRouter.get('/admin/home', isAuth, permitAdmin, (req, res) => {
    res.render('admin/home', {
        user: {
            nome: req.user.nome || 'Usuário',
            tipo: req.user.tipo 
        }
    });
});

module.exports = adminRenderRouter;