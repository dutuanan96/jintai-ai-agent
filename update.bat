@echo off
chcp 65001 >nul
cd /d D:\JinTai_AI_Agent

echo ========================================
echo   JinTai AI Agent - Update
echo ========================================
echo.

:: Check git
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Git not found!
    echo Please install Git: https://git-scm.com/download/win
    pause
    exit /b 1
)

:: Pull latest code
echo Pulling latest code...
git pull

:: Install dependencies
echo.
echo Installing dependencies...
pip install -r requirements.txt

echo.
echo ========================================
echo   Update complete!
echo   Restart machine to apply changes.
echo ========================================
pause
