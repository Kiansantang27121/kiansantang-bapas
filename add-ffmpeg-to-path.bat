@echo off
echo ========================================
echo   Add FFmpeg to PATH
echo ========================================
echo.
echo Checking if FFmpeg exists...

if not exist "C:\ffmpeg\bin\ffmpeg.exe" (
    echo.
    echo ERROR: FFmpeg not found at C:\ffmpeg\bin\ffmpeg.exe
    echo.
    echo Please:
    echo 1. Extract ffmpeg-release-essentials.zip to C:\
    echo 2. Rename folder to "ffmpeg"
    echo 3. Make sure C:\ffmpeg\bin\ffmpeg.exe exists
    echo.
    pause
    exit /b 1
)

echo FFmpeg found at C:\ffmpeg\bin\ffmpeg.exe
echo.
echo Adding to PATH...
echo.

setx PATH "%PATH%;C:\ffmpeg\bin" /M

if %errorlevel% neq 0 (
    echo.
    echo ERROR: Need Administrator rights!
    echo.
    echo Please:
    echo 1. Right-click this file
    echo 2. Select "Run as administrator"
    echo.
    pause
    exit /b 1
)

echo.
echo ========================================
echo   SUCCESS!
echo ========================================
echo.
echo FFmpeg has been added to PATH!
echo.
echo NEXT STEPS:
echo 1. Close ALL terminals and VSCode
echo 2. Open new terminal
echo 3. Test: ffmpeg -version
echo 4. Restart backend
echo.
echo ========================================
pause
