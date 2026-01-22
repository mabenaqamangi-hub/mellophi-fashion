# How to Fix "Pictures Not Showing" Issue

## The Problem
Images aren't displaying because you're opening HTML files directly (file://) instead of through a web server.

## The Solution - Option 1: Use Live Server (Recommended)

### Step 1: Install Live Server Extension in VS Code
1. Open VS Code
2. Click Extensions icon (or press Ctrl+Shift+X)
3. Search for "Live Server"
4. Install "Live Server" by Ritwick Dey
5. Click "Reload" if prompted

### Step 2: Start Live Server
1. Open any HTML file in VS Code (e.g., index.html)
2. Right-click in the editor
3. Select "Open with Live Server"
4. Your browser will open at `http://127.0.0.1:5500`

### Step 3: Start Backend Server
```powershell
cd backend
npm start
```

✅ **Done!** Images should now display correctly.

---

## The Solution - Option 2: Use Serve Package

### Step 1: Install Serve (one-time)
```powershell
npm install -g serve
```

### Step 2: Start Frontend Server
```powershell
# In the main folder (MELLOPHI 2 WEBSITE)
npx serve -p 3000
```

### Step 3: Start Backend Server (in another terminal)
```powershell
cd backend
npm start
```

### Step 4: Open Browser
Visit: `http://localhost:3000`

✅ **Done!** Images should now display correctly.

---

## The Solution - Option 3: Python Simple Server

### If you have Python installed:

```powershell
# Python 3
python -m http.server 3000

# Then in another terminal, start backend:
cd backend
npm start
```

Visit: `http://localhost:3000`

---

## Quick Test

1. **Start Backend:**
   ```powershell
   cd backend
   npm start
   ```
   You should see: `🚀 Server running on port 5000`

2. **Start Frontend:** (choose one method above)

3. **Visit:** `http://localhost:3000` (or whatever port you chose)

4. **Check images:** Navigate to the shop page

---

## Why This Happens

- **File Protocol (file:///):** Browser security restrictions prevent proper image loading
- **Web Server (http://):** Proper paths resolve correctly and all features work

## Verification

✅ **Working:** URL shows `http://localhost:3000/index.html`
❌ **Not Working:** URL shows `file:///C:/Users/.../index.html`

---

## Need Help?

If images still don't show after following these steps:

1. Open browser console (F12)
2. Check for errors
3. Verify image paths in console
4. Make sure both servers are running:
   - Backend: `http://localhost:5000`
   - Frontend: `http://localhost:3000`

## Check Servers Are Running

```powershell
# Check backend (should return health status)
curl http://localhost:5000/api/health

# Check frontend (should see HTML)
curl http://localhost:3000
```
