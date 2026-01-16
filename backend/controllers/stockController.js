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
    },

    /**
     * GET /api/stock/stream
     * SSE endpoint for real-time stock updates
     */
    async streamStock(req, res) {
        // Set headers for SSE
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        res.setHeader('Access-Control-Allow-Origin', '*');

        // Send initial stock data
        try {
            const result = await stockService.getAllStock();
            res.write(`data: ${JSON.stringify(result.data)}\n\n`);
        } catch (error) {
            res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
        }

        // Send updates every 5 seconds
        const intervalId = setInterval(async () => {
            try {
                const result = await stockService.getAllStock();
                res.write(`data: ${JSON.stringify(result.data)}\n\n`);
            } catch (error) {
                console.error('SSE error:', error);
            }
        }, 5000);

        // Clean up on client disconnect
        req.on('close', () => {
            clearInterval(intervalId);
            res.end();
        });
    }
};

module.exports = stockController;
