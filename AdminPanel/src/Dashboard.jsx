import { useState, useEffect } from 'react';
import api from './services/api';

function Dashboard() {
  const [data, setData] = useState({
    productos: [],
    usuarios: [],
    pedidos: [],
    loading: true,
    error: null
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [productosRes, usuariosRes, pedidosRes] = await Promise.all([
        api.getProductos().catch(() => []),
        api.getUsuarios().catch(() => []),
        api.getPedidos().catch(() => [])
      ]);

      setData({
        productos: productosRes,
        usuarios: usuariosRes,
        pedidos: pedidosRes,
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

  const stats = {
    totalProductos: data.productos?.length || 0,
    totalUsuarios: data.usuarios?.length || 0,
    pedidosActivos: data.pedidos?.filter(p => p.estado === 'Pendiente')?.length || 0,
    productosBajoStock: data.productos?.filter(p => p.stock < 10)?.length || 0
  };

  return (
    <main style={{
      flex: 1,
      marginLeft: '280px',
      padding: '2rem',
      backgroundColor: '#f7fafc'
    }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
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
            title="PEDIDOS ACTIVOS"
            value={stats.pedidosActivos}
            change="Pedidos pendientes"
            icon="🛒"
            color="#48bb78"
            iconBg="#48bb78"
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
          <KPICard
            title="USUARIOS ACTIVOS"
            value={stats.totalUsuarios}
            change="Total de usuarios"
            icon="👥"
            color="#48bb78"
            iconBg="#ff6b35"
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
          <BarChart />
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
          <PieChart />
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
          <LineChart />
        </div>
      </div>
    </main>
  );
}

function KPICard({ title, value, change, icon, color, iconBg, isWarning = false }) {
  return (
    <div style={{
      background: 'white',
      borderRadius: '12px',
      padding: '1.5rem',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
      border: '1px solid #e2e8f0'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'start',
        marginBottom: '1rem'
      }}>
        <div style={{ flex: 1 }}>
          <p style={{
            fontSize: '0.875rem',
            color: '#718096',
            marginBottom: '0.5rem',
            fontWeight: '600'
          }}>
            {title}
          </p>
          <h3 style={{
            fontSize: '2rem',
            fontWeight: '700',
            color: color,
            marginBottom: '0.5rem'
          }}>
            {value}
          </h3>
        </div>
        <div style={{
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          background: iconBg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.5rem'
        }}>
          {icon}
        </div>
      </div>
      <p style={{
        fontSize: '0.875rem',
        color: color,
        display: 'flex',
        alignItems: 'center',
        gap: '0.25rem'
      }}>
        {!isWarning && '↗'} {change}
      </p>
    </div>
  );
}

function BarChart() {
  const data = [
    { category: 'Tecnología', value: 2400 },
    { category: 'Moda', value: 1800 },
    { category: 'Hogar', value: 1200 },
    { category: 'Mascotas', value: 700 },
    { category: 'Bebés', value: 600 },
    { category: 'Juguetes', value: 400 }
  ];
  
  const maxValue = Math.max(...data.map(d => d.value));

  return (
    <div style={{ height: '250px', display: 'flex', alignItems: 'end', gap: '0.75rem' }}>
      {data.map((item, index) => (
        <div key={index} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{
            width: '100%',
            height: `${(item.value / maxValue) * 100}%`,
            background: '#ff6b35',
            borderRadius: '4px 4px 0 0',
            minHeight: '20px'
          }}></div>
          <span style={{
            fontSize: '0.75rem',
            color: '#718096',
            marginTop: '0.5rem'
          }}>
            {item.category}
          </span>
        </div>
      ))}
    </div>
  );
}

function PieChart() {
  const data = [
    { label: 'Tecnología', percentage: 33, color: '#ff6b35' },
    { label: 'Moda', percentage: 25, color: '#ffd93d' },
    { label: 'Hogar', percentage: 17, color: '#4299e1' },
    { label: 'Mascotas', percentage: 11, color: '#48bb78' },
    { label: 'Bebés', percentage: 8, color: '#9f7aea' },
    { label: 'Juguetes', percentage: 6, color: '#ed8936' }
  ];

  return (
    <div style={{ height: '250px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '0.75rem' }}>
      {data.map((item, index) => (
        <div key={index} style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem'
        }}>
          <div style={{
            width: '24px',
            height: '24px',
            borderRadius: '4px',
            background: item.color
          }}></div>
          <span style={{
            fontSize: '0.875rem',
            color: '#2d3748'
          }}>
            {item.label} {item.percentage}%
          </span>
        </div>
      ))}
    </div>
  );
}

function LineChart() {
  const data = [1400, 1350, 1500, 1600, 1800, 1750, 1800];
  const maxValue = Math.max(...data);
  const minValue = Math.min(...data);

  return (
    <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#718096' }}>
      <p>Gráfico de línea de usuarios activos</p>
    </div>
  );
}

export default Dashboard;
