@echo off
REM Frontend setup script for Windows

cd /d "%~dp0\..\frontend"

echo ==========================================
echo Setting up Frontend on Windows...
echo ==========================================

if exist node_modules_win (
    if not exist node_modules (
        ren node_modules_win node_modules
    )
)

npm install
echo Frontend setup complete.
