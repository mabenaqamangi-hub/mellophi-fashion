# 📊 Database Migration Guide

## Overview
This guide helps you migrate your local MySQL database to production.

---

## Quick Migration Steps

### 1. Export Local Database

```bash
# Navigate to backend directory
cd backend

# Export entire database
mysqldump -u root -p mellophi_fashion > mellophi_backup_$(date +%Y%m%d).sql

# Export with compression (for large databases)
mysqldump -u root -p mellophi_fashion | gzip > mellophi_backup_$(date +%Y%m%d).sql.gz
```

**What gets exported:**
- Products table (all product data)
- Orders table (order history)
- Users table (admin credentials)
- Database schema (table structures)

**Not included:**
- Product images (files in `/backend/images/PRODUCTS/`)
- Environment variables (.env file)

### 2. Verify Backup

```bash
# Check file size
ls -lh mellophi_backup_*.sql

# Preview content
head -n 50 mellophi_backup_*.sql

# Count tables
grep "CREATE TABLE" mellophi_backup_*.sql | wc -l
```

### 3. Import to Production

#### Option A: Direct MySQL Import

```bash
# Connect to production database
mysql -h production-host -P 3306 -u username -p database_name < mellophi_backup.sql

# With progress indicator
pv mellophi_backup.sql | mysql -h production-host -u username -p database_name
```

#### Option B: Using MySQL Workbench

1. Open MySQL Workbench
2. Connect to production database
3. **Server** → **Data Import**
4. Select **Import from Self-Contained File**
5. Choose your backup file
6. Click **Start Import**

#### Option C: Cloud Provider Tools

**Render:**
```bash
# Get connection details from Render dashboard
mysql -h oregon-postgres.render.com -P 3306 -u user -p database < backup.sql
```

**Heroku ClearDB:**
```bash
# Get CLEARDB_DATABASE_URL from config
heroku config:get CLEARDB_DATABASE_URL

# Extract details and import
mysql -h us-cdbr-east.cleardb.com -u user -p database < backup.sql
```

---

## Database Schema

### Products Table
```sql
CREATE TABLE `Products` (
  `id` int NOT NULL AUTO_INCREMENT,
  `productId` varchar(50) NOT NULL,
  `name` varchar(255) NOT NULL,
  `category` enum('dress','top','bottom','set') NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `description` text,
  `images` json DEFAULT NULL,
  `sizes` json DEFAULT NULL,
  `sizeGuide` text,
  `colors` json DEFAULT NULL,
  `stock` int DEFAULT '0',
  `isFeatured` tinyint(1) DEFAULT '0',
  `isNewArrival` tinyint(1) DEFAULT '0',
  `isBestSeller` tinyint(1) DEFAULT '0',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `productId` (`productId`)
);
```

### Orders Table
```sql
CREATE TABLE `Orders` (
  `id` int NOT NULL AUTO_INCREMENT,
  `orderNumber` varchar(50) NOT NULL,
  `customerName` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `shippingAddress` text NOT NULL,
  `products` json NOT NULL,
  `subtotal` decimal(10,2) NOT NULL,
  `shippingCost` decimal(10,2) DEFAULT '0.00',
  `total` decimal(10,2) NOT NULL,
  `paymentMethod` varchar(50) DEFAULT NULL,
  `paymentStatus` enum('pending','paid','failed') DEFAULT 'pending',
  `orderStatus` enum('pending','processing','shipped','delivered','cancelled') DEFAULT 'pending',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `orderNumber` (`orderNumber`)
);
```

### Users Table
```sql
CREATE TABLE `Users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','customer') DEFAULT 'customer',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`)
);
```

---

## Image Migration

### 1. Create Archive

```bash
# Zip all product images
cd backend/images
zip -r products_images.zip PRODUCTS/

# Or tar with compression
tar -czf products_images.tar.gz PRODUCTS/
```

### 2. Upload to Production

**Option A: SCP (if you have SSH access)**
```bash
scp products_images.zip user@server:/path/to/backend/images/
```

**Option B: FTP/SFTP**
- Use FileZilla or similar
- Upload to `/backend/images/PRODUCTS/`

**Option C: Cloud Storage (Recommended for scalability)**
- **AWS S3**: Use S3 bucket and update image URLs
- **Cloudinary**: Upload via their API
- **Render/Heroku Persistent Storage**: Configure volume mounts

### 3. Extract on Server

```bash
cd /path/to/backend/images
unzip products_images.zip
# or
tar -xzf products_images.tar.gz
```

---

## Production Database Configuration

### Environment Variables

```env
# Option 1: Individual credentials
DB_HOST=your-production-host.com
DB_PORT=3306
DB_USER=your_db_user
DB_PASSWORD=your_secure_password
DB_NAME=mellophi_fashion

