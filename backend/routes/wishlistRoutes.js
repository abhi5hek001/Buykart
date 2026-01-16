const express = require('express');
const router = express.Router();
const wishlistController = require('../controllers/wishlistController');

router.get('/:userId', wishlistController.getWishlist);
router.post('/:userId/add', wishlistController.addItem);
router.delete('/:userId/remove/:productId', wishlistController.removeItem);
router.post('/:userId/move-to-cart/:productId', wishlistController.moveToCart);
router.delete('/:userId/clear', wishlistController.clearWishlist);

module.exports = router;
