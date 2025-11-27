const express = require('express');
const adminRenderRouter = express.Router();
const dbConn = require('../../config/dbConnection');

const isAuth = require('../middlewares/isAuth');
const requireRoles = require('../middlewares/requireRoles');
const { getProductById } = require('../models/productModel');
const { getUserById } = require('../models/userModel');

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

adminRenderRouter.get('/admin/products/add', isAuth, permitSuper, (req, res) => {
    res.render('admin/add-product');
}),

adminRenderRouter.get('/admin/products/edit/:id', isAuth, permitSuper, (req, res) => {
    const { id } = req.params;
    const db = dbConn();

    getProductById(db, id, (error, result) => {
        db.end();

        if (error || !result.length) {
            return res.redirect('/admin/products');
        }

        res.render('admin/edit-product', { product: result[0] });
    });
});

adminRenderRouter.get('/admin/users/add', isAuth, permitSuper, (req, res) => {
    res.render('admin/add-user');
}),

adminRenderRouter.get('/admin/users/edit/:id', isAuth, permitSuper, (req, res) => {
    const { id } = req.params;
    const db = dbConn();

    getUserById(db, id, (error, result) => {
        db.end();

        if (error || !result.length) {
            return res.redirect('/admin/users');
        }

        res.render('admin/edit-user', { user: result[0] });
    });
});

module.exports = adminRenderRouter;