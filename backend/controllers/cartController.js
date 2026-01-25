const cartService = require('../services/cartService');

const cartController = {
    // GET /api/cart/:userId
    async getCart(req, res, next) {
        try {
            const cart = await cartService.getCart(req.user.id);
            res.json({ success: true, data: cart });
        } catch (error) {
            next(error);
        }
    },

    // POST /api/cart/:userId/add
    async addItem(req, res, next) {
        try {
            const { product_id, quantity } = req.body;
            const cart = await cartService.addToCart(req.user.id, product_id, quantity);
            res.status(201).json({ success: true, data: cart });
        } catch (error) {
            next(error);
        }
    },

    // PUT /api/cart/:userId/update
    async updateItem(req, res, next) {
        try {
            const { product_id, quantity } = req.body;
            const cart = await cartService.updateCartItem(req.user.id, product_id, quantity);
            res.json({ success: true, data: cart });
        } catch (error) {
            next(error);
        }
    },

    // DELETE /api/cart/:userId/remove/:productId
    async removeItem(req, res, next) {
        try {
            const cart = await cartService.removeFromCart(req.user.id, req.params.productId);
            res.json({ success: true, data: cart });
        } catch (error) {
            next(error);
        }
    },

    // DELETE /api/cart/:userId/clear
    async clearCart(req, res, next) {
        try {
            const cart = await cartService.clearCart(req.user.id);
            res.json({ success: true, data: cart, message: 'Cart cleared successfully' });
        } catch (error) {
            next(error);
        }
    }
};

module.exports = cartController;
