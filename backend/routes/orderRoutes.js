const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

const { authMiddleware, adminMiddleware } = require('../middlewares/auth');

router.get('/', authMiddleware, adminMiddleware, orderController.getAll);
router.get('/my-orders', authMiddleware, orderController.getByUser);
router.get('/:id', authMiddleware, orderController.getById);
router.post('/', authMiddleware, orderController.create);
router.patch('/:id/status', authMiddleware, adminMiddleware, orderController.updateStatus);

module.exports = router;
