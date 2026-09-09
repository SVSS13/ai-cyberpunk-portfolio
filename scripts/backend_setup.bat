@echo off
REM Backend setup script for Windows

cd /d "%~dp0\..\backend"

echo ==========================================
echo Setting up Django Backend on Windows...
echo ==========================================

if not exist venv (
    echo Creating virtual environment...
    python -m venv venv
)

call venv\Scripts\activate.bat
pip install -r requirements.txt
python manage.py migrate
echo Backend setup complete.
