@echo off
echo ========================================
echo Installing BAPAS Bandung System
echo ========================================
echo.

echo [1/4] Installing Backend Dependencies...
cd backend
call npm install
if %errorlevel% neq 0 (
    echo Error installing backend dependencies!
    pause
    exit /b %errorlevel%
)
echo Backend dependencies installed successfully!
echo.

echo [2/4] Installing Registration App Dependencies...
cd ..\registration-app
call npm install
if %errorlevel% neq 0 (
    echo Error installing registration app dependencies!
    pause
    exit /b %errorlevel%
)
echo Registration app dependencies installed successfully!
echo.

echo [3/4] Installing Operator App Dependencies...
cd ..\operator-app
call npm install
if %errorlevel% neq 0 (
    echo Error installing operator app dependencies!
    pause
    exit /b %errorlevel%
)
echo Operator app dependencies installed successfully!
echo.

echo [4/4] Installing Display App Dependencies...
cd ..\display-app
call npm install
if %errorlevel% neq 0 (
    echo Error installing display app dependencies!
    pause
    exit /b %errorlevel%
)
echo Display app dependencies installed successfully!
echo.

cd ..

echo ========================================
echo Installation Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Create .env file in backend folder
echo 2. Copy content from backend/.env.example
echo 3. Run START-ALL.bat to start all applications
echo.
echo Default login: admin / admin123
echo.
pause
