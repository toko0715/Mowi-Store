import axios from 'axios';

// URL base del API de Django
const DJANGO_API_URL = process.env.REACT_APP_DJANGO_API_URL || 'http://localhost:8000/api';

// Crear instancia de axios para Django
const djangoApi = axios.create({
  baseURL: DJANGO_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar tokens JWT
djangoApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores
djangoApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// ==================== DIRECCIONES ====================
export const direccionesAPI = {
  // Listar direcciones del usuario
  listar: () => {
    return djangoApi.get('/direcciones/');
  },

  // Crear nueva dirección
  crear: (direccion) => {
    return djangoApi.post('/direcciones/', direccion);
  },

  // Obtener dirección por ID
  obtenerPorId: (id) => {
    return djangoApi.get(`/direcciones/${id}/`);
  },

  // Actualizar dirección
  actualizar: (id, direccion) => {
    return djangoApi.put(`/direcciones/${id}/`, direccion);
  },

  // Actualizar parcialmente dirección
  actualizarParcial: (id, direccion) => {
    return djangoApi.patch(`/direcciones/${id}/`, direccion);
  },

  // Eliminar dirección
  eliminar: (id) => {
    return djangoApi.delete(`/direcciones/${id}/`);
  },
};

// ==================== WISHLIST ====================
export const wishlistAPI = {
  // Listar items de wishlist
  listar: () => {
    return djangoApi.get('/wishlist/');
  },

  // Agregar producto a wishlist
  agregar: (productoId) => {
    return djangoApi.post('/wishlist/', { producto_id: productoId });
  },

  // Eliminar producto de wishlist
  eliminar: (productoId) => {
    return djangoApi.delete(`/wishlist/${productoId}/`);
  },

  // Verificar si un producto está en wishlist
  verificar: (productoId) => {
    return djangoApi.get(`/wishlist/check/${productoId}/`);
  },
};

export default djangoApi;


