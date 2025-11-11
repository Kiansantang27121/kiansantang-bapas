@echo off
echo ========================================
echo Push KIANSANTANG to GitHub
echo ========================================
echo.

cd /d D:\kiansantang\bapas-bandung

echo Adding remote repository...
git remote add origin https://github.com/asiansantang-bapas/kiansantang-bapas.git

echo.
echo Setting main branch...
git branch -M main

echo.
echo Pushing to GitHub...
git push -u origin main

echo.
echo ========================================
echo Push completed!
echo ========================================
pause
