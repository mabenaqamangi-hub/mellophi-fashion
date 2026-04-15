# 🚀 Quick Start Guide - Mellophi Fashion Backend

## Step-by-Step Setup (Windows)

### 1️⃣ Install Node.js (if not already installed)
- Download from: https://nodejs.org/
- Install the LTS version
- Verify installation:
```powershell
node --version
npm --version
```

### 2️⃣ Install MongoDB

**Option A: Local MongoDB (Recommended for Development)**
1. Download from: https://www.mongodb.com/try/download/community
2. Install MongoDB Community Server
3. MongoDB should start automatically

**Option B: MongoDB Atlas (Free Cloud Database)**
1. Sign up at: https://www.mongodb.com/cloud/atlas/register
2. Create a free cluster
3. Get your connection string
4. Update `.env` file with your Atlas connection string

### 3️⃣ Setup Backend

Open PowerShell and navigate to your project:

```powershell
cd "C:\Users\maben\OneDrive\Desktop\MELLOPHI 2 WEBSITE\backend"
```

Install dependencies:
```powershell
npm install
```

Create .env file:
```powershell
Copy-Item .env.example .env
```

**Edit the .env file** (open with Notepad):
- Keep defaults if using local MongoDB
- Change `JWT_SECRET` to any random string
- Change admin password if needed

### 4️⃣ Seed Database with Products

```powershell
npm run seed
```

You should see:
```
✅ Connected to MongoDB
✅ Inserted 22 products
✅ Created admin user
   Email: admin@mellophifashion.com
   Password: admin123
```

### 5️⃣ Start the Backend Server

```powershell
npm run dev
```

Server should start:
```
✅ MongoDB Connected Successfully
🚀 Server running on port 5000
```

**Keep this PowerShell window open!**

### 6️⃣ Access Admin Panel

1. Open a web browser
2. Navigate to your website folder and open: `admin/login.html`
3. Login with:
   - Email: `admin@mellophifashion.com`
   - Password: `admin123`

### 7️⃣ Test the Setup

**Check API is working:**
Open browser and go to: http://localhost:5000/api/health

You should see:
```json
{
  "status": "OK",
  "message": "Mellophi Fashion API is running"
}
```

**Check products:**
http://localhost:5000/api/products

**Access admin dashboard:**
Navigate to `admin/login.html` in your browser

## ✅ Verification Checklist

- [ ] Node.js installed (check: `node --version`)
- [ ] MongoDB running (local or Atlas)
- [ ] Dependencies installed (`npm install` completed)
- [ ] .env file created and configured
- [ ] Database seeded (`npm run seed` successful)
- [ ] Backend server running (`npm run dev`)
- [ ] API responding (http://localhost:5000/api/health)
- [ ] Admin panel accessible (admin/login.html)
- [ ] Can login to admin dashboard

## 🎯 What You Can Do Now

### In Admin Dashboard:
1. **View Statistics**: Total orders, revenue, products, customers
2. **Manage Products**: Add, edit, delete products
3. **Track Orders**: View and update order status
4. **View Customers**: See registered users

### API Endpoints Available:
- **GET** `/api/products` - All products
- **GET** `/api/products/:id` - Single product
- **POST** `/api/orders` - Create order
- **POST** `/api/auth/register` - Register user
- **POST** `/api/auth/login` - Login user

## 🔧 Common Issues & Solutions

### Issue: "MongoDB connection error"
**Solution**: 
- Make sure MongoDB is running
- Check if `MONGODB_URI` in .env is correct
- For local: `mongodb://localhost:27017/mellophi-fashion`

### Issue: "Port 5000 already in use"
**Solution**:
- Change `PORT=5001` in .env file
- Restart the server

### Issue: "Cannot find module"
**Solution**:
```powershell
rm -r node_modules
npm install
```

### Issue: "CORS error in browser"
**Solution**:
- Make sure backend is running
- Check `FRONTEND_URL` in .env matches your frontend URL

## 📞 Next Steps

1. **Customize Products**: Use admin panel to update product info
2. **Test Orders**: Try creating an order through the website
3. **Update Prices**: Change product prices in admin panel
4. **Manage Stock**: Update inventory levels
5. **Track Orders**: Process orders and update shipping status

## 🎨 Frontend Integration

To connect your website to the backend, update `js/shop.js`:

```javascript
// Add at the top of shop.js
const API_URL = 'http://localhost:5000/api';

// Replace the hardcoded products array with:
async function loadProducts() {
    try {
        const response = await fetch(`${API_URL}/products`);
        const data = await response.json();
        
        if (data.success) {
            products = data.data;
            displayProducts(products);
        }
    } catch (error) {
        console.error('Error loading products:', error);
    }
}

// Call on page load
loadProducts();
```

## 📚 Learn More

- Check `backend/README.md` for complete API documentation
- Explore admin panel features
- Test different API endpoints

---

**Support**: If you encounter any issues, check the server logs in the PowerShell window where you ran `npm run dev`
