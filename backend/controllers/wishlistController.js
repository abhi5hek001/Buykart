const wishlistService = require('../services/wishlistService');

const wishlistController = {
    // GET /api/wishlist/:userId
    async getWishlist(req, res, next) {
        try {
            const wishlist = await wishlistService.getWishlist(req.user.id);
            res.json({ success: true, data: wishlist });
        } catch (error) {
            next(error);
        }
    },

    // POST /api/wishlist/:userId/add
    async addItem(req, res, next) {
        try {
            const { product_id } = req.body;
            const wishlist = await wishlistService.addToWishlist(req.user.id, product_id);
            res.status(201).json({ success: true, data: wishlist });
        } catch (error) {
            next(error);
        }
    },

    // DELETE /api/wishlist/:userId/remove/:productId
    async removeItem(req, res, next) {
        try {
            const wishlist = await wishlistService.removeFromWishlist(req.user.id, req.params.productId);
            res.json({ success: true, data: wishlist });
        } catch (error) {
            next(error);
        }
    },

    // POST /api/wishlist/:userId/move-to-cart/:productId
    async moveToCart(req, res, next) {
        try {
            const quantity = req.body.quantity || 1;
            const result = await wishlistService.moveToCart(req.user.id, req.params.productId, quantity);
            res.json({ success: true, ...result });
        } catch (error) {
            next(error);
        }
    },

    // DELETE /api/wishlist/:userId/clear
    async clearWishlist(req, res, next) {
        try {
            const wishlist = await wishlistService.clearWishlist(req.user.id);
            res.json({ success: true, data: wishlist, message: 'Wishlist cleared successfully' });
        } catch (error) {
            next(error);
        }
    }
};

module.exports = wishlistController;
