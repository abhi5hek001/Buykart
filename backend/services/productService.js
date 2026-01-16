const productModel = require('../models/productModel');

const productService = {
    async getAllProducts(filters) {
        return await productModel.findAll(filters);
    },

    async getProductById(id) {
        const product = await productModel.findById(id);
        if (!product) {
            throw new Error('Product not found');
        }
        return product;
    },

    async createProduct(data) {
        if (!data.name || !data.price) {
            throw new Error('Product name and price are required');
        }
        if (data.price < 0) {
            throw new Error('Price cannot be negative');
        }
        return await productModel.create(data);
    },

    async updateProduct(id, data) {
        const product = await productModel.findById(id);
        if (!product) {
            throw new Error('Product not found');
        }
        if (data.price && data.price < 0) {
            throw new Error('Price cannot be negative');
        }
        return await productModel.update(id, data);
    },

    async deleteProduct(id) {
        const deleted = await productModel.delete(id);
        if (!deleted) {
            throw new Error('Product not found');
        }
        return { message: 'Product deleted successfully' };
    },

    async checkStockAvailability(productId, quantity) {
        return await productModel.checkStock(productId, quantity);
    }
};

module.exports = productService;
