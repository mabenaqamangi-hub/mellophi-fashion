const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const { authenticate } = require('../middleware/auth');

// GET /api/orders - Get all orders (Admin)
router.get('/', async (req, res) => {
    try {
        const orders = await Order.findAll({ 
            order: [['createdAt', 'DESC']] 
        });

        res.json({
            success: true,
            count: orders.length,
            data: orders
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// POST /api/orders - Create new order
router.post('/', async (req, res) => {
    try {
        console.log('📦 Order request received:', JSON.stringify(req.body, null, 2));
        const { customerInfo, shippingAddress, items, paymentMethod, subtotal, shippingCost, tax, discount, total } = req.body;

        // Validate required fields
        if (!customerInfo || !shippingAddress || !items || !paymentMethod) {
            console.error('❌ Missing required fields');
            return res.status(400).json({
                success: false,
                message: 'Missing required fields: customerInfo, shippingAddress, items, or paymentMethod'
            });
        }

        // Validate stock availability
        for (const item of items) {
            const product = await Product.findOne({ where: { productId: item.productId } });
            if (!product) {
                return res.status(400).json({
                    success: false,
                    message: `Product ${item.productId} not found`
                });
            }
            if (product.stock < item.quantity) {
                return res.status(400).json({
                    success: false,
                    message: `Insufficient stock for ${product.name}`
                });
            }
        }

        // Create order
        const order = await Order.create({
            userId: req.userId || null,
            customerInfo,
            shippingAddress,
            items,
            paymentMethod,
            subtotal,
            shippingCost,
            tax,
            discount,
            total
        });

        // Update product stock
        for (const item of items) {
            const product = await Product.findOne({ where: { productId: item.productId } });
            await product.update({ stock: product.stock - item.quantity });
        }

        res.status(201).json({
            success: true,
            message: 'Order placed successfully',
            data: order
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// GET /api/orders/:orderNumber - Get order by order number
router.get('/:orderNumber', async (req, res) => {
    try {
        const order = await Order.findOne({ where: { orderNumber: req.params.orderNumber } });
        
        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        res.json({
            success: true,
            data: order
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// GET /api/orders/user/my-orders - Get user's orders (requires authentication)
router.get('/user/my-orders', authenticate, async (req, res) => {
    try {
        const orders = await Order.findAll({ where: { userId: req.userId }, order: [['createdAt', 'DESC']] });

        res.json({
            success: true,
            count: orders.length,
            data: orders
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

module.exports = router;
