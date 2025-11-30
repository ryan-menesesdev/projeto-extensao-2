const dbConn = require("../../config/dbConnection");
const { getAdminOrderById, alterOrderStatus } = require("../models/orderModel");
const { getAllOrders } = require("../models/orderModel");
const { getOrdersByUserId, getOrderById } = require("../models/orderModel");
const sendEmail = require("../services/emailService");

module.exports = {
    listOrders: (req, res) => {
        const { status } = req.query;

        const userId = req.user.id;

        const db = dbConn();

        getOrdersByUserId(db, userId, status, (error, result) => {
            if(error) {
                console.error("Erro no CONTROLLER ao LISTAR PEDIDOS:", error);
                return res.status(500).render('error');
            }

            res.status(200).render('client/orders', { orders: result });
        });
    },
    getOrderById: (req, res) => {
        const { id } = req.params;

        const userId = req.user.id;

        const db = dbConn();

        getOrderById(db, id, userId, (error, result) => {
            if(error) {
                console.error("Erro no CONTROLLER ao LISTAR PEDIDO por ID:", error);
                res.status(500).render('error');
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
            if (error) {
                console.error("Erro no CONTROLLER (admin) ao listar pedidos:", error);
                return res.status(500).render('error');
            }

            res.status(200).render('admin/orders', { orders: orders });
        });
    },

    showAdminOrderDetails: (req, res) => {
    const { id } = req.params;
    const db = dbConn();

    getAdminOrderById(db, id, (error, orderData) => {
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

        getAdminOrderById(db, id, (error, orderData) => {
            if (error || !orderData) {
                console.error("Erro ao buscar dados para envio de email:", error);
            }

            const clientEmail = orderData?.details?.emailCliente;
            const clientName = orderData?.details?.nomeCliente;

            alterOrderStatus(db, id, statusPedido, async (updateError, result) => {
                if (updateError) {
                    console.error("Erro ao atualizar status:", updateError);
                    return res.redirect('/admin/orders');
                }

                console.log(`[Order] Pedido #${id} atualizado para: ${statusPedido}`);

                if (clientEmail) {
                    await sendEmail(clientEmail, clientName, statusPedido, id);
                }

                res.redirect('/admin/orders');
            });
        });
    }
}
