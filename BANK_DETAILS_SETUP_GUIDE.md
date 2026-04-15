# How to Set Up Your Bank Details for Payments

## 📍 Where to Find Payment Settings

**Direct Link:** http://localhost:3000/admin/settings.html

Or navigate from the admin dashboard:
1. Go to http://localhost:3000/admin/dashboard.html
2. Click "Settings" in the sidebar menu (⚙️ Settings)

---

## 💳 Step 1: Add Your Bank Account Details

This is where customers will send EFT payments.

### Required Information:
1. **Bank Name** - Select your bank from the dropdown
   - ABSA, Standard Bank, FNB, Nedbank, Capitec, etc.

2. **Account Holder Name** - Your business name
   - Example: "MELLOPHI FASHION"

3. **Account Type** - Type of account
   - Current Account (recommended for business)
   - Savings Account
   - Business Account

4. **Account Number** - Your full bank account number
   - Example: 1234567890

5. **Branch Code** - Your bank's 6-digit branch code
   - Example: 250655

6. **SWIFT Code** (Optional) - Only needed for international payments

### How to Fill It Out:
1. Scroll to "💳 Bank Account Details" section
2. Fill in all required fields marked with *
3. Click "Save Bank Details"
4. Your details will appear in a box below for verification

---

## 🔐 Step 2: PayGate Settings (Already Configured)

Your PayGate account is already set up:
- **Merchant ID:** 12975260
- **Merchant Key:** Inyyjkfuaiwyr
- **Status:** Active ✓

You can enable/disable:
- ✅ PayGate for card payments
- ✅ Manual EFT payments

---

## 🏢 Step 3: Business Information

Fill in your business details:
- **Business Name:** MELLOPHI FASHION
- **Email:** mellophifashion@gmail.com (or your preferred email)
- **Phone:** Your WhatsApp/contact number
- **Address:** Your business/shipping address
- **VAT Number:** (Optional - if you're VAT registered)
- **Registration Number:** (Optional)

---

## ✅ What Happens After You Save?

### For Customers:
When customers choose "Bank Transfer (EFT)" at checkout, they will automatically see:
- Your bank name
- Your account holder name
- Your account number (with copy button)
- Your branch code (with copy button)
- Account type
- A unique payment reference

### For You:
Your bank details are:
- Saved securely in your browser
- Displayed on the settings page
- Automatically shown to customers at checkout
- Easy to copy and share

---

## 💡 Important Notes

### Security:
- Bank details are stored locally in your browser
- Only visible in the admin settings page
- Customers see them ONLY when they select EFT payment

### Customer Payment Flow:
1. Customer adds items to cart
2. Goes to checkout
3. Selects "Bank Transfer (EFT)"
4. Sees YOUR bank details
5. Makes payment to your account
6. You receive the money in your bank account

### PayGate Payments:
- PayGate handles card payments
- Money is transferred to your registered PayGate account
- You receive funds according to PayGate's settlement terms
- **Important:** Make sure your bank account is registered with PayGate at https://merchant.paygate.co.za/

---

## 📋 Quick Checklist

- [ ] Open http://localhost:3000/admin/settings.html
- [ ] Fill in your bank name
- [ ] Enter account holder name (your business name)
- [ ] Enter account number
- [ ] Enter branch code
- [ ] Select account type
- [ ] Click "Save Bank Details"
- [ ] Verify details appear correctly below the form
- [ ] Fill in business information (email, phone)
- [ ] Click "Save Business Info"
- [ ] Test by going to checkout and selecting "Bank Transfer (EFT)"

---

## 🔍 How to Test

1. **Save your bank details** in settings
2. **Go to shop:** http://localhost:3000/shop.html
3. **Add a product** to cart
4. **Go to checkout:** http://localhost:3000/checkout.html
5. **Select "Bank Transfer (EFT)"** as payment method
6. **Verify your bank details** appear correctly
7. Your details should show exactly as you entered them!

---

## 🆘 Need Help?

### Bank Details Not Showing?
- Make sure you clicked "Save Bank Details"
- Refresh the checkout page
- Check browser console (F12) for errors

### Can't Access Settings Page?
- Make sure both servers are running:
  - Frontend: http://localhost:3000
  - Backend: http://localhost:5000
- Clear browser cache and try again

### Want to Update Details?
- Go back to settings page
- Change the information
- Click "Save Bank Details" again
- Details update immediately

---

## 📧 Customer Payment Instructions

When customers select EFT, they will see:

```
Banking Details
Please use the following banking details to make your payment:

Bank Name: [Your Bank]
Account Name: [Your Business Name]
Account Number: [Your Account Number] [Copy Button]
Branch Code: [Your Branch Code] [Copy Button]
Account Type: [Account Type]
Reference: MELL12345678 [Copy Button]

Important Instructions:
• Please use your order number as the payment reference
• After making the payment, email proof of payment to: payments@mellophi.co.za
• Your order will be processed within 24 hours of payment verification
• Keep your payment reference for tracking purposes
```

---

## 💰 Getting Paid

### PayGate Payments:
- Customers pay via card
- PayGate processes payment
- Money goes to your PayGate-registered bank account
- Typical settlement: 2-3 business days

### EFT Payments:
- Customers transfer money directly to your bank account
- You receive it in 1-2 business days (instant if using same bank)
- You verify the payment manually
- Process the order once payment confirmed

---

## 🎉 You're All Set!

Once you've filled in your bank details, customers can pay you via:
- 💳 **Credit/Debit Cards** → via PayGate (automatic)
- 🏦 **Bank Transfer (EFT)** → directly to your account (manual verification)

Your MELLOPHI Fashion store is ready to accept payments! 🎀
