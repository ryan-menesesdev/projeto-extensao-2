const dbConn = require("../../config/dbConnection");
const { getOrdersByUserId, getOrderById } = require("../models/orderModel");

module.exports = {
    listOrders: (req, res) => {
        const { userId, status } = req.query;

        if (!userId) {
            return res.status(400).json({ error: "Não foi encontrado usuário vinculado." });
        }

        const db = dbConn();

        getOrdersByUserId(db, userId, status, (error, result) => {
            db.end();

            if(error) {
                console.error("Erro no CONTROLLER ao LISTAR PEDIDOS:", error);
                return res.status(500).json({ error: "Erro interno do servidor." });
            }

            res.status(200).json({ orders: result });
        });
    },
    getOrderById: (req, res) => {
        const { id } = req.params;
        const { userId } = req.query;

        if(!userId) {
            return res.status(400).json({ error: "Nenhum usuário foi encontrado sobre esse pedido" });
        }

        const db = dbConn();

        getOrderById(db, id, userId, (error, result) => {
            db.end();

            if(error) {
                console.error("Erro no CONTROLLER ao LISTAR PEDIDO por ID:", error);
                res.status(500).json({ error: 'Erro interno no servidor' });
            }

            if (!result.details) {
                return res.status(404).json({ message: "Pedido não encontrado ou não pertence a este usuário." });
            }
            
            res.status(200).json({ order: result });
        });
    },

    showAllAdminOrders: (req, res) => {
        // verificação
        if (!req.user || (req.user.role !== 'funcionario' && req.user.role !== 'supervisor')) {
            return res.status(403).send('<h1>Acesso Negado</h1><p>Você não tem permissão para ver esta página.</p>');
        }
        // --- FIM DA VERIFICAÇÃO ---

        const { status } = req.query;
        const db = dbConn();
        const { getAllOrders } = require("../models/orderModel");
        getAllOrders(db, status, (error, orders) => {
            db.end();
            if (error) {
                console.error("Erro no CONTROLLER (admin) ao listar pedidos:", error);
                return res.status(500).render('error');
            }
            res.render('admin/orders-list', { orders: orders });
        });
    },

    showAdminOrderDetails: (req, res) => {
        // verificcao
        if (!req.user || (req.user.role !== 'funcionario' && req.user.role !== 'supervisor')) {
            return res.status(403).send('<h1>Acesso Negado</h1><p>Você não tem permissão para ver esta página.</p>');
        }
       
        
        const { id } = req.params;
        const db = dbConn();
        const { getAdminOrderById } = require("../models/orderModel");
        getAdminOrderById(db, id, (error, order) => {
            db.end();
            if (error) {
                console.error("Erro no CONTROLLER (admin) ao buscar pedido por ID:", error);
                return res.status(500).render('error');
            }
            if (!order) {
                return res.status(404).render('error');
            }
            res.render('admin/order-details', { order: order });
        });
    }
}
