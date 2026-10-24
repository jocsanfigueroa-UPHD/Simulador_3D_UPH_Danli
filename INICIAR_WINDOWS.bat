@echo off
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
echo Instale Node.js para ejecutar este proyecto.
pause
exit /b 1
)
start "" http://localhost:8080
node servidor.cjs
pause
