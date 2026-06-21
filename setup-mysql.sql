-- ==========================================
-- MELLOPHI FASHION - MySQL Database Setup
-- ==========================================
-- Run this script if you need to manually create the database
-- The backend will automatically create tables via Sequelize

-- Create the database
CREATE DATABASE IF NOT EXISTS mellophi_fashion 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

-- Use the database
USE mellophi_fashion;

-- Grant privileges (if needed)
-- Replace 'your_username' with your MySQL username
-- GRANT ALL PRIVILEGES ON mellophi_fashion.* TO 'your_username'@'localhost';
-- FLUSH PRIVILEGES;

-- Check if database was created
SELECT 'Database mellophi_fashion created successfully!' AS Status;

-- Show all databases
SHOW DATABASES LIKE 'mellophi_fashion';

-- ==========================================
-- NOTES:
-- ==========================================
-- 1. Tables will be created automatically by Sequelize when you start the backend
-- 2. Run 'npm run seed' in the backend folder to populate products
-- 3. Default admin user will be created during seeding
-- 4. Make sure to update backend/.env with your MySQL credentials
