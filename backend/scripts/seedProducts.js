const sequelize = require('../config/database');
const dotenv = require('dotenv');
const Product = require('../models/Product');
const User = require('../models/User');

dotenv.config();

const productsData = [
    { productId: "A1", name: "A1 — Casual Summer Dress", category: "dress", price: 380, images: ["images/PRODUCTS/A1 front.png"], sizes: ["XS", "S", "M", "L"], stock: 15, isNewArrival: true },
    { productId: "A2", name: "A2 — Casual Dress", category: "dress", price: 300, images: ["images/PRODUCTS/A2 front.png"], sizes: ["S", "M", "L"], stock: 12 },
    { productId: "A3", name: "A3 — Summer Dress", category: "dress", price: 400, images: ["images/PRODUCTS/A3 front.png"], sizes: ["XS", "S", "M", "L"], stock: 10, isBestSeller: true },
    { productId: "A4", name: "A4 — Casual Dress", category: "dress", price: 380, images: ["images/PRODUCTS/A4 front.png"], sizes: ["S", "M", "L"], stock: 8, isBestSeller: true },
    { productId: "A5", name: "A5 — Elegant Dress", category: "dress", price: 450, images: ["images/PRODUCTS/A5 front.png"], sizes: ["XS", "S", "M", "L"], stock: 6 },
    { productId: "A6", name: "A6 — Party Dress", category: "dress", price: 500, images: ["images/PRODUCTS/A6 front.png"], sizes: ["S", "M", "L"], stock: 5 },
    { productId: "A7", name: "A7 — Maxi Dress", category: "dress", price: 550, images: ["images/PRODUCTS/A7 front.png"], sizes: ["XS", "S", "M", "L"], stock: 7 },
    { productId: "A8", name: "A8 — Cocktail Dress", category: "dress", price: 600, images: ["images/PRODUCTS/A8 front.png"], sizes: ["S", "M", "L"], stock: 4 },
    { productId: "A9", name: "A9 — Evening Dress", category: "dress", price: 650, images: ["images/PRODUCTS/A9 front.png"], sizes: ["XS", "S", "M", "L"], stock: 3 },
    { productId: "B1", name: "B1 — Elegant Dress", category: "dress", price: 380, images: ["images/PRODUCTS/B1 front.png"], sizes: ["XS", "S", "M", "L"], stock: 14, isNewArrival: true },
    { productId: "B2", name: "B2 — Formal Dress", category: "dress", price: 400, images: ["images/PRODUCTS/B2 front.png"], sizes: ["S", "M", "L"], stock: 11, isBestSeller: true },
    { productId: "B3", name: "B3 — Cocktail Dress", category: "dress", price: 450, images: ["images/PRODUCTS/B3 front.png", "images/PRODUCTS/B3 back.png"], sizes: ["XS", "S", "M", "L"], colors: ["Brown", "Blue", "Yellow"], stock: 9 },
    { productId: "B4", name: "B4 — Sleeveless Dress", category: "dress", price: 420, images: ["images/PRODUCTS/B4 front.png"], sizes: ["S", "M", "L"], stock: 8 },
    { productId: "C1", name: "C1 — V-Neck Top", category: "top", price: 220, images: ["images/PRODUCTS/C1 front.png"], sizes: ["S", "M", "L"], stock: 20, isNewArrival: true },
    { productId: "C2", name: "C2 — Ribbed Tee", category: "top", price: 220, images: ["images/PRODUCTS/C2 front.png"], sizes: ["S", "M", "L"], stock: 18, isBestSeller: true },
    { productId: "C3", name: "C3 — Casual Top", category: "top", price: 250, images: ["images/PRODUCTS/C3 front.png"], sizes: ["S", "M", "L"], stock: 16 },
    { productId: "C4", name: "C4 — Crop Top", category: "top", price: 220, images: ["images/PRODUCTS/C4 front.png"], sizes: ["S", "M", "L"], stock: 15 },
    { productId: "C5", name: "C5 — Sleeveless Top", category: "top", price: 200, images: ["images/PRODUCTS/C5 front.png"], sizes: ["S", "M", "L"], stock: 12 },
    { productId: "C6", name: "C6 — Basic Tee", category: "top", price: 180, images: ["images/PRODUCTS/C6 front.png"], sizes: ["S", "M", "L"], stock: 25 },
    { productId: "D1", name: "D1 — Co-ord Set", category: "set", price: 300, images: ["images/PRODUCTS/D1 front.png"], sizes: ["XS", "S", "M", "L"], stock: 10, isNewArrival: true },
    { productId: "E1", name: "E1 — Blue Skirt", category: "bottom", price: 250, images: ["images/PRODUCTS/E1 blue.jpg"], sizes: ["XS", "S", "M", "L"], stock: 13 },
    { productId: "E2", name: "E2 — Gold Skirt", category: "bottom", price: 250, images: ["images/PRODUCTS/E1 gold.jpg"], sizes: ["XS", "S", "M", "L"], stock: 13 }
];

async function seedDatabase() {
    try {
        await sequelize.authenticate();
        console.log('✅ Connected to MySQL');

        await sequelize.sync({ force: true });
        console.log('✅ Database tables created');

        await Product.bulkCreate(productsData);
        console.log(`✅ Inserted ${productsData.length} products`);

        const admin = await User.create({
            firstName: 'Admin',
            lastName: 'Mellophi',
            email: process.env.ADMIN_EMAIL || 'admin@mellophi.co.za',
            password: process.env.ADMIN_PASSWORD || 'Admin123',
            isAdmin: true
        });
        console.log('✅ Created admin user');
        console.log(`   Email: ${admin.email}`);
        console.log(`   Password: ${process.env.ADMIN_PASSWORD || 'Admin123'}`);

        console.log('\n🎉 Database seeded successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error.message);
        process.exit(1);
    }
}

seedDatabase();
