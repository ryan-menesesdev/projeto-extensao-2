const dbConn = require("../../config/dbConnection");
const { getAdminOrderById } = require("../models/orderModel");
const { getAllOrders } = require("../models/orderModel");
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

        if (!req.user || (req.user.role === 'cliente')) {
            return res.status(403).json({ error: 'Você não tem acesso a essa funcionalidade'});
        }

        const { status } = req.query;

        const db = dbConn();

        getAllOrders(db, status, (error, orders) => {
            db.end();

            if (error) {
                console.error("Erro no CONTROLLER (admin) ao listar pedidos:", error);
                return res.status(500).json({ error: 'Erro interno do servidor.'});
            }

            res.status(200).json({ orders: orders });
        });
    },

    showAdminOrderDetails: (req, res) => {
        if (!req.user || (req.user.role === 'cliente')) {
            return res.status(403).json({ error: 'Você não tem acesso a essa funcionalidade'});
        }
       
        const { id } = req.params;

        const db = dbConn();

        getAdminOrderById(db, id, (error, order) => {
            db.end();
            if (error) {
                console.error("Erro no CONTROLLER (admin) ao buscar pedido por ID:", error);
                return res.status(500).json({ error: 'Erro interno do servidor.'});
            }

            if (!order) {
                return res.status(404).json({ error: 'Pedido não encontrado.' });
            }

            res.status(200).json({ order: order });
        });
    }
}
