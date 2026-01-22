# 🚀 MELLOPHI Fashion - Final Deployment Guide

## Current Status: 95% Ready ✅

Your website is nearly ready for publication! Follow these steps to complete the setup.

---

## 📋 Step 1: Install MySQL Database

### Option A: XAMPP (Easiest for Windows)
1. **Download XAMPP**: https://www.apachefriends.org/download.html
2. **Install** and start MySQL from XAMPP Control Panel
3. **Open phpMyAdmin**: http://localhost/phpmyadmin
4. **Create Database**: Click "New" → Name: `mellophi_fashion` → Create

### Option B: MySQL Standalone
1. **Download**: https://dev.mysql.com/downloads/installer/
2. **Install** MySQL Community Server
3. **Set root password** during installation
4. **Create database** via MySQL Workbench or command line:
   ```sql
   CREATE DATABASE mellophi_fashion;
   ```

---

## 📋 Step 2: Configure Backend Environment

1. **Open** `backend/.env` file (already exists)
2. **Update** with your MySQL credentials:

```env
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password_here
DB_NAME=mellophi_fashion
DB_DIALECT=mysql

# Server Configuration
PORT=5000
NODE_ENV=development

# JWT Secret (change this to any random string)
JWT_SECRET=MellophiFashion2026SecureKey!@#$%

# Frontend URL (change when deploying)
FRONTEND_URL=http://localhost:3000
```

3. **Save** the file

---

## 📋 Step 3: Seed the Database with Products

Open PowerShell in the backend folder:

```powershell
cd "C:\Users\maben\OneDrive\Desktop\MELLOPHI 2 WEBSITE\backend"

# Start the backend server
npm start
```

In a **NEW** PowerShell window:

```powershell
cd "C:\Users\maben\OneDrive\Desktop\MELLOPHI 2 WEBSITE\backend"

# Seed products
npm run seed
```

This will:
- ✅ Create all database tables
- ✅ Add all 47 products from your images folder
- ✅ Create default admin user

**Default Admin Credentials:**
- Email: `admin@mellophifashion.com`
- Password: `Admin123!`

---

## 📋 Step 4: Test Locally

### Start Backend:
```powershell
cd backend
npm start
```
Server will run on: http://localhost:5000

### Start Frontend:
Option 1 - Double click: `START.bat`
Option 2 - PowerShell:
```powershell
# Run from project root
./START.ps1
```
Website will open at: http://localhost:3000

### Test Checklist:
- [ ] Browse products on shop page
- [ ] Add items to cart
- [ ] Go through checkout process
- [ ] Login to admin: http://localhost:3000/admin/login.html
- [ ] Test adding/editing products
- [ ] Test order management

---

## 📋 Step 5: Update API URLs for Production

When ready to deploy, update the API URL in these files:

### Create Config File (Recommended):
Create `js/config.js`:
```javascript
// Change this when deploying to production
const API_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:5000/api'
    : 'https://your-api-domain.com/api';
```

Then update these files to use it:
- `js/checkout.js` (line 648)
- `js/shop.js` (line 5)
- `admin/admin-script.js` (line 1)

**OR** manually replace `http://localhost:5000/api` with your production API URL in all three files.

---

## 🌐 Step 6: Choose Hosting & Deploy

### Recommended Hosting Options:

#### Option 1: All-in-One Hosting (Easiest)
**Heroku** (Free/Paid tiers)
- Backend + Database in one place
- Frontend via Heroku static site
- Guide: https://devcenter.heroku.com/articles/deploying-nodejs

#### Option 2: Split Hosting (Recommended)
**Backend:** Railway, Render, or DigitalOcean
**Frontend:** Netlify or Vercel (Free tier)
**Database:** Railway includes MySQL

#### Option 3: Traditional Hosting
**Shared Hosting** with Node.js support (e.g., Hostinger, SiteGround)

---

## 📋 Step 7: Deployment Checklist

### Backend Deployment:
- [ ] Set environment variables on hosting platform
- [ ] Update `FRONTEND_URL` to your actual domain
- [ ] Update `NODE_ENV=production`
- [ ] Deploy backend code
- [ ] Run database migrations
- [ ] Test API endpoints

### Frontend Deployment:
- [ ] Update API URLs (Step 5)
- [ ] Update PayGate redirect URLs if needed
- [ ] Upload all files to hosting
- [ ] Configure custom domain
- [ ] Test all pages

### Security:
- [ ] Enable HTTPS (most hosts do this automatically)
- [ ] Change default admin password
- [ ] Update PayGate settings for production
- [ ] Test payment flow end-to-end

### Final Testing:
- [ ] Test on mobile devices
- [ ] Test all payment methods
- [ ] Test admin dashboard
- [ ] Test email contact form
- [ ] Check all images load
- [ ] Verify social media links

---

## 🎯 Quick Deployment Commands

### Railway (Recommended)
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```

### Netlify (Frontend)
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
cd "C:\Users\maben\OneDrive\Desktop\MELLOPHI 2 WEBSITE"
netlify deploy --prod
```

---

## 📞 Support & Resources

### Your Website Details:
- **Project Name:** MELLOPHI Fashion
- **Contact Email:** info@mellophifashion.co.za
- **WhatsApp:** +27 65 045 8081
- **Instagram:** @mellophi_fashion
- **PayGate ID:** 12975260

### Documentation Files:
- `PAYGATE_INTEGRATION.md` - Payment setup
- `ADMIN_USER_GUIDE.md` - Admin dashboard help
- `MONGODB_SETUP.md` - Database setup (now MySQL)
- `QUICK_START.md` - Quick start guide

### Need Help?
Review the specific guide files or check:
- Backend errors: Check `backend/.env` configuration
- Database errors: Verify MySQL is running
- Payment issues: Check `PAYGATE_INTEGRATION.md`

---

## ✅ You're Ready When:

1. ✅ MySQL database running
2. ✅ Backend starts without errors
3. ✅ Products visible on shop page
4. ✅ Can complete a test order
5. ✅ Admin dashboard accessible
6. ✅ API URLs updated for production
7. ✅ Hosting platform selected
8. ✅ Domain configured

---

**🎉 Once complete, your MELLOPHI Fashion website will be LIVE!**

For any issues during setup, check the error messages carefully and verify:
- MySQL is running
- `.env` file has correct credentials
- All npm packages are installed
- Ports 5000 and 3000 are not in use
