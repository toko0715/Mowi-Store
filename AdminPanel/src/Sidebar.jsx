import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';

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
    <aside className="admin-sidebar">
      {/* Logo Section */}
      <div className="admin-sidebar__header">
        <div className="admin-sidebar__brand">
          <div className="admin-sidebar__logo">M</div>
          <div>
            <h2 className="admin-sidebar__title">MOWI</h2>
            <p className="admin-sidebar__subtitle">Panel Admin</p>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="admin-sidebar__nav">
        <div className="admin-sidebar__section">
          <SidebarLink icon="📊" label="Dashboard" path="/" active={isActive('/')} />
          <SidebarLink icon="📦" label="Productos" path="/productos" active={isActive('/productos')} />
          <SidebarLink icon="🏪" label="Inventario" path="/inventario" active={isActive('/inventario')} />
          <SidebarLink icon="📈" label="Reportes" path="/reportes" active={isActive('/reportes')} />
          <SidebarLink icon="👥" label="Pedidos / Usuarios" path="/pedidos" active={isActive('/pedidos')} />
        </div>
      </nav>

      <div className="admin-sidebar__footer">
        <div className="admin-sidebar__section">
          <SidebarLink icon="⚙️" label="Configuración" path="/configuracion" active={isActive('/configuracion')} />
          <LogoutButton icon="🚪" label="Cerrar Sesión" onClick={handleLogout} />
        </div>
      </div>
    </aside>
  );
}

function SidebarLink({ icon, label, path, active = false }) {
  const linkClass = active
    ? 'admin-sidebar__link admin-sidebar__link--active'
    : 'admin-sidebar__link';

  return (
    <Link to={path} className={linkClass}>
      <span className="admin-sidebar__icon">{icon}</span>
      <span>{label}</span>
    </Link>
  );
}

function LogoutButton({ icon, label, onClick }) {
  return (
    <button type="button" className="admin-sidebar__logout" onClick={onClick}>
      <span className="admin-sidebar__icon">{icon}</span>
      <span>{label}</span>
    </button>
  );
}

export default Sidebar;
