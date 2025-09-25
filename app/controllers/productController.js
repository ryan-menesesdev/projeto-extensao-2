const { getAllProducts } = require('../models/productModel');
const dbConn = require('../../config/dbConnection');

module.exports = {
    listProducts: async (app, req, res) => {
        console.log('CONTROLLER de PRODUTOS');

        const db = dbConn();
        getAllProducts(db, (error, result) => {
            if (error) {
                console.log("ERRO ENCOTRANDO no CONTROLLER de PRODUTOS: ", error);
            }
            res.status(200).json({products: result});
        })
    },
}
