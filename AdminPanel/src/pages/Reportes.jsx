import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useToast } from '../context/ToastContext';

function Reportes() {
  const [stats, setStats] = useState({
    totalVentas: 0,
    totalProductos: 0,
    totalUsuarios: 0,
    pedidos: []
  });
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [productosRes, usuariosRes, pedidosRes] = await Promise.all([
        api.getProductos(),
        api.getUsuarios(),
        api.getPedidos()
      ]);

      const totalVentas = pedidosRes.reduce((sum, p) => sum + parseFloat(p.total || 0), 0);

      setStats({
        totalVentas,
        totalProductos: productosRes.length,
        totalUsuarios: usuariosRes.length,
        pedidos: pedidosRes
      });
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const topPedidos = stats.pedidos
    .sort((a, b) => parseFloat(b.total) - parseFloat(a.total))
    .slice(0, 5);

  const pedidosPorEstado = stats.pedidos.reduce((acc, pedido) => {
    acc[pedido.estado] = (acc[pedido.estado] || 0) + 1;
    return acc;
  }, {});

  // Exportar a Excel (CSV)
  const handleExportExcel = () => {
    const csvContent = [
      ['Reporte de Ventas - MOWI Store'],
      ['Fecha de generación:', new Date().toLocaleString('es-PE')],
      [],
      ['Resumen General'],
      ['Total Ventas', `S/ ${stats.totalVentas.toFixed(2)}`],
      ['Total Pedidos', stats.pedidos.length],
      ['Total Productos', stats.totalProductos],
      ['Total Usuarios', stats.totalUsuarios],
      [],
      ['Pedidos por Estado'],
      ['Estado', 'Cantidad'],
      ...Object.entries(pedidosPorEstado).map(([estado, count]) => [estado, count]),
      [],
      ['Top 5 Pedidos'],
      ['ID', 'Cliente', 'Total', 'Estado', 'Fecha'],
      ...topPedidos.map(p => [
        p.id,
        p.usuario_nombre || 'N/A',
        `S/ ${parseFloat(p.total).toFixed(2)}`,
        p.estado,
        new Date(p.fecha_pedido).toLocaleDateString('es-PE')
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `reporte_ventas_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Reporte Excel descargado exitosamente');
  };

  // Exportar a PDF (simulado con window.print o texto formateado)
  const handleExportPDF = () => {
    // Crear contenido HTML para imprimir
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Reporte de Ventas - MOWI Store</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1 { color: #2d3748; }
            h2 { color: #4a5568; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th, td { border: 1px solid #e2e8f0; padding: 8px; text-align: left; }
            th { background: #f7fafc; font-weight: 600; }
            .summary { background: #f7fafc; padding: 15px; border-radius: 8px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <h1>Reporte de Ventas - MOWI Store</h1>
          <p><strong>Fecha de generación:</strong> ${new Date().toLocaleString('es-PE')}</p>
          
          <div class="summary">
            <h2>Resumen General</h2>
            <p><strong>Total Ventas:</strong> S/ ${stats.totalVentas.toFixed(2)}</p>
            <p><strong>Total Pedidos:</strong> ${stats.pedidos.length}</p>
            <p><strong>Total Productos:</strong> ${stats.totalProductos}</p>
            <p><strong>Total Usuarios:</strong> ${stats.totalUsuarios}</p>
          </div>

          <h2>Pedidos por Estado</h2>
          <table>
            <thead>
              <tr>
                <th>Estado</th>
                <th>Cantidad</th>
              </tr>
            </thead>
            <tbody>
              ${Object.entries(pedidosPorEstado).map(([estado, count]) => `
                <tr>
                  <td>${estado.charAt(0).toUpperCase() + estado.slice(1)}</td>
                  <td>${count}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <h2>Top 5 Pedidos</h2>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Cliente</th>
                <th>Total</th>
                <th>Estado</th>
                <th>Fecha</th>
              </tr>
            </thead>
            <tbody>
              ${topPedidos.map(p => `
                <tr>
                  <td>#${p.id}</td>
                  <td>${p.usuario_nombre || 'N/A'}</td>
                  <td>S/ ${parseFloat(p.total).toFixed(2)}</td>
                  <td>${p.estado.charAt(0).toUpperCase() + p.estado.slice(1)}</td>
                  <td>${new Date(p.fecha_pedido).toLocaleDateString('es-PE')}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 250);
  };

  return (
    <main style={{
      marginLeft: '280px',
      padding: '2rem',
      backgroundColor: '#f7fafc'
    }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{
          fontSize: '2rem',
          fontWeight: '700',
          color: '#2d3748',
          marginBottom: '0.5rem'
        }}>
          Reportes
        </h1>
        <p style={{
          fontSize: '1rem',
          color: '#718096'
        }}>
          Estadísticas y análisis de la tienda
        </p>
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
              <p style={{ fontSize: '0.875rem', color: '#718096', marginBottom: '0.5rem' }}>Total Ventas</p>
              <h3 style={{ fontSize: '2rem', fontWeight: '700', color: '#48bb78' }}>
                S/ {stats.totalVentas.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
              </h3>
            </div>
            <div style={{ fontSize: '2rem' }}>💰</div>
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
              <p style={{ fontSize: '0.875rem', color: '#718096', marginBottom: '0.5rem' }}>Total Pedidos</p>
              <h3 style={{ fontSize: '2rem', fontWeight: '700', color: '#2d3748' }}>{stats.pedidos.length}</h3>
            </div>
            <div style={{ fontSize: '2rem' }}>🛒</div>
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
              <p style={{ fontSize: '0.875rem', color: '#718096', marginBottom: '0.5rem' }}>Productos</p>
              <h3 style={{ fontSize: '2rem', fontWeight: '700', color: '#2d3748' }}>{stats.totalProductos}</h3>
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
              <p style={{ fontSize: '0.875rem', color: '#718096', marginBottom: '0.5rem' }}>Usuarios</p>
              <h3 style={{ fontSize: '2rem', fontWeight: '700', color: '#2d3748' }}>{stats.totalUsuarios}</h3>
            </div>
            <div style={{ fontSize: '2rem' }}>👥</div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        {/* Pedidos por Estado */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '1.5rem',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
        }}>
          <h3 style={{
            fontSize: '1.25rem',
            fontWeight: '600',
            color: '#2d3748',
            marginBottom: '1.5rem'
          }}>
            Pedidos por Estado
          </h3>
          <div style={{ height: '250px' }}>
            {Object.entries(pedidosPorEstado).map(([estado, count]) => {
              const percentage = (count / stats.pedidos.length) * 100;
              return (
                <div key={estado} style={{ marginBottom: '1rem' }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '0.5rem'
                  }}>
                    <span style={{ fontSize: '0.875rem', color: '#2d3748' }}>
                      {estado.charAt(0).toUpperCase() + estado.slice(1)}
                    </span>
                    <span style={{ fontSize: '0.875rem', color: '#718096', fontWeight: '600' }}>
                      {count} ({percentage.toFixed(1)}%)
                    </span>
                  </div>
                  <div style={{
                    width: '100%',
                    height: '12px',
                    background: '#e2e8f0',
                    borderRadius: '9999px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${percentage}%`,
                      height: '100%',
                      background: '#ff6b35',
                      borderRadius: '9999px',
                      transition: 'width 0.3s ease'
                    }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Pedidos */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '1.5rem',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
        }}>
          <h3 style={{
            fontSize: '1.25rem',
            fontWeight: '600',
            color: '#2d3748',
            marginBottom: '1.5rem'
          }}>
            Top 5 Pedidos
          </h3>
          <div style={{ height: '250px', overflowY: 'auto' }}>
            {topPedidos.map((pedido, index) => (
              <div key={pedido.id} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '1rem',
                marginBottom: '0.5rem',
                background: '#f7fafc',
                borderRadius: '8px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    background: '#ff6b35',
                    color: 'white',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: '700'
                  }}>
                    {index + 1}
                  </div>
                  <div>
                    <div style={{ fontWeight: '600', color: '#2d3748' }}>
                      Pedido #{pedido.id}
                    </div>
                    <div style={{ fontSize: '0.875rem', color: '#718096' }}>
                      {pedido.usuario_nombre || 'N/A'}
                    </div>
                  </div>
                </div>
                <div style={{ fontWeight: '700', color: '#48bb78' }}>
                  S/ {parseFloat(pedido.total).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Export Section */}
      <div style={{
        background: 'white',
        borderRadius: '12px',
        padding: '1.5rem',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
      }}>
        <h3 style={{
          fontSize: '1.25rem',
          fontWeight: '600',
          color: '#2d3748',
          marginBottom: '1.5rem'
        }}>
          Exportar Reportes
        </h3>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button 
            onClick={handleExportPDF}
            style={{
              padding: '0.75rem 1.5rem',
              background: '#48bb78',
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
            📄 Exportar PDF
          </button>
          <button 
            onClick={handleExportExcel}
            style={{
              padding: '0.75rem 1.5rem',
              background: '#4299e1',
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
            📊 Exportar Excel
          </button>
        </div>
      </div>
    </main>
  );
}

export default Reportes;
