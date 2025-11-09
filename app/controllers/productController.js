const { getAllProducts, alterProductAvailability, getAllAdminProducts, createProduct, updateProductById, deleteProductById } = require('../models/productModel');
const { getProductById } = require('../models/productModel');
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
            db.end();

            if (error) {
                console.log("Erro no Controller de PRODUTOS ao buscar por ID: ", error);
                return res.status(500).json({ error: "Erro interno de servidor." });
            }

            if(!result.length) {
                return res.status(400).json({ message: "Produto não encontrado." });
            }

            res.status(200).json({ product: result[0] });
        });
    },
    alterProductAvailability: (req, res) => {
        if (!req.user || (req.user.role !== 'funcionario' && req.user.role !== 'supervisor')) {
            return res.status(401).json({ error: 'Você não tem acesso a essa funcionalidade'});
        }

        const { id } = req.params;
        const { disponivel } = req.body;

        if (typeof disponivel !== 'boolean') {
            return res.status(400).json({ error: 'A "disponibilidade" (true/false) é obrigatória no corpo da requisição.' });
        }

        const db = dbConn();

        alterProductAvailability(db, disponivel, id, (error, result) => {
            db.end();

            if (error) {
                console.log("Erro no Controller de PRODUTOS ao buscar por ID: ", error);
                return res.status(500).json({ error: "Erro interno de servidor." });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Produto não encontrado.' });
            }

            res.status(200).json({ message: "Disponibilidade do produto alterada." });
        });
    },
     
     showAdminProducts: (req, res) => {
        if (!req.user || req.user.role !== 'supervisor') {
            return res.status(403).send('<h1>Acesso Negado</h1>');
        }
        
        const { categoria } = req.query;
        const db = dbConn();

        getAllAdminProducts(db, categoria, (error, products) => {
            db.end();
            if (error) {
                console.error("Erro ao listar produtos", error);
                return res.status(500).render('error');
            }

            res.status(200).json({ products: products });
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
            imagem: req.body.imagem,
            disponivel: req.body.disponivel === 1 
        };

        const db = dbConn();

        createProduct(db, productData, (error, result) => {
            db.end();
            if (error) {
                console.error("Erro no CONTROLLER ao criar produto:", error);
                return res.status(500).render('error');
            }

            res.status(201).json({message: "Produto adicionado com sucesso!"});
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
            disponivel: req.body.disponivel
        };

        const db = dbConn();
        updateProductById(db, id, productData, (error, result) => {
            db.end();
            if (error) {
                console.error("Erro no CONTROLLER ao atualizar produto:", error);
                return res.status(500).render('error');
            }
        });

        res.status(201).json({message: "Produto editado com sucesso!"});
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
        });

        res.status(200).json({message: "Produto apagado com sucesso!"});
    }

}
