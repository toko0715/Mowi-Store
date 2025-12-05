# Mowi-Store – Proyecto Integrador

Mowi-Store es una plataforma de comercio electrónico integral que combina múltiples tecnologías para ofrecer una experiencia completa tanto para el cliente final como para la administración del negocio. El sistema adopta una arquitectura híbrida con dos backends (Django y Spring Boot), dos frontends en React, integración de Inteligencia Artificial (Gemini) y pasarela de pagos con Stripe.

---

## 🚀 Estructura del Proyecto

El proyecto está organizado en cuatro módulos principales:

### `AdminPanel/`
- Panel administrativo moderno construido con React + Vite.  
- Permite la gestión de productos, usuarios, pedidos y visualización de métricas.

### `client/react-client/`
- Tienda online para los clientes, construida con React (Create React App).  
- Incluye catálogo, carrito, historial de pedidos y flujo de pago.

### `server/django_api/`
- Backend principal encargado de la lógica de negocio administrativa, gestión de usuarios y base de datos relacional.  
- Construido con Django REST Framework.

### `server/sboot_api/`
- API de servicios especializados, responsable de la integración con Google Gemini AI y el procesamiento de pagos con Stripe.  
- Implementado con Java Spring Boot.

---

## 🛠️ Tecnologías Utilizadas

- **Frontend:** React 19, Vite, Tailwind/CSS, Recharts, Axios.  
- **Backend:** Python (Django 5), Java 17 (Spring Boot 3.1.5).  
- **Base de datos:** MySQL.  
- **Integraciones:** Google Cloud AI Platform (Gemini), Stripe Payments.

---

## 🎯 Objetivo del Proyecto

Mowi-Store busca proporcionar una solución de e‑commerce adaptable para supermercados de tamaño medio, priorizando:

- Escalabilidad mediante separación de responsabilidades entre Django, Spring Boot y los frontends.  
- Extensibilidad a través de módulos de IA y pagos desacoplados.  
- Experiencia de usuario consistente en la tienda cliente y el panel administrativo.

---

## 🧩 Arquitectura General

**Capa de presentación:**

- AdminPanel (React + Vite) para usuarios administrativos.  
- `client/react-client` (React) para clientes finales.

**Capa de servicios:**

- Django API para administración, usuarios, inventario y pedidos.  
- Spring Boot API para búsqueda inteligente con IA y procesamiento de pagos.

**Capa de datos:**

- MySQL como almacén relacional para la información de negocio.

**Diagrama lógico simplificado:**

<img width="210" height="139" alt="image" src="https://github.com/user-attachments/assets/51b3b776-aedd-4749-bb86-dc8f5ecacb92" />

---

## 📋 Pre‑requisitos

Antes de iniciar, asegúrate de contar con:

- Node.js v18 o superior y npm.  
- Python 3.10 o superior.  
- Java JDK 17.  
- Servidor MySQL accesible (puerto típico 3306) con una base de datos creada para el proyecto (por ejemplo, `mowi_store`).  
- Variables de entorno configuradas para:
  - Credenciales de MySQL.
  - Claves de Stripe.
  - Claves de Google Cloud / Gemini.



---

## ⚙️ Configuración y Ejecución

### 1. Base de Datos (MySQL)

1. Crear la base de datos, por ejemplo: `mowi_store`.  
2. Configurar usuario, contraseña, host y puerto en:
   - `server/django_api` (settings / variables de entorno).  
   - `server/sboot_api` (`application.properties` / `application.yml` o variables de entorno).

---

### 2. Backend 1: Django API (Gestión y Datos)

Servicio que alimenta principalmente al Admin Panel.

cd server/django_api

1. (Opcional) Crear entorno virtual

    python -m venv venv

    Windows: venv\Scripts\activate

    Linux/Mac: source venv/bin/activate

2. Instalar dependencias

   pip install -r requirements.txt

3. Migraciones a la BD

   python manage.py migrate

4. Iniciar servidor (http://localhost:8000)

   python manage.py runserver

---

### 3. Backend 2: Spring Boot API (IA y Pagos)

Servicio orientado a búsqueda inteligente y transacciones de pago.

cd server/sboot_api

Ejecutar con Maven Wrapper (puerto por defecto 8080)

./mvnw spring-boot:run

En Windows CMD:

mvnw.cmd spring-boot:run

Configurar en `application.properties` / `application.yml` o variables de entorno:

- URL y credenciales de MySQL.  
- Claves de Stripe.  
- Claves de Gemini / Google Cloud AI.

---

### 4. Frontend: Admin Panel

Panel de control para administradores.

cd AdminPanel

1. Instalar dependencias

npm install

2. Iniciar en modo desarrollo

npm run dev

Por defecto, el Admin Panel se conecta a `http://localhost:8000` (Django API) mediante proxy y CORS.

---

### 5. Frontend: Tienda Cliente (Client)

Interfaz de compra para usuarios finales.

cd client/react-client

1. Instalar dependencias
npm install

2. Iniciar aplicación
npm start

La app cliente consumirá las APIs de Django y Spring Boot según las URLs configuradas en sus archivos `.env`.

---

## ✅ Funcionalidades Principales

### Panel de Administración

- Dashboard con KPIs y gráficos de ventas.  
- Gestión de inventario: CRUD de productos y categorías.  
- Gestión de pedidos: seguimiento de estados (pendiente, enviado, entregado).

### Tienda Cliente

- Búsqueda inteligente con Gemini AI para recomendaciones o búsquedas semánticas.  
- Catálogo navegable con filtros básicos.  
- Carrito de compras y proceso de checkout.  
- Pagos seguros con Stripe (modo prueba o producción, según configuración).

---

## 👥 Equipo

- Backend / IA: Jheremy Strong Delgado  
- Frontend & Mobile: Jamir Alexander Venturo  
- Backend & Admin Platform: Enrique Valois Oporto  
- QA & Documentación: Miguel Ángel Carasas  

---

## 📌 Roadmap

- Integrar pasarela de pagos en entorno producción.  
- Extender el módulo de IA con recomendaciones personalizadas.  
- Añadir notificaciones push (web y móvil).  
- Automatizar CI/CD con pipelines (por ejemplo, GitHub Actions).

