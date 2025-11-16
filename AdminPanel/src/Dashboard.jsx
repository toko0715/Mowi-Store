import { useState, useEffect, useMemo, useCallback } from 'react';
import api from './services/api';
import KPICard from './components/KPICard';
import BarChart from './components/charts/BarChart';
import PieChart from './components/charts/PieChart';
import LineChart from './components/charts/LineChart';

function Dashboard() {
  const [data, setData] = useState({
    productos: [],
    usuarios: [],
    pedidos: [],
    ventasPorCategoria: [],
    productosMasVendidos: [],
    usuariosActivosSemana: [],
    loading: true,
    error: null
  });
  const [periodoFiltro, setPeriodoFiltro] = useState('semana'); // 'hoy', 'semana', 'mes'

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [
        productosRes, 
        usuariosRes, 
        pedidosRes,
        ventasRes,
        masVendidosRes,
        usuariosSemanaRes
      ] = await Promise.all([
        api.getProductos().catch(() => []),
        api.getUsuarios().catch(() => []),
        api.getPedidos().catch(() => []),
        api.getVentasPorCategoria().catch(() => []),
        api.getProductosMasVendidos().catch(() => []),
        api.getUsuariosActivosSemana().catch(() => [])
      ]);

      setData({
        productos: productosRes,
        usuarios: usuariosRes,
        pedidos: pedidosRes,
        ventasPorCategoria: ventasRes,
        productosMasVendidos: masVendidosRes,
        usuariosActivosSemana: usuariosSemanaRes,
        loading: false,
        error: null
      });
    } catch (error) {
      console.error('Error fetching data:', error);
      setData(prev => ({ 
        ...prev, 
        loading: false, 
        error: 'Error al cargar datos. Asegúrate de que el servidor Django esté corriendo.' 
      }));
    }
  };

  // Filtrar datos según el período seleccionado (optimizado con useMemo)
  const filteredData = useMemo(() => {
    const ahora = new Date();
    let fechaInicio;
    
    switch (periodoFiltro) {
      case 'hoy':
        fechaInicio = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate());
        break;
      case 'semana':
        fechaInicio = new Date(ahora);
        fechaInicio.setDate(ahora.getDate() - 7);
        break;
      case 'mes':
        fechaInicio = new Date(ahora);
        fechaInicio.setMonth(ahora.getMonth() - 1);
        break;
      default:
        fechaInicio = new Date(ahora);
        fechaInicio.setDate(ahora.getDate() - 7);
    }
    
    const pedidosFiltrados = data.pedidos?.filter(p => {
      const fechaPedido = new Date(p.fecha_pedido);
      return fechaPedido >= fechaInicio && fechaPedido <= ahora;
    }) || [];
    
    return {
      pedidos: pedidosFiltrados,
      totalVentas: pedidosFiltrados.reduce((sum, p) => sum + parseFloat(p.total || 0), 0)
    };
  }, [data.pedidos, periodoFiltro]);
  
  // Stats optimizado con useMemo
  const stats = useMemo(() => ({
    totalProductos: data.productos?.length || 0,
    totalUsuarios: data.usuarios?.length || 0,
    pedidosActivos: filteredData.pedidos.filter(p => p.estado === 'pendiente')?.length || 0,
    productosBajoStock: data.productos?.filter(p => p.stock < 10)?.length || 0,
    totalVentas: filteredData.totalVentas,
    pedidosPeriodo: filteredData.pedidos.length
  }), [data.productos, data.usuarios, filteredData]);

  return (
    <main style={{
      flex: 1,
      marginLeft: '280px',
      padding: '2rem',
      backgroundColor: '#f7fafc'
    }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '1rem'
        }}>
          <div>
            <h1 style={{
              fontSize: '2.5rem',
              fontWeight: '700',
              color: '#2d3748',
              marginBottom: '0.5rem'
            }}>
              Panel de Control
            </h1>
            <p style={{
              fontSize: '1.125rem',
              color: '#718096'
            }}>
              Resumen general de tu tienda MOWI
            </p>
          </div>
          
          {/* Filtro de Período */}
          <div style={{
            display: 'flex',
            gap: '0.5rem',
            background: 'white',
            padding: '0.5rem',
            borderRadius: '8px',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
          }}>
            {['hoy', 'semana', 'mes'].map(periodo => (
              <button
                key={periodo}
                onClick={() => setPeriodoFiltro(periodo)}
                style={{
                  padding: '0.5rem 1rem',
                  background: periodoFiltro === periodo ? '#ff6b35' : 'transparent',
                  color: periodoFiltro === periodo ? 'white' : '#4a5568',
                  border: 'none',
                  borderRadius: '6px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  transition: 'all 0.2s ease'
                }}
              >
                {periodo.charAt(0).toUpperCase() + periodo.slice(1)}
              </button>
            ))}
          </div>
        </div>
        
        {data.error && (
          <div style={{
            padding: '1rem',
            background: '#fee',
            border: '1px solid #fcc',
            borderRadius: '8px',
            color: '#c00',
            marginTop: '1rem'
          }}>
            ⚠️ {data.error}
          </div>
        )}
      </div>

      {/* KPI Cards */}
      {data.loading ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <p style={{ fontSize: '1.5rem', color: '#718096' }}>Cargando datos...</p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          <KPICard
            title="TOTAL PRODUCTOS"
            value={stats.totalProductos}
            change="Productos en inventario"
            icon="📦"
            color="#48bb78"
            iconBg="#4299e1"
          />
          <KPICard
            title={`PEDIDOS ${periodoFiltro.toUpperCase()}`}
            value={stats.pedidosPeriodo}
            change={`${stats.pedidosActivos} pendientes`}
            icon="🛒"
            color="#48bb78"
            iconBg="#48bb78"
          />
          <KPICard
            title="VENTAS PERÍODO"
            value={`S/ ${stats.totalVentas.toFixed(2)}`}
            change={`Última ${periodoFiltro}`}
            icon="💰"
            color="#4299e1"
            iconBg="#4299e1"
          />
          <KPICard
            title="PRODUCTOS CON BAJO STOCK"
            value={stats.productosBajoStock}
            change="Requiere atención"
            icon="⚠️"
            color="#f56565"
            iconBg="#ed8936"
            isWarning={true}
          />
        </div>
      )}

      {/* Charts Section */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        {/* Bar Chart */}
        <div style={{
          gridColumn: '1 / 3',
          background: 'white',
          borderRadius: '12px',
          padding: '1.5rem',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
          border: '1px solid #e2e8f0'
        }}>
          <h3 style={{
            fontSize: '1.25rem',
            fontWeight: '600',
            color: '#2d3748',
            marginBottom: '1.5rem'
          }}>
            Ventas por Categoría
          </h3>
          <BarChart data={data.ventasPorCategoria} />
        </div>

        {/* Pie Chart */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '1.5rem',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
          border: '1px solid #e2e8f0'
        }}>
          <h3 style={{
            fontSize: '1.25rem',
            fontWeight: '600',
            color: '#2d3748',
            marginBottom: '1.5rem'
          }}>
            Productos Más Vendidos
          </h3>
          <PieChart data={data.productosMasVendidos} />
        </div>

        {/* Line Chart */}
        <div style={{
          gridColumn: '1 / 4',
          background: 'white',
          borderRadius: '12px',
          padding: '1.5rem',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
          border: '1px solid #e2e8f0'
        }}>
          <h3 style={{
            fontSize: '1.25rem',
            fontWeight: '600',
            color: '#2d3748',
            marginBottom: '1.5rem'
          }}>
            Usuarios Activos (Última Semana)
          </h3>
          <LineChart data={data.usuariosActivosSemana} />
        </div>
      </div>
    </main>
  );
}



export default Dashboard;
