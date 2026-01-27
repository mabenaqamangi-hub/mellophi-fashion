const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Order = require('../models/Order');
const User = require('../models/User');
const { authenticate, isAdmin } = require('../middleware/auth');
const { Op } = require('sequelize');
const sequelize = require('../config/database');
const upload = require('../middleware/upload');
const uploadToCloudinary = require('../utils/uploadToCloudinary');
const path = require('path');
const fs = require('fs');

// ============ PUBLIC ENDPOINTS (NO AUTH REQUIRED) ============

// POST upload product images (secure signature, backend only)
const crypto = require('crypto');
const multerUpload = upload.single('images');

router.post('/upload', multerUpload, async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No file uploaded' });
        }

        const cloudinary = require('cloudinary').v2;
        const timestamp = Math.floor(Date.now() / 1000);
        const folder = 'products';
        const use_filename = true;
        const unique_filename = false;
        const overwrite = false;

        // Build params for signature (sorted alphabetically)
        const paramsToSign = {
            folder,
            overwrite: overwrite ? 1 : 0,
            timestamp,
            unique_filename: unique_filename ? 1 : 0,
            use_filename: use_filename ? 1 : 0
        };
        const sortedKeys = Object.keys(paramsToSign).sort();
        const paramString = sortedKeys.map(key => `${key}=${paramsToSign[key]}`).join('&');
        const toSign = paramString + process.env.CLOUDINARY_API_SECRET;
        const signature = crypto.createHash('sha1').update(toSign).digest('hex');

        // Upload to Cloudinary with signature
        cloudinary.uploader.upload(req.file.path, {
            api_key: process.env.CLOUDINARY_API_KEY,
            timestamp,
            signature,
            folder,
            use_filename,
            unique_filename,
            overwrite
        }, (error, result) => {
            // Remove local file after upload
            try { require('fs').unlinkSync(req.file.path); } catch (e) {}
            if (error) {
                console.error('Cloudinary upload error:', error);
                return res.status(500).json({ success: false, message: error.message });
            }
            res.json({ success: true, imagePaths: [result.secure_url] });
        });
    } catch (error) {
        console.error('Upload route error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// ============ SEED DATABASE (ONE-TIME SETUP - NO AUTH) ============

// Seed products only
router.post('/seed-products', async (req, res) => {
    try {
        const existingProducts = await Product.count();
        if (existingProducts > 0) {
            return res.status(400).json({ 
                success: false, 
                message: `Database already has ${existingProducts} products.` 
            });
        }

        const productsData = [
            { id: "A1", name: "A1 — Casual Summer Dress", category: "dress", price: 380, images: ["images/PRODUCTS/A1 front.png"], sizes: ["XS", "S", "M", "L"], stock: 15, isNewArrival: true },
            { id: "A2", name: "A2 — Casual Dress", category: "dress", price: 300, images: ["images/PRODUCTS/A2 front.png"], sizes: ["S", "M", "L"], stock: 12 },
            { id: "A3", name: "A3 — Summer Dress", category: "dress", price: 400, images: ["images/PRODUCTS/A3 front.png"], sizes: ["XS", "S", "M", "L"], stock: 10, isBestSeller: true },
            { id: "A4", name: "A4 — Casual Dress", category: "dress", price: 380, images: ["images/PRODUCTS/A4 front.png"], sizes: ["S", "M", "L"], stock: 8, isBestSeller: true },
            { id: "A5", name: "A5 — Elegant Dress", category: "dress", price: 450, images: ["images/PRODUCTS/A5 front.png"], sizes: ["XS", "S", "M", "L"], stock: 6 },
            { id: "A6", name: "A6 — Party Dress", category: "dress", price: 500, images: ["images/PRODUCTS/A6 front.png"], sizes: ["S", "M", "L"], stock: 5 },
            { id: "A7", name: "A7 — Maxi Dress", category: "dress", price: 550, images: ["images/PRODUCTS/A7 front.png"], sizes: ["XS", "S", "M", "L"], stock: 7 },
            { id: "A8", name: "A8 — Cocktail Dress", category: "dress", price: 600, images: ["images/PRODUCTS/A8 front.png"], sizes: ["S", "M", "L"], stock: 4 },
            { id: "A9", name: "A9 — Evening Dress", category: "dress", price: 650, images: ["images/PRODUCTS/A9 front.png"], sizes: ["XS", "S", "M", "L"], stock: 3 },
            { id: "B1", name: "B1 — Elegant Dress", category: "dress", price: 380, images: ["images/PRODUCTS/B1 front.png"], sizes: ["XS", "S", "M", "L"], stock: 14, isNewArrival: true },
            { id: "B2", name: "B2 — Formal Dress", category: "dress", price: 400, images: ["images/PRODUCTS/B2 front.png"], sizes: ["S", "M", "L"], stock: 11, isBestSeller: true },
            { id: "B3", name: "B3 — Cocktail Dress", category: "dress", price: 450, images: ["images/PRODUCTS/B3 front.png"], sizes: ["XS", "S", "M", "L"], stock: 9 },
            { id: "B4", name: "B4 — Sleeveless Dress", category: "dress", price: 420, images: ["images/PRODUCTS/B4 front.png"], sizes: ["S", "M", "L"], stock: 8 },
            { id: "C1", name: "C1 — V-Neck Top", category: "top", price: 220, images: ["images/PRODUCTS/C1 front.png"], sizes: ["S", "M", "L"], stock: 20, isNewArrival: true },
            { id: "C2", name: "C2 — Ribbed Tee", category: "top", price: 220, images: ["images/PRODUCTS/C2 front.png"], sizes: ["S", "M", "L"], stock: 18, isBestSeller: true },
            { id: "C3", name: "C3 — Casual Top", category: "top", price: 250, images: ["images/PRODUCTS/C3 front.png"], sizes: ["S", "M", "L"], stock: 16 },
            { id: "C4", name: "C4 — Crop Top", category: "top", price: 220, images: ["images/PRODUCTS/C4 front.png"], sizes: ["S", "M", "L"], stock: 15 },
            { id: "C5", name: "C5 — Sleeveless Top", category: "top", price: 200, images: ["images/PRODUCTS/C5 front.png"], sizes: ["S", "M", "L"], stock: 12 },
            { id: "C6", name: "C6 — Basic Tee", category: "top", price: 180, images: ["images/PRODUCTS/C6 front.png"], sizes: ["S", "M", "L"], stock: 25 },
            { id: "D1", name: "D1 — Co-ord Set", category: "set", price: 300, images: ["images/PRODUCTS/D1 front.png"], sizes: ["XS", "S", "M", "L"], stock: 10, isNewArrival: true }
        ];

        await Product.bulkCreate(productsData);
        res.json({ success: true, message: `✅ ${productsData.length} products added` });
    } catch (error) {
        console.error('Seed products error:', error);
        res.status(500).json({ success: false, message: error.message, stack: error.stack });
    }
});

// Create admin user
router.post('/create-admin', async (req, res) => {
    try {
        const adminExists = await User.findOne({ where: { email: 'admin@mellophi.co.za' } });
        if (adminExists) {
            return res.status(400).json({ success: false, message: 'Admin already exists' });
        }

        const admin = await User.create({
            firstName: 'Admin',
            lastName: 'Mellophi',
            email: 'admin@mellophi.co.za',
            password: 'Mellophi2026!',
            isAdmin: true
        });

        res.json({ 
            success: true, 
            message: '✅ Admin user created',
            credentials: { email: 'admin@mellophi.co.za', password: 'Mellophi2026!' }
        });
    } catch (error) {
        console.error('Create admin error:', error);
        res.status(500).json({ success: false, message: error.message, stack: error.stack });
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
        // Secure Cloudinary upload for images
        if (req.files && req.files.length > 0) {
            const crypto = require('crypto');
            const cloudinary = require('cloudinary').v2;
            const imageUrls = [];
            for (const file of req.files) {
                const timestamp = Math.floor(Date.now() / 1000);
                const folder = 'products';
                const use_filename = true;
                const unique_filename = false;
                const overwrite = false;
                const paramsToSign = {
                    folder,
                    overwrite: overwrite ? 1 : 0,
                    timestamp,
                    unique_filename: unique_filename ? 1 : 0,
                    use_filename: use_filename ? 1 : 0
                };
                const sortedKeys = Object.keys(paramsToSign).sort();
                const paramString = sortedKeys.map(key => `${key}=${paramsToSign[key]}`).join('&');
                const toSign = paramString + process.env.CLOUDINARY_API_SECRET;
                const signature = crypto.createHash('sha1').update(toSign).digest('hex');
                const result = await cloudinary.uploader.upload(file.path, {
                    api_key: process.env.CLOUDINARY_API_KEY,
                    timestamp,
                    signature,
                    folder,
                    use_filename,
                    unique_filename,
                    overwrite
                });
                try { require('fs').unlinkSync(file.path); } catch (e) {}
                imageUrls.push(result.secure_url);
            }
            productData.images = imageUrls;
        } else {
            productData.images = [];
        }
        const product = await Product.create(productData);
        res.status(201).json({ success: true, message: 'Product created', data: product });
        
        // Add uploaded images to existing images (Cloudinary)
        if (req.files && req.files.length > 0) {
            const imageUrls = [];
            for (const file of req.files) {
                const url = await uploadToCloudinary(file.path);
                imageUrls.push(url);
            }
            const existingImages = updateData.images || product.images || [];
            updateData.images = [...existingImages, ...imageUrls];
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

