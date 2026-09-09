@echo off
REM Cross-platform development runner for Windows

cd /d "%~dp0\.."

echo ==========================================
echo Starting Backend (Django)...
echo ==========================================
start "Django Backend" cmd /k "cd backend && (if exist venv\Scripts\activate.bat (call venv\Scripts\activate.bat) else if exist .venv\Scripts\activate.bat (call .venv\Scripts\activate.bat)) && python manage.py runserver 127.0.0.1:8000"

echo ==========================================
echo Starting Frontend (Vite)...
echo ==========================================
start "Vite Frontend" cmd /k "cd frontend && npm run dev"

echo Both servers launched in separate command windows.
