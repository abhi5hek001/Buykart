const prisma = require('../config/db');
const cacheService = require('./cacheService');

/**
 * Stock Service - Handles real-time stock queries and polling
 */
const stockService = {
    /**
     * Get stock for a single product (with cache)
     */
    async getStock(productId) {
        // Try cache first
        const cachedStock = await cacheService.getStock(productId);
        if (cachedStock !== null) {
            return { productId, stock: cachedStock, fromCache: true };
        }

        // Fetch from database
        const product = await prisma.product.findUnique({
            where: { id: parseInt(productId) },
            select: { id: true, stock: true }
        });

        if (!product) {
            throw new Error('Product not found');
        }

        // Cache the stock
        await cacheService.setStock(productId, product.stock);

        return { productId: product.id, stock: product.stock, fromCache: false };
    },

    /**
     * Get stock for multiple products (bulk query for polling)
     */
    async getStockBulk(productIds) {
        const results = {};

        // Try cache first for all products
        const uncachedIds = [];
        for (const id of productIds) {
            const cached = await cacheService.getStock(id);
            if (cached !== null) {
                results[id] = { stock: cached, fromCache: true };
            } else {
                uncachedIds.push(parseInt(id));
            }
        }

        // Fetch uncached from database
        if (uncachedIds.length > 0) {
            const products = await prisma.product.findMany({
                where: { id: { in: uncachedIds } },
                select: { id: true, stock: true }
            });

            for (const product of products) {
                results[product.id] = { stock: product.stock, fromCache: false };
                // Cache the stock
                await cacheService.setStock(product.id, product.stock);
            }
        }

        return results;
    },

    /**
     * Get all product stock (for polling endpoint)
     */
    async getAllStock() {
        // Try cache first
        const cached = await cacheService.getAllStock();
        if (cached) {
            return { data: cached, fromCache: true };
        }

        // Fetch from database
        const products = await prisma.product.findMany({
            select: { id: true, name: true, stock: true }
        });

        const stockData = products.reduce((acc, p) => {
            acc[p.id] = { name: p.name, stock: p.stock };
            return acc;
        }, {});

        // Cache the result
        await cacheService.setAllStock(stockData);

        return { data: stockData, fromCache: false };
    },

    /**
     * Check if products have sufficient stock (for order validation)
     * Uses raw SQL with locking to ensure consistency
     */
    async checkAndLockStock(items, tx) {
        const results = [];

        for (const item of items) {
            // Use raw SQL with FOR UPDATE to lock the row
            const [product] = await tx.$queryRaw`
                SELECT id, name, stock, price 
                FROM products 
                WHERE id = ${parseInt(item.product_id)}
                FOR UPDATE
            `;

            if (!product) {
                throw new Error(`Product with ID ${item.product_id} not found`);
            }

            if (product.stock < item.quantity) {
                throw new Error(
                    `Insufficient stock for "${product.name}". ` +
                    `Requested: ${item.quantity}, Available: ${product.stock}`
                );
            }

            results.push({
                productId: product.id,
                name: product.name,
                quantity: item.quantity,
                price: product.price,
                currentStock: product.stock
            });
        }

        return results;
    },

    /**
     * Decrement stock for products (within transaction)
     */
    async decrementStock(productId, quantity, tx) {
        await tx.$executeRaw`
            UPDATE products 
            SET stock = stock - ${quantity}
            WHERE id = ${productId}
        `;

        // Invalidate cache for this product
        await cacheService.invalidateProduct(productId);
    }
};

module.exports = stockService;
