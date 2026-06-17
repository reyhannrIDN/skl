@echo off
title SKLIDN - Stopping All Services
color 0C

echo ===============================================
echo        SKLIDN - Stopping All Services
echo ===============================================
echo.

echo Menghentikan PHP (Backend)...
taskkill /f /im php.exe >nul 2>nul
if %errorlevel% equ 0 (
    echo   [OK] Backend dihentikan
) else (
    echo   [--] Backend tidak sedang berjalan
)

echo Menghentikan Node (Frontend)...
taskkill /f /im node.exe >nul 2>nul
if %errorlevel% equ 0 (
    echo   [OK] Frontend dihentikan
) else (
    echo   [--] Frontend tidak sedang berjalan
)

echo.
echo ===============================================
echo   Semua service SKLIDN telah dihentikan
echo ===============================================
echo.

timeout /t 3 /nobreak >nul
