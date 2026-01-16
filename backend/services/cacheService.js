const { redis, CACHE_TTL, CACHE_KEYS } = require('../config/redis');

/**
 * Cache Service - Handles Redis caching with fallback
 */
const cacheService = {
    /**
     * Check if Redis is connected
     */
    isConnected() {
        return redis.status === 'ready';
    },

    /**
     * Get cached value by key
     */
    async get(key) {
        if (!this.isConnected()) return null;
        try {
            const value = await redis.get(key);
            return value ? JSON.parse(value) : null;
        } catch (err) {
            console.error('Cache get error:', err.message);
            return null;
        }
    },

    /**
     * Set cached value with TTL
     */
    async set(key, value, ttl = CACHE_TTL.PRODUCT) {
        if (!this.isConnected()) return false;
        try {
            await redis.setex(key, ttl, JSON.stringify(value));
            return true;
        } catch (err) {
            console.error('Cache set error:', err.message);
            return false;
        }
    },

    /**
     * Delete cached value
     */
    async del(key) {
        if (!this.isConnected()) return false;
        try {
            await redis.del(key);
            return true;
        } catch (err) {
            console.error('Cache delete error:', err.message);
            return false;
        }
    },

    /**
     * Delete multiple keys by pattern
     */
    async delByPattern(pattern) {
        if (!this.isConnected()) return false;
        try {
            const keys = await redis.keys(pattern);
            if (keys.length > 0) {
                await redis.del(...keys);
            }
            return true;
        } catch (err) {
            console.error('Cache delete pattern error:', err.message);
            return false;
        }
    },

    // ==================== PRODUCT CACHING ====================

    /**
     * Get cached product by ID
     */
    async getProduct(id) {
        return await this.get(`${CACHE_KEYS.PRODUCT}${id}`);
    },

    /**
     * Cache product
     */
    async setProduct(id, product) {
        await this.set(`${CACHE_KEYS.PRODUCT}${id}`, product, CACHE_TTL.PRODUCT);
        // Also cache stock separately with shorter TTL
        if (product.stock !== undefined) {
            await this.setStock(id, product.stock);
        }
    },

    /**
     * Invalidate product cache
     */
    async invalidateProduct(id) {
        await this.del(`${CACHE_KEYS.PRODUCT}${id}`);
        await this.del(`${CACHE_KEYS.STOCK}${id}`);
        await this.del(CACHE_KEYS.PRODUCT_LIST);
        await this.delByPattern(`${CACHE_KEYS.PRODUCT_SEARCH}*`);
    },

    /**
     * Get cached product list
     */
    async getProductList(cacheKey = CACHE_KEYS.PRODUCT_LIST) {
        return await this.get(cacheKey);
    },

    /**
     * Cache product list
     */
    async setProductList(products, cacheKey = CACHE_KEYS.PRODUCT_LIST) {
        await this.set(cacheKey, products, CACHE_TTL.PRODUCT_LIST);
    },

    // ==================== STOCK CACHING (SHORT TTL) ====================

    /**
     * Get cached stock for a product
     */
    async getStock(productId) {
        const stock = await this.get(`${CACHE_KEYS.STOCK}${productId}`);
        return stock !== null ? parseInt(stock) : null;
    },

    /**
     * Cache stock value
     */
    async setStock(productId, stock) {
        await this.set(`${CACHE_KEYS.STOCK}${productId}`, stock, CACHE_TTL.STOCK);
    },

    /**
     * Get all stock values (for polling)
     */
    async getAllStock() {
        return await this.get(CACHE_KEYS.STOCK_ALL);
    },

    /**
     * Cache all stock values
     */
    async setAllStock(stockData) {
        await this.set(CACHE_KEYS.STOCK_ALL, stockData, CACHE_TTL.STOCK);
    },

    /**
     * Decrement stock in cache (atomic operation)
     */
    async decrementStock(productId, quantity) {
        if (!this.isConnected()) return null;
        try {
            const key = `${CACHE_KEYS.STOCK}${productId}`;
            const newStock = await redis.decrby(key, quantity);
            return newStock;
        } catch (err) {
            console.error('Cache decrement error:', err.message);
            return null;
        }
    },

    // ==================== CATEGORY CACHING ====================

    /**
     * Get cached categories
     */
    async getCategories() {
        return await this.get(CACHE_KEYS.CATEGORY_LIST);
    },

    /**
     * Cache categories
     */
    async setCategories(categories) {
        await this.set(CACHE_KEYS.CATEGORY_LIST, categories, CACHE_TTL.CATEGORY);
    },

    /**
     * Invalidate category cache
     */
    async invalidateCategories() {
        await this.del(CACHE_KEYS.CATEGORY_LIST);
        await this.delByPattern(`${CACHE_KEYS.CATEGORY}*`);
    }
};

module.exports = cacheService;
