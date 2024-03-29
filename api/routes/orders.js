const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');

const OrdersController = require('../controllers/orders');

router.get('/', checkAuth, OrdersController.get_all_orders);

router.post('/', checkAuth, OrdersController.create_order);

router.get('/:orderId', checkAuth, OrdersController.get_order_by_id);

router.delete('/:orderId', checkAuth, OrdersController.delete_order_by_id);

module.exports = router;