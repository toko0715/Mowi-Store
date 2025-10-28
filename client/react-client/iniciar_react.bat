@echo off
echo ========================================
echo Iniciando aplicacion React - MOWI
echo ========================================
echo.

cd /d "%~dp0"

echo Instalando dependencias (si es necesario)...
call npm install

echo.
echo Iniciando React en http://localhost:3000
echo.
echo IMPORTANTE: El navegador se abrira automaticamente
echo Para detener presiona Ctrl+C en esta ventana
echo.
echo ========================================

npm start
