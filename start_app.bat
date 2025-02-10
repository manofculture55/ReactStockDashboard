@echo off
title Stock Dashboard

:: Start Flask Backend
echo Starting Flask backend...
cd /d "D:\reactjs\backend"

:: Check if virtual environment exists, if not, create it
if not exist venv (
    echo Creating virtual environment...
    python -m venv venv
)

:: Activate virtual environment
call venv\Scripts\activate

:: Install required Python libraries
echo Installing Flask dependencies...
pip install --upgrade pip
pip install -r requirements.txt

start cmd /k "venv\Scripts\activate && python app.py"

:: Start React Frontend
echo Starting React frontend...
cd /d "D:\reactjs\frontend"

:: Check if node_modules exists, if not, install dependencies
if not exist node_modules (
    echo Installing React dependencies...
    npm install
)

start cmd /k "npm start"

echo All processes started successfully!
exit
