const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

let sequelize;

const buildSequelizeFromEnv = () => {
    const envDialect = process.env.DB_DIALECT ? process.env.DB_DIALECT.trim() : 'mysql';
    return new Sequelize(
        process.env.DB_NAME || 'mellophi_fashion',
        process.env.DB_USER || 'root',
        process.env.DB_PASSWORD || '',
        {
            host: process.env.DB_HOST || 'localhost',
            port: process.env.DB_PORT || 3306,
            dialect: envDialect,
            logging: process.env.NODE_ENV === 'development' ? console.log : false,
            pool: {
                max: 5,
                min: 0,
                acquire: 30000,
                idle: 10000
            }
        }
    );
};

const buildSequelizeFromUrl = (connectionString, dialect) => {
    const dialectOptions = {
        connectTimeout: 60000
    };

    if (process.env.NODE_ENV === 'production') {
        if (dialect === 'postgres') {
            dialectOptions.ssl = {
                require: true,
                rejectUnauthorized: false
            };
        } else if (dialect === 'mysql' || dialect === 'mariadb') {
            dialectOptions.ssl = {
                rejectUnauthorized: false
            };
        }
    }

    return new Sequelize(connectionString, {
        dialect,
        dialectModule: dialect === 'postgres' ? require('pg') : undefined,
        logging: false,
        pool: {
            max: 5,
            min: 0,
            acquire: 60000,
            idle: 10000
        },
        dialectOptions,
        retry: {
            max: 5,
            match: [
                /ECONNREFUSED/,
                /ETIMEDOUT/,
                /EHOSTUNREACH/
            ]
        }
    });
};

console.log('🔍 Database Configuration Check:');
console.log('   NODE_ENV:', process.env.NODE_ENV);
console.log('   DATABASE_URL exists:', !!process.env.DATABASE_URL);
console.log('   DATABASE_URL starts with:', process.env.DATABASE_URL ? process.env.DATABASE_URL.substring(0, 15) + '...' : 'N/A');

// Check if DATABASE_URL is provided (common in Heroku/Render)
if (process.env.DATABASE_URL) {
    const dbUrl = process.env.DATABASE_URL.trim();
    console.log('📊 Using DATABASE_URL for connection');

    const parsedUrl = (() => {
        try {
            return new URL(dbUrl);
        } catch (error) {
            console.error('❌ Invalid DATABASE_URL format:', error.message);
            return null;
        }
    })();

    const protocol = parsedUrl ? parsedUrl.protocol.replace(':', '') : '';
    let dialect = process.env.DB_DIALECT ? process.env.DB_DIALECT.trim() : 'mysql';
    if (protocol === 'postgres' || protocol === 'postgresql') {
        dialect = 'postgres';
    } else if (protocol === 'sqlite') {
        dialect = 'sqlite';
    } else if (protocol === 'mysql2') {
        dialect = 'mysql';
    } else if (protocol === 'mariadb') {
        dialect = 'mariadb';
    }

    let correctedDbUrl = dbUrl;
    let selectedHost = parsedUrl && parsedUrl.hostname ? parsedUrl.hostname : null;

    const isBareRenderHost = parsedUrl && parsedUrl.hostname && parsedUrl.hostname.startsWith('dpg-') && !parsedUrl.hostname.includes('.');
    if (parsedUrl && dialect === 'postgres' && isBareRenderHost) {
        const hostBase = parsedUrl.hostname.replace(/\.postgres\.render\.com$|\.render\.com$|\.internal$|\.internal\.render\.com$/i, '');
        const candidateHosts = [
            `${hostBase}.oregon.postgres.render.com`,
            `${hostBase}.postgres.render.com`,
            `${hostBase}.oregon.render.com`,
            `${hostBase}.render.com`,
            `${hostBase}.internal`,
            `${hostBase}.internal.render.com`
        ];

        for (const candidateHost of [...new Set(candidateHosts)]) {
            try {
                const candidateUrl = new URL(dbUrl);
                candidateUrl.hostname = candidateHost;
                correctedDbUrl = candidateUrl.toString();
                selectedHost = candidateHost;
                console.warn('⚠️ Applying Render Postgres host candidate:', candidateHost);
                break;
            } catch (err) {
                console.warn('⚠️ Host candidate failed to apply:', candidateHost, err.message);
            }
        }
    }

    console.log('   Detected protocol:', protocol);
    console.log('   Detected dialect:', dialect);
    if (parsedUrl) {
        console.log('   Database host:', selectedHost);
        console.log('   Database port:', parsedUrl.port || '(default)');
        console.log('   Database username:', parsedUrl.username ? '***' : '(none)');
    }

    if (dialect === 'sqlite') {
        const sqliteStorage = dbUrl.replace(/^sqlite:/, '') || './mellophi-dev.sqlite';
        sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: sqliteStorage,
            logging: false
        });
    } else {
        sequelize = buildSequelizeFromUrl(correctedDbUrl, dialect);
    }
} else {
    console.log('📊 Using individual DB credentials');
    sequelize = buildSequelizeFromEnv();
}

async function initializeDatabaseConnection() {
    const connected = await testConnection();
    if (!connected && process.env.DATABASE_URL && process.env.DB_HOST) {
        console.warn('⚠️ DATABASE_URL connection failed; falling back to individual DB environment variables.');
        sequelize = buildSequelizeFromEnv();
        await testConnection();
    }
}

initializeDatabaseConnection();
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
