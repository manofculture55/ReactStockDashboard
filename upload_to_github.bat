@echo on
@echo Running Git commands to upload project to GitHub...

cd /d "%~dp0"

echo Initializing Git...
git init
timeout /t 10 >nul

echo Adding all files...
git add .
timeout /t 10 >nul

set /p commitMsg="Enter commit message: "
git commit -m "%commitMsg%"
timeout /t 10 >nul

echo Setting remote repository...
git remote add origin https://github.com/manofculture55/ReactStockDashboard.git
timeout /t 10 >nul

echo Pushing to GitHub...
git branch -M main
timeout /t 10 >nul

git push -u origin main
timeout /t 10 >nul

echo Upload completed!
pause
