# MELLOPHI Fashion Website - Startup Script
# This PowerShell script starts both backend and frontend servers

Write-Host "================================================" -ForegroundColor Cyan
Write-Host " MELLOPHI Fashion Website - Startup Script" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "This will start both backend and frontend servers" -ForegroundColor Yellow
Write-Host ""
Write-Host "Backend will run on:  http://localhost:5000" -ForegroundColor Green
Write-Host "Frontend will run on: http://localhost:3000" -ForegroundColor Green
Write-Host ""

# Function to check if port is in use
function Test-Port {
    param([int]$Port)
    $connection = Test-NetConnection -ComputerName localhost -Port $Port -InformationLevel Quiet -WarningAction SilentlyContinue
    return $connection
}

# Check if ports are already in use
Write-Host "Checking ports..." -ForegroundColor Yellow
if (Test-Port 5000) {
    Write-Host "⚠️  Port 5000 is already in use (Backend might be running)" -ForegroundColor Yellow
}
if (Test-Port 3000) {
    Write-Host "⚠️  Port 3000 is already in use (Frontend might be running)" -ForegroundColor Yellow
}
Write-Host ""

Write-Host "[1/3] Starting Backend Server..." -ForegroundColor Cyan
$backendPath = Join-Path $PSScriptRoot "backend"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$backendPath'; Write-Host 'MELLOPHI Backend Server' -ForegroundColor Green; npm start"

Start-Sleep -Seconds 3

Write-Host "[2/3] Installing 'serve' if needed..." -ForegroundColor Cyan
npm list -g serve *>$null
if ($LASTEXITCODE -ne 0) {
    npm install -g serve
}

Write-Host "[3/3] Starting Frontend Server..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot'; Write-Host 'MELLOPHI Frontend Server' -ForegroundColor Green; npx serve -p 3000"

Write-Host ""
Write-Host "================================================" -ForegroundColor Green
Write-Host " Servers Starting!" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Green
Write-Host ""
Write-Host "Backend:  http://localhost:5000" -ForegroundColor Green
Write-Host "Frontend: http://localhost:3000" -ForegroundColor Green
Write-Host ""
Write-Host "Opening website in browser in 5 seconds..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

Start-Process "http://localhost:3000"

Write-Host ""
Write-Host "✅ Website should open shortly!" -ForegroundColor Green
Write-Host "Keep both PowerShell windows open." -ForegroundColor Yellow
Write-Host ""
Write-Host "Press any key to exit this window..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
