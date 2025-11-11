@echo off
echo ========================================
echo   KIANSANTANG
echo   Kios Antrian Santun dan Tanggap
echo   BAPAS Kelas I Bandung
echo ========================================
echo.
echo Starting all applications...
echo.

start "Backend API" cmd /k "cd backend && npm run dev"
timeout /t 3 /nobreak > nul

start "Registration App" cmd /k "cd registration-app && npm run dev"
timeout /t 2 /nobreak > nul

start "Operator App" cmd /k "cd operator-app && npm run dev"
timeout /t 2 /nobreak > nul

start "Display App" cmd /k "cd display-app && npm run dev"

echo.
echo ========================================
echo   All applications are starting!
echo ========================================
echo.
echo URLs:
echo   Backend API    : http://localhost:3000
echo   Pendaftaran    : http://localhost:5173
echo   Operator       : http://localhost:5174
echo   Display        : http://localhost:5175
echo   Home Dashboard : index.html
echo.
echo Login Credentials:
echo   Admin    : admin / admin123
echo   Operator : operator / operator123
echo   PK       : budiana / pk123456
echo   Petugas  : petugas_penghadapan / petugas123
echo.
echo ========================================
echo   KIANSANTANG is ready!
echo ========================================
echo.
pause
