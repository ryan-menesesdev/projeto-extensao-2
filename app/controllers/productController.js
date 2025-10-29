const { 
    getAllAdminProducts, 
    getAdminProductById, 
    createProduct, 
    updateProductById, 
    deleteProductById 
} = require("../models/productModel");


const dbConn = require('../../config/dbConnection');


function validateProduct(data) {
    if (!data.nome || data.nome.trim() === '') {
        return 'O nome é obrigatório.';
    }
    if (!data.preco || isNaN(parseFloat(data.preco)) || parseFloat(data.preco) <= 0) {
        return 'O preço é obrigatório e deve ser um número positivo.';
    }
    if (data.estoque === '' || data.estoque === null || isNaN(parseInt(data.estoque)) || parseInt(data.estoque) < 0) {
        return 'O estoque é obrigatório e deve ser um número 0 ou maior.';
    }
    return null;
}

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


    }, 



    showAdminProducts: (req, res) => {
        if (!req.user || req.user.role !== 'supervisor') {
            return res.status(403).send('<h1>Acesso Negado</h1>');
        }
        
        const db = dbConn();
        getAllAdminProducts(db, (error, products) => {
            db.end();
            if (error) {
                console.error("Erro no CONTROLLER ao listar produtos (admin):", error);
                return res.status(500).render('error');
            }
            // Nome do EJS: 'admin-list-products.ejs' (ou o nome que você escolheu)
            res.status(200).render('listaProdutos', { products: products });
        });
    },

    
    showAddProductForm: (req, res) => {
        if (!req.user || req.user.role !== 'supervisor') {
            return res.status(403).send('<h1>Acesso Negado</h1>');
        }
        
        res.status(200).render('addProdutos');
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
           
            res.status(200).render('editaProduto', { product: product });
        });
    },

    
    addProduct: (req, res) => {
        if (!req.user || req.user.role !== 'supervisor') {
            return res.status(403).send('<h1>Acesso Negado</h1>');
        }

        // Validação
        const errorMsg = validateProduct(req.body);
        if (errorMsg) {
            return res.status(400).send(`Erro de validação: ${errorMsg}`);
        }

        const productData = {
            nome: req.body.nome,
            preco: parseFloat(req.body.preco), 
            descricao: req.body.descricao || '',
            categoria: req.body.categoria || null,
            estoque: parseInt(req.body.estoque),
            disponivel: req.body.disponivel === '1' ? true : false
        };

        const db = dbConn();
        createProduct(db, productData, (error, result) => {
            db.end();
            if (error) {
                console.error("Erro no CONTROLLER ao ADICIONAR produto:", error);
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

        
        const errorMsg = validateProduct(req.body);
        if (errorMsg) {
            return res.status(400).send(`Erro de validação: ${errorMsg}`);
        }

        const productData = {
            nome: req.body.nome,
            preco: parseFloat(req.body.preco), 
            descricao: req.body.descricao || '',
            categoria: req.body.categoria || null,
            estoque: parseInt(req.body.estoque),
            disponivel: req.body.disponivel === '1' ? true : false
        };

        const db = dbConn();
        updateProductById(db, id, productData, (error, result) => {
            db.end();
            if (error) {
                console.error("Erro no CONTROLLER ao ATUALIZAR produto:", error);
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
                console.error("Erro no CONTROLLER ao DELETAR produto:", error);
                return res.status(500).render('error');
            }
            res.redirect('/admin/products');
        });
    }
}
