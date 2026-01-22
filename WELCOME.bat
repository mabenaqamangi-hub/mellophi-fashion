@echo off
title MELLOPHI Fashion - Welcome
color 0B

cls
echo.
echo ╔══════════════════════════════════════════════════════════════════╗
echo ║                                                                  ║
echo ║           🎉 MELLOPHI FASHION - WEBSITE READY! 🎉                ║
echo ║                                                                  ║
echo ║                    95%% COMPLETE - ALMOST THERE!                  ║
echo ║                                                                  ║
echo ╚══════════════════════════════════════════════════════════════════╝
echo.
echo.
echo ┌─────────────────────────────────────────────────────────────────┐
echo │  📋 FINAL 5%% - WHAT'S LEFT TO DO                                │
echo └─────────────────────────────────────────────────────────────────┘
echo.
echo   1. Install MySQL Database (10 min)
echo   2. Configure Backend .env (5 min)
echo   3. Seed Database with Products (2 min)
echo   4. Test Locally (10 min)
echo   5. Deploy to Hosting (1-2 hours)
echo.
echo ┌─────────────────────────────────────────────────────────────────┐
echo │  📖 IMPORTANT DOCUMENTS                                          │
echo └─────────────────────────────────────────────────────────────────┘
echo.
echo   ⭐ READ_ME_FIRST.txt ................ Visual checklist
echo   ⭐ START_HERE.md .................... Complete summary
echo   ⭐ QUICK_REFERENCE.md ............... Quick commands
echo   ⭐ FINAL_DEPLOYMENT_GUIDE.md ........ How to deploy
echo   ⭐ PRE_LAUNCH_CHECKLIST.md .......... Before launch
echo.
echo ┌─────────────────────────────────────────────────────────────────┐
echo │  🚀 WHAT DO YOU WANT TO DO?                                      │
echo └─────────────────────────────────────────────────────────────────┘
echo.
echo   [1] Open READ_ME_FIRST.txt (Start here!)
echo   [2] Open START_HERE.md (Detailed guide)
echo   [3] Run SETUP.bat (Install dependencies)
echo   [4] Open project folder in Explorer
echo   [5] Exit
echo.
set /p choice="Enter your choice (1-5): "

if "%choice%"=="1" (
    notepad READ_ME_FIRST.txt
    goto menu
)
if "%choice%"=="2" (
    start START_HERE.md
    goto menu
)
if "%choice%"=="3" (
    echo.
    echo Running setup...
    call SETUP.bat
    pause
    goto menu
)
if "%choice%"=="4" (
    explorer .
    goto menu
)
if "%choice%"=="5" (
    exit
)

:menu
cls
echo.
echo ┌─────────────────────────────────────────────────────────────────┐
echo │  📚 MORE OPTIONS                                                 │
echo └─────────────────────────────────────────────────────────────────┘
echo.
echo   [1] Open documentation folder
echo   [2] Open backend folder
echo   [3] Start backend server
echo   [4] Start website (after backend is running)
echo   [5] View all guides
echo   [6] Exit
echo.
set /p choice2="Enter your choice (1-6): "

if "%choice2%"=="1" (
    explorer .
)
if "%choice2%"=="2" (
    explorer backend
)
if "%choice2%"=="3" (
    echo.
    echo Starting backend...
    echo Make sure MySQL is running first!
    pause
    start "MELLOPHI Backend" cmd /k "cd backend && npm start"
)
if "%choice2%"=="4" (
    call START.bat
)
if "%choice2%"=="5" (
    echo.
    echo Available Guides:
    echo ─────────────────
    echo.
    dir *.md /b
    echo.
    pause
    goto menu
)
if "%choice2%"=="6" (
    exit
)

goto menu
