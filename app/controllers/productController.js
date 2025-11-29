const { getAllProducts, alterProductAvailability, getAllAdminProducts, createProduct, updateProductById, deleteProductById } = require('../models/productModel');
const { getProductById } = require('../models/productModel');
const dbConn = require('../../config/dbConnection');

module.exports = {
    listProducts: async (req, res) => {
        console.log('CONTROLLER de PRODUTOS');

        const { categoria } = req.query;
        const db = dbConn();

        getAllProducts(db, categoria, (error, result) => {
            if (error) {
                console.log("Erro no Controller de PRODUTOS ao LISTAR produtos: ", error);
                return res.status(500).render('error');
            }
            
            res.render('client/products', {
                title: categoria ? `${categoria.charAt(0).toUpperCase() + categoria.slice(1)} - Sinhá Bolos e Lanches` : 'Produtos - Sinhá Bolos e Lanches',
                products: result,
            })
        })
    },
    getProductById: async (req, res) => {
        const { id } = req.params;
        const db = dbConn();

        getProductById(db, id, (error, result) => {
            if (error) {
                console.log("Erro no Controller de PRODUTOS ao buscar por ID: ", error);
                return res.status(500).render('error');
            }

            res.status(200).render('client/product-display', { product: result[0] });
        });
    },
    alterProductAvailability: (req, res) => {
        const { id } = req.params;

        const disponivelValue = req.body.disponivel; 

        const isDisponivel = (disponivelValue == '1' || disponivelValue == 1 || disponivelValue == 'true');

        const db = dbConn();

        alterProductAvailability(db, isDisponivel, id, (error, result) => {
            if (error) {
                console.log("Erro no Controller de PRODUTOS:", error);
                return res.status(500).render('error');
            }
            
            res.redirect('/admin/products');
        });
    },
    showAdminProducts: (req, res) => {
        const { categoria } = req.query;
        const db = dbConn();

        getAllAdminProducts(db, categoria, (error, products) => {
            if (error) {
                console.error("Erro ao listar produtos", error);
                return res.status(500).render('error');
            }

            res.status(200).render('admin/products', { products: products });
        });
    },
    
    addProduct: (req, res) => {
        const productData = {
            nome: req.body.nome,
            preco: parseFloat(req.body.preco),
            descricao: req.body.descricao,
            categoria: req.body.categoria,
            imagem: req.body.imagem,
            disponivel: req.body.disponivel == '1' 
        };

        const db = dbConn();

        createProduct(db, productData, (error, result) => {
            if (error) {
                console.error("Erro no CONTROLLER ao criar produto:", error);
                return res.status(500).render('error');
            }

            res.redirect('/admin/products');
        });
    },

    updateProduct: (req, res) => {
        const { id } = req.params;
        const productData = {
            nome: req.body.nome,
            preco: parseFloat(req.body.preco),
            descricao: req.body.descricao,
            imagem: req.body.imagem,
            categoria: req.body.categoria,
            disponivel: req.body.disponivel == '1'
        };

        const db = dbConn();
        updateProductById(db, id, productData, (error, result) => {
            if (error) {
                console.error("Erro no CONTROLLER ao atualizar produto:", error);
                return res.status(500).render('error');
            }

            res.redirect('/admin/products');
        });
    },
}
