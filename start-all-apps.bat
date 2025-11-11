@echo off
chcp 65001 >nul
cls

echo ========================================
echo   🎫 KIANSANTANG - Start All Apps
echo   Kios Antrian Santun dan Tanggap
echo   BAPAS Kelas I Bandung
echo ========================================
echo.

echo 🚀 Starting Backend API (Port 3000)...
start "KIANSANTANG - Backend API" cmd /k "cd backend && npm run dev"
timeout /t 3 /nobreak >nul

echo 🚀 Starting Pengguna Layanan (Port 5173)...
start "KIANSANTANG - Pengguna Layanan" cmd /k "cd registration-app && npm run dev"
timeout /t 2 /nobreak >nul

echo 🚀 Starting Panel Admin (Port 5174)...
start "KIANSANTANG - Panel Admin" cmd /k "cd operator-app && npm run dev"
timeout /t 2 /nobreak >nul

echo 🚀 Starting Display (Port 5175)...
start "KIANSANTANG - Display" cmd /k "cd display-app && npm run dev"
timeout /t 2 /nobreak >nul

echo 🚀 Starting Petugas (Port 5176)...
start "KIANSANTANG - Petugas" cmd /k "cd petugas-app && npm run dev"
timeout /t 2 /nobreak >nul

echo.
echo ========================================
echo   ✅ All Applications Started!
echo ========================================
echo.
echo 📱 Access URLs:
echo   • Backend API:       http://localhost:3000
echo   • Pengguna Layanan:  http://localhost:5173
echo   • Panel Admin:       http://localhost:5174
echo   • Display:           http://localhost:5175
echo   • Petugas:           http://localhost:5176
echo.
echo 🏠 Home Dashboard: index.html
echo.
echo 💡 Tip: Buka index.html di browser untuk akses semua aplikasi
echo.
echo ========================================
pause
