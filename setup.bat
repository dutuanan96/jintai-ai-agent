@echo off
chcp 65001 >nul
cd /d "%~dp0"

echo ========================================
echo    JinTai AI Agent - Setup
echo ========================================
echo.

:: Check Python
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Python not found!
    echo.
    echo Please install Python first:
    echo 1. Go to: https://www.python.org/downloads/
    echo 2. Click "Download Python install manager"
    echo 3. Run the installer
    echo 4. IMPORTANT: Check "Add Python to PATH"
    echo 5. Click "Install Now"
    echo 6. Restart your computer
    echo 7. Run this setup.bat again
    echo.
    pause
    exit /b 1
)

:: Check Python version
for /f "tokens=2" %%a in ('python --version 2^>^&1') do set PYVER=%%a
echo [1/3] Python %PYVER% found!
echo.

:: Install dependencies
echo [2/3] Installing dependencies (this may take 1-2 minutes)...
pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Failed to install dependencies!
    echo Please check your internet connection and try again.
    pause
    exit /b 1
)
echo [2/3] Dependencies installed!
echo.

:: Copy to Startup
echo [3/3] Adding to Startup folder (auto-start on boot)...
copy "%~dp0jintai-agent.vbs" "%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup\jintai-agent.vbs" >nul 2>&1
if %errorlevel% equ 0 (
    echo [3/3] Added to Startup!
) else (
    echo [3/3] Warning: Could not add to Startup (run as Administrator)
)
echo.

echo ========================================
echo    Setup complete!
echo ========================================
echo.
echo Next steps:
echo 1. Restart your computer
echo 2. Server will auto-run on boot
echo 3. Open browser: http://localhost:8001
echo 4. Click Settings icon and enter your API key
echo.
echo To stop server: Task Manager - find "python.exe" - End Task
echo.
pause
