# Backend Django - MOWI Store

## 🚀 Configuración Inicial (Primera vez)

### **Opción 1: Configuración Automática (Recomendada)**

Ejecuta el script de configuración que creará la base de datos y usuarios de prueba:

**Windows:**
```bash
cd server\django_api
setup_dev.bat
```

**Linux/Mac:**
```bash
cd server/django_api
python setup_dev.py
```

### **Opción 2: Configuración Manual**

```bash
cd server/django_api
python manage.py makemigrations
python manage.py migrate
python manage.py create_test_users
```

---

## 🏃 Iniciar el Servidor

### Windows:

**Opción rápida:**
1. Ve a la carpeta: `server/django_api`
2. Doble clic en `iniciar_servidor.bat`

**Desde terminal:**
```bash
cd server\django_api
python manage.py runserver
```

### Linux/Mac:
```bash
cd server/django_api
python manage.py runserver
```

El servidor estará disponible en: **http://localhost:8000**

---

## 👤 Usuarios de Prueba

Después de ejecutar la configuración inicial, tendrás estos usuarios:

### **Administrador:**
- Email: `admin@mowi.com`
- Password: `admin123`
- Acceso: Panel de administración (puerto 5173)

### **Cliente:**
- Email: `cliente@mowi.com`
- Password: `cliente123`
- Acceso: Vista de cliente (puerto 3000)

---

## 📡 API Endpoints

### Autenticación:
- `POST /api/register/` - Registrar nuevo usuario
- `POST /api/login/` - Iniciar sesión

### Admin Panel Django:
- `GET /admin/` - Panel de administración de Django

---

## 🛠️ Comandos Útiles

### Crear usuarios de prueba:
```bash
python manage.py create_test_users
```

### Crear superusuario personalizado:
```bash
python manage.py createsuperuser
```

### Ver usuarios existentes:
```bash
python manage.py shell
>>> from users.models import User
>>> User.objects.all()
```
