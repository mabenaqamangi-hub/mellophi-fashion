const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const Order = require('../models/Order');
const { sendOrderConfirmationEmail } = require('../utils/email');
const logger = require('../utils/logger');
require('dotenv').config();

// PayGate credentials from environment variables
const PAYGATE_ID = process.env.PAYGATE_ID;
const PAYGATE_SECRET = process.env.PAYGATE_SECRET;
const PAYGATE_INITIATE_URL = process.env.PAYGATE_INITIATE_URL || 'https://secure.paygate.co.za/payweb3/initiate.trans';
const PAYGATE_PROCESS_URL = process.env.PAYGATE_PROCESS_URL || 'https://secure.paygate.co.za/payweb3/process.trans';
const PAYGATE_RETURN_URL = process.env.PAYGATE_RETURN_URL || 'https://mabenaqamangi-hub.github.io/mellophi-fashion/payment-return.html';
const PAYGATE_NOTIFY_URL = process.env.PAYGATE_NOTIFY_URL;
const PAYGATE_TEST_MODE = process.env.PAYGATE_TEST_MODE === 'true';

// Validate PayGate configuration
if (!PAYGATE_ID || !PAYGATE_SECRET) {
    if (!PAYGATE_TEST_MODE) {
        logger.error('⚠️  WARNING: PayGate credentials not configured!');
        logger.error('   Set PAYGATE_ID and PAYGATE_SECRET in .env file');
    } else {
        console.log('🧪 PayGate TEST MODE enabled - using mock responses');
    }
}

/**
 * Generate mock PayGate response for testing
 */
function generateMockPayGateResponse(paymentId) {
    const mockData = {
        RESULT_CODE: '0',
        PAY_REQUEST_ID: paymentId,
        REDIRECT_URL: `${PAYGATE_PROCESS_URL}?PAY_REQUEST_ID=${paymentId}`,
        CHECKSUM: 'mock_checksum_' + Date.now()
    };
    
    const checksumString = Object.keys(mockData)
        .filter(key => key !== 'CHECKSUM')
        .sort()
        .map(key => String(mockData[key] || ''))
        .join('');
    
    mockData.CHECKSUM = crypto.createHash('md5').update(checksumString).digest('hex');
    
    return Object.entries(mockData)
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
        .join('&');
}

/**
 * Generate MD5 checksum for PayGate
 */
function generateChecksum(data) {
    if (!PAYGATE_SECRET) {
        throw new Error('PAYGATE_SECRET is not configured');
    }
    const checksumString = Object.keys(data)
        .filter(key => key !== 'CHECKSUM')
        .sort()
        .map(key => String(data[key] || ''))
        .join('') + PAYGATE_SECRET;
    return crypto.createHash('md5').update(checksumString).digest('hex');
}

async function processPaygateUpdate(paygateReturn) {
    const returnedChecksum = paygateReturn.CHECKSUM;
    if (!returnedChecksum) {
        throw new Error('PayGate return payload missing CHECKSUM');
    }

    const calculatedChecksum = generateChecksum(paygateReturn);

    if (returnedChecksum !== calculatedChecksum) {
        throw new Error(`Invalid checksum: expected ${calculatedChecksum}, received ${returnedChecksum}`);
    }

    if (!paygateReturn.REFERENCE) {
        throw new Error('PayGate return payload missing REFERENCE');
    }

    const order = await Order.findOne({
        where: { orderNumber: paygateReturn.REFERENCE }
    });

    if (!order) {
        throw new Error(`Order not found: ${paygateReturn.REFERENCE}`);
    }

    const transactionStatus = paygateReturn.TRANSACTION_STATUS;
    if (transactionStatus === '1') {
        await order.update({
            paymentStatus: 'completed',
            orderStatus: 'processing',
            transactionId: paygateReturn.TRANSACTION_ID
        });
        try {
            await sendOrderConfirmationEmail(order.customerInfo.email, order);
        } catch (emailErr) {
            logger.error('Order confirmation email failed:', emailErr);
        }
    } else if (transactionStatus === '2') {
        await order.update({
            paymentStatus: 'failed',
            orderStatus: 'cancelled'
        });
    } else {
        await order.update({
            paymentStatus: 'cancelled',
            orderStatus: 'cancelled'
        });
    }

    return {
        success: true,
        status: transactionStatus === '1' ? 'approved' : 'declined',
        reference: paygateReturn.REFERENCE,
        transactionId: paygateReturn.TRANSACTION_ID || null
    };
}

