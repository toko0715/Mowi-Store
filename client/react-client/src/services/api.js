import axios from 'axios';

// URL base del API de Spring Boot
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

// Crear instancia de axios con configuración base
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar tokens si están disponibles
api.interceptors.request.use(
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
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado o inválido
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// ==================== PRODUCTOS ====================
export const productosAPI = {
  // Listar todos los productos
  listar: (params = {}) => {
    return api.get('/productos', { params });
  },

  // Obtener producto por ID
  obtenerPorId: (id) => {
    return api.get(`/productos/${id}`);
  },

  // Buscar productos
  buscar: (busqueda) => {
    return api.get('/productos', { params: { busqueda } });
  },

  // Productos por categoría
  porCategoria: (categoriaId) => {
    return api.get('/productos', { params: { categoriaId } });
  },

  // Productos más vendidos
  topVendidos: () => {
    return api.get('/productos/top/vendidos');
  },
};

// ==================== CATEGORÍAS ====================
export const categoriasAPI = {
  // Listar todas las categorías
  listar: () => {
    return api.get('/categorias');
  },

  // Obtener categoría por ID
  obtenerPorId: (id) => {
    return api.get(`/categorias/${id}`);
  },
};

// ==================== CARRITO ====================
export const carritoAPI = {
  // Obtener carrito del usuario
  obtener: (usuarioId) => {
    return api.get('/carrito', { params: { usuarioId } });
  },

  // Agregar producto al carrito
  agregar: (usuarioId, productoId, cantidad) => {
    return api.post('/carrito/agregar', null, {
      params: { usuarioId, productoId, cantidad },
    });
  },

  // Actualizar cantidad de producto
  actualizar: (usuarioId, productoId, cantidad) => {
    return api.put('/carrito/actualizar', null, {
      params: { usuarioId, productoId, cantidad },
    });
  },

  // Eliminar producto del carrito
  eliminar: (usuarioId, itemId) => {
    return api.delete(`/carrito/eliminar/${itemId}`, {
      params: { usuarioId },
    });
  },

  // Limpiar carrito
  limpiar: (usuarioId) => {
    return api.delete('/carrito/limpiar', { params: { usuarioId } });
  },
};

// ==================== PEDIDOS ====================
export const pedidosAPI = {
  // Listar pedidos del usuario
  listar: (usuarioId) => {
    return api.get('/pedidos', { params: { usuarioId } });
  },

  // Obtener detalle del pedido
  obtenerDetalle: (id) => {
    return api.get(`/pedidos/${id}`);
  },

  // Crear pedido desde carrito (sin cupones)
  crearDesdeCarrito: (usuarioId, metodoPago) => {
    const params = { usuarioId, metodoPago };
    return api.post('/pedidos/pago', null, { params });
  },

  // Actualizar estado del pedido
  actualizarEstado: (id, nuevoEstado) => {
    return api.put(`/pedidos/${id}/estado`, null, {
      params: { nuevoEstado },
    });
  },
};

// ==================== PAGOS ====================
export const pagosAPI = {
  // Crear Payment Intent de Stripe
  crearPaymentIntent: (pedidoId, monto) => {
    return api.post('/pagos/crear-payment-intent', {
      pedidoId,
      monto,
    });
  },

  // Confirmar pago
  confirmar: (paymentIntentId) => {
    return api.post('/pagos/confirmar', {
      paymentIntentId,
    });
  },

  // Obtener estado del pago
  obtenerEstado: (pedidoId) => {
    return api.get(`/pagos/estado/${pedidoId}`);
  },
};

// ==================== RESEÑAS ====================
export const resenasAPI = {
  // Obtener reseñas de un producto
  obtenerPorProducto: (productoId) => {
    return api.get(`/resenas/${productoId}`);
  },

  // Crear reseña
  crear: (resena) => {
    return api.post('/resenas', resena);
  },

  // Eliminar reseña
  eliminar: (id) => {
    return api.delete(`/resenas/${id}`);
  },
};

// ==================== BÚSQUEDA CON GEMINI ====================
export const busquedaAPI = {
  // Búsqueda con IA
  buscarConGemini: (consulta) => {
    return api.post('/busca-gemini/buscar', { consulta });
  },

  // Obtener sugerencias
  obtenerSugerencias: (q) => {
    return api.get('/busca-gemini/sugerencias', { params: { q } });
  },
};


export default api;

