# Instrucciones para iniciar el servidor Django

## Windows:

1. Abre el explorador de archivos
2. Ve a la carpeta: `server/django_api`
3. Haz doble clic en `iniciar_servidor.bat`

O desde la terminal:
```bash
cd server\django_api
venv\Scripts\activate
python manage.py runserver
```

## El servidor debe estar corriendo en:
http://localhost:8000

## Credenciales del Administrador:
- Email: admin@mowi.com
- Contraseña: Admin123!

## Endpoints disponibles:
- POST http://localhost:8000/api/register/ - Registrar cliente
- POST http://localhost:8000/api/login/ - Iniciar sesión
- GET http://localhost:8000/admin/ - Panel de administración
