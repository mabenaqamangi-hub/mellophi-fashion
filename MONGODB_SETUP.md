# 🗄️ MongoDB Setup Instructions

## You have 2 options for MongoDB:

### Option 1: MongoDB Atlas (Cloud - Recommended for Easy Setup) ✅

1. **Create Free Account**
   - Go to: https://www.mongodb.com/cloud/atlas/register
   - Sign up with email or Google

2. **Create a Cluster**
   - Choose "FREE" tier (M0)
   - Select a region close to you
   - Click "Create Cluster"

3. **Setup Database Access**
   - Go to "Database Access" in left sidebar
   - Click "Add New Database User"
   - Create username: `mellophiAdmin`
   - Create password: `Mellophi2025!` (or your own)
   - Set privileges to "Read and write to any database"
   - Click "Add User"

4. **Setup Network Access**
   - Go to "Network Access" in left sidebar
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (0.0.0.0/0)
   - Click "Confirm"

5. **Get Connection String**
   - Go back to "Database" (Clusters)
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string (looks like):
   ```
   mongodb+srv://mellophiAdmin:<password>@cluster0.xxxxx.mongodb.net/
   ```

6. **Update .env file**
   - Open `backend\.env`
   - Replace `MONGODB_URI` line with:
   ```
   MONGODB_URI=mongodb+srv://mellophiAdmin:Mellophi2025!@cluster0.xxxxx.mongodb.net/mellophi-fashion
   ```
   - Replace `<password>` with your actual password
   - Replace `cluster0.xxxxx` with your actual cluster address

7. **Run seed command again**
   ```powershell
   cd backend
   npm run seed
   ```

---

### Option 2: Local MongoDB (More Setup Required)

1. **Download MongoDB**
   - Go to: https://www.mongodb.com/try/download/community
   - Download MongoDB Community Server for Windows
   - Run installer, choose "Complete" installation

2. **Install as Windows Service**
   - During installation, check "Install MongoDB as a Service"
   - Keep default settings

3. **Verify Installation**
   ```powershell
   mongod --version
   ```

4. **Start MongoDB Service**
   ```powershell
   net start MongoDB
   ```

5. **Keep .env as is** (already configured for local)

6. **Run seed command**
   ```powershell
   cd backend
   npm run seed
   ```

---

## ✅ Recommended: Use MongoDB Atlas

**Why?**
- No installation needed
- Free tier available
- Works from anywhere
- Automatic backups
- Easy to setup (5 minutes)

## 📝 After Setup

Once MongoDB is working (either option), run:

```powershell
cd backend
npm run seed
npm run dev
```

You should see:
```
✅ MongoDB Connected Successfully
✅ Inserted 22 products
✅ Created admin user
🚀 Server running on port 5000
```

## 🆘 Need Help?

If you get errors:
1. Check MongoDB Atlas network access (must allow your IP)
2. Check username/password in connection string
3. Make sure connection string has no spaces
4. Make sure password is URL-encoded (replace special characters)

## 🎯 Quick Test

After seeding, test the API:
Open browser: http://localhost:5000/api/health

Should show:
```json
{
  "status": "OK",
  "message": "Mellophi Fashion API is running"
}
```
