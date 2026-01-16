const cartModel = require('../models/cartModel');
const productModel = require('../models/productModel');

const cartService = {
    async getCart(userId) {
        const items = await cartModel.findByUser(userId);
        const totals = await cartModel.getCartTotal(userId);
        return {
            items,
            total: totals.total || 0,
            item_count: totals.item_count || 0
        };
    },

    async addToCart(userId, productId, quantity = 1) {
        // Check if product exists
        const product = await productModel.findById(productId);
        if (!product) {
            throw new Error('Product not found');
        }

        // Check stock availability
        if (product.stock < quantity) {
            throw new Error(`Insufficient stock. Available: ${product.stock}`);
        }

        await cartModel.addItem(userId, productId, quantity);
        return await this.getCart(userId);
    },

    async updateCartItem(userId, productId, quantity) {
        if (quantity < 0) {
            throw new Error('Quantity cannot be negative');
        }

        if (quantity === 0) {
            return await this.removeFromCart(userId, productId);
        }

        // Check stock
        const product = await productModel.findById(productId);
        if (!product) {
            throw new Error('Product not found');
        }

        if (product.stock < quantity) {
            throw new Error(`Insufficient stock. Available: ${product.stock}`);
        }

        await cartModel.updateQuantity(userId, productId, quantity);
        return await this.getCart(userId);
    },

    async removeFromCart(userId, productId) {
        await cartModel.removeItem(userId, productId);
        return await this.getCart(userId);
    },

    async clearCart(userId) {
        await cartModel.clearCart(userId);
        return { items: [], total: 0, item_count: 0 };
    }
};

module.exports = cartService;
