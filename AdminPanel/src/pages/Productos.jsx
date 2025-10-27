import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function Productos() {
  const navigate = useNavigate();
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [productosRes, categoriasRes] = await Promise.all([
        api.getProductos(),
        api.getCategorias()
      ]);
      setProductos(productosRes);
      setCategorias(categoriasRes);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const handleEdit = (productoId) => {
    navigate(`/productos/editar/${productoId}`);
  };

  const handleDelete = async (productoId) => {
    if (window.confirm('¿Está seguro de que desea eliminar este producto?')) {
      try {
        await api.deleteProducto(productoId);
        fetchData(); 
      } catch (error) {
        console.error('Error deleting producto:', error);
        alert('Error al eliminar el producto');
      }
    }
  };

  const handleAdd = () => {
    navigate('/productos/nuevo');
  };

  const filteredProductos = productos.filter(producto => {
    const matchesSearch = producto.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (producto.descripcion?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || 
      (producto.categoria && 
       (typeof producto.categoria === 'number' ? producto.categoria === parseInt(selectedCategory) :
        (typeof producto.categoria === 'object' && producto.categoria.id === parseInt(selectedCategory))));
    return matchesSearch && matchesCategory;
  });

  const getStatusBadge = (stock) => {
    if (stock < 10) {
      return <span style={{
        padding: '0.25rem 0.75rem',
        borderRadius: '9999px',
        fontSize: '0.75rem',
        fontWeight: '500',
        background: '#fed7d7',
        color: '#c53030'
      }}>Stock bajo</span>;
    }
    return <span style={{
      padding: '0.25rem 0.75rem',
      borderRadius: '9999px',
      fontSize: '0.75rem',
      fontWeight: '500',
      background: '#ff6b35',
      color: 'white'
    }}>Disponible</span>;
  };

  return (
    <main style={{
      marginLeft: '280px',
      padding: '2rem',
      backgroundColor: '#f7fafc'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem'
      }}>
        <div>
          <h1 style={{
            fontSize: '2rem',
            fontWeight: '700',
            color: '#2d3748',
            marginBottom: '0.5rem'
          }}>
            Gestión de Productos
          </h1>
          <p style={{
            fontSize: '1rem',
            color: '#718096'
          }}>
            Administra tu catálogo de productos
          </p>
        </div>
        <button 
          onClick={handleAdd}
          style={{
            padding: '0.75rem 1.5rem',
            background: '#ff6b35',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          + Agregar Producto
        </button>
      </div>

      {/* Search and Filter */}
      <div style={{
        display: 'flex',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <div style={{
          flex: 1,
          position: 'relative'
        }}>
          <input
            type="text"
            placeholder="Buscar productos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem 1rem 0.75rem 2.5rem',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              fontSize: '1rem'
            }}
          />
          <span style={{
            position: 'absolute',
            left: '0.75rem',
            top: '50%',
            transform: 'translateY(-50%)',
            fontSize: '1.25rem'
          }}>🔍</span>
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          style={{
            padding: '0.75rem 1rem',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            fontSize: '1rem',
            minWidth: '200px'
          }}
        >
          <option value="">Todas las categorías</option>
          {categorias.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.nombre}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div style={{
        background: 'white',
        borderRadius: '12px',
        padding: '1.5rem',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{
          marginBottom: '1rem',
          color: '#718096',
          fontSize: '0.875rem'
        }}>
          Productos ({filteredProductos.length})
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <p>Cargando productos...</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{
                  borderBottom: '1px solid #e2e8f0'
                }}>
                  <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', color: '#718096', fontWeight: '600' }}>Producto</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', color: '#718096', fontWeight: '600' }}>Categoría</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', color: '#718096', fontWeight: '600' }}>Precio</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', color: '#718096', fontWeight: '600' }}>Stock</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', color: '#718096', fontWeight: '600' }}>Estado</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', color: '#718096', fontWeight: '600' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredProductos.map(producto => (
                  <tr key={producto.id} style={{
                    borderBottom: '1px solid #e2e8f0'
                  }}>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        {producto.imagen ? (
                          <img 
                            src={producto.imagen} 
                            alt={producto.nombre}
                            style={{
                              width: '40px',
                              height: '40px',
                              borderRadius: '8px',
                              objectFit: 'cover'
                            }}
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextElementSibling.style.display = 'flex';
                            }}
                          />
                        ) : null}
                        <div style={{
                          width: '40px',
                          height: '40px',
                          background: '#e2e8f0',
                          borderRadius: '8px',
                          display: producto.imagen ? 'none' : 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '1.5rem'
                        }}>
                          📦
                        </div>
                        <div>
                          <div style={{ fontWeight: '600', color: '#2d3748' }}>{producto.nombre}</div>
                          <div style={{ fontSize: '0.875rem', color: '#718096' }}>
                            {producto.categoria_nombre || (producto.categoria && typeof producto.categoria === 'object' ? producto.categoria.nombre : 'Sin categoría')}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '1rem', color: '#2d3748' }}>
                      {producto.categoria_nombre || (producto.categoria && typeof producto.categoria === 'object' ? producto.categoria.nombre : 'Sin categoría')}
                    </td>
                    <td style={{ padding: '1rem', fontWeight: '600', color: '#2d3748' }}>
                      S/ {parseFloat(producto.precio).toFixed(2)}
                    </td>
                    <td style={{ padding: '1rem', color: '#2d3748' }}>{producto.stock || 0}</td>
                    <td style={{ padding: '1rem' }}>{getStatusBadge(producto.stock || 0)}</td>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button 
                          onClick={() => handleEdit(producto.id)}
                          style={{
                            padding: '0.5rem',
                            background: '#edf2f7',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                          }}
                        >
                          ✏️
                        </button>
                        <button 
                          onClick={() => handleDelete(producto.id)}
                          style={{
                            padding: '0.5rem',
                            background: '#fed7d7',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                          }}
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}

export default Productos;
