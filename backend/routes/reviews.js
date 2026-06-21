const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const Product = require('../models/Product');
const { Op } = require('sequelize');

// Get all reviews for a product
router.get('/product/:productId', async (req, res) => {
    try {
        const reviews = await Review.findAll({
            where: { productId: req.params.productId },
            order: [['createdAt', 'DESC']]
        });
        
        res.json(reviews);
    } catch (error) {
        console.error('Error fetching reviews:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error fetching reviews',
            error: error.message 
        });
    }
});

// Submit a new review
router.post('/', async (req, res) => {
    try {
        const { productId, customerName, customerEmail, rating, comment } = req.body;

        // Validation
        if (!productId || !customerName || !customerEmail || !rating || !comment) {
            return res.status(400).json({ 
                success: false, 
                message: 'All fields are required' 
            });
        }

        if (rating < 1 || rating > 5) {
            return res.status(400).json({ 
                success: false, 
                message: 'Rating must be between 1 and 5' 
            });
        }

        // Check if product exists
        const product = await Product.findByPk(productId);
        if (!product) {
            return res.status(404).json({ 
                success: false, 
                message: 'Product not found' 
            });
        }

        // Create review
        const review = await Review.create({
            productId,
            customerName,
            customerEmail,
            rating,
            comment
        });

        // Update product rating
        const allReviews = await Review.findAll({
            where: { productId }
        });

        const totalRating = allReviews.reduce((sum, r) => sum + r.rating, 0);
        const avgRating = (totalRating / allReviews.length).toFixed(1);

        await product.update({
            rating: avgRating,
            reviewCount: allReviews.length
        });

        res.status(201).json({ 
            success: true, 
            message: 'Review submitted successfully',
            review 
        });

    } catch (error) {
        console.error('Error submitting review:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error submitting review',
            error: error.message 
        });
    }
});

// Get review statistics for a product
router.get('/stats/:productId', async (req, res) => {
    try {
        const reviews = await Review.findAll({
            where: { productId: req.params.productId }
        });

        const stats = {
            total: reviews.length,
            average: 0,
            distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
        };

        if (reviews.length > 0) {
            const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
            stats.average = (totalRating / reviews.length).toFixed(1);

            reviews.forEach(review => {
                stats.distribution[review.rating]++;
            });
        }

        res.json(stats);
    } catch (error) {
        console.error('Error fetching review stats:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error fetching review statistics',
            error: error.message 
        });
    }
});

module.exports = router;
