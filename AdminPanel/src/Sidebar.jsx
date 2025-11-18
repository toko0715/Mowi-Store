import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function Sidebar() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const handleLogout = (e) => {
    e.preventDefault();
    e.stopPropagation();

    console.log('Cerrando sesión...');

    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');

    console.log('localStorage limpiado');
    console.log('Redirigiendo a puerto 3000...');

    window.location.replace('http://localhost:3000?logout=true');
  };

  return (
    <aside style={{
      width: '280px',
      height: '100vh',
      background: 'white',
      borderRight: '1px solid #e2e8f0',
      position: 'fixed',
      left: 0,
      top: 0,
      display: 'flex',
      flexDirection: 'column',
      zIndex: 1000
    }}>
      {/* Logo Section */}
      <div style={{
        padding: '2rem 1.5rem',
        borderBottom: '1px solid #e2e8f0'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem'
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            background: '#ff6b35',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.5rem',
            fontWeight: '700',
            color: 'white'
          }}>
            M
          </div>
          <div>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: '700',
              margin: 0,
              color: '#2d3748'
            }}>
              MOWI
            </h2>
            <p style={{
              fontSize: '0.875rem',
              color: '#718096',
              margin: 0
            }}>
              Panel Admin
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav style={{
        flex: 1,
        padding: '1rem 0'
      }}>
        <SidebarLink icon="📊" label="Dashboard" path="/" active={isActive('/')} />
        <SidebarLink icon="📦" label="Productos" path="/productos" active={isActive('/productos')} />
        <SidebarLink icon="🏪" label="Inventario" path="/inventario" active={isActive('/inventario')} />
        <SidebarLink icon="📈" label="Reportes" path="/reportes" active={isActive('/reportes')} />
        <SidebarLink icon="👥" label="Pedidos / Usuarios" path="/pedidos" active={isActive('/pedidos')} />
      </nav>

      <div style={{
        borderTop: '1px solid #e2e8f0',
        padding: '1rem 0'
      }}>
        <SidebarLink icon="⚙️" label="Configuración" path="/configuracion" active={isActive('/configuracion')} />
        <LogoutButton icon="🚪" label="Cerrar Sesión" onClick={handleLogout} />
      </div>
    </aside>
  )
}

function SidebarLink({ icon, label, path, active = false }) {
  return (
    <Link
      to={path}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        padding: '0.875rem 1.5rem',
        background: active ? '#ff6b35' : 'transparent',
        color: active ? 'white' : '#4a5568',
        fontWeight: '500',
        textDecoration: 'none',
        transition: 'all 0.2s ease',
        borderLeft: active ? '3px solid white' : '3px solid transparent'
      }}
    >
      <span style={{ fontSize: '1.25rem' }}>{icon}</span>
      <span style={{ fontSize: '1rem' }}>{label}</span>
    </Link>
  )
}

function LogoutButton({ icon, label, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        padding: '0.875rem 1.5rem',
        background: 'transparent',
        color: '#f56565',
        fontWeight: '500',
        textDecoration: 'none',
        transition: 'all 0.2s ease',
        borderLeft: '3px solid transparent',
        border: 'none',
        width: '100%',
        cursor: 'pointer',
        fontSize: '1rem',
        textAlign: 'left'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = '#fff5f5';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'transparent';
      }}
    >
      <span style={{ fontSize: '1.25rem' }}>{icon}</span>
      <span>{label}</span>
    </button>
  )
}

export default Sidebar
