const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const Order = require('../models/Order');
require('dotenv').config();

// PayGate credentials from environment variables
const PAYGATE_ID = process.env.PAYGATE_ID || '12975260';
const PAYGATE_SECRET = process.env.PAYGATE_SECRET || 'lnyyjkfuaiwyr';
const PAYGATE_INITIATE_URL = process.env.PAYGATE_INITIATE_URL || 'https://secure.paygate.co.za/payweb3/initiate.trans';
const PAYGATE_PROCESS_URL = process.env.PAYGATE_PROCESS_URL || 'https://secure.paygate.co.za/payweb3/process.trans';
const PAYGATE_RETURN_URL = process.env.PAYGATE_RETURN_URL || 'http://localhost:5500/payment-return.html';
const PAYGATE_NOTIFY_URL = process.env.PAYGATE_NOTIFY_URL || 'http://localhost:5000/api/paygate/notify';

// Validate PayGate configuration
if (!PAYGATE_ID || !PAYGATE_SECRET) {
    console.error('⚠️  WARNING: PayGate credentials not configured!');
    console.error('   Set PAYGATE_ID and PAYGATE_SECRET in .env file');
}

/**
 * Generate MD5 checksum for PayGate
 */
function generateChecksum(data) {
    const checksumString = Object.values(data).join('') + PAYGATE_SECRET;
    return crypto.createHash('md5').update(checksumString).digest('hex');
}

/**
 * Initiate PayGate payment
 * POST /api/paygate/initiate
 */
router.post('/initiate', async (req, res) => {
    try {
        const { 
            amount, 
            reference, 
            email, 
            firstName, 
            lastName,
            orderDetails 
        } = req.body;

        // Validate required fields
        if (!amount || !reference || !email) {
            return res.status(400).json({ 
                success: false, 
                message: 'Missing required fields' 
            });
        }

        // Convert amount to cents (PayGate requires amount in cents)
        const amountInCents = Math.round(parseFloat(amount) * 100);

        // Create order in database
        const order = await Order.create({
            orderNumber: reference,
            customerEmail: email,
            customerName: `${firstName} ${lastName}`,
            items: orderDetails.items,
            shippingAddress: orderDetails.shippingAddress,
            subtotal: orderDetails.subtotal,
            shipping: orderDetails.shipping,
            discount: orderDetails.discount || 0,
            total: amount,
            paymentMethod: 'paygate',
            paymentStatus: 'pending',
            status: 'pending'
        });

        // PayGate initiate payload
        const paygateData = {
            PAYGATE_ID: PAYGATE_ID,
            REFERENCE: reference,
            AMOUNT: amountInCents,
            CURRENCY: 'ZAR',
            RETURN_URL: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/payment-return`,
            TRANSACTION_DATE: new Date().toISOString().slice(0, 19).replace('T', ' '),
            LOCALE: 'en-za',
            COUNTRY: 'ZAF',
            EMAIL: email,
            // Optional fields
            ...(firstName && { FIRST_NAME: firstName }),
            ...(lastName && { LAST_NAME: lastName })
        };

        // Generate checksum
        paygateData.CHECKSUM = generateChecksum(paygateData);

        // Send request to PayGate
        const fetch = (await import('node-fetch')).default;
        const formBody = Object.entries(paygateData)
            .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
            .join('&');

        const response = await fetch(PAYGATE_INITIATE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: formBody
        });

        const responseText = await response.text();
        
        // Parse PayGate response
        const paygateResponse = {};
        responseText.split('&').forEach(pair => {
            const [key, value] = pair.split('=');
            paygateResponse[key] = decodeURIComponent(value || '');
        });

        // Verify checksum
        const returnedChecksum = paygateResponse.CHECKSUM;
        delete paygateResponse.CHECKSUM;
        const calculatedChecksum = generateChecksum(paygateResponse);

        if (returnedChecksum !== calculatedChecksum) {
            await order.update({ 
                paymentStatus: 'failed',
                status: 'cancelled'
            });
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid checksum from PayGate' 
            });
        }

        // Update order with PayGate reference
        await order.update({ 
            paygateId: paygateResponse.PAY_REQUEST_ID 
        });

        // Return payment URL
        res.json({
            success: true,
            payRequestId: paygateResponse.PAY_REQUEST_ID,
            paymentUrl: `${PAYGATE_PROCESS_URL}?PAY_REQUEST_ID=${paygateResponse.PAY_REQUEST_ID}`,
            reference: reference
        });

    } catch (error) {
        console.error('PayGate initiate error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Payment initiation failed',
            error: error.message 
        });
    }
});

/**
 * Handle PayGate return/callback
 * POST /api/paygate/return
 */
router.post('/return', async (req, res) => {
    try {
        const paygateReturn = req.body;

        // Verify checksum
        const returnedChecksum = paygateReturn.CHECKSUM;
        const dataToVerify = { ...paygateReturn };
        delete dataToVerify.CHECKSUM;
        const calculatedChecksum = generateChecksum(dataToVerify);

        if (returnedChecksum !== calculatedChecksum) {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid checksum' 
            });
        }

        // Find order by reference
        const order = await Order.findOne({
            where: { orderNumber: paygateReturn.REFERENCE }
        });

        if (!order) {
            return res.status(404).json({ 
                success: false, 
                message: 'Order not found' 
            });
        }

        // Update order based on transaction status
        const transactionStatus = paygateReturn.TRANSACTION_STATUS;
        
        if (transactionStatus === '1') {
            // Payment approved
            await order.update({
                paymentStatus: 'completed',
                status: 'processing',
                transactionId: paygateReturn.TRANSACTION_ID
            });
        } else if (transactionStatus === '2') {
            // Payment declined
            await order.update({
                paymentStatus: 'failed',
                status: 'cancelled'
            });
        } else {
            // Payment cancelled or other status
            await order.update({
                paymentStatus: 'cancelled',
                status: 'cancelled'
            });
        }

        res.json({
            success: true,
            status: transactionStatus === '1' ? 'approved' : 'declined',
            reference: paygateReturn.REFERENCE,
            transactionId: paygateReturn.TRANSACTION_ID
        });

    } catch (error) {
        console.error('PayGate return error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Payment verification failed',
            error: error.message 
        });
    }
});

/**
 * Get payment status
 * GET /api/paygate/status/:reference
 */
router.get('/status/:reference', async (req, res) => {
    try {
        const { reference } = req.params;

        const order = await Order.findOne({
            where: { orderNumber: reference }
        });

        if (!order) {
            return res.status(404).json({ 
                success: false, 
                message: 'Order not found' 
            });
        }

        res.json({
            success: true,
            reference: reference,
            paymentStatus: order.paymentStatus,
            orderStatus: order.status,
            transactionId: order.transactionId
        });

    } catch (error) {
        console.error('Status check error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to check payment status',
            error: error.message 
        });
    }
});

module.exports = router;
