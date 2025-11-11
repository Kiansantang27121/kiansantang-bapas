@echo off
cls

echo ========================================
echo   KIANSANTANG - Start All Apps
echo   Kios Antrian Santun dan Tanggap
echo   BAPAS Kelas I Bandung
echo ========================================
echo.

echo [1/5] Starting Backend API (Port 3000)...
start "Backend API" cmd /k "cd /d %~dp0backend && npm run dev"
timeout /t 5 /nobreak >nul

echo [2/5] Starting Pengguna Layanan (Port 5173)...
start "Pengguna Layanan" cmd /k "cd /d %~dp0registration-app && npm run dev -- --port 5173"
timeout /t 3 /nobreak >nul

echo [3/5] Starting Panel Admin (Port 5174)...
start "Panel Admin" cmd /k "cd /d %~dp0operator-app && npm run dev -- --port 5174"
timeout /t 3 /nobreak >nul

echo [4/5] Starting Display (Port 5175)...
start "Display" cmd /k "cd /d %~dp0display-app && npm run dev -- --port 5175"
timeout /t 3 /nobreak >nul

echo [5/5] Starting Petugas (Port 5176)...
start "Petugas" cmd /k "cd /d %~dp0petugas-app && npm run dev -- --port 5176"
timeout /t 2 /nobreak >nul

echo.
echo ========================================
echo   All Applications Started!
echo ========================================
echo.
echo Access URLs:
echo   - Backend API:       http://localhost:3000
echo   - Pengguna Layanan:  http://localhost:5173
echo   - Panel Admin:       http://localhost:5174
echo   - Display:           http://localhost:5175
echo   - Petugas:           http://localhost:5176
echo.
echo Home Dashboard: index.html
echo.
echo ========================================
echo.
echo Tunggu 10-15 detik untuk semua aplikasi siap...
echo Kemudian buka index.html di browser
echo.
pause
