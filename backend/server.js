const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const sequelize = require('./config/database');

// Load environment variables
dotenv.config();

// Import routes
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const userRoutes = require('./routes/users');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const paygateRoutes = require('./routes/paygate');
const reviewRoutes = require('./routes/reviews');

// Initialize Express app
const app = express();

// Middleware
// CORS Configuration
const corsOptions = {
    origin: function (origin, callback) {
        const allowedOrigins = process.env.FRONTEND_URL 
            ? process.env.FRONTEND_URL.split(',').map(url => url.trim())
            : ['http://localhost:5500', 'http://127.0.0.1:5500'];
        
        // Allow requests with no origin (mobile apps, postman, etc.)
        if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files (product images)
// Serve from backend/images for newly uploaded images
app.use('/images/PRODUCTS', express.static(path.join(__dirname, 'images/PRODUCTS')));
app.use('/images', express.static(path.join(__dirname, 'images')));
// Serve from root/images for existing product images
app.use('/images', express.static(path.join(__dirname, '../images')));
app.use('/uploads', express.static(path.join(__dirname, 'images')));

// Database connection and sync
// Using alter: true to allow table creation/updates
async function initializeDatabase() {
    try {
        console.log('🔄 Starting database sync...');
        await sequelize.authenticate();
        console.log('✅ Database connection verified');
        
        const syncOptions = { alter: true };
        await sequelize.sync(syncOptions);
        console.log('✅ Database Synced Successfully');
        console.log('📊 All tables created/updated');
    } catch (err) {
        console.error('❌ Database Sync Error:', err.message);
        console.error('⚠️  Database features will be limited');
        // Don't exit - let server run without database
    }
}

// Initialize database (will wait for connection from config/database.js)
setTimeout(() => {
    initializeDatabase();
}, 3000); // Wait 3 seconds for connection to be established

// API Routes
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/paygate', paygateRoutes);

// Health check endpoint
app.get('/api/health', async (req, res) => {
    let dbStatus = 'unknown';
    try {
        await sequelize.authenticate();
        dbStatus = 'connected';
    } catch (err) {
        dbStatus = 'disconnected';
    }
    
    res.json({ 
        status: 'OK', 
        message: 'Mellophi Fashion API is running',
        timestamp: new Date().toISOString(),
        database: dbStatus,
        environment: process.env.NODE_ENV || 'development',
        hasDatabaseUrl: !!process.env.DATABASE_URL
    });
});

// Diagnostic endpoint
app.get('/api/diagnostic', (req, res) => {
    res.json({
        server: 'running',
        nodeVersion: process.version,
        env: {
            NODE_ENV: process.env.NODE_ENV,
            hasDatabaseUrl: !!process.env.DATABASE_URL,
            databaseUrlPrefix: process.env.DATABASE_URL ? process.env.DATABASE_URL.substring(0, 15) + '...' : 'not set',
            port: process.env.PORT || 5000
        },
        timestamp: new Date().toISOString()
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal Server Error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'API endpoint not found'
    });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📍 API URL: http://localhost:${PORT}/api`);
    console.log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`);
});
