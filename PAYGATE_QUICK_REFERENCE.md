# PayGate Quick Reference - MELLOPHI Fashion

## Your PayGate Credentials
```
Merchant ID: 12975260
Merchant Key: Inyyjkfuaiwyr
```

## Quick Start

1. **Start Backend Server**
   ```bash
   cd backend
   npm start
   ```

2. **Test Payment Flow**
   - Go to checkout page
   - Select "PayGate" payment option
   - Fill in shipping details
   - Click "Place Order"
   - You'll be redirected to PayGate

3. **Check Payment Status**
   - After payment, you'll be redirected to payment-return.html
   - Order status will be updated automatically

## URLs

### Test Environment (Current)
- Initiate: `https://secure.paygate.co.za/payweb3/initiate.trans`
- Process: `https://secure.paygate.co.za/payweb3/process.trans`

### Production Environment
Same URLs - PayGate uses the same endpoint for test and production. The merchant ID determines the environment.

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/paygate/initiate` | POST | Start a payment |
| `/api/paygate/return` | POST | Handle payment callback |
| `/api/paygate/status/:reference` | GET | Check payment status |

## Payment Methods Supported
- ✅ Credit Cards (Visa, Mastercard, Amex)
- ✅ Debit Cards
- ✅ Instant EFT
- ✅ Bank Transfer

## Test Cards

### Approved Transaction
- **Card Number:** 4000000000000002
- **CVV:** 123
- **Expiry:** 12/25 (any future date)
- **Result:** Approved (Status 1)

### Declined Transaction
- **Card Number:** 4000000000000010
- **CVV:** 123
- **Expiry:** 12/25
- **Result:** Declined (Status 2)

## Transaction Status Codes
| Code | Meaning | Order Status |
|------|---------|-------------|
| 1 | Approved | Processing |
| 2 | Declined | Cancelled |
| 0 | Cancelled | Cancelled |
| 4 | User Cancelled | Cancelled |

## Common Tasks

### View Order in Database
```sql
SELECT * FROM orders WHERE orderNumber = 'MELL1234567890';
```

### Check Payment Status via API
```bash
curl http://localhost:5000/api/paygate/status/MELL1234567890
```

### Test Payment
```bash
curl -X POST http://localhost:5000/api/paygate/initiate \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 100.00,
    "reference": "TEST'$(date +%s)'",
    "email": "test@example.com",
    "firstName": "Test",
    "lastName": "User",
    "orderDetails": {
      "items": [],
      "shippingAddress": {},
      "subtotal": 80,
      "shipping": 20,
      "discount": 0
    }
  }'
```

## Files to Check

### Backend
- `backend/routes/paygate.js` - Payment logic
- `backend/models/Order.js` - Order model with PayGate fields
- `backend/server.js` - Route registration

### Frontend
- `payment-return.html` - Success/failure page
- `checkout.html` - Checkout form
- `js/checkout.js` - Payment processing

## Environment Variables (.env)
```env
FRONTEND_URL=http://localhost:3000
PORT=5000
```

## Troubleshooting

### Payment not working?
1. Check backend is running: `curl http://localhost:5000/api/health`
2. Check browser console for errors
3. Verify credentials in `backend/routes/paygate.js`

### Order not updating?
1. Check database connection
2. Look at backend logs
3. Verify Order model has been synced

### Can't redirect to PayGate?
1. Check FRONTEND_URL in .env
2. Verify payment-return.html exists
3. Check browser console for CORS errors

## Support Contacts

**PayGate Support:**
- 📧 support@paygate.co.za
- 📞 +27 (0)86 111 7498
- 🌐 https://www.paygate.co.za

**PayGate Documentation:**
https://docs.paygate.co.za/

## Security Notes
- ✅ Card details never touch your server
- ✅ All communication is HTTPS encrypted
- ✅ Checksums verify all responses
- ✅ PCI DSS compliant through PayGate
