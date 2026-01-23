const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { authMiddleware, adminMiddleware } = require('../middlewares/auth');

// Public routes - no authentication required
router.get('/', productController.getAll);
router.get('/:id', productController.getById);

// Protected routes - require admin authentication
router.post('/', authMiddleware, adminMiddleware, productController.create);
router.put('/:id', authMiddleware, adminMiddleware, productController.update);
router.delete('/:id', authMiddleware, adminMiddleware, productController.delete);

module.exports = router;
