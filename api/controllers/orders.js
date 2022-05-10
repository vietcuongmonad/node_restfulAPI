const mongoose = require('mongoose')

const Order = require('../models/order')
const Product = require('../models/product')

exports.orders_get_all = (req, res, next) => {
    Order.find()
        .select('_id productId quantity')
        .populate('productId', 'name')
        .exec()
        .then(result => {
            res.status(200).json({
                count: result.length,
                orders: result.map(item => {
                    return {
                        _id: item._id,
                        productId: item.productId,
                        quantity: item.quantity,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/orders/' + item._id
                        }
                    }
                })
            })
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
}

exports.orders_create_order = (req, res, netxt) => {
    Product.findById(req.body.productId)
        .then(product => {
            if (!product) {
                return res.status(404).json({
                    message: "Product not found!"
                })
            }
            const order = new Order({
                _id: mongoose.Types.ObjectId(),
                quantity: req.body.quantity,
                productId: req.body.productId
            })
            return order.save()
        })
        .then(result => {
            console.log(result)
            res.status(201).json({
                message: 'Order stored!',
                createdOrder: {
                    _id: result._id,
                    productId: result.productId,
                    quantity: result.quantity
                },
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/orders/' + result._id
                }
            })            
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
}

exports.orders_get_order = (req, res, next) => {
    Order.findById(req.params.orderId)
        //.populate('productId')
        .exec()
        .then(item => {
            if (item) {
                res.status(200).json({
                    order: item,
                    request: {
                        type: 'GET',
                        description: 'GET_ALL_ORDER',
                        url: 'http://localhost:3000/orders/'
                    }
                })
            } else {
                res.status(404).json({
                    message: 'No valid entry found!'
                })
            }
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
}

exports.orders_delete_order = (req, res, next) => {
    Order.deleteOne({ _id: req.params.orderId })
        .exec()
        .then(result => {
            if (result.deletedCount == 0) {
                return res.status(404).json({
                    message: 'Order not found!'
                })
            }
            res.status(200).json({
                message: 'Order deleted!',
                request: {
                    type: 'GET',
                    description: 'GET_ALL_ORDER',
                    url: 'http://localhost:3000/orders/'
                }
            })
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
}