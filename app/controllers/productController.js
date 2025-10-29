const { getAllProducts, alterProductAvailability } = require('../models/productModel');
const { getProductById } = require('../models/productModel');
const { getAllAdminProducts } = require('../models/productModel');
const { getAdminProductById } = require('../models/productModel');
const { createProduct } = require('../models/productModel');
const { updateProductById } = require('../models/productModel');
const { deleteProductById } = require('../models/productModel');

/*const {  mannn ese aqui é uma dica que o gemini passou, estava fazendo as coisas com ele, ai ele deu a dica de fazer assim quando for o mesmo endereço, mas se nao curir só apaga blz????
    getAllProducts, 
    getProductById,
    getAllAdminProducts, 
    getAdminProductById, 
    createProduct,       
    updateProductById,   
    deleteProductById    
} = require("../models/productModel");*/

const dbConn = require('../../config/dbConnection');

module.exports = {
    listProducts: async (req, res) => {
        console.log('CONTROLLER de PRODUTOS');

        const { categoria } = req.query;
        const db = dbConn();

        getAllProducts(db, categoria, (error, result) => {
            db.end();

            if (error) {
                console.log("Erro no Controller de PRODUTOS ao LISTAR produtos: ", error);
                return res.status(500).json({ error: "Erro interno do servidor." });
            }
            
            res.status(200).json({products: result});
        })
    },
    getProductById: async (req, res) => {
        const { id } = req.params;
        const db = dbConn();

        getProductById(db, id, (error, result) => {
            db.end();

            if (error) {
                console.log("Erro no Controller de PRODUTOS ao buscar por ID: ", error);
                return res.status(500).json({ error: "Erro interno de servidor." });
            }

            if(!result.length) {
                return res.status(400).json({ message: "Produto não encontrado." });
            }

            res.status(200).json({ product: result[0] });
        })


    }
}