/**
 * Generate checksum for PayWeb3 initiate request using documented field order.
 */
function generateInitiateChecksum(data) {
    const orderedFields = [
        'PAYGATE_ID',
        'REFERENCE',
        'AMOUNT',
        'CURRENCY',
        'RETURN_URL',
        'TRANSACTION_DATE',
        'LOCALE',
        'COUNTRY',
        'EMAIL',
        'PAY_METHOD',
        'PAY_METHOD_DETAIL',
        'NOTIFY_URL',
        'USER1',
        'USER2',
        'USER3',
        'VAULT',
        'VAULT_ID'
    ];

    const checksumString = orderedFields
        .filter((field) => data[field] !== undefined && data[field] !== null && data[field] !== '')
        .map((field) => String(data[field]))
        .join('') + PAYGATE_SECRET;

    return crypto.createHash('md5').update(checksumString).digest('hex');
}

/**
 * Initiate PayGate payment
 * POST /api/paygate/initiate
 */
router.post('/initiate', async (req, res) => {
    try {
        if (!PAYGATE_ID || !PAYGATE_SECRET) {
            return res.status(500).json({
                success: false,
                message: 'PayGate is not configured on the server'
            });
        }

        const { 
            amount, 
            reference, 
            email, 
            firstName, 
            lastName,
            paymentMethod,
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

        // Create order in database (if available)
        let order = null;
        try {
            order = await Order.create({
                orderNumber: reference,
                customerInfo: {
                    email: email,
                    firstName: firstName,
                    lastName: lastName,
                    fullName: `${firstName} ${lastName}`
                },
                items: orderDetails && orderDetails.items ? orderDetails.items : [],
                shippingAddress: orderDetails && orderDetails.shippingAddress ? orderDetails.shippingAddress : '',
                subtotal: orderDetails && orderDetails.subtotal ? orderDetails.subtotal : amount,
                shippingCost: orderDetails && orderDetails.shipping ? orderDetails.shipping : 0,
                discount: orderDetails && orderDetails.discount ? orderDetails.discount : 0,
                total: amount,
                paymentMethod: paymentMethod || 'paygate',
                paymentStatus: 'pending',
                orderStatus: 'pending'
            });
        } catch (dbError) {
            console.warn('⚠️  Database unavailable for order creation. Proceeding with PayGate payment only:', dbError.message);
            // Continue with payment initiation even if database is unavailable
        }

        // PayGate initiate payload
        const paygateData = {
            PAYGATE_ID: PAYGATE_ID,
            REFERENCE: reference,
            AMOUNT: amountInCents,
            CURRENCY: 'ZAR',
            RETURN_URL: PAYGATE_RETURN_URL,
            TRANSACTION_DATE: new Date().toISOString().slice(0, 19).replace('T', ' '),
            LOCALE: 'en-za',
            COUNTRY: 'ZAF',
            EMAIL: email
        };

        if (paymentMethod === 'applepay') {
            paygateData.PAY_METHOD = 'APPLEPAY';
            paygateData.PAY_METHOD_DETAIL = 'APPLEPAY';
        } else if (paymentMethod === 'card' || paymentMethod === 'payfast' || !paymentMethod) {
            paygateData.PAY_METHOD = 'CARD';
            paygateData.PAY_METHOD_DETAIL = 'CREDITCARD';
        }

        if (PAYGATE_NOTIFY_URL) {
            paygateData.NOTIFY_URL = PAYGATE_NOTIFY_URL;
        }

        // Generate checksum
        paygateData.CHECKSUM = generateInitiateChecksum(paygateData);

        if (PAYGATE_TEST_MODE) {
            console.log('🧪 Using local success redirect in test mode');
            const paymentId = 'TEST_' + reference + '_' + Date.now();

            // Build a signed mock callback payload that matches /api/paygate/return verification.
            const mockReturnData = {
                PAY_REQUEST_ID: paymentId,
                REFERENCE: reference,
                TRANSACTION_STATUS: '1',
                TRANSACTION_ID: 'MOCKTXN_' + Date.now()
            };
            mockReturnData.CHECKSUM = generateChecksum(mockReturnData);

            if (order) {
                await order.update({
                    paygateId: paymentId
                }).catch(err => console.warn('Could not update order with PayGate ID:', err.message));
            }

            const query = Object.entries(mockReturnData)
                .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
                .join('&');
            const separator = PAYGATE_RETURN_URL.includes('?') ? '&' : '?';

            return res.json({
                success: true,
                payRequestId: paymentId,
                paymentUrl: `${PAYGATE_RETURN_URL}${separator}${query}`,
                reference: reference,
                testMode: true
            });
        }

        // Generate real PayGate response
        let responseText;
        {
            // Send request to PayGate (real)
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

            responseText = await response.text();
        }
        
        console.log('✅ PayGate Initiate Response Status: 200');
        console.log('✅ PayGate Initiate Response Body:', responseText);
        
        // Parse PayGate response
        const paygateResponse = {};
        responseText.split('&').forEach(pair => {
            const [key, value] = pair.split('=');
            paygateResponse[key] = decodeURIComponent(value || '');
        });

        console.log('✅ Parsed PayGate Response:', paygateResponse);

        const resultCode = paygateResponse.RESULT_CODE;
        const hasError = paygateResponse.ERROR && paygateResponse.ERROR !== '0';
        const isFailedResult = resultCode !== undefined && resultCode !== null && resultCode !== '' && resultCode !== '0' && resultCode !== 0;

        if (hasError || isFailedResult) {
            if (order) {
                await order.update({
                    paymentStatus: 'failed',
                    orderStatus: 'cancelled'
                }).catch(err => console.warn('Could not update order status:', err.message));
            }

            return res.status(400).json({
                success: false,
                message: 'PayGate rejected initiation request',
                paygate: {
                    resultCode: resultCode || null,
                    error: paygateResponse.ERROR || null,
                    raw: responseText
                }
            });
        }

        const payRequestId = paygateResponse.PAY_REQUEST_ID;
        const responseChecksum = paygateResponse.CHECKSUM;

        if (!payRequestId || !responseChecksum) {
            if (order) {
                await order.update({
                    paymentStatus: 'failed',
                    orderStatus: 'cancelled'
                }).catch(err => console.warn('Could not update order status:', err.message));
            }

            return res.status(400).json({
                success: false,
                message: 'Invalid response from PayGate',
                paygate: {
                    raw: responseText
                }
            });
        }

        // Update order with PayGate reference (if order exists in database)
        if (order) {
            await order.update({ 
                paygateId: payRequestId 
            }).catch(err => console.warn('Could not update order with PayGate ID:', err.message));
        }

        // Return payment URL
        res.json({
            success: true,
            payRequestId: payRequestId,
            paymentUrl: `${PAYGATE_PROCESS_URL}?PAY_REQUEST_ID=${encodeURIComponent(payRequestId)}&CHECKSUM=${encodeURIComponent(responseChecksum)}`,
            reference: reference
        });

    } catch (error) {
        logger.error('PayGate initiate error:', error);
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
        const result = await processPaygateUpdate(paygateReturn);
        res.json(result);
    } catch (error) {
        logger.error('PayGate return error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Payment verification failed',
            error: error.message 
        });
    }
});

router.post('/notify', async (req, res) => {
    try {
        await processPaygateUpdate(req.body);
        res.type('text/plain').send('OK');
    } catch (error) {
        logger.error('PayGate notify error:', error);
        res.type('text/plain').status(400).send('ERROR');
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
            orderStatus: order.orderStatus,
            transactionId: order.transactionId
        });

    } catch (error) {
        logger.error('Status check error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to check payment status',
            error: error.message 
        });
    }
});

module.exports = router;
