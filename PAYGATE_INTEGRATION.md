# PayGate Integration Guide - MELLOPHI Fashion

## Overview
This guide explains the PayGate payment gateway integration for MELLOPHI Fashion e-commerce website.

## Credentials
- **Merchant ID:** 12975260
- **Merchant Key:** Inyyjkfuaiwyr

## Files Created/Modified

### 1. Backend Files
- **`backend/routes/paygate.js`** - PayGate API route handlers
  - POST `/api/paygate/initiate` - Initiates payment with PayGate
  - POST `/api/paygate/return` - Handles payment callback
  - GET `/api/paygate/status/:reference` - Checks payment status

- **`backend/models/Order.js`** - Updated to include PayGate fields
  - Added `paygateId` field for PayGate request ID
  - Added `transactionId` field for transaction reference
  - Added 'paygate' to payment method enum
  - Updated payment status enum

- **`backend/server.js`** - Added PayGate route
- **`backend/package.json`** - Added node-fetch dependency

### 2. Frontend Files
- **`payment-return.html`** - Payment result page
- **`checkout.html`** - Updated payment options to show PayGate
- **`js/checkout.js`** - Updated payment processing logic

## Installation Steps

### 1. Install Dependencies
```bash
cd backend
npm install
```

This will install the `node-fetch` package needed for PayGate API calls.

### 2. Update Environment Variables
Create or update your `.env` file in the `backend` directory:

```env
# Database
DB_HOST=localhost
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=mellophi_fashion

# Server
PORT=5000
NODE_ENV=development

# Frontend URL (for PayGate return URL)
FRONTEND_URL=http://localhost:3000

# JWT Secret
JWT_SECRET=your_jwt_secret_key

# PayGate (already hardcoded in routes/paygate.js)
# If you want to move them to env:
# PAYGATE_ID=12975260
# PAYGATE_SECRET=Inyyjkfuaiwyr
```

### 3. Update Database
Run your backend server to automatically sync the database with the new Order model fields:

```bash
cd backend
npm start
```

The Sequelize ORM will automatically add the new columns (`paygateId`, `transactionId`) to your orders table.

## How It Works

### Payment Flow

1. **Customer Checkout**
   - Customer fills in shipping information
   - Selects "PayGate" or "Credit/Debit Card" payment method
   - Clicks "Place Order"

2. **Payment Initiation**
   - Frontend sends order data to `/api/paygate/initiate`
   - Backend creates order record with status "pending"
   - Backend sends request to PayGate API
   - PayGate returns a `PAY_REQUEST_ID` and payment URL

3. **Redirect to PayGate**
   - Customer is redirected to PayGate's secure payment page
   - Customer enters payment details on PayGate's site

4. **Payment Processing**
   - PayGate processes the payment
   - Customer is redirected back to `payment-return.html`
   - URL contains payment status parameters

5. **Payment Verification**
   - Frontend calls `/api/paygate/return` with payment data
   - Backend verifies checksum and updates order status
   - Success page is shown to customer

### Payment Status Codes
- **1** - Approved (payment successful)
- **2** - Declined (payment failed)
- **0** - Cancelled (customer cancelled)
- **4** - User cancelled

## Testing

### Test Mode
PayGate provides a test environment. Update the URLs in `backend/routes/paygate.js`:

```javascript
// Test environment URLs
const PAYGATE_INITIATE_URL = 'https://secure.paygate.co.za/payweb3/initiate.trans';
const PAYGATE_PROCESS_URL = 'https://secure.paygate.co.za/payweb3/process.trans';
```

### Test Cards
PayGate provides test card numbers for testing:
- **Visa:** 4000000000000002
- **Mastercard:** 5200000000000015
- **CVV:** Any 3 digits
- **Expiry:** Any future date

## API Endpoints

### Initiate Payment
```http
POST /api/paygate/initiate
Content-Type: application/json

{
  "amount": 1500.00,
  "reference": "MELL1234567890",
  "email": "customer@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "orderDetails": {
    "items": [...],
    "shippingAddress": {...},
    "subtotal": 1420.00,
    "shipping": 80.00,
    "discount": 0
  }
}
```

Response:
```json
{
  "success": true,
  "payRequestId": "F4B9D9F2-...",
  "paymentUrl": "https://secure.paygate.co.za/payweb3/process.trans?PAY_REQUEST_ID=...",
  "reference": "MELL1234567890"
}
```

### Payment Return (Callback)
```http
POST /api/paygate/return
Content-Type: application/json

{
  "PAY_REQUEST_ID": "...",
  "REFERENCE": "MELL1234567890",
  "TRANSACTION_STATUS": "1",
  "TRANSACTION_ID": "...",
  "CHECKSUM": "..."
}
```

### Check Payment Status
```http
GET /api/paygate/status/MELL1234567890
```

Response:
```json
{
  "success": true,
  "reference": "MELL1234567890",
  "paymentStatus": "completed",
  "orderStatus": "processing",
  "transactionId": "..."
}
```

## Security Features

1. **Checksum Validation** - All PayGate responses are verified using MD5 checksum
2. **HTTPS** - All PayGate communication uses HTTPS
3. **PCI Compliance** - Card details are never stored on your server
4. **3D Secure** - PayGate supports 3D Secure authentication

## Troubleshooting

### Common Issues

1. **"Invalid checksum" error**
   - Verify merchant key is correct
   - Check that all fields are included in checksum calculation
   - Ensure field order matches PayGate documentation

2. **Payment not redirecting back**
   - Check FRONTEND_URL in .env file
   - Ensure payment-return.html is accessible
   - Verify RETURN_URL in PayGate request

3. **Order not updating after payment**
   - Check backend logs for errors
   - Verify database connection
   - Ensure Order model has been synced

4. **node-fetch errors**
   - Make sure node-fetch v3 is installed: `npm install node-fetch@3`
   - The code uses dynamic import for node-fetch

## Production Checklist

- [ ] Move PayGate credentials to environment variables
- [ ] Update FRONTEND_URL to production domain
- [ ] Test with real payment amounts
- [ ] Set up webhook/notify URL for reliable payment notifications
- [ ] Enable error logging and monitoring
- [ ] Test payment failure scenarios
- [ ] Verify email notifications work
- [ ] Check order status updates correctly
- [ ] Test on mobile devices

## Support

For PayGate support:
- Email: support@paygate.co.za
- Phone: +27 (0)86 111 7498
- Website: https://www.paygate.co.za

For MELLOPHI technical support, contact your development team.

## Notes

- Currency is set to ZAR (South African Rand)
- Amounts are sent in cents (multiply by 100)
- Reference numbers must be unique per transaction
- PayGate may take 1-2 business days for settlement
