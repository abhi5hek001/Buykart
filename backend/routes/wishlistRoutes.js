const express = require('express');
const router = express.Router();
const wishlistController = require('../controllers/wishlistController');

const { authMiddleware } = require('../middlewares/auth');

router.get('/', authMiddleware, wishlistController.getWishlist);
router.post('/add', authMiddleware, wishlistController.addItem);
router.delete('/remove/:productId', authMiddleware, wishlistController.removeItem);
router.post('/move-to-cart/:productId', authMiddleware, wishlistController.moveToCart);
router.delete('/clear', authMiddleware, wishlistController.clearWishlist);

module.exports = router;
