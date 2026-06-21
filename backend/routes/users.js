const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { authenticate } = require('../middleware/auth');

// GET /api/users/profile - Get user profile
router.get('/profile', authenticate, async (req, res) => {
    try {
        const user = await User.findByPk(req.userId, { attributes: { exclude: ['password'] } });
        
        res.json({
            success: true,
            data: user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// PUT /api/users/profile - Update user profile
router.put('/profile', authenticate, async (req, res) => {
    try {
        const { firstName, lastName, phone, address } = req.body;

        const user = await User.findByPk(req.userId);
        await user.update({ firstName, lastName, phone, address });

        const updatedUser = user.toJSON();
        delete updatedUser.password;

        res.json({
            success: true,
            message: 'Profile updated successfully',
            data: updatedUser
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// POST /api/users/wishlist/:productId - Add to wishlist
router.post('/wishlist/:productId', authenticate, async (req, res) => {
    try {
        const user = await User.findByPk(req.userId);
        
        const wishlist = user.wishlist || [];
        if (!wishlist.includes(req.params.productId)) {
            wishlist.push(req.params.productId);
            await user.update({ wishlist });
        }

        res.json({
            success: true,
            message: 'Added to wishlist',
            wishlist: user.wishlist
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// DELETE /api/users/wishlist/:productId - Remove from wishlist
router.delete('/wishlist/:productId', authenticate, async (req, res) => {
    try {
        const user = await User.findByPk(req.userId);
        const wishlist = (user.wishlist || []).filter(id => id !== req.params.productId);
        await user.update({ wishlist });

        res.json({
            success: true,
            message: 'Removed from wishlist',
            wishlist: user.wishlist
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

module.exports = router;
