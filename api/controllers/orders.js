const mongoose = require('mongoose');

const Product = require('../models/product');
const Order = require('../models/order');

exports.get_all_orders = (req, res, next) => {
    Order.find()
    .select('product quantity _id')
    .populate('product','name')
    .exec()
    .then(orders => {
        res.status(200).json({
            count: orders.length,
            orders: orders.map(order => {
                return {
                    _id: doc._id,
                    quantity: order.quantity,
                    product: order.product,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/orders/'+doc._id
                    }
                }
            })
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
};

exports.create_order = (req, res, next) => {
    Product.findById(req.body.productId)
    .then(product => {
        if(!product){
            return res.status(404).json({
                message: 'Product not found'
            });
        }
        const order = new Order({
            _id: mongoose.Types.ObjectId(),
            quantity: req.body.quantity,
            product: req.body.productId
        });
        return order.save()
    })
    .then(result => {
        console.log(result);
        res.status(201).json({
            message: 'Order created successfully',
            createdOrder: {
                _id: result._id,
                quantity: result.quantity,
                product: result.product
            },
            request: {
                type: 'GET',
                url: 'http://localhost:3000/orders/'+result._id
            }
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
};

exports.get_order_by_id = (req, res, next) => {
    Order.findById(req.params.orderId)
    .populate('product')
    .exec()
    .then(order => {
        if(!order){
            return res.status(404).json({
                message: 'Order not found'
            });
        }
        res.status(200).json({
            message: 'Orders details',
            _id: order._id,
            quantity: order.quantity,
            product: order.product,
            request: {
                type: 'GET',
                url: 'http://localhost:3000/orders'
            }
        });
    })
    .catch(err => {
        res.status(500).json({
            error: err
        });
    });
};

exports.delete_order_by_id = (req, res, next) => {
    Order.remove({_id: req.params.orderId})
    .exec()
    .then(result => {
        res.status(200).json({
            message: 'Orders deleted',
            request: {
                type: 'POST',
                url: 'http://localhost:3000/orders',
                body: { quantity: 'Number', productId: 'ID'}
            }
        });
    })
    .catch(err => {
        res.status(500).json({
            error: err
        });
    });
};