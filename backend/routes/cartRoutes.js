const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

router.get('/:userId', cartController.getCart);
router.post('/:userId/add', cartController.addItem);
router.put('/:userId/update', cartController.updateItem);
router.delete('/:userId/remove/:productId', cartController.removeItem);
router.delete('/:userId/clear', cartController.clearCart);

module.exports = router;
