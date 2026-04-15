# 🎯 MELLOPHI Fashion - Quick Reference

## 🚀 Getting Started (First Time)

### 1. Install Requirements
- **MySQL** - https://dev.mysql.com/downloads/installer/ OR XAMPP
- **Node.js** - https://nodejs.org/ (LTS version)

### 2. Quick Setup
```powershell
# Run the setup script
./SETUP.bat

# Or manually:
cd backend
npm install
```

### 3. Configure Database
Edit `backend/.env`:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=mellophi_fashion
JWT_SECRET=MellophiFashion2026SecureKey
```

### 4. Create Database
Run this SQL in MySQL:
```sql
CREATE DATABASE mellophi_fashion;
```

### 5. Start Backend & Seed Data
```powershell
cd backend
npm start              # In one terminal
npm run seed           # In another terminal (after backend starts)
```

### 6. Open Website
```powershell
./START.bat           # Opens website at http://localhost:3000
```

---

## 📝 Daily Development

### Start Everything
```powershell
./SETUP_AND_START.bat    # Automated startup
```

### Or Start Manually:
```powershell
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Frontend (or just double-click START.bat)
./START.bat
```

---

## 🔑 Default Credentials

**Admin Login:** http://localhost:3000/admin/login.html
- Email: `admin@mellophifashion.com`
- Password: `Admin123!`

---

## 📁 Important Files

| File | Purpose |
|------|---------|
| `backend/.env` | Database credentials & config |
| `js/config.js` | API URL configuration |
| `FINAL_DEPLOYMENT_GUIDE.md` | Complete deployment steps |
| `PRE_LAUNCH_CHECKLIST.md` | Pre-launch checklist |

---

## 🌐 URLs (Development)

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:5000/api |
| Admin Login | http://localhost:3000/admin/login.html |
| Admin Dashboard | http://localhost:3000/admin/dashboard.html |

---

## 🛠️ Common Commands

```powershell
# Backend
cd backend
npm start              # Start server
npm run dev            # Start with auto-reload
npm run seed           # Seed database with products

# Check if services are running
curl http://localhost:5000/api/health         # Backend health
curl http://localhost:5000/api/products       # Get products
```

---

## 🚨 Troubleshooting

### Backend won't start
- ✅ Check MySQL is running
- ✅ Verify `.env` credentials
- ✅ Run `npm install` in backend folder

### Products not showing
- ✅ Backend must be running first
- ✅ Run `npm run seed` to add products
- ✅ Check browser console for errors

### Admin can't login
- ✅ Backend must be running
- ✅ Run seed script to create admin user
- ✅ Use default credentials above

### Database errors
- ✅ Create database: `CREATE DATABASE mellophi_fashion;`
- ✅ Check MySQL service is running
- ✅ Verify credentials in `.env`

---

## 📦 Before Publishing

1. ✅ Complete `PRE_LAUNCH_CHECKLIST.md`
2. ✅ Update API URL in `js/config.js`
3. ✅ Set production environment in `.env`
4. ✅ Test complete checkout flow
5. ✅ Change admin password
6. ✅ Deploy to hosting

See `FINAL_DEPLOYMENT_GUIDE.md` for full deployment instructions.

---

## 📞 Contact Info (Your Website)

- **Email:** info@mellophifashion.co.za
- **WhatsApp:** +27 65 045 8081
- **Instagram:** @mellophi_fashion
- **PayGate ID:** 12975260

---

## 🎉 You're All Set!

Your MELLOPHI Fashion e-commerce website is ready to go!

Need help? Check the documentation files or review error messages carefully.
