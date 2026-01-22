const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

let sequelize;

// Check if DATABASE_URL is provided (common in Heroku/Render)
if (process.env.DATABASE_URL) {
    console.log('📊 Using DATABASE_URL for connection');
    sequelize = new Sequelize(process.env.DATABASE_URL, {
        dialect: 'mysql',
        logging: process.env.NODE_ENV === 'development' ? console.log : false,
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        },
        dialectOptions: {
            ssl: process.env.NODE_ENV === 'production' ? {
                require: true,
                rejectUnauthorized: false // For cloud databases
            } : false
        }
    });
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

// Test connection
sequelize.authenticate()
    .then(() => {
        console.log('✅ MySQL Database Connected Successfully');
        console.log(`   Database: ${sequelize.config.database}`);
        console.log(`   Host: ${sequelize.config.host}`);
    })
    .catch(err => {
        console.error('❌ MySQL Connection Error:', err.message);
        console.error('   Check your database credentials in .env file');
    });

module.exports = sequelize;
