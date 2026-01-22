const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Order = require('../models/Order');
const User = require('../models/User');
const { authenticate, isAdmin } = require('../middleware/auth');
const { Op } = require('sequelize');
const sequelize = require('../config/database');
const upload = require('../middleware/upload');
const path = require('path');
const fs = require('fs');

// ============ IMAGE UPLOAD (NO AUTH REQUIRED) ============

// POST upload product images
router.post('/upload', upload.array('images', 5), async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ success: false, message: 'No files uploaded' });
        }

        // Return array of image paths that can be stored in the database
        const imagePaths = req.files.map(file => `images/PRODUCTS/${file.filename}`);
        
        res.json({ 
            success: true, 
            message: `${req.files.length} image(s) uploaded successfully`,
            imagePaths: imagePaths 
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// All other admin routes require authentication and admin privileges
router.use(authenticate);
router.use(isAdmin);

// ============ IMAGE MANAGEMENT ============

// GET list of available product images
router.get('/images', async (req, res) => {
    try {
        const imagesDir = path.join(__dirname, '../../images/PRODUCTS');
        
        // Check if directory exists
        if (!fs.existsSync(imagesDir)) {
            return res.json({ success: true, images: [] });
        }

        // Read all files from the PRODUCTS directory
        const files = fs.readdirSync(imagesDir);
        
        // Filter for image files and create full paths
        const imageFiles = files
            .filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file))
            .map(file => ({
                name: file,
                path: `images/PRODUCTS/${file}`
            }));

        res.json({ success: true, images: imageFiles });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ============ PRODUCT MANAGEMENT ============

// GET all products
router.get('/products', async (req, res) => {
    try {
        const products = await Product.findAll({ order: [['createdAt', 'DESC']] });
        res.json({ success: true, data: products });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// POST create product
router.post('/products', upload.array('images', 5), async (req, res) => {
    try {
        // Parse JSON fields if they come as strings
        const productData = { ...req.body };
        if (typeof productData.sizes === 'string') productData.sizes = JSON.parse(productData.sizes);
        if (typeof productData.colors === 'string') productData.colors = JSON.parse(productData.colors);
        
        // Handle uploaded images
        if (req.files && req.files.length > 0) {
            const uploadedPaths = req.files.map(file => `images/PRODUCTS/${file.filename}`);
            productData.images = uploadedPaths;
        } else {
            // No images uploaded, set empty array
            productData.images = [];
        }
        
        const product = await Product.create(productData);
        res.status(201).json({ success: true, message: 'Product created', data: product });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// PUT update product
router.put('/products/:productId', upload.array('images', 5), async (req, res) => {
    try {
        const product = await Product.findOne({ where: { productId: req.params.productId } });
        
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        // Parse JSON fields if they come as strings
        const updateData = { ...req.body };
        if (typeof updateData.sizes === 'string') updateData.sizes = JSON.parse(updateData.sizes);
        if (typeof updateData.colors === 'string') updateData.colors = JSON.parse(updateData.colors);
        if (typeof updateData.images === 'string') updateData.images = JSON.parse(updateData.images);
        
        // Add uploaded images to existing images
        if (req.files && req.files.length > 0) {
            const uploadedPaths = req.files.map(file => `images/PRODUCTS/${file.filename}`);
            const existingImages = updateData.images || product.images || [];
            updateData.images = [...existingImages, ...uploadedPaths];
        }

        await product.update(updateData);
        res.json({ success: true, message: 'Product updated', data: product });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// DELETE product
router.delete('/products/:productId', async (req, res) => {
    try {
        const product = await Product.findOne({ where: { productId: req.params.productId } });
        
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        await product.destroy();
        res.json({ success: true, message: 'Product deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ============ ORDER MANAGEMENT ============

// GET all orders
router.get('/orders', async (req, res) => {
    try {
        const { status, startDate, endDate } = req.query;
        let where = {};
        
        if (status) where.orderStatus = status;
        if (startDate || endDate) {
            where.createdAt = {};
            if (startDate) where.createdAt[Op.gte] = new Date(startDate);
            if (endDate) where.createdAt[Op.lte] = new Date(endDate);
        }

        const orders = await Order.findAll({ 
            where, 
            order: [['createdAt', 'DESC']] 
        });

        res.json({ success: true, count: orders.length, data: orders });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// PUT update order status
router.put('/orders/:orderNumber', async (req, res) => {
    try {
        const { orderStatus, paymentStatus, trackingNumber, notes } = req.body;
        
        const order = await Order.findOne({ where: { orderNumber: req.params.orderNumber } });

        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        await order.update({ orderStatus, paymentStatus, trackingNumber, notes });
        res.json({ success: true, message: 'Order updated', data: order });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ============ USER MANAGEMENT ============

// GET all users
router.get('/users', async (req, res) => {
    try {
        const users = await User.findAll({ 
            attributes: { exclude: ['password'] },
            order: [['createdAt', 'DESC']] 
        });
        res.json({ success: true, count: users.length, data: users });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ============ STATISTICS ============

// GET dashboard statistics
router.get('/stats', async (req, res) => {
    try {
        const totalProducts = await Product.count();
        const totalOrders = await Order.count();
        const totalUsers = await User.count();
        
        const revenue = await Order.findAll({
            where: { paymentStatus: 'paid' },
            attributes: [[sequelize.fn('SUM', sequelize.col('total')), 'total']]
        });

        const recentOrders = await Order.findAll({
            order: [['createdAt', 'DESC']],
            limit: 10
        });

        const lowStockProducts = await Product.findAll({ where: { stock: { [Op.lt]: 10 } } });

        res.json({
            success: true,
            data: {
                totalProducts,
                totalOrders,
                totalUsers,
                totalRevenue: revenue[0]?.dataValues?.total || 0,
                recentOrders,
                lowStockProducts
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
