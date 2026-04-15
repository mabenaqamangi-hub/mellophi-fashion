# 🚀 Production Deployment Guide - Mellophi Fashion

## Table of Contents
1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Database Migration](#database-migration)
3. [Environment Configuration](#environment-configuration)
4. [Deployment Options](#deployment-options)
   - [Render.com (Recommended)](#rendercom-recommended)
   - [Heroku](#heroku-deployment)
5. [Post-Deployment Tasks](#post-deployment-tasks)
6. [Troubleshooting](#troubleshooting)

---

## Pre-Deployment Checklist

Before deploying, ensure you have completed:

- [ ] All features tested locally
- [ ] Database contains products and necessary data
- [ ] PayGate credentials verified (production, not test)
- [ ] Strong JWT_SECRET generated
- [ ] Domain name purchased (if applicable)
- [ ] SSL certificate plan (most hosts provide free)
- [ ] Backup of local database created

---

## Database Migration

### Step 1: Export Local Database

```bash
# Export your MySQL database
cd backend
mysqldump -u root -p mellophi_fashion > mellophi_backup.sql

# This creates a backup file with all your products and data
```

### Step 2: Prepare Database for Production

**Important Notes:**
- Production databases should NOT auto-alter schema (already configured)
- Use migrations for schema changes in production
- Always backup before applying changes

**What gets migrated:**
- Products table (all your product listings)
- Orders table (order history)
- Users table (admin accounts)
- Product images (need separate upload)

---

## Environment Configuration

### Step 1: Create Production .env File

**DO NOT commit this file to GitHub!**

```env
# Production Environment Variables
NODE_ENV=production
PORT=5000

# Database - Will be provided by hosting service
DATABASE_URL=mysql://username:password@host:port/database_name

# Frontend - Your actual domain
FRONTEND_URL=https://www.mellophi.co.za,https://mellophi.co.za

# JWT - Generate new secure secret
JWT_SECRET=<use: require('crypto').randomBytes(64).toString('hex')>
JWT_EXPIRE=7d

# PayGate - Production credentials
PAYGATE_ID=12975260
PAYGATE_SECRET=lnyyjkfuaiwyr
PAYGATE_RETURN_URL=https://www.mellophi.co.za/payment-return.html
PAYGATE_NOTIFY_URL=https://api.mellophi.co.za/api/paygate/notify

# File Upload
MAX_FILE_SIZE=5242880
```

### Step 2: Generate Secure JWT Secret

```bash
# In Node.js terminal
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Copy the output and use it as your JWT_SECRET.

---

## Deployment Options

## Render.com (Recommended)

**Why Render?**
- Free tier available
- Easy deployment
- Automatic HTTPS
- MySQL database included
- Better performance than Heroku free tier

### Step 1: Create Render Account

1. Go to https://render.com
2. Sign up with GitHub (recommended)
3. Verify your email

### Step 2: Deploy Database

1. Click **"New +"** → **"MySQL"**
2. Configure:
   - **Name**: `mellophi-database`
   - **Database**: `mellophi_fashion`
   - **User**: (auto-generated)
   - **Region**: Choose closest to target users
   - **Plan**: Start with Free tier
3. Click **"Create Database"**
4. Wait for provisioning (2-3 minutes)
5. **Copy the Internal Database URL** (you'll need this)

### Step 3: Import Database

```bash
# Connect to Render database (use URL from dashboard)
mysql -h <host> -P <port> -u <user> -p <database> < mellophi_backup.sql

# Or use MySQL Workbench with connection details from Render
```

### Step 4: Deploy Backend

1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository
3. Configure:
   - **Name**: `mellophi-api`
   - **Region**: Same as database
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Plan**: Free tier

4. **Add Environment Variables** (click "Advanced"):
   ```
   NODE_ENV=production
   DATABASE_URL=<paste Internal Database URL from Step 2>
   FRONTEND_URL=https://your-frontend-url.onrender.com
   JWT_SECRET=<your generated secret>
   PAYGATE_ID=12975260
   PAYGATE_SECRET=lnyyjkfuaiwyr
   PAYGATE_RETURN_URL=https://your-frontend-url.onrender.com/payment-return.html
   PAYGATE_NOTIFY_URL=https://mellophi-api.onrender.com/api/paygate/notify
   ```

5. Click **"Create Web Service"**
6. Wait for deployment (5-10 minutes)
7. Your API will be at: `https://mellophi-api.onrender.com`

### Step 5: Deploy Frontend

1. Click **"New +"** → **"Static Site"**
2. Connect repository
3. Configure:
   - **Name**: `mellophi-fashion`
   - **Branch**: `main`
   - **Build Command**: (leave empty)
   - **Publish Directory**: `.` (root)

4. Click **"Create Static Site"**
5. Update `js/config.js` with your API URL:
   ```javascript
   const PRODUCTION_API_URL = 'https://mellophi-api.onrender.com/api';
   ```
6. Redeploy after config change

---

## Heroku Deployment

### Prerequisites

```bash
# Install Heroku CLI
# Windows: Download from https://devcenter.heroku.com/articles/heroku-cli
# Mac: brew install heroku/brew/heroku
# Linux: curl https://cli-assets.heroku.com/install.sh | sh

# Login
heroku login
```

### Step 1: Create Heroku App

```bash
cd backend
heroku create mellophi-api

# Add MySQL database (ClearDB addon - Free tier)
heroku addons:create cleardb:ignite

# Get database URL
heroku config:get CLEARDB_DATABASE_URL
# Copy this URL - you'll need it
```

### Step 2: Import Database to ClearDB

```bash
# Extract connection details from CLEARDB_DATABASE_URL
# Format: mysql://user:password@host/database?reconnect=true

mysql -h <host> -u <user> -p<password> <database> < mellophi_backup.sql
```

### Step 3: Configure Environment Variables

```bash
# Set all environment variables
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=<your generated secret>
heroku config:set FRONTEND_URL=https://your-frontend-url.herokuapp.com
heroku config:set PAYGATE_ID=12975260
heroku config:set PAYGATE_SECRET=lnyyjkfuaiwyr
heroku config:set PAYGATE_RETURN_URL=https://your-frontend-url.herokuapp.com/payment-return.html
heroku config:set PAYGATE_NOTIFY_URL=https://mellophi-api.herokuapp.com/api/paygate/notify

# Verify
heroku config
```

### Step 4: Deploy Backend

```bash
# Initialize git if not already
git init
git add .
git commit -m "Initial production deployment"

# Deploy
git push heroku main

# View logs
heroku logs --tail
```

### Step 5: Deploy Frontend

Option 1: **GitHub Pages** (Free, recommended for static sites)
```bash
# In root directory
git add .
git commit -m "Deploy frontend"
git push origin main

# Enable GitHub Pages in repository settings
# Source: main branch / root
```

Option 2: **Heroku Static Site**
```bash
heroku create mellophi-fashion
# Deploy frontend files
git push heroku main
```

---

## Post-Deployment Tasks

### 1. Update Frontend Config

Update `js/config.js`:
```javascript
const PRODUCTION_API_URL = 'https://your-actual-backend-url.com/api';
```

### 2. Test Critical Flows

- [ ] Homepage loads
- [ ] Products display correctly
- [ ] Images load
- [ ] Add to cart works
- [ ] Checkout process
- [ ] Payment gateway (use test card)
- [ ] Admin dashboard login
- [ ] Product management

### 3. Configure Custom Domain (Optional)

**Render:**
- Dashboard → Your service → Settings → Custom Domain
- Add your domain and follow DNS instructions

**Heroku:**
```bash
heroku domains:add www.mellophi.co.za
# Follow DNS configuration instructions
```

### 4. Enable HTTPS

**Render:** Automatic (Let's Encrypt)
**Heroku:** Automatic with custom domains

### 5. Set Up Monitoring

**Render:**
- Built-in monitoring in dashboard
- Email alerts for downtime

**Heroku:**
```bash
# Add log management
heroku addons:create papertrail:choklad

# View logs
heroku logs --tail
```

### 6. Configure Backups

**Database Backups:**
```bash
# Manual backup
mysqldump -h <production-host> -u <user> -p <database> > backup_$(date +%Y%m%d).sql

# Automate with cron job or hosting provider tools
```

**Image Backups:**
- Download `/backend/images/PRODUCTS/` directory regularly
- Consider cloud storage (AWS S3, Cloudinary) for production

---

## Troubleshooting

### Database Connection Errors

```bash
# Check DATABASE_URL format
echo $DATABASE_URL

# Test connection
mysql -h <host> -P <port> -u <user> -p

# Verify Sequelize can connect
node -e "require('./config/database')"
```

### CORS Errors

Check:
1. FRONTEND_URL includes your actual domain
2. Protocol matches (http vs https)
3. No trailing slashes in URLs

### Payment Gateway Issues

1. Verify PayGate URLs are updated to production URLs
2. Check notify URL is publicly accessible
3. Test with PayGate test cards first
4. Check PayGate dashboard for transaction logs

### Images Not Loading

1. Ensure `/backend/images/PRODUCTS/` directory exists
2. Check image paths in database (should be relative)
3. Verify static file serving middleware is configured
4. Check hosting service supports file uploads to disk

### Application Won't Start

```bash
# Check logs
heroku logs --tail  # Heroku
# or check Render dashboard

# Common issues:
# - Missing environment variables
# - Database connection failed
# - Port binding (use process.env.PORT)
# - Missing dependencies (npm install)
```

### Performance Issues

1. **Enable compression:**
   ```bash
   npm install compression
   ```
   
   ```javascript
   // In server.js
   const compression = require('compression');
   app.use(compression());
   ```

2. **Database optimization:**
   - Add indexes to frequently queried fields
   - Use connection pooling (already configured)
   - Cache frequent queries

3. **CDN for images:**
   - Consider Cloudinary or AWS S3 for image hosting
   - Reduces server load significantly

---

## Security Best Practices

1. **Never commit .env to version control**
   ```bash
   # Add to .gitignore
   echo ".env" >> .gitignore
   ```

2. **Use strong secrets**
   - JWT_SECRET: 64+ random characters
   - Database passwords: 16+ characters, mixed

3. **Keep dependencies updated**
   ```bash
   npm audit
   npm audit fix
   ```

4. **Rate limiting** (recommended for production):
   ```bash
   npm install express-rate-limit
   ```

5. **Helmet for security headers:**
   ```bash
   npm install helmet
   ```

---

## Need Help?

- **Render Docs**: https://render.com/docs
- **Heroku Docs**: https://devcenter.heroku.com
- **PayGate Support**: https://www.paygate.co.za/paygate-support/

---

## Summary

✅ **You've configured:**
- Production-ready environment variables
- Database connection with SSL support
- CORS for your domain
- PayGate payment integration
- Secure authentication

🛑 **STOP HERE** - Do not proceed with actual deployment until:
- You have verified all credentials
- You have tested thoroughly in development
- You have a backup of your database
- You understand the costs of your hosting provider

**Next step when ready:** Choose Render or Heroku and follow their respective deployment steps above.
