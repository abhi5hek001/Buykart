const stockService = require('../services/stockService');

/**
 * Stock Controller - Handles real-time stock queries and polling
 */
const stockController = {
    /**
     * GET /api/stock
     * Get stock for all products
     */
    async getAllStock(req, res, next) {
        try {
            const result = await stockService.getAllStock();
            res.json({
                success: true,
                data: result.data,
                fromCache: result.fromCache
            });
        } catch (error) {
            next(error);
        }
    },

    /**
     * GET /api/stock/:id
     * Get stock for a single product
     */
    async getProductStock(req, res, next) {
        try {
            const result = await stockService.getStock(req.params.id);
            res.json({
                success: true,
                data: result
            });
        } catch (error) {
            next(error);
        }
    },

    /**
     * GET /api/stock/bulk?ids=1,2,3
     * Get stock for multiple products
     */
    async getBulkStock(req, res, next) {
        try {
            const { ids } = req.query;
            if (!ids) {
                return res.status(400).json({
                    success: false,
                    error: 'Product IDs are required (query param: ids)'
                });
            }

            const productIds = ids.split(',').map(id => id.trim());
            const result = await stockService.getStockBulk(productIds);

            res.json({
                success: true,
                data: result
            });
        } catch (error) {
            next(error);
        }
    }
};

module.exports = stockController;
