const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const sequelize = require('../config/database');
const Order = require('../models/Order');
const { sendOrderConfirmationEmail } = require('../utils/email');
const logger = require('../utils/logger');
require('dotenv').config();

// PAYGATE_SECRET is what PayGate calls the "Encryption Key" in the Back Office.
const PAYGATE_ID = process.env.PAYGATE_ID;
const PAYGATE_SECRET = process.env.PAYGATE_SECRET;
const PAYGATE_TEST_MODE = String(process.env.PAYGATE_TEST_MODE || '').toLowerCase() === 'true';

const PAYGATE_INITIATE_URL = process.env.PAYGATE_INITIATE_URL || 'https://secure.paygate.co.za/payweb3/initiate.trans';
const PAYGATE_PROCESS_URL = process.env.PAYGATE_PROCESS_URL || 'https://secure.paygate.co.za/payweb3/process.trans';
const PAYGATE_RETURN_URL = process.env.PAYGATE_RETURN_URL || 'https://mabenaqamangi-hub.github.io/mellophi-fashion/payment-return.html';
const PAYGATE_NOTIFY_URL = process.env.PAYGATE_NOTIFY_URL || '';

// Optional, sensible defaults for a South African storefront. Can be overridden via env.
const PAYGATE_CURRENCY = process.env.PAYGATE_CURRENCY || 'ZAR';
const PAYGATE_LOCALE = process.env.PAYGATE_LOCALE || 'en-za';
const PAYGATE_COUNTRY = process.env.PAYGATE_COUNTRY || 'ZAF';

const fallbackOrders = new Map();

if (!PAYGATE_ID || !PAYGATE_SECRET) {
    if (!PAYGATE_TEST_MODE) {
        logger.error('WARNING: Payment credentials not configured');
        logger.error('Set PAYGATE_ID and PAYGATE_SECRET in .env');
    }
}

function maskValue(value, visible = 4) {
    const str = String(value || '');
    if (str.length <= visible) return '*'.repeat(str.length);
    return `${'*'.repeat(str.length - visible)}${str.slice(-visible)}`;
}

/**
 * PayGate PayWeb3 checksum algorithm (see PayGate PayWeb3 API docs, "Security & Checksum"):
 * Concatenate the VALUES of every non-empty field, in the exact order the fields
 * were added, append the merchant's Encryption Key, then MD5 the result.
 * The CHECKSUM field itself is always excluded from its own calculation.
 * This is used both to sign our own requests and to verify PayGate's responses.
 */
function generatePaygateChecksum(fields, secret = PAYGATE_SECRET) {
    let checksumSource = '';
    for (const key of Object.keys(fields)) {
        if (key === 'CHECKSUM') continue;
        const value = fields[key];
        if (value !== undefined && value !== null && String(value) !== '') {
            checksumSource += String(value);
        }
    }
    checksumSource += secret;
    return crypto.createHash('md5').update(checksumSource).digest('hex');
}

