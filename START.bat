@echo off
echo ================================================
echo  MELLOPHI Fashion Website - Startup Script
echo ================================================
echo.
echo This will start both backend and frontend servers
echo.
echo Backend will run on: http://localhost:5000
echo Frontend will run on: http://localhost:3000
echo.
echo Press any key to continue or Ctrl+C to cancel...
pause >nul

echo.
echo [1/2] Starting Backend Server...
start "MELLOPHI Backend" cmd /k "cd backend && npm start"

timeout /t 3 /nobreak >nul

echo [2/2] Starting Frontend Server...
echo.
echo Installing 'serve' if needed...
call npm install -g serve >nul 2>&1

start "MELLOPHI Frontend" cmd /k "npx serve -p 3000"

timeout /t 2 /nobreak >nul

echo.
echo ================================================
echo  Servers Starting!
echo ================================================
echo.
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Opening website in browser...
timeout /t 5 /nobreak >nul

start http://localhost:3000

echo.
echo Website should open shortly!
echo Keep both terminal windows open.
echo.
echo Press any key to exit this window...
pause >nul
