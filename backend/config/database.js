const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

let sequelize;

console.log('🔍 Database Configuration Check:');
console.log('   NODE_ENV:', process.env.NODE_ENV);
console.log('   DATABASE_URL exists:', !!process.env.DATABASE_URL);
console.log('   DATABASE_URL starts with:', process.env.DATABASE_URL ? process.env.DATABASE_URL.substring(0, 15) + '...' : 'N/A');

// Check if DATABASE_URL is provided (common in Heroku/Render)
if (process.env.DATABASE_URL) {
    console.log('📊 Using DATABASE_URL for connection');
    // Detect dialect from URL (postgres://, mysql://, sqlite:)
    let dialect = 'mysql';
    if (process.env.DATABASE_URL.startsWith('postgres')) {
        dialect = 'postgres';
    } else if (process.env.DATABASE_URL.startsWith('sqlite:')) {
        dialect = 'sqlite';
    }
    console.log('   Detected dialect:', dialect);

    if (dialect === 'sqlite') {
        const sqliteStorage = process.env.DATABASE_URL.replace(/^sqlite:/, '') || './mellophi-dev.sqlite';
        sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: sqliteStorage,
            logging: false
        });
    } else {
        sequelize = new Sequelize(process.env.DATABASE_URL, {
            dialect: dialect,
            logging: false, // Disable query logging in production
            pool: {
                max: 5,
                min: 0,
                acquire: 60000, // Increased timeout
                idle: 10000
            },
            dialectOptions: {
                ssl: process.env.NODE_ENV === 'production' ? {
                    require: true,
                    rejectUnauthorized: false // For cloud databases
                } : false,
                connectTimeout: 60000 // 60 seconds
            },
            retry: {
                max: 5,
                match: [
                    /ECONNREFUSED/,
                    /ETIMEDOUT/,
                    /EHOSTUNREACH/,
                ]
            }
        });
    }
} else {
    // Use individual environment variables
    console.log('📊 Using individual DB credentials');
    sequelize = new Sequelize(
        process.env.DB_NAME || 'mellophi_fashion',
        process.env.DB_USER || 'root',
        process.env.DB_PASSWORD || '',
        {
            host: process.env.DB_HOST || 'localhost',
            port: process.env.DB_PORT || 3306,
            dialect: 'mysql',
            logging: process.env.NODE_ENV === 'development' ? console.log : false,
            pool: {
                max: 5,
                min: 0,
                acquire: 30000,
                idle: 10000
            }
        }
    );
}

// Test connection with retry logic
async function testConnection(retries = 3) {
    for (let i = 0; i < retries; i++) {
        try {
            await sequelize.authenticate();
            console.log('✅ Database Connected Successfully');
            console.log(`   Dialect: ${sequelize.getDialect()}`);
            return true;
        } catch (err) {
            console.error(`❌ Database Connection Attempt ${i + 1}/${retries} Failed:`);
            console.error('   Error:', err.message);
            console.error('   Code:', err.original?.code);
            
            if (i < retries - 1) {
                console.log(`   Retrying in 5 seconds...`);
                await new Promise(resolve => setTimeout(resolve, 5000));
            } else {
                console.error('❌ All connection attempts failed!');
                console.error('⚠️  Server will start but database features will be unavailable');
                console.error('⚠️  Please check:');
                console.error('   1. DATABASE_URL environment variable is set correctly');
                console.error('   2. Database server is running and accessible');
                console.error('   3. Database credentials are correct');
                return false;
            }
        }
    }
}

testConnection();

module.exports = sequelize;
