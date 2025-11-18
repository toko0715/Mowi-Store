// API Configuration
// Usa el proxy de Vite para desarrollo
const API_BASE_URL = '/api/dashboard';

// Fetch helper
async function fetchAPI(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  // Obtener token de autenticación desde localStorage
  const token = localStorage.getItem('access_token');
  
  // Debug: Verificar si hay token
  if (!token) {
    console.warn('⚠️ No hay token de autenticación. Las peticiones que requieren autenticación fallarán.');
    console.warn('💡 Por favor, inicia sesión desde http://localhost:3000');
  }
  
  // Construir headers
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  // Agregar token de autenticación si existe
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
    console.log('✅ Token agregado a la petición:', endpoint);
  } else {
    console.warn('❌ Sin token para:', endpoint);
  }
  
  const config = {
    headers,
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
    // Si el token expiró (401), mostrar mensaje claro
    if (response.status === 401) {
      if (token) {
        console.error('❌ Token expirado o inválido. Por favor, inicia sesión nuevamente.');
        console.error('💡 Ve a http://localhost:3000 para iniciar sesión');
      } else {
        console.error('❌ No hay token de autenticación. Por favor, inicia sesión.');
        console.error('💡 Ve a http://localhost:3000 para iniciar sesión');
      }
    }
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.detail || errorData.message || `HTTP error! status: ${response.status}`;
      console.error('❌ Error en petición:', endpoint, errorMessage);
      throw new Error(errorMessage);
    }
    return await response.json();
  } catch (error) {
    console.error('❌ API Error:', error);
    throw error;
  }
}

// API Endpoints
export const api = {
  // Test connection
  ping: () => fetchAPI('/ping/'),

  // Productos
  getProductos: () => fetchAPI('/productos/'),
  getProducto: (id) => fetchAPI(`/productos/${id}/`),
  createProducto: (data) => fetchAPI('/productos/', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  updateProducto: (id, data) => fetchAPI(`/productos/${id}/`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  deleteProducto: (id) => fetchAPI(`/productos/${id}/`, {
    method: 'DELETE',
  }),

  // Categorias
  getCategorias: () => fetchAPI('/categorias/'),
  getCategoria: (id) => fetchAPI(`/categorias/${id}/`),
  createCategoria: (data) => fetchAPI('/categorias/', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  updateCategoria: (id, data) => fetchAPI(`/categorias/${id}/`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  deleteCategoria: (id) => fetchAPI(`/categorias/${id}/`, {
    method: 'DELETE',
  }),

  // Usuarios
  getUsuarios: () => fetchAPI('/usuarios/'),
  getUsuario: (id) => fetchAPI(`/usuarios/${id}/`),
  createUsuario: (data) => fetchAPI('/usuarios/', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  updateUsuario: (id, data) => fetchAPI(`/usuarios/${id}/`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  deleteUsuario: (id) => fetchAPI(`/usuarios/${id}/`, {
    method: 'DELETE',
  }),

  // Pedidos
  getPedidos: () => fetchAPI('/pedidos/'),
  getPedido: (id) => fetchAPI(`/pedidos/${id}/`),
  createPedido: (data) => fetchAPI('/pedidos/', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  updatePedido: (id, data) => fetchAPI(`/pedidos/${id}/`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  deletePedido: (id) => fetchAPI(`/pedidos/${id}/`, {
    method: 'DELETE',
  }),

  // Detalles Pedido
  getDetallesPedido: () => fetchAPI('/detalles/'),
  getDetallePedido: (id) => fetchAPI(`/detalles/${id}/`),
  createDetallePedido: (data) => fetchAPI('/detalles/', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  updateDetallePedido: (id, data) => fetchAPI(`/detalles/${id}/`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  deleteDetallePedido: (id) => fetchAPI(`/detalles/${id}/`, {
    method: 'DELETE',
  }),

  // Estadísticas
  getVentasPorCategoria: () => fetchAPI('/ventas-por-categoria/'),
  getProductosMasVendidos: () => fetchAPI('/productos-mas-vendidos/'),
  getUsuariosActivosSemana: () => fetchAPI('/usuarios-activos-semana/'),
};

export default api;
