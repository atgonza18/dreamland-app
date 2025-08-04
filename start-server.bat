@echo off
echo ============================================================
echo Starting Dreamland Play Cafe PWA Server...
echo ============================================================
echo.
echo Choose server option:
echo 1. Python Server (Recommended if Python is installed)
echo 2. Node.js Server (Recommended if Node.js is installed)
echo 3. Exit
echo.
set /p choice="Enter your choice (1-3): "

if "%choice%"=="1" (
    echo Starting Python server...
    python server.py
) else if "%choice%"=="2" (
    echo Starting Node.js server...
    node server.js
) else if "%choice%"=="3" (
    exit
) else (
    echo Invalid choice. Please run the script again.
    pause
)