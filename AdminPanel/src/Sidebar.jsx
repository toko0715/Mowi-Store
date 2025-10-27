import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function Sidebar() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

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
        <SidebarLink icon="🚪" label="Cerrar Sesión" path="/logout" logout={true} />
      </div>
    </aside>
  )
}

function SidebarLink({ icon, label, path, active = false, logout = false }) {
  return (
    <Link
      to={path}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        padding: '0.875rem 1.5rem',
        background: active ? '#ff6b35' : 'transparent',
        color: logout ? '#f56565' : (active ? 'white' : '#4a5568'),
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

export default Sidebar