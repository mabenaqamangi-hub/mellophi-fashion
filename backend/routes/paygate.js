const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const sequelize = require('../config/database');
const Order = require('../models/Order');
const { sendOrderConfirmationEmail } = require('../utils/email');
const logger = require('../utils/logger');
require('dotenv').config();

const PAYGATE_ID = process.env.PAYGATE_ID;
const PAYGATE_SECRET = process.env.PAYGATE_SECRET;
const PAYGATE_PASSPHRASE = process.env.PAYGATE_PASSPHRASE || '';
const PAYGATE_TEST_MODE = String(process.env.PAYGATE_TEST_MODE || '').toLowerCase() === 'true';

const PAYGATE_PROCESS_URL = process.env.PAYGATE_PROCESS_URL || (PAYGATE_TEST_MODE
    ? 'https://sandbox.payfast.co.za/eng/process'
    : 'https://www.payfast.co.za/eng/process');
const PAYGATE_RETURN_URL = process.env.PAYGATE_RETURN_URL || 'https://mabenaqamangi-hub.github.io/mellophi-fashion/payment-return.html';
const PAYGATE_CANCEL_URL = process.env.PAYGATE_CANCEL_URL || PAYGATE_RETURN_URL;
const PAYGATE_NOTIFY_URL = process.env.PAYGATE_NOTIFY_URL || '';

if (!PAYGATE_ID || !PAYGATE_SECRET) {
    if (!PAYGATE_TEST_MODE) {
        logger.error('WARNING: Payment credentials not configured');
        logger.error('Set PAYGATE_ID and PAYGATE_SECRET in .env');
    }
}

