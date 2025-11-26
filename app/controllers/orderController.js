const dbConn = require("../../config/dbConnection");
const { getAdminOrderById, alterOrderStatus } = require("../models/orderModel");
const { getAllOrders } = require("../models/orderModel");
const { getOrdersByUserId, getOrderById } = require("../models/orderModel");

module.exports = {
    listOrders: (req, res) => {
        const { status } = req.query;

        const userId = req.user.id;

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

            res.status(200).render('client/orders', { orders: result });
        });
    },
    getOrderById: (req, res) => {
        const { id } = req.params;

        const userId = req.user.id;

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
                return res.status(400).json({ message: "Pedido não encontrado ou não pertence a este usuário." });
            }
            
            res.status(200).render('client/order-display', { 
                order: result.details, 
                products: result.products 
            });
        });
    },

    showAllAdminOrders: (req, res) => {
        const { status } = req.query;

        const db = dbConn();

        getAllOrders(db, status, (error, orders) => {
            db.end();

            if (error) {
                console.error("Erro no CONTROLLER (admin) ao listar pedidos:", error);
                return res.status(500).json({ error: 'Erro interno do servidor.'});
            }

            res.status(200).render('admin/orders', { orders: orders });
        });
    },

    showAdminOrderDetails: (req, res) => {
    const { id } = req.params;
    const db = dbConn();

    getAdminOrderById(db, id, (error, orderData) => {
        db.end();
        if (error) {
            console.error("Erro no CONTROLLER (admin) ao buscar pedido por ID:", error);
            return res.redirect('/admin/orders'); 
        }

        if (!orderData) {
            return res.redirect('/admin/orders');
        }

        res.render('admin/orders-display', { orderData: orderData });
    });
},
    alterOrderStatus: (req, res) => {
        const { id } = req.params;
        const { statusPedido } = req.body;

        if (!statusPedido) {
            return res.redirect('/admin/orders');
        }

        const db = dbConn();

        alterOrderStatus(db, id, statusPedido, (error, result) => {
            db.end();
            
            if (error) {
                console.error("Erro ao atualizar status:", error);
                return res.redirect('/admin/orders'); 
            }

            console.log(`[Order] Pedido #${id} atualizado para: ${statusPedido}`);
            res.redirect('/admin/orders');
        });
    }
}
