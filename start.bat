@echo off
title SKLIDN - Auto Start
color 0A

echo ===============================================
echo        SKLIDN - Starting All Services
echo ===============================================
echo.

:: Check if PHP is available
where php >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] PHP tidak ditemukan! Pastikan PHP sudah terinstall dan ada di PATH.
    pause
    exit /b 1
)

:: Check if Node/npm is available
where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] npm tidak ditemukan! Pastikan Node.js sudah terinstall dan ada di PATH.
    pause
    exit /b 1
)

echo [1/4] Checking backend dependencies...
if not exist "backend\vendor" (
    echo       Installing composer dependencies...
    cd backend
    composer install
    cd ..
)

echo [2/4] Checking frontend dependencies...
if not exist "frontend\node_modules" (
    echo       Installing npm dependencies...
    cd frontend
    npm install
    cd ..
)

echo [3/4] Starting Backend (Laravel) on http://127.0.0.1:8000 ...
start "SKLIDN Backend" cmd /k "cd /d %~dp0backend && php artisan serve"

:: Wait a moment for backend to start
timeout /t 3 /nobreak >nul

echo [4/4] Starting Frontend (Vite) on http://127.0.0.1:5173 ...
start "SKLIDN Frontend" cmd /k "cd /d %~dp0frontend && npm run dev"

:: Wait a moment for frontend to start
timeout /t 5 /nobreak >nul

echo.
echo ===============================================
echo   SKLIDN berhasil dijalankan!
echo ===============================================
echo.
echo   Backend  : http://127.0.0.1:8000
echo   Frontend : http://127.0.0.1:5173
echo.
echo   Buka browser: http://127.0.0.1:5173
echo.
echo   Untuk menghentikan, tutup window Backend dan Frontend
echo ===============================================
echo.

:: Auto open browser
start http://127.0.0.1:5173

echo Tekan tombol apa saja untuk menutup window ini...
pause >nul
