const orderService = require('../services/orderService');

const orderController = {
    // GET /api/orders
    async getAll(req, res, next) {
        try {
            const orders = await orderService.getAllOrders();
            res.json({ success: true, data: orders });
        } catch (error) {
            next(error);
        }
    },

    // GET /api/orders/user/:userId
    async getByUser(req, res, next) {
        try {
            const orders = await orderService.getOrdersByUser(req.user.id);
            res.json({ success: true, data: orders });
        } catch (error) {
            next(error);
        }
    },

    // GET /api/orders/:id
    async getById(req, res, next) {
        try {
            const order = await orderService.getOrderById(req.params.id);
            res.json({ success: true, data: order });
        } catch (error) {
            next(error);
        }
    },

    // POST /api/orders
    async create(req, res, next) {
        try {
            const orderData = {
                ...req.body,
                user_id: req.user.id
            };
            const order = await orderService.createOrder(orderData);
            res.status(201).json({ success: true, data: order });
        } catch (error) {
            next(error);
        }
    },

    // PATCH /api/orders/:id/status
    async updateStatus(req, res, next) {
        try {
            const order = await orderService.updateOrderStatus(req.params.id, req.body.status);
            res.json({ success: true, data: order });
        } catch (error) {
            next(error);
        }
    }
};

module.exports = orderController;
