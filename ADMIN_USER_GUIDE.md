# 🎨 MELLOPHI FASHION - ADMIN PANEL USER GUIDE

## 📋 Table of Contents
1. [Getting Started](#getting-started)
2. [Logging In](#logging-in)
3. [Adding a New Product](#adding-a-new-product)
4. [Managing Products](#managing-products)
5. [Managing Orders](#managing-orders)
6. [Troubleshooting](#troubleshooting)

---

## 🚀 Getting Started

### Prerequisites
Before using the admin panel, make sure:
- ✅ Backend server is running (you should see a PowerShell window open)
- ✅ MySQL database is running
- ✅ You're accessing the website through Live Server (not opening files directly)

### Starting the Backend Server
1. Open PowerShell
2. Navigate to: `c:\Users\maben\OneDrive\Desktop\MELLOPHI 2 WEBSITE\backend`
3. Run: `npm start`
4. You should see: ✅ MySQL Database Connected Successfully

---

## 🔐 Logging In

### Access the Admin Panel
1. **Open VS Code**
2. Click **"Go Live"** button at the bottom-right corner
   - OR right-click `index.html` → "Open with Live Server"
3. In your browser, go to: `http://127.0.0.1:5500/admin/login.html`

### Login Credentials
- **Email:** admin@mellophi.co.za
- **Password:** Admin123

### After Login
You'll see the dashboard with:
- 📊 Statistics (Total Products, Orders, Customers, Revenue)
- 📦 Recent Orders
- 📉 Low Stock Products
- Navigation tabs: Products | Orders | Customers

---

## ➕ Adding a New Product

### Step 1: Access Product Management
1. After logging in, you're on the **Dashboard** tab
2. Click the **"Products"** tab at the top

### Step 2: Click "Add New Product"
1. Click the green **"+ Add New Product"** button
2. A form will appear

### Step 3: Fill in Product Details

#### Basic Information
- **Product ID:** 
  - Enter a unique ID (e.g., A10, B5, C7)
  - Format: Letter + Number (A1-A9 for dresses, C1-C6 for tops, etc.)
  - **IMPORTANT:** Must be unique!

- **Product Name:**
  - Full descriptive name
  - Example: "A10 — Evening Maxi Dress"
  - Format: ID — Description

- **Category:**
  - Choose from dropdown:
    - `dress` - For dresses
    - `top` - For tops/blouses
    - `bottom` - For skirts/pants
    - `set` - For matching sets

- **Price:**
  - Enter price in Rands (numbers only)
  - Example: 450 (for R 450.00)
  - Don't include "R" or commas

- **Description:**
  - Write a detailed product description
  - Include fabric, fit, care instructions
  - Example: "Elegant linen maxi dress perfect for summer events. Features adjustable straps and side pockets. Hand wash cold."

#### Images
- **Upload Product Images:**
  - Click "Choose Files" or drag and drop
  - Recommended: 2-4 images per product
  - Show front view, back view, detail shots
  - **Supported formats:** JPG, PNG, WebP
  - **Recommended size:** 800x1200px or larger
  - **File naming:** Use descriptive names like "A10-front.jpg", "A10-back.jpg"

#### Sizes
- **Available Sizes:**
  - Enter comma-separated sizes
  - Example: `XS, S, M, L, XL`
  - Or: `S, M, L`
  - **No spaces after commas** (system will handle it)

#### Colors
- **Available Colors:**
  - Enter comma-separated colors
  - Example: `Nude, Beige, Cream, Sand`
  - Use brand color palette:
    - Nude, Beige, Cream, Sand, Taupe, Olive, White, Navy

#### Stock & Features
- **Stock Quantity:**
  - Enter number of items available
  - Example: 15
  - Set to 0 if out of stock

- **Product Features:**
  - ☑️ **Featured Product** - Shows on homepage featured section
  - ☑️ **New Arrival** - Shows with "New" badge
  - ☑️ **Best Seller** - Shows with "Best Seller" badge
  - Check the boxes that apply

### Step 4: Save Product
1. Review all information
2. Click **"Save Product"** button
3. Wait for confirmation message: ✅ "Product created successfully"
4. The product will immediately appear on your website!

### Example: Adding a New Dress

```
Product ID: A10
Product Name: A10 — Evening Maxi Dress
Category: dress
Price: 450
Description: Elegant linen maxi dress perfect for summer events. Features adjustable straps and side pockets. Hand wash cold.
Images: [Upload A10-front.jpg, A10-back.jpg]
Sizes: S, M, L, XL
Colors: Nude, Cream, Sand
Stock: 12
✓ Featured Product
✓ New Arrival
□ Best Seller
```

---

## ✏️ Managing Products

### Viewing All Products
1. Click **"Products"** tab
2. You'll see a table with all products showing:
   - Product ID & Name
   - Category
   - Price
   - Stock level
   - Actions (Edit/Delete buttons)

### Editing a Product
1. Find the product in the list
2. Click the **"✏️ Edit"** button
3. Modify any fields you want to change
4. Click **"Update Product"**
5. Changes appear immediately on the website

### Deleting a Product
1. Find the product in the list
2. Click the **"🗑️ Delete"** button
3. Confirm deletion
4. Product is removed from website immediately

### Search & Filter
- Use the search box to find products by name or ID
- Filter by category using dropdown
- Sort by price, stock, or date added

---

## 📦 Managing Orders

### Viewing Orders
1. Click **"Orders"** tab
2. See all customer orders with:
   - Order number
   - Customer name
   - Order date
   - Total amount
   - Payment status
   - Order status

### Updating Order Status
1. Click on an order to view details
2. Update **Order Status:**
   - Pending → Processing → Shipped → Delivered
3. Update **Payment Status:**
   - Pending → Paid → Failed → Refunded
4. Add tracking number if shipped
5. Click **"Update Order"**
6. Customer receives automatic email notification

### Order Details
Click any order to see:
- Customer information (name, email, phone, address)
- Items ordered (products, sizes, quantities)
- Payment method
- Shipping details
- Order notes

---

## 👥 Managing Customers

### Viewing Customers
1. Click **"Customers"** tab
2. See all registered customers
3. View customer details:
   - Name and email
   - Total orders
   - Total spent
   - Registration date

### Customer Actions
- View order history
- Contact customer (email shown)
- Export customer data

---

## 🔧 Troubleshooting

### "Connection Error" when logging in
**Problem:** Can't connect to backend server

**Solutions:**
1. Check if backend server is running (PowerShell window should be open)
2. Make sure you're using Live Server (URL should be http://127.0.0.1:5500)
3. Don't open HTML files directly (no file:// in URL)
4. Restart backend: Close PowerShell window, run `npm start` in backend folder

### "Invalid credentials" error
**Problem:** Wrong email or password

**Solutions:**
1. Use correct credentials:
   - Email: admin@mellophi.co.za
   - Password: Admin123
2. Check for typos (case-sensitive)
3. Make sure no extra spaces

### Product not appearing on website
**Problem:** Added product but don't see it

**Solutions:**
1. Refresh the website (Ctrl + F5)
2. Check the product was saved successfully
3. Make sure backend server is running
4. Clear browser cache

### Images not uploading
**Problem:** Can't upload product images

**Solutions:**
1. Check file size (max 5MB per image)
2. Use supported formats: JPG, PNG, WebP
3. Rename files (no special characters or spaces)
4. Make sure `images/PRODUCTS/` folder exists

### "Product already exists" error
**Problem:** Product ID already used

**Solutions:**
1. Choose a different Product ID
2. Check existing products list
3. Use format: A1-A99, B1-B99, C1-C99, etc.

---

## 📞 Support & Maintenance

### Changing Admin Password
1. Open: `backend/.env`
2. Find: `ADMIN_PASSWORD=Admin123`
3. Change to: `ADMIN_PASSWORD=YourNewPassword`
4. Restart backend server
5. Use new password to login

### Adding Another Admin User
Contact your developer to add more admin accounts.

### Database Backup
1. Open MySQL
2. Export `mellophi_fashion` database
3. Save backup file with date
4. Store securely

### Regular Maintenance Tasks
- **Daily:** Check new orders
- **Weekly:** Update stock levels
- **Monthly:** Backup database
- **Seasonal:** Add new seasonal products

---

## 🎯 Quick Tips

✅ **DO:**
- Use descriptive product names
- Upload high-quality images
- Keep stock levels updated
- Respond to orders promptly
- Backup database regularly

❌ **DON'T:**
- Use duplicate Product IDs
- Leave stock at 0 without marking sold out
- Delete products with pending orders
- Share admin credentials
- Access from public WiFi

---

## 📱 Mobile Access

The admin panel is **responsive** and works on:
- 💻 Desktop (recommended)
- 📱 Tablet
- 📱 Mobile phones

For best experience, use a laptop or desktop computer.

---

## 🆘 Need Help?

If you encounter any issues:
1. Check this guide first
2. Check Troubleshooting section
3. Contact your developer

---

**Last Updated:** December 19, 2025  
**Version:** 1.0  
**Mellophi Fashion Admin Panel**
