@echo off
echo ========================================
echo MELLOPHI FASHION - Quick Setup
echo ========================================
echo.

REM Check if MySQL is running
echo [1/4] Checking MySQL...
sc query MySQL >nul 2>&1
if %errorlevel% neq 0 (
    echo WARNING: MySQL service not found or not running
    echo Please install MySQL and start the service
    echo Download from: https://dev.mysql.com/downloads/installer/
    echo Or install XAMPP: https://www.apachefriends.org/
    pause
    exit /b 1
)
echo ✓ MySQL is running

REM Check if Node.js is installed
echo.
echo [2/4] Checking Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed
    echo Please download and install from: https://nodejs.org/
    pause
    exit /b 1
)
echo ✓ Node.js is installed

REM Install backend dependencies if needed
echo.
echo [3/4] Checking backend dependencies...
cd backend
if not exist "node_modules\" (
    echo Installing backend dependencies...
    call npm install
    if %errorlevel% neq 0 (
        echo ERROR: Failed to install dependencies
        pause
        exit /b 1
    )
    echo ✓ Dependencies installed
) else (
    echo ✓ Dependencies already installed
)

REM Create .env if it doesn't exist
if not exist ".env" (
    echo.
    echo WARNING: .env file not found
    echo Please create backend\.env file with your database credentials
    echo See backend\.env.template for reference
    echo.
    pause
)

cd ..

echo.
echo [4/4] Setup complete!
echo.
echo ========================================
echo NEXT STEPS:
echo ========================================
echo.
echo 1. Configure backend\.env with your MySQL credentials
echo 2. Start the backend: cd backend ^&^& npm start
echo 3. Seed the database: cd backend ^&^& npm run seed
echo 4. Start the frontend: Double-click START.bat
echo.
echo Or run "SETUP_AND_START.bat" to do all steps automatically
echo.
pause
