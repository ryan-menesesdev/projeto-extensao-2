const dbConn = require('../../config/dbConnection');
const { getCartItemsByUserId } = require('../models/cartModel');

const loadCart = (req, res, next) => {
    const user = req.user || res.locals.user;

    if (!user || !user.id) {
        res.locals.cart = [];
        return next();
    }

    const db = dbConn();
    getCartItemsByUserId(db, user.id, (error, result) => {
        db.end();
        
        if (error) {
            console.error("Erro silencioso ao carregar carrinho no header:", error);
            res.locals.cart = [];
        } else {
            res.locals.cart = result || [];
        }
        
        next();
    });
};

module.exports = loadCart;