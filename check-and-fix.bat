@echo off
echo ========================================
echo   KIANSANTANG - Check and Fix
echo   Kios Antrian Santun dan Tanggap
echo ========================================
echo.

echo Checking Node.js installation...
node --version
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js from https://nodejs.org
    pause
    exit /b 1
)
echo ✓ Node.js is installed
echo.

echo Checking npm installation...
npm --version
if %errorlevel% neq 0 (
    echo ERROR: npm is not installed!
    pause
    exit /b 1
)
echo ✓ npm is installed
echo.

echo ========================================
echo   Checking and fixing dependencies
echo ========================================
echo.

echo [1/4] Checking Backend...
cd backend
if not exist node_modules (
    echo Installing backend dependencies...
    call npm install
) else (
    echo ✓ Backend dependencies OK
)
cd ..
echo.

echo [2/4] Checking Registration App...
cd registration-app
if not exist node_modules (
    echo Installing registration-app dependencies...
    call npm install
) else (
    echo ✓ Registration App dependencies OK
)
cd ..
echo.

echo [3/4] Checking Operator App...
cd operator-app
if not exist node_modules (
    echo Installing operator-app dependencies...
    call npm install
) else (
    echo ✓ Operator App dependencies OK
)
cd ..
echo.

echo [4/4] Checking Display App...
cd display-app
if not exist node_modules (
    echo Installing display-app dependencies...
    call npm install
) else (
    echo ✓ Display App dependencies OK
)
cd ..
echo.

echo ========================================
echo   Checking Backend Configuration
echo ========================================
echo.

cd backend
if not exist .env (
    echo Creating .env file...
    (
        echo PORT=3000
        echo JWT_SECRET=kiansantang-secret-key-change-in-production
        echo NODE_ENV=development
    ) > .env
    echo ✓ .env file created
) else (
    echo ✓ .env file exists
)
cd ..
echo.

echo ========================================
echo   Checking Database
echo ========================================
echo.

cd backend
if not exist bapas.db (
    echo Database will be created on first run
) else (
    echo ✓ Database exists
)
cd ..
echo.

echo ========================================
echo   System Check Complete!
echo ========================================
echo.
echo All checks passed! Your system is ready.
echo.
echo Next steps:
echo   1. Run start-all.bat to start all applications
echo   2. Open index.html for home dashboard
echo   3. Access applications at:
echo      - Backend: http://localhost:3000
echo      - Registration: http://localhost:5173
echo      - Operator: http://localhost:5174
echo      - Display: http://localhost:5175
echo.
echo ========================================
pause
