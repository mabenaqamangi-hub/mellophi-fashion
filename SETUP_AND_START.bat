@echo off
title MELLOPHI Fashion - Setup and Start
color 0A

echo.
echo ========================================
echo  MELLOPHI FASHION - COMPLETE SETUP
echo ========================================
echo.

REM Step 1: Setup
call SETUP.bat
if %errorlevel% neq 0 (
    echo Setup failed. Please fix errors and try again.
    pause
    exit /b 1
)

echo.
echo ========================================
echo  STARTING SERVICES
echo ========================================
echo.

REM Start backend in new window
echo Starting backend server...
start "MELLOPHI Backend" cmd /k "cd backend && npm start"
timeout /t 3 /nobreak >nul

echo ✓ Backend started on http://localhost:5000
echo.

REM Wait a bit for backend to initialize
echo Waiting for backend to initialize...
timeout /t 5 /nobreak >nul

echo.
echo ========================================
echo  SERVICES RUNNING
echo ========================================
echo.
echo Backend API: http://localhost:5000/api
echo.
echo To start the frontend, run START.bat
echo To seed products, run: cd backend ^&^& npm run seed
echo.
echo Press any key to open the website...
pause >nul

REM Start the website
call START.bat

exit
