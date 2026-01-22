const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { Op } = require('sequelize');
const multer = require('multer');
const xlsx = require('xlsx');

// Configure multer for Excel file uploads
const storage = multer.memoryStorage();
const upload = multer({ 
    storage: storage,
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Only Excel files are allowed'), false);
        }
    }
});

// GET all products (with filters)
router.get('/', async (req, res) => {
    try {
        const { category, minPrice, maxPrice, featured, newArrival, bestSeller, search } = req.query;
        
        let where = {};
        
        if (category) where.category = category;
        if (featured === 'true') where.isFeatured = true;
        if (newArrival === 'true') where.isNewArrival = true;
        if (bestSeller === 'true') where.isBestSeller = true;
        if (search) where.name = { [Op.like]: `%${search}%` };
        if (minPrice || maxPrice) {
            where.price = {};
            if (minPrice) where.price[Op.gte] = Number(minPrice);
            if (maxPrice) where.price[Op.lte] = Number(maxPrice);
        }

        const products = await Product.findAll({ where, order: [['createdAt', 'DESC']] });

        res.json({
            success: true,
            count: products.length,
            data: products
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// GET single product by ID
router.get('/:productId', async (req, res) => {
    try {
        const product = await Product.findOne({ where: { productId: req.params.productId } });
        
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        res.json({
            success: true,
            data: product
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// GET featured products
router.get('/featured/list', async (req, res) => {
    try {
        const products = await Product.findAll({ where: { isFeatured: true }, limit: 8 });
        
        res.json({
            success: true,
            count: products.length,
            data: products
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// GET new arrivals
router.get('/new/arrivals', async (req, res) => {
    try {
        const products = await Product.findAll({ where: { isNewArrival: true }, limit: 8 });
        
        res.json({
            success: true,
            count: products.length,
            data: products
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// GET best sellers
router.get('/bestsellers/list', async (req, res) => {
    try {
        const products = await Product.findAll({ where: { isBestSeller: true }, limit: 8 });
        
        res.json({
            success: true,
            count: products.length,
            data: products
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// CREATE new product (Admin only)
router.post('/', async (req, res) => {
    try {
        const { productId, name, category, price, description, images, sizes, sizeGuide, colors, stock, isFeatured, isNewArrival, isBestSeller } = req.body;
        
        // Check if productId already exists
        const existingProduct = await Product.findOne({ where: { productId } });
        if (existingProduct) {
            return res.status(400).json({
                success: false,
                message: 'Product ID already exists'
            });
        }
        
        const product = await Product.create({
            productId,
            name,
            category,
            price,
            description,
            images: images || [],
            sizes: sizes || ['S', 'M', 'L'],
            sizeGuide: sizeGuide || null,
            colors: colors || ['Nude'],
            stock: stock || 0,
            isFeatured: isFeatured || false,
            isNewArrival: isNewArrival || false,
            isBestSeller: isBestSeller || false
        });
        
        res.status(201).json({
            success: true,
            message: 'Product created successfully',
            data: product
        });
    } catch (error) {
        console.error('❌ Error creating product:', error);
        res.status(500).json({
            success: false,
            message: error.message,
            error: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
});

// UPDATE product (Admin only)
router.put('/:productId', async (req, res) => {
    try {
        const { productId: newProductId, name, category, price, description, images, sizes, sizeGuide, colors, stock, isFeatured, isNewArrival, isBestSeller } = req.body;
        const oldProductId = req.params.productId;
        
        const product = await Product.findOne({ where: { productId: oldProductId } });
        
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }
        
        // If productId is being changed, check if new ID already exists
        if (newProductId && newProductId !== oldProductId) {
            const existingProduct = await Product.findOne({ where: { productId: newProductId } });
            if (existingProduct) {
                return res.status(400).json({
                    success: false,
                    message: 'New Product ID already exists'
                });
            }
        }
        
        await product.update({
            productId: newProductId || product.productId,
            name: name || product.name,
            category: category || product.category,
            price: price !== undefined ? price : product.price,
            description: description !== undefined ? description : product.description,
            images: images || product.images,
            sizes: sizes || product.sizes,
            sizeGuide: sizeGuide !== undefined ? sizeGuide : product.sizeGuide,
            colors: colors || product.colors,
            stock: stock !== undefined ? stock : product.stock,
            isFeatured: isFeatured !== undefined ? isFeatured : product.isFeatured,
            isNewArrival: isNewArrival !== undefined ? isNewArrival : product.isNewArrival,
            isBestSeller: isBestSeller !== undefined ? isBestSeller : product.isBestSeller
        });
        
        res.json({
            success: true,
            message: 'Product updated successfully',
            data: product
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// DELETE product (Admin only)
router.delete('/:productId', async (req, res) => {
    try {
        const product = await Product.findOne({ where: { productId: req.params.productId } });
        
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }
        
        await product.destroy();
        
        res.json({
            success: true,
            message: 'Product deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// IMPORT size guide from Excel (Admin only)
router.post('/:productId/import-size-guide', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No file uploaded'
            });
        }

        const product = await Product.findOne({ where: { productId: req.params.productId } });
        
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        // Parse Excel file
        const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const data = xlsx.utils.sheet_to_json(worksheet);

        // Transform data to size guide format
        const sizeGuide = {
            measurements: data.map(row => ({
                size: row.Size || row.size || '',
                bust: row.Bust || row.bust || '',
                waist: row.Waist || row.waist || '',
                hips: row.Hips || row.hips || '',
                length: row.Length || row.length || ''
            })),
            unit: 'cm',
            notes: req.body.notes || 'All measurements are in centimeters'
        };

        // Update product with size guide
        await product.update({ sizeGuide });

        res.json({
            success: true,
            message: 'Size guide imported successfully',
            data: product
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// UPDATE size guide manually (Admin only)
router.put('/:productId/size-guide', async (req, res) => {
    try {
        const { sizeGuide } = req.body;
        
        const product = await Product.findOne({ where: { productId: req.params.productId } });
        
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }
        
        await product.update({ sizeGuide });
        
        res.json({
            success: true,
            message: 'Size guide updated successfully',
            data: product
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

module.exports = router;