function pfEncode(value) {
    return encodeURIComponent(String(value))
        .replace(/%20/g, '+')
        .replace(/[!'()*]/g, (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`);
}

function buildQueryString(fields) {
    return Object.entries(fields)
        .filter(([, value]) => value !== undefined && value !== null && String(value) !== '')
        .map(([key, value]) => `${pfEncode(key)}=${pfEncode(String(value))}`)
        .join('&');
}

function maskValue(value, visible = 4) {
    const str = String(value || '');
    if (str.length <= visible) return '*'.repeat(str.length);
    return `${'*'.repeat(str.length - visible)}${str.slice(-visible)}`;
}

async function ensureDatabaseForPayments() {
    try {
        await sequelize.authenticate();
        return true;
    } catch (error) {
        logger.error('Payment database unavailable', {
            message: error.message
        });
        throw new Error('Payment service database unavailable');
    }
}

function generatePayfastSignature(data, passphrase = PAYGATE_PASSPHRASE) {
    const sortedPairs = Object.keys(data)
        .filter((key) => key !== 'signature' && key !== 'CHECKSUM')
        .filter((key) => data[key] !== undefined && data[key] !== null && String(data[key]) !== '')
        .sort()
        .map((key) => `${key}=${pfEncode(String(data[key]).trim())}`);

    if (passphrase) {
        sortedPairs.push(`passphrase=${pfEncode(passphrase)}`);
    }

    return crypto.createHash('md5').update(sortedPairs.join('&')).digest('hex');
}

function generateLegacyChecksum(data) {
    const checksumString = Object.keys(data)
        .filter((key) => key !== 'CHECKSUM')
        .sort()
        .map((key) => String(data[key] || ''))
        .join('') + PAYGATE_SECRET;
    return crypto.createHash('md5').update(checksumString).digest('hex');
}

function mapGatewayStatus(payload) {
    const payfastStatus = String(payload.payment_status || '').toUpperCase();
    if (payfastStatus === 'COMPLETE') return 'completed';
    if (payfastStatus === 'PENDING') return 'pending';
    if (payfastStatus === 'CANCELLED') return 'cancelled';
    if (payfastStatus === 'FAILED') return 'failed';

    const legacy = String(payload.TRANSACTION_STATUS || '');
    if (legacy === '1') return 'completed';
    if (legacy === '2') return 'failed';

    return 'cancelled';
}

async function applyOrderPaymentUpdate(order, mappedStatus, transactionId) {
    if (mappedStatus === 'completed') {
        await order.update({
            paymentStatus: 'completed',
            orderStatus: 'processing',
            transactionId: transactionId || null
        });
        try {
            await sendOrderConfirmationEmail(order.customerInfo.email, order);
        } catch (emailErr) {
            logger.error('Order confirmation email failed:', emailErr);
        }
        return;
    }

    if (mappedStatus === 'pending') {
        await order.update({
            paymentStatus: 'pending',
            orderStatus: 'pending',
            transactionId: transactionId || null
        });
        return;
    }

    if (mappedStatus === 'failed') {
        await order.update({
            paymentStatus: 'failed',
            orderStatus: 'cancelled',
            transactionId: transactionId || null
        });
        return;
    }

    await order.update({
        paymentStatus: 'cancelled',
        orderStatus: 'cancelled',
        transactionId: transactionId || null
    });
}

async function processPaygateUpdate(payload, source = 'unknown') {
    await ensureDatabaseForPayments();

    const reference = payload.m_payment_id || payload.REFERENCE;
    if (!reference) {
        throw new Error('Payment payload missing order reference');
    }

    if (payload.signature) {
        const calculatedSignature = generatePayfastSignature(payload);
        if (payload.signature !== calculatedSignature) {
            logger.warn('Payment signature mismatch', {
                source,
                reference,
                provided: maskValue(payload.signature),
                calculated: maskValue(calculatedSignature)
            });
            throw new Error('Invalid payment signature');
        }
    } else if (payload.CHECKSUM) {
        const calculatedChecksum = generateLegacyChecksum(payload);
        if (payload.CHECKSUM !== calculatedChecksum) {
            logger.warn('Legacy checksum mismatch', {
                source,
                reference,
                provided: maskValue(payload.CHECKSUM),
                calculated: maskValue(calculatedChecksum)
            });
            throw new Error('Invalid legacy checksum');
        }
    }

    const order = await Order.findOne({ where: { orderNumber: reference } });
    if (!order) {
        throw new Error(`Order not found: ${reference}`);
    }

    const mappedStatus = mapGatewayStatus(payload);
    const transactionId = payload.pf_payment_id || payload.TRANSACTION_ID || null;

    await applyOrderPaymentUpdate(order, mappedStatus, transactionId);

    logger.info('Payment update applied', {
        source,
        reference,
        mappedStatus,
        transactionId: transactionId || null
    });

    return {
        success: true,
        status: mappedStatus === 'completed' ? 'approved' : mappedStatus === 'pending' ? 'pending' : 'declined',
        reference,
        transactionId
    };
}

router.post('/initiate', async (req, res) => {
    try {
        await ensureDatabaseForPayments();

        logger.info('Payment initiation request received', {
            mode: PAYGATE_TEST_MODE ? 'test' : 'live',
            processUrl: PAYGATE_PROCESS_URL,
            hasPassphrase: !!PAYGATE_PASSPHRASE,
            hasNotifyUrl: !!PAYGATE_NOTIFY_URL
        });

        if (process.env.NODE_ENV === 'production' && PAYGATE_TEST_MODE) {
            return res.status(500).json({
                success: false,
                message: 'Payment test mode is disabled in production'
            });
        }

        if (!PAYGATE_ID || !PAYGATE_SECRET) {
            return res.status(500).json({
                success: false,
                message: 'Payment gateway is not configured on the server'
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

        if (!amount || !reference || !email) {
            return res.status(400).json({ success: false, message: 'Missing required fields' });
        }

        if (!/^\d+(\.\d{1,2})?$/.test(String(amount))) {
            return res.status(400).json({ success: false, message: 'Invalid amount format' });
        }

        let order = null;
        try {
            order = await Order.create({
                orderNumber: reference,
                customerInfo: {
                    email,
                    firstName,
                    lastName,
                    fullName: `${firstName || ''} ${lastName || ''}`.trim()
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
            console.warn('Database unavailable for order creation. Continuing with payment initiation:', dbError.message);
        }

        if (PAYGATE_TEST_MODE) {
            const mockPayload = {
                PAY_REQUEST_ID: `TEST_${reference}_${Date.now()}`,
                REFERENCE: reference,
                TRANSACTION_STATUS: '1',
                TRANSACTION_ID: `MOCKTXN_${Date.now()}`
            };
            mockPayload.CHECKSUM = generateLegacyChecksum(mockPayload);

            if (order) {
                await order.update({ paygateId: mockPayload.PAY_REQUEST_ID }).catch(() => null);
            }

            const separator = PAYGATE_RETURN_URL.includes('?') ? '&' : '?';
            return res.json({
                success: true,
                payRequestId: mockPayload.PAY_REQUEST_ID,
                paymentUrl: `${PAYGATE_RETURN_URL}${separator}${buildQueryString(mockPayload)}`,
                reference,
                testMode: true
            });
        }

        const paymentPayload = {
            merchant_id: PAYGATE_ID,
            merchant_key: PAYGATE_SECRET,
            return_url: PAYGATE_RETURN_URL,
            cancel_url: PAYGATE_CANCEL_URL,
            notify_url: PAYGATE_NOTIFY_URL,
            name_first: firstName || 'Customer',
            name_last: lastName || '',
            email_address: email,
            m_payment_id: reference,
            amount: Number(parseFloat(amount || 0)).toFixed(2),
            item_name: `Order ${reference}`,
            item_description: `Mellophi Fashion order ${reference}`
        };

        paymentPayload.signature = generatePayfastSignature(paymentPayload);

        if (order) {
            await order.update({ paygateId: reference }).catch(() => null);
        }

        return res.json({
            success: true,
            payRequestId: reference,
            paymentUrl: `${PAYGATE_PROCESS_URL}?${buildQueryString(paymentPayload)}`,
            reference
        });
    } catch (error) {
        logger.error('Payment initiate error', {
            message: error.message,
            stack: error.stack
        });
        return res.status(500).json({
            success: false,
            message: 'Payment initiation failed',
            error: error.message
        });
    }
});

router.post('/return', async (req, res) => {
    try {
        logger.info('Payment return callback received', {
            keys: Object.keys(req.body || {})
        });
        const result = await processPaygateUpdate(req.body, 'return');
        res.json(result);
    } catch (error) {
        logger.error('Payment return error', {
            message: error.message,
            stack: error.stack
        });
        res.status(500).json({
            success: false,
            message: 'Payment verification failed',
            error: error.message
        });
    }
});

router.post('/notify', async (req, res) => {
    try {
        logger.info('Payment notify received', {
            ip: req.ip,
            userAgent: req.get('user-agent') || 'unknown',
            keys: Object.keys(req.body || {})
        });
        await processPaygateUpdate(req.body, 'notify');
        res.type('text/plain').send('OK');
    } catch (error) {
        logger.error('Payment notify error', {
            message: error.message,
            stack: error.stack
        });
        res.type('text/plain').status(400).send('ERROR');
    }
});

router.get('/status/:reference', async (req, res) => {
    try {
        const { reference } = req.params;

        const order = await Order.findOne({ where: { orderNumber: reference } });

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        return res.json({
            success: true,
            reference,
            paymentStatus: order.paymentStatus,
            orderStatus: order.orderStatus,
            transactionId: order.transactionId
        });
    } catch (error) {
        logger.error('Status check error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to check payment status',
            error: error.message
        });
    }
});

module.exports = router;
