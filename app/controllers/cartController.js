const dbConn = require('../../config/dbConnection');
const { getCartItemsByUserId } = require('../models/cartModel');

module.exports = {
    getCart: (req, res) => {
        const { userId } = req.query;

        if(!userId) {
            return res.status(400).json({ error: "Não existe nenhum Usuário vinculado a esse carrinho" });
        }

        const db = dbConn();

        getCartItemsByUserId(db, userId, (error, result) => {
            db.end();

            if (error) {
                console.error("Erro no CONTROLLER ao buscar CARRINHO: ", error);
                return res.status(500).json({ error: "Erro interno do servidor." });
            }

            res.status(200).json({ cart: result });
        });
    }
}