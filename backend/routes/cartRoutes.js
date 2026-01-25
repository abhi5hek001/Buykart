const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

const { authMiddleware } = require('../middlewares/auth');

router.get('/', authMiddleware, cartController.getCart);
router.post('/add', authMiddleware, cartController.addItem);
router.put('/update', authMiddleware, cartController.updateItem);
router.delete('/remove/:productId', authMiddleware, cartController.removeItem);
router.delete('/clear', authMiddleware, cartController.clearCart);

module.exports = router;
