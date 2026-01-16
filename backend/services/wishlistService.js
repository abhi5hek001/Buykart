const wishlistModel = require('../models/wishlistModel');
const cartModel = require('../models/cartModel');
const productModel = require('../models/productModel');

const wishlistService = {
    async getWishlist(userId) {
        return await wishlistModel.findByUser(userId);
    },

    async addToWishlist(userId, productId) {
        // Check if product exists
        const product = await productModel.findById(productId);
        if (!product) {
            throw new Error('Product not found');
        }

        // Check if already in wishlist
        const isInWishlist = await wishlistModel.isInWishlist(userId, productId);
        if (isInWishlist) {
            throw new Error('Product already in wishlist');
        }

        await wishlistModel.addItem(userId, productId);
        return await this.getWishlist(userId);
    },

    async removeFromWishlist(userId, productId) {
        await wishlistModel.removeItem(userId, productId);
        return await this.getWishlist(userId);
    },

    async moveToCart(userId, productId, quantity = 1) {
        // Check if product is in wishlist
        const isInWishlist = await wishlistModel.isInWishlist(userId, productId);
        if (!isInWishlist) {
            throw new Error('Product not in wishlist');
        }

        // Check product stock
        const product = await productModel.findById(productId);
        if (!product) {
            throw new Error('Product not found');
        }

        if (product.stock < quantity) {
            throw new Error(`Insufficient stock. Available: ${product.stock}`);
        }

        // Add to cart
        await cartModel.addItem(userId, productId, quantity);

        // Remove from wishlist
        await wishlistModel.removeItem(userId, productId);

        return {
            message: 'Item moved to cart successfully',
            wishlist: await this.getWishlist(userId)
        };
    },

    async clearWishlist(userId) {
        await wishlistModel.clearWishlist(userId);
        return [];
    }
};

module.exports = wishlistService;
