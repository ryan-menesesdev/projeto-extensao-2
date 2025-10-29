const { getAllProducts } = require('../models/productModel');
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
    listProducts: async (app, req, res) => {
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


    },


//coisas que adicionei 
     
     showAdminProducts: (req, res) => {
        if (!req.user || req.user.role !== 'supervisor') {
            return res.status(403).send('<h1>Acesso Negado</h1>');
        }
        
        const db = dbConn();
        getAllAdminProducts(db, (error, products) => {
            db.end();
            if (error) {
                console.error("Erro ao listar produtos", error);
                return res.status(500).render('error');
            }
            res.render('listaProdutos', { products: products });
        });
    },


    showAddProductForm: (req, res) => {
        if (!req.user || req.user.role !== 'supervisor') {
            return res.status(403).send('<h1>Acesso Negado</h1>');
        }
        
        res.render('addProdutos');
    },


    showEditProductForm: (req, res) => {
        if (!req.user || req.user.role !== 'supervisor') {
            return res.status(403).send('<h1>Acesso Negado</h1>');
        }
        
        const { id } = req.params;
        const db = dbConn();
        getAdminProductById(db, id, (error, product) => {
            db.end();
            if (error || !product) {
                console.error("Erro no CONTROLLER ao buscar produto para editar:", error);
                return res.status(404).render('error');
            }
            
            res.render('editaProduto', { product: product });
        });
    },

    
    addProduct: (req, res) => {
        if (!req.user || req.user.role !== 'supervisor') {
            return res.status(403).send('<h1>Acesso Negado</h1>');
        }

        const productData = {
            nome: req.body.nome,
            preco: req.body.preco,
            descricao: req.body.descricao,
            categoria: req.body.categoria,
            estoque: req.body.estoque,
            disponivel: req.body.disponivel === 'on' ? 1 : 0 
        };

    const db = dbConn();
        createProduct(db, productData, (error, result) => {
            db.end();
            if (error) {
                console.error("Erro no CONTROLLER ao criar produto:", error);
                return res.status(500).render('error');
            }
            
            res.redirect('/admin/products');
        });
    },

    updateProduct: (req, res) => {
        if (!req.user || req.user.role !== 'supervisor') {
            return res.status(403).send('<h1>Acesso Negado</h1>');
        }

        const { id } = req.params;
        const productData = {
            nome: req.body.nome,
            preco: req.body.preco,
            descricao: req.body.descricao,
            categoria: req.body.categoria,
            estoque: req.body.estoque,
            disponivel: req.body.disponivel === 'on' ? 1 : 0 
        };

        const db = dbConn();
        updateProductById(db, id, productData, (error, result) => {
            db.end();
            if (error) {
                console.error("Erro no CONTROLLER ao atualizar produto:", error);
                return res.status(500).render('error');
            }
            res.redirect('/admin/products');
        });
    },

    deleteProduct: (req, res) => {
        if (!req.user || req.user.role !== 'supervisor') {
            return res.status(403).send('<h1>Acesso Negado</h1>');
        }
        
        const { id } = req.params;
        const db = dbConn();
        deleteProductById(db, id, (error, result) => {
            db.end();
            if (error) {
                console.error("Erro no CONTROLLER ao deletar produto:", error);
                return res.status(500).render('error');
            }
            res.redirect('/admin/products');
        });
    }

}
