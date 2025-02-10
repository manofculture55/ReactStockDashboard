@echo off
cd /d "%~dp0"

:: Check if Git is installed
where git >nul 2>nul
if %errorlevel% neq 0 (
    echo Git is not installed. Please install Git first.
    pause
    exit /b
)

:: Initialize Git if not already initialized
if not exist ".git" (
    echo Initializing Git...
    git init
    timeout /t 10
    
    echo Setting main branch...
    git branch -M main
    timeout /t 10

    echo Adding remote repository...
    git remote add origin https://github.com/manofculture55/ReactStockDashboard.git
    timeout /t 10
)

:: Add all files to staging
echo Staging all files...
git add .
timeout /t 10

:: Ask for commit message
set /p commitMessage="Enter commit message: "

:: Commit the changes
echo Committing changes...
git commit -m "%commitMessage%"
timeout /t 10

:: Push to the main branch
echo Pushing to GitHub...
git push -u origin main
timeout /t 10

echo.
echo Project successfully uploaded to GitHub!
pause