// PayGate expects 'YYYY-MM-DD HH:mm:ss' (UTC) for TRANSACTION_DATE.
function formatPaygateDateTime(date = new Date()) {
    const pad = (n) => String(n).padStart(2, '0');
    return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())} ` +
        `${pad(date.getUTCHours())}:${pad(date.getUTCMinutes())}:${pad(date.getUTCSeconds())}`;
}

// PayGate requires the transaction amount in cents, as an integer.
function toCents(amount) {
    return Math.round(parseFloat(amount) * 100);
}

async function ensureDatabaseForPayments() {
    try {
        await sequelize.authenticate();
        return true;
    } catch (error) {
        logger.error('Payment database unavailable', {
            message: error.message
        });
        return false;
    }
}

/**
 * PayGate's TRANSACTION_STATUS codes: 1 = Approved, 2 = Declined, 4 = Cancelled.
 * Anything else (or missing) is treated as still pending.
 */
function mapGatewayStatus(payload) {
    const status = String(payload.TRANSACTION_STATUS || '');
    if (status === '1') return 'completed';
    if (status === '2') return 'failed';
    if (status === '4') return 'cancelled';
    return 'pending';
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

/**
 * Step 1 of PayWeb3: POST the transaction details to initiate.trans.
 * PayGate replies with a url-encoded string (NOT json) containing
 * PAY_REQUEST_ID + CHECKSUM, which we then hand to the browser for step 2.
 */
async function initiatePaygateTransaction(fields) {
    const body = new URLSearchParams();
    Object.entries(fields).forEach(([key, value]) => {
        if (value !== undefined && value !== null && String(value) !== '') {
            body.append(key, String(value));
        }
    });

    const response = await fetch(PAYGATE_INITIATE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body.toString()
    });

    const raw = await response.text();
    const parsed = Object.fromEntries(new URLSearchParams(raw));

    if (parsed.ERROR) {
        throw new Error(`PayGate initiate error: ${parsed.ERROR}`);
    }
    if (!parsed.PAY_REQUEST_ID || !parsed.CHECKSUM) {
        throw new Error(`PayGate initiate returned an unexpected response: ${raw}`);
    }

    return parsed;
}

async function processPaygateUpdate(payload, source = 'unknown') {
    const databaseAvailable = await ensureDatabaseForPayments();

    const reference = payload.REFERENCE;
    if (!reference) {
        throw new Error('Payment payload missing REFERENCE');
    }

    if (payload.CHECKSUM) {
        const calculatedChecksum = generatePaygateChecksum(payload);
        if (payload.CHECKSUM !== calculatedChecksum) {
            logger.warn('Payment checksum mismatch', {
                source,
                reference,
                provided: maskValue(payload.CHECKSUM),
                calculated: maskValue(calculatedChecksum)
            });
            throw new Error('Invalid payment checksum');
        }
    } else {
        logger.warn('Payment payload missing CHECKSUM', { source, reference });
    }

    const mappedStatus = mapGatewayStatus(payload);
    const transactionId = payload.TRANSACTION_ID || null;

    if (databaseAvailable) {
        const order = await Order.findOne({ where: { orderNumber: reference } });
        if (!order) {
            throw new Error(`Order not found: ${reference}`);
        }
        await applyOrderPaymentUpdate(order, mappedStatus, transactionId);
    } else {
        const current = fallbackOrders.get(reference) || {
            reference,
            paymentStatus: 'pending',
            orderStatus: 'pending',
            transactionId: null,
            updatedAt: new Date().toISOString()
        };
        current.paymentStatus = mappedStatus;
        current.orderStatus = mappedStatus === 'completed' ? 'processing' : (mappedStatus === 'pending' ? 'pending' : 'cancelled');
        current.transactionId = transactionId || current.transactionId;
        current.updatedAt = new Date().toISOString();
        fallbackOrders.set(reference, current);
    }

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
        const databaseAvailable = await ensureDatabaseForPayments();

        logger.info('Payment initiation request received', {
            mode: PAYGATE_TEST_MODE ? 'test' : 'live',
            initiateUrl: PAYGATE_INITIATE_URL,
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
            if (!databaseAvailable) {
                throw new Error('Database unavailable');
            }
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
            fallbackOrders.set(reference, {
                reference,
                paymentStatus: 'pending',
                orderStatus: 'pending',
                transactionId: null,
                email,
                total: Number(parseFloat(amount || 0)).toFixed(2),
                updatedAt: new Date().toISOString()
            });
        }

        if (PAYGATE_TEST_MODE) {
            // Mock flow for local/dev testing only — never hits the real gateway.
            const mockPayload = {
                PAYGATE_ID,
                PAY_REQUEST_ID: `TEST_${reference}_${Date.now()}`,
                REFERENCE: reference,
                TRANSACTION_STATUS: '1',
                TRANSACTION_ID: `MOCKTXN_${Date.now()}`
            };
            mockPayload.CHECKSUM = generatePaygateChecksum(mockPayload);

            if (order) {
                await order.update({ paygateId: mockPayload.PAY_REQUEST_ID }).catch(() => null);
            }

            const separator = PAYGATE_RETURN_URL.includes('?') ? '&' : '?';
            const query = new URLSearchParams(mockPayload).toString();
            return res.json({
                success: true,
                payRequestId: mockPayload.PAY_REQUEST_ID,
                paymentUrl: `${PAYGATE_RETURN_URL}${separator}${query}`,
                reference,
                testMode: true
            });
        }

        // --- Real PayGate PayWeb3 flow ---
        // Step 1: initiate the transaction and get a PAY_REQUEST_ID + CHECKSUM back.
        // Field order matters: it is part of the checksum calculation.
        const initiateFields = {
            PAYGATE_ID,
            REFERENCE: reference,
            AMOUNT: toCents(amount),
            CURRENCY: PAYGATE_CURRENCY,
            RETURN_URL: PAYGATE_RETURN_URL,
            TRANSACTION_DATE: formatPaygateDateTime(),
            LOCALE: PAYGATE_LOCALE,
            COUNTRY: PAYGATE_COUNTRY,
            EMAIL: email,
            NOTIFY_URL: PAYGATE_NOTIFY_URL
        };
        initiateFields.CHECKSUM = generatePaygateChecksum(initiateFields);

        const initiateResult = await initiatePaygateTransaction(initiateFields);

        if (order) {
            await order.update({ paygateId: initiateResult.PAY_REQUEST_ID }).catch(() => null);
        }

        // Step 2 happens in the browser: it must POST PAY_REQUEST_ID + CHECKSUM
        // to PAYGATE_PROCESS_URL as a real form submission (PayGate requires POST,
        // not a query-string redirect).
        return res.json({
            success: true,
            payRequestId: initiateResult.PAY_REQUEST_ID,
            checksum: initiateResult.CHECKSUM,
            processUrl: PAYGATE_PROCESS_URL,
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

        const databaseAvailable = await ensureDatabaseForPayments();
        const order = databaseAvailable
            ? await Order.findOne({ where: { orderNumber: reference } })
            : null;

        if (!order) {
            const fallback = fallbackOrders.get(reference);
            if (fallback) {
                return res.json({
                    success: true,
                    reference,
                    paymentStatus: fallback.paymentStatus,
                    orderStatus: fallback.orderStatus,
                    transactionId: fallback.transactionId || null,
                    fallback: true
                });
            }
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