# Option 2: Connection URL (Heroku/Render style)
DATABASE_URL=mysql://user:password@host:port/database
```

### Security Considerations

1. **SSL/TLS Connection**
   - Already configured in `database.js`
   - Automatically enabled in production

2. **Strong Passwords**
   - Use 16+ character passwords
   - Mix of letters, numbers, symbols

3. **Limited Permissions**
   ```sql
   -- Create dedicated user (not root)
   CREATE USER 'mellophi_app'@'%' IDENTIFIED BY 'strong_password';
   GRANT SELECT, INSERT, UPDATE, DELETE ON mellophi_fashion.* TO 'mellophi_app'@'%';
   FLUSH PRIVILEGES;
   ```

4. **Firewall Rules**
   - Whitelist only your server's IP
   - Deny public access

---

## Testing Production Database

### 1. Verify Connection

```bash
# Test connection
node -e "require('./config/database')"

# Should output:
# ✅ MySQL Database Connected Successfully
#    Database: mellophi_fashion
#    Host: your-production-host
```

### 2. Check Tables

```sql
-- Connect to database
mysql -h host -u user -p database

-- List tables
SHOW TABLES;

-- Check product count
SELECT COUNT(*) FROM Products;

-- Check order count
SELECT COUNT(*) FROM Orders;

-- Verify recent data
SELECT productId, name, price FROM Products LIMIT 5;
```

### 3. Test API Endpoints

```bash
# Health check
curl https://your-api-url.com/api/health

# Get products
curl https://your-api-url.com/api/products

# Get specific product
curl https://your-api-url.com/api/products/A1
```

---

## Rollback Plan

### If Something Goes Wrong

1. **Keep local backup safe**
   ```bash
   # Create multiple backups
   cp mellophi_backup.sql mellophi_backup_safe.sql
   ```

2. **Production backup before changes**
   ```bash
   # Backup production before migration
   mysqldump -h prod-host -u user -p database > prod_before_migration.sql
   ```

3. **Restore from backup**
   ```bash
   # Drop and recreate database
   mysql -h host -u user -p -e "DROP DATABASE database_name;"
   mysql -h host -u user -p -e "CREATE DATABASE database_name;"
   
   # Restore
   mysql -h host -u user -p database_name < backup.sql
   ```

---

## Ongoing Database Management

### Regular Backups

```bash
# Daily backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
mysqldump -h $DB_HOST -u $DB_USER -p$DB_PASSWORD $DB_NAME > backup_$DATE.sql
gzip backup_$DATE.sql

# Keep only last 7 days
find . -name "backup_*.sql.gz" -mtime +7 -delete
```

### Monitoring

```sql
-- Check database size
SELECT 
    table_schema AS 'Database',
    ROUND(SUM(data_length + index_length) / 1024 / 1024, 2) AS 'Size (MB)'
FROM information_schema.TABLES
WHERE table_schema = 'mellophi_fashion';

-- Table sizes
SELECT 
    table_name,
    ROUND(((data_length + index_length) / 1024 / 1024), 2) AS 'Size (MB)'
FROM information_schema.TABLES
WHERE table_schema = 'mellophi_fashion'
ORDER BY (data_length + index_length) DESC;
```

### Performance Optimization

```sql
-- Add indexes for frequently queried fields
CREATE INDEX idx_category ON Products(category);
CREATE INDEX idx_featured ON Products(isFeatured);
CREATE INDEX idx_order_status ON Orders(orderStatus);
CREATE INDEX idx_payment_status ON Orders(paymentStatus);

-- Analyze tables
ANALYZE TABLE Products, Orders, Users;
```

---

## Troubleshooting

### Connection Refused
- Check firewall rules
- Verify host and port
- Confirm database is running

### Access Denied
- Verify username/password
- Check user permissions
- Confirm host allows remote connections

### Table Already Exists
```sql
-- Drop and recreate
DROP TABLE IF EXISTS TableName;
-- Then re-import
```

### Character Encoding Issues
```sql
-- Set UTF-8
ALTER DATABASE mellophi_fashion CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

---

## Summary

✅ **Migration Checklist:**
- [ ] Local database exported
- [ ] Backup verified and tested
- [ ] Production database created
- [ ] Data imported successfully
- [ ] Images uploaded
- [ ] Environment variables configured
- [ ] Connection tested
- [ ] API endpoints working
- [ ] Sample orders created
- [ ] Backup strategy in place

🎉 **Your database is ready for production!**
