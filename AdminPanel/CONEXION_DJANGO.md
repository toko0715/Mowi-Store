# MOWI Store - Admin Panel
## Frontend conectado al Backend Django

### Instalación de CORS en Django

Para conectar el frontend con el backend Django, necesitas instalar django-cors-headers:

```bash
cd "d:\integrador\Mowi-Store\server\django_api"
pip install django-cors-headers
```

### Configuración en settings.py

Agrega estas líneas al archivo `server/django_api/django_api/settings.py`:

```python
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'corsheaders',  
    'dashboard.apps.DashboardConfig',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware', 
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

# AGREGAR AL FINAL DEL ARCHIVO
CORS_ALLOWED_ORIGINS = [
    'http://localhost:5173',
    'http://localhost:3000',
    'http://localhost:5174',
]

CORS_ALLOW_CREDENTIALS = True
```

### Para ejecutar el proyecto:

1. **Backend Django:**
```bash
cd "d:\integrador\Mowi-Store\server\django_api"
python manage.py runserver
```

2. **Frontend React:**
```bash
cd "d:\integrador\Mowi-Store\AdminPanel"
npm run dev
```

### Endpoints disponibles:

- `http://localhost:8000/api/dashboard/ping/` - Test de conexión
- `http://localhost:8000/api/dashboard/productos/` - CRUD de productos
- `http://localhost:8000/api/dashboard/categorias/` - CRUD de categorias
- `http://localhost:8000/api/dashboard/usuarios/` - CRUD de usuarios
- `http://localhost:8000/api/dashboard/pedidos/` - CRUD de pedidos
- `http://localhost:8000/api/dashboard/detalles/` - CRUD de detalles

### El frontend está configurado para:

- ✅ Conectarse automáticamente al backend Django
- ✅ Mostrar datos reales de la base de datos
- ✅ Manejar errores de conexión
- ✅ Mostrar estado de carga mientras obtiene datos
- ✅ Actualizar las métricas del dashboard con datos reales
