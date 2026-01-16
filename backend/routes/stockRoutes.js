const express = require('express');
const router = express.Router();
const stockController = require('../controllers/stockController');

// GET /api/stock - Get all product stock
router.get('/', stockController.getAllStock);

// GET /api/stock/stream - SSE endpoint for real-time updates
router.get('/stream', stockController.streamStock);

// GET /api/stock/bulk?ids=1,2,3 - Get multiple products stock
router.get('/bulk', stockController.getBulkStock);

// GET /api/stock/:id - Get single product stock
router.get('/:id', stockController.getProductStock);

module.exports = router;
