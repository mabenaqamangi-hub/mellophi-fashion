# Mellophi Fashion - Backend & Admin Panel

Complete e-commerce backend system with admin dashboard for Mellophi Fashion website.

## 🚀 Features

### Backend API
- **Product Management**: CRUD operations for products with categories, pricing, stock
- **Order Processing**: Complete order lifecycle from creation to fulfillment
- **User Authentication**: JWT-based authentication with secure password hashing
- **Admin Dashboard**: Protected admin routes for managing entire store
- **RESTful API**: Clean, documented API endpoints

### Admin Panel
- **Dashboard**: Real-time statistics (orders, revenue, products, customers)
- **Product Management**: Add, edit, delete products with stock tracking
- **Order Management**: View, update order status, add tracking numbers
- **Customer Management**: View customer list and order history
- **Responsive Design**: Works on desktop and mobile devices

## 📋 Prerequisites

Before running the backend, ensure you have:
- **Node.js** (v14 or higher) - [Download here](https://nodejs.org/)
- **MongoDB** - Choose one:
  - Local MongoDB - [Download here](https://www.mongodb.com/try/download/community)
  - MongoDB Atlas (free cloud) - [Sign up here](https://www.mongodb.com/cloud/atlas/register)

## 🛠️ Installation

### Step 1: Install Dependencies

```powershell
cd backend
npm install
```

### Step 2: Configure Environment

1. Copy `.env.example` to `.env`:
```powershell
Copy-Item .env.example .env
```

2. Edit `.env` file and update:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/mellophi-fashion
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/mellophi-fashion

JWT_SECRET=your-random-secret-key-here-make-it-long-and-complex
ADMIN_EMAIL=admin@mellophifashion.com
ADMIN_PASSWORD=admin123
FRONTEND_URL=http://127.0.0.1:5500
```

### Step 3: Seed Database

Populate the database with your products and create admin user:

```powershell
npm run seed
```

You should see:
```
✅ Connected to MongoDB
🗑️  Cleared existing data
✅ Inserted 22 products
✅ Created admin user
   Email: admin@mellophifashion.com
   Password: admin123
🎉 Database seeded successfully!
```

## 🏃 Running the Backend

### Development Mode (with auto-restart)
```powershell
npm run dev
```

### Production Mode
```powershell
npm start
```

You should see:
```
✅ MongoDB Connected Successfully
🚀 Server running on port 5000
📍 API URL: http://localhost:5000/api
🔧 Environment: development
```

## 🔐 Accessing Admin Panel

1. Make sure backend is running
2. Open in browser: `admin/login.html`
3. Login with:
   - **Email**: `admin@mellophifashion.com`
   - **Password**: `admin123`

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Products
- `GET /products` - Get all products (with filters)
- `GET /products/:productId` - Get single product
- `GET /products/featured/list` - Get featured products
- `GET /products/new/arrivals` - Get new arrivals
- `GET /products/bestsellers/list` - Get best sellers

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - User login

### Orders
- `POST /orders` - Create new order
- `GET /orders/:orderNumber` - Get order details
- `GET /orders/user/my-orders` - Get user's orders (auth required)

### Admin (requires admin authentication)
- `GET /admin/stats` - Dashboard statistics
- `GET /admin/products` - Get all products
- `POST /admin/products` - Create product
- `PUT /admin/products/:productId` - Update product
- `DELETE /admin/products/:productId` - Delete product
- `GET /admin/orders` - Get all orders
- `PUT /admin/orders/:orderNumber` - Update order
- `GET /admin/users` - Get all users

## 🔧 Frontend Integration

Update your frontend JavaScript files to use the API:

### Example: Fetching Products
```javascript
const API_URL = 'http://localhost:5000/api';

async function loadProducts() {
    try {
        const response = await fetch(`${API_URL}/products`);
        const data = await response.json();
        
        if (data.success) {
            // Use data.data array of products
            displayProducts(data.data);
        }
    } catch (error) {
        console.error('Error loading products:', error);
    }
}
```

### Example: Creating Order
```javascript
async function createOrder(orderData) {
    try {
        const response = await fetch(`${API_URL}/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(orderData)
        });
        
        const data = await response.json();
        
        if (data.success) {
            console.log('Order created:', data.data.orderNumber);
        }
    } catch (error) {
        console.error('Error creating order:', error);
    }
}
```

## 📁 Project Structure

```
backend/
├── models/
│   ├── Product.js       # Product schema
│   ├── User.js          # User schema with authentication
│   └── Order.js         # Order schema
├── routes/
│   ├── products.js      # Product endpoints
│   ├── auth.js          # Authentication endpoints
│   ├── orders.js        # Order endpoints
│   ├── users.js         # User endpoints
│   └── admin.js         # Admin endpoints
├── middleware/
│   └── auth.js          # JWT authentication middleware
├── scripts/
│   └── seedProducts.js  # Database seeding script
├── .env.example         # Environment variables template
├── .gitignore
├── package.json
└── server.js            # Express server setup

admin/
├── login.html           # Admin login page
├── dashboard.html       # Admin dashboard
├── admin-styles.css     # Admin panel styles
└── admin-script.js      # Admin panel functionality
```

## 🐛 Troubleshooting

### MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution**: Make sure MongoDB is running:
```powershell
# If using local MongoDB
mongod
```

### CORS Error in Browser
**Solution**: Make sure `FRONTEND_URL` in `.env` matches your frontend URL

### Port Already in Use
```
Error: Port 5000 is already in use
```
**Solution**: Change `PORT` in `.env` or stop the other process

## 🔒 Security Notes

⚠️ **Important for Production:**

1. Change `JWT_SECRET` to a strong random string
2. Change default admin password immediately
3. Use HTTPS in production
4. Set up proper CORS restrictions
5. Use environment variables for all secrets
6. Enable MongoDB authentication
7. Implement rate limiting for API endpoints

## 📱 Testing the API

You can test the API using:
- **Browser**: Navigate to `http://localhost:5000/api/health`
- **Postman**: Import and test all endpoints
- **cURL**: Command line testing

Example:
```powershell
# Test health endpoint
curl http://localhost:5000/api/health

# Get all products
curl http://localhost:5000/api/products
```

## 🆘 Support

For issues or questions:
1. Check if backend server is running
2. Check MongoDB connection
3. Verify .env configuration
4. Check browser console for errors
5. Review server logs

## 📝 License

Private - Mellophi Fashion © 2025
