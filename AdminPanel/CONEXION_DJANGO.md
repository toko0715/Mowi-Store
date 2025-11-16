# MOWI Store - Admin Panel
## Frontend conectado al Backend Django

✅ **Configuración completada** - CORS y REST Framework ya están configurados

### Instalación de CORS en Django (Ya instalado)

Si necesitas reinstalar django-cors-headers:

```bash
cd "d:\integrador\Mowi-Store\server\django_api"
pip install django-cors-headers
```

### Configuración en settings.py (Ya configurado)

El archivo `server/django_api/django_api/settings.py` ya tiene:

✅ `corsheaders` en INSTALLED_APPS
✅ `CorsMiddleware` en MIDDLEWARE
✅ CORS_ALLOWED_ORIGINS configurado
✅ CORS_ALLOW_CREDENTIALS = True
✅ REST_FRAMEWORK configurado con paginación y permisos

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

#### Test de Conexión
- `GET http://localhost:8000/api/dashboard/ping/` - Verificar que el servidor funciona

#### Productos (CRUD Completo)
- `GET http://localhost:8000/api/dashboard/productos/` - Listar todos los productos
- `POST http://localhost:8000/api/dashboard/productos/` - Crear producto
- `GET http://localhost:8000/api/dashboard/productos/{id}/` - Obtener producto específico
- `PUT http://localhost:8000/api/dashboard/productos/{id}/` - Actualizar producto
- `DELETE http://localhost:8000/api/dashboard/productos/{id}/` - Eliminar producto

#### Categorías (CRUD Completo)
- `GET http://localhost:8000/api/dashboard/categorias/` - Listar todas las categorías
- `POST http://localhost:8000/api/dashboard/categorias/` - Crear categoría
- `GET http://localhost:8000/api/dashboard/categorias/{id}/` - Obtener categoría específica
- `PUT http://localhost:8000/api/dashboard/categorias/{id}/` - Actualizar categoría
- `DELETE http://localhost:8000/api/dashboard/categorias/{id}/` - Eliminar categoría

#### Usuarios (CRUD Completo)
- `GET http://localhost:8000/api/dashboard/usuarios/` - Listar todos los usuarios
- `POST http://localhost:8000/api/dashboard/usuarios/` - Crear usuario
- `GET http://localhost:8000/api/dashboard/usuarios/{id}/` - Obtener usuario específico
- `PUT http://localhost:8000/api/dashboard/usuarios/{id}/` - Actualizar usuario
- `DELETE http://localhost:8000/api/dashboard/usuarios/{id}/` - Eliminar usuario

#### Pedidos (CRUD Completo)
- `GET http://localhost:8000/api/dashboard/pedidos/` - Listar todos los pedidos
- `POST http://localhost:8000/api/dashboard/pedidos/` - Crear pedido
- `GET http://localhost:8000/api/dashboard/pedidos/{id}/` - Obtener pedido específico
- `PUT http://localhost:8000/api/dashboard/pedidos/{id}/` - Actualizar pedido
- `DELETE http://localhost:8000/api/dashboard/pedidos/{id}/` - Eliminar pedido

#### Detalles de Pedido (CRUD Completo)
- `GET http://localhost:8000/api/dashboard/detalles/` - Listar todos los detalles
- `POST http://localhost:8000/api/dashboard/detalles/` - Crear detalle
- `GET http://localhost:8000/api/dashboard/detalles/{id}/` - Obtener detalle específico
- `PUT http://localhost:8000/api/dashboard/detalles/{id}/` - Actualizar detalle
- `DELETE http://localhost:8000/api/dashboard/detalles/{id}/` - Eliminar detalle

### El frontend está configurado para:

- ✅ Conectarse automáticamente al backend Django
- ✅ Mostrar datos reales de la base de datos
- ✅ Manejar errores de conexión
- ✅ Mostrar estado de carga mientras obtiene datos
- ✅ Actualizar las métricas del dashboard con datos reales

### Estructura de Datos

#### Producto
```json
{
  "id": 1,
  "nombre": "Laptop",
  "descripcion": "Laptop de alta gama",
  "categoria": 1,
  "categoria_nombre": "Tecnología",
  "precio": "1500.00",
  "stock": 50,
  "vendidos": 10,
  "imagen": "https://ejemplo.com/imagen.jpg",
  "activo": true,
  "fecha_creacion": "2024-01-01T00:00:00Z",
  "fecha_actualizacion": "2024-01-01T00:00:00Z"
}
```

#### Categoría
```json
{
  "id": 1,
  "nombre": "Tecnología",
  "descripcion": "Artículos tecnológicos"
}
```

#### Usuario
```json
{
  "id": 1,
  "nombre": "Juan Pérez",
  "email": "juan@ejemplo.com",
  "rol": "cliente",
  "activo": true,
  "fecha_registro": "2024-01-01T00:00:00Z"
}
```

#### Pedido
```json
{
  "id": 1,
  "usuario": {...},
  "total": "1500.00",
  "fecha_pedido": "2024-01-01T00:00:00Z",
  "estado": "pendiente",
  "metodo_pago": "tarjeta",
  "fecha_actualizacion": "2024-01-01T00:00:00Z"
}
```

### Notas Importantes

1. **Base de Datos**: El proyecto usa MySQL (puerto 3306)
   - Base de datos: `mowi_store`
   - Usuario: `root`
   - Contraseña: `evor0806`

2. **Proxy de Vite**: El frontend usa un proxy configurado en `vite.config.ts` para redirigir las peticiones `/api` a `http://localhost:8000`

3. **Estados de Pedido**: Los pedidos pueden tener los siguientes estados:
   - `pendiente`
   - `en_proceso`
   - `enviado`
   - `entregado`
   - `cancelado`

4. **Roles de Usuario**: Los usuarios pueden tener los siguientes roles:
   - `cliente`
   - `admin`
