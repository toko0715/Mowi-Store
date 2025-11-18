@echo off
echo ========================================
echo Iniciando servidor Django para MOWI
echo ========================================
echo.

cd /d "%~dp0"

echo Activando entorno virtual...
call venv\Scripts\activate.bat

echo.
echo Iniciando servidor en http://localhost:8000
echo.
echo IMPORTANTE: Deja esta ventana abierta mientras usas la aplicacion
echo Para detener el servidor presiona Ctrl+C
echo.
echo ========================================

python manage.py runserver
