# 🚀 Quick Test Guide - Checkout Flow

## How to Test Your New Checkout Flow

### Prerequisites
1. ✅ Backend server running (if using database)
2. ✅ VS Code Live Server running
3. ✅ Browser with localStorage enabled

---

## 🧪 Quick Test (2 Minutes)

### Step-by-Step Test

1. **Start Live Server**
   - Right-click on `index.html`
   - Select "Open with Live Server"
   - Browser opens at `http://127.0.0.1:5500`

2. **Add a Product**
   - Navigate to Shop: `http://127.0.0.1:5500/shop.html`
   - Click any product (e.g., "A1 — Casual Summer Dress")
   - Select size "M"
   - Click **"Buy Now"** button

3. **You Should See:**

   #### ✅ Checkout Page Opens
   - URL: `http://127.0.0.1:5500/checkout.html`
   - Cart shows your selected product

   #### ✅ Product Details Display:
   ```
   Product Name: A1 — Casual Summer Dress
   Size: M
   Price per item: R 380.00
   Quantity: × 1
   Item Subtotal: R 380.00
   ```

   #### ✅ Shipping Options (3 options):
   ```
   ⚪ Standard Shipping (R 80.00)
   ⚪ Express Shipping (R 150.00)
   ⚪ Store Pickup (FREE)
   ```

   #### ✅ Payment Breakdown:
   ```
   Products Subtotal:     R 380.00
   Shipping Cost:         R 80.00
   ────────────────────────────────
   TOTAL TO PAY:         R 460.00
   ```

4. **Test Shipping Change**
   - Click "Express Shipping"
   - Watch shipping cost change to R 150.00
   - Watch total update to R 530.00
   - Click "Store Pickup"
   - Watch shipping become "FREE (Pickup)" in green
   - Watch total update to R 380.00

5. **Test Multiple Products**
   - Click browser back button
   - Go back to shop
   - Click another product (e.g., "C1 — Everyday Top")
   - Select size "L"
   - Click "Add to Cart"
   - Go to checkout (click cart icon)
   - See both products listed with individual subtotals

---

## ✨ What to Look For

### ✅ Product Display Shows:
- [x] Product image
- [x] Product name
- [x] Selected size
- [x] Selected color (if applicable)
- [x] Price per item
- [x] Quantity (× number)
- [x] Item subtotal (highlighted in green)

### ✅ Shipping Options:
- [x] Standard Shipping - R 80.00
- [x] Express Shipping - R 150.00
- [x] Store Pickup - FREE

### ✅ Payment Breakdown:
- [x] Products Subtotal (sum of all items)
- [x] Shipping Cost (changes with selection)
- [x] TOTAL TO PAY (bold and prominent)

### ✅ Dynamic Updates:
- [x] Total changes when shipping option changes
- [x] Shipping shows "FREE (Pickup)" in green for pickup
- [x] Can remove items and total updates
- [x] Item count shows in heading "(X items)"

---

## 🎯 Test Scenarios

### Scenario A: Single Item
```
Add: 1× A1 Dress (M) @ R380
Shipping: Standard (R80)
Expected Total: R 460.00
```

### Scenario B: Multiple Items
```
Add: 2× A1 Dress (M) @ R380 = R760
Add: 1× C1 Top (L) @ R220 = R220
Shipping: Express (R150)
Expected Total: R 1,130.00
```

### Scenario C: Pickup (Free Shipping)
```
Add: 1× B3 Dress (S) @ R380
Shipping: Pickup (FREE)
Expected Total: R 380.00
```

### Scenario D: With Promo Code
```
Add: 2× A1 Dress @ R380 = R760
Shipping: Pickup (FREE)
Promo: WELCOME10 (10% off)
Discount: -R76.00
Expected Total: R 684.00
```

---

## 🐛 Troubleshooting

### Problem: Cart is Empty
**Solution:** Make sure you added items to cart first

### Problem: Total Not Updating
**Solution:** 
- Check browser console for errors (F12)
- Refresh the page
- Clear localStorage: `localStorage.clear()`

### Problem: Shipping Cost Not Changing
**Solution:** 
- Check that radio button is actually selected
- Look at console logs for debugging info

### Problem: Products Not Showing
**Solution:**
- Ensure you're using Live Server (not opening file directly)
- Check that `localStorage` has cart data:
  ```javascript
  // In browser console:
  console.log(localStorage.getItem('cart'));
  ```

---

## 📱 Mobile Testing

Test on mobile by:
1. Open Chrome DevTools (F12)
2. Click device icon (Ctrl+Shift+M)
3. Select "iPhone 12 Pro" or "Pixel 5"
4. Test the same scenarios

Should see:
- Products stack vertically
- Shipping options full width
- Order summary at bottom
- Everything readable and clickable

---

## ✅ Final Checklist

Before going live, verify:

- [ ] All products display correctly
- [ ] Can add multiple items
- [ ] Can remove items
- [ ] Shipping options all work (Standard/Express/Pickup)
- [ ] Total updates when shipping changes
- [ ] Promo code works (WELCOME10)
- [ ] Checkout button shows correct total
- [ ] Mobile layout works
- [ ] Payment methods display
- [ ] Can submit order

---

## 🎉 Success Criteria

Your checkout is working if:

1. ✅ Customer sees all product details clearly
2. ✅ Each product shows quantity and subtotal
3. ✅ Can choose between 3 shipping options
4. ✅ Shipping cost updates in real-time
5. ✅ Total calculates correctly
6. ✅ Payment breakdown is clear
7. ✅ Can apply promo codes
8. ✅ Everything updates dynamically

---

## 📞 Need Help?

Check these files:
- [CHECKOUT_IMPLEMENTATION_GUIDE.md](CHECKOUT_IMPLEMENTATION_GUIDE.md) - Complete documentation
- [CHECKOUT_EXAMPLE.md](CHECKOUT_EXAMPLE.md) - Visual examples
- Browser Console (F12) - Check for JavaScript errors

---

**Happy Testing!** 🚀

Remember: The customer should clearly see:
- What they're buying
- How much each item costs
- How many of each item
- Shipping options and costs
- The final total they'll pay

**Everything is transparent and updates instantly!** ✨
