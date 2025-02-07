@echo off
cd backend
start cmd /k "venv\Scripts\activate && python app.py"
cd ..
cd frontend
start cmd /k "npm start"
