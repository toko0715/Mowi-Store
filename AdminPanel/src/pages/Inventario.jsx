import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useToast } from '../context/ToastContext';

function Inventario() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [productosLocal, setProductosLocal] = useState({});
  const toast = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const productos = await api.getProductos();
      setProductos(productos);
      // Inicializar productosLocal con los IDs y stocks
      const local = {};
      productos.forEach(p => {
        local[p.id] = { stock: p.stock || 0, nombre: p.nombre };
      });
      setProductosLocal(local);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const handleGenerateReport = () => {
    // Crear el reporte en formato CSV
    const csvContent = [
      ['Producto', 'Stock', 'Estado', 'Valor Unitario', 'Valor Total'],
      ...productos.map(p => [
        p.nombre,
        p.stock || 0,
        p.stock < 15 ? 'Stock Bajo' : 'Normal',
        `S/ ${parseFloat(p.precio).toFixed(2)}`,
        `S/ ${(parseFloat(p.precio) * (p.stock || 0)).toFixed(2)}`
      ])
    ].map(row => row.join(',')).join('\n');

    // Descargar el archivo
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `reporte_inventario_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Reporte descargado exitosamente');
  };

  const handleAdjustStock = (productoId, delta) => {
    setProductosLocal(prev => {
      const currentStock = prev[productoId]?.stock ?? productos.find(p => p.id === productoId)?.stock ?? 0;
      const newStock = currentStock + delta;
      return {
        ...prev,
        [productoId]: {
          ...prev[productoId],
          stock: newStock < 0 ? 0 : newStock,
          nombre: prev[productoId]?.nombre || productos.find(p => p.id === productoId)?.nombre || ''
        }
      };
    });
  };

  const handleSaveStock = async (producto) => {
    try {
      const nuevoStock = productosLocal[producto.id]?.stock !== undefined 
        ? productosLocal[producto.id].stock 
        : producto.stock;
      await api.updateProducto(producto.id, {
        ...producto,
        stock: nuevoStock
      });
      toast.success('Stock actualizado exitosamente');
      fetchData();
      setProductosLocal(prev => {
        const newLocal = { ...prev };
        delete newLocal[producto.id];
        return newLocal;
      });
    } catch (error) {
      console.error('Error updating stock:', error);
      toast.error('Error al actualizar el stock');
      setProductosLocal(prev => ({
        ...prev,
        [producto.id]: { ...prev[producto.id], stock: producto.stock }
      }));
    }
  };

  const filteredProductos = productos.filter(producto =>
    producto.nombre?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalValor = productos.reduce((sum, p) => sum + (p.precio * (p.stock || 0)), 0);
  const stockBajo = productos.filter(p => p.stock > 0 && p.stock < 15).length;
  const agotados = productos.filter(p => p.stock === 0).length;

  const getStatusBadge = (stock, stockMin = 15) => {
    if (stock === 0) {
      return <span style={{
        padding: '0.25rem 0.75rem',
        borderRadius: '9999px',
        fontSize: '0.75rem',
        fontWeight: '500',
        background: '#f56565',
        color: 'white'
      }}>Agotado</span>;
    }
    if (stock < stockMin) {
      return <span style={{
        padding: '0.25rem 0.75rem',
        borderRadius: '9999px',
        fontSize: '0.75rem',
        fontWeight: '500',
        background: '#fbd38d',
        color: '#744210'
      }}>Stock Bajo</span>;
    }
    return <span style={{
      padding: '0.25rem 0.75rem',
      borderRadius: '9999px',
      fontSize: '0.75rem',
      fontWeight: '500',
      background: '#48bb78',
      color: 'white'
    }}>Normal</span>;
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
            Gestión de Inventario
          </h1>
          <p style={{
            fontSize: '1rem',
            color: '#718096'
          }}>
            Controla y administra tu inventario
          </p>
        </div>
        <button
          onClick={handleGenerateReport}
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
          📥 Generar Reporte
        </button>
      </div>

      {/* Summary Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        <div style={{
          background: 'white',
          padding: '1.5rem',
          borderRadius: '12px',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <p style={{ fontSize: '0.875rem', color: '#718096', marginBottom: '0.5rem' }}>Total Productos</p>
              <h3 style={{ fontSize: '2rem', fontWeight: '700', color: '#2d3748' }}>{productos.length}</h3>
            </div>
            <div style={{ fontSize: '2rem' }}>📦</div>
          </div>
        </div>
        <div style={{
          background: 'white',
          padding: '1.5rem',
          borderRadius: '12px',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <p style={{ fontSize: '0.875rem', color: '#718096', marginBottom: '0.5rem' }}>Stock Bajo</p>
              <h3 style={{ fontSize: '2rem', fontWeight: '700', color: '#ff6b35' }}>{stockBajo}</h3>
            </div>
            <div style={{ fontSize: '2rem' }}>⚠️</div>
          </div>
        </div>
        <div style={{
          background: 'white',
          padding: '1.5rem',
          borderRadius: '12px',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <p style={{ fontSize: '0.875rem', color: '#718096', marginBottom: '0.5rem' }}>Agotados</p>
              <h3 style={{ fontSize: '2rem', fontWeight: '700', color: '#f56565' }}>{agotados}</h3>
            </div>
            <div style={{ fontSize: '2rem' }}>📉</div>
          </div>
        </div>
        <div style={{
          background: 'white',
          padding: '1.5rem',
          borderRadius: '12px',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <p style={{ fontSize: '0.875rem', color: '#718096', marginBottom: '0.5rem' }}>Valor Total</p>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#48bb78' }}>
                S/ {totalValor.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
              </h3>
            </div>
            <div style={{ fontSize: '2rem' }}>📈</div>
          </div>
        </div>
      </div>

      <div style={{
        display: 'flex',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <input
          type="text"
          placeholder="Buscar en inventario..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            flex: 1,
            padding: '0.75rem 1rem',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            fontSize: '1rem'
          }}
        />
      </div>

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
          Inventario ({filteredProductos.length} productos)
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <p>Cargando inventario...</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', color: '#718096', fontWeight: '600' }}>Producto</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', color: '#718096', fontWeight: '600' }}>Stock Actual</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', color: '#718096', fontWeight: '600' }}>Estado</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', color: '#718096', fontWeight: '600' }}>Proveedor</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', color: '#718096', fontWeight: '600' }}>Última Reposición</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', color: '#718096', fontWeight: '600' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredProductos.map(producto => (
                  <tr key={producto.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        {producto.imagen ? (
                          <img 
                            src={producto.imagen} 
                            alt={producto.nombre}
                            style={{
                              width: '50px',
                              height: '50px',
                              borderRadius: '8px',
                              objectFit: 'cover',
                              border: '1px solid #e2e8f0'
                            }}
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextElementSibling.style.display = 'flex';
                            }}
                          />
                        ) : null}
                        <div style={{
                          width: '50px',
                          height: '50px',
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
                            {producto.categoria_nombre || 'Sin categoría'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        {(() => {
                          const currentStock = productosLocal[producto.id]?.stock !== undefined 
                            ? productosLocal[producto.id].stock 
                            : producto.stock || 0;
                          if (currentStock === 0) return '🟣';
                          if (currentStock < 15) return '🟠';
                          return '🟢';
                        })()}
                        <span style={{ fontWeight: '600', color: '#2d3748' }}>
                          {productosLocal[producto.id]?.stock !== undefined 
                            ? productosLocal[producto.id].stock 
                            : producto.stock || 0}
                        </span>
                        <div style={{ display: 'flex', gap: '0.25rem' }}>
                          <button
                            onClick={() => handleAdjustStock(producto.id, -1)}
                            style={{
                              padding: '0.25rem 0.5rem',
                              border: '1px solid #e2e8f0',
                              background: 'white',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              fontSize: '1rem'
                            }}
                          >-</button>
                          <button
                            onClick={() => handleAdjustStock(producto.id, 1)}
                            style={{
                              padding: '0.25rem 0.5rem',
                              border: '1px solid #e2e8f0',
                              background: 'white',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              fontSize: '1rem'
                            }}
                          >+</button>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      {getStatusBadge(productosLocal[producto.id]?.stock !== undefined 
                        ? productosLocal[producto.id].stock 
                        : producto.stock)}
                    </td>
                    <td style={{ padding: '1rem', color: '#2d3748' }}>Proveedor General</td>
                    <td style={{ padding: '1rem', color: '#718096', fontSize: '0.875rem' }}>
                      {new Date().toLocaleDateString('es-PE')}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <button
                        onClick={() => handleSaveStock(producto)}
                        style={{
                          padding: '0.5rem 1rem',
                          background: '#ff6b35',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          fontSize: '0.875rem',
                          cursor: 'pointer'
                        }}
                      >
                        Guardar Stock
                      </button>
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

export default Inventario;
