// API Configuration
// Usa el proxy de Vite para desarrollo
const API_BASE_URL = '/api/dashboard';

// Fetch helper
async function fetchAPI(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
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
