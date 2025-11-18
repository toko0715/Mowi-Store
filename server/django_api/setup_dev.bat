@echo off
echo ============================================================
echo   CONFIGURACION INICIAL - MOWI Store Backend
echo ============================================================
echo.

echo [1/3] Ejecutando migraciones...
python manage.py makemigrations
python manage.py migrate

echo.
echo [2/3] Creando usuarios de prueba...
python manage.py create_test_users

echo.
echo ============================================================
echo   CONFIGURACION COMPLETADA
echo ============================================================
echo.
echo Credenciales de acceso:
echo   Admin:   admin@mowi.com / admin123
echo   Cliente: cliente@mowi.com / cliente123
echo.
echo Proximos pasos:
echo   1. Inicia el servidor: python manage.py runserver
echo   2. Inicia el frontend: cd ../../client/react-client ^&^& npm start
echo   3. Inicia AdminPanel: cd ../../AdminPanel ^&^& npm run dev
echo.
pause
