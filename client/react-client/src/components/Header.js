import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import './Header.css';

function Header({ onLogout, onLoginClick }) {
  const { isAuthenticated, user, cartItemsCount } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/catalogo?busqueda=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="header-logo">
          MOWI
        </Link>
        
        <form className="header-search" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Buscar productos o categorías"
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="search-icon-btn">
            <span className="search-icon">🔍</span>
          </button>
        </form>

        <nav className="header-nav">
          <Link 
            to="/catalogo" 
            className={`nav-link ${location.pathname.startsWith('/catalogo') || location.pathname.startsWith('/producto') ? 'active' : ''}`}
          >
            Productos
          </Link>
          <Link 
            to="/soporte" 
            className={`nav-link ${location.pathname.startsWith('/soporte') ? 'active' : ''}`}
          >
            Soporte
          </Link>
          <Link to="/carrito" className="cart-icon-container">
            <span className="cart-icon">🛒</span>
            {cartItemsCount > 0 && (
              <span className="cart-badge">{cartItemsCount}</span>
            )}
          </Link>
          
          {isAuthenticated ? (
            <div className="user-menu">
              <Link to="/mis-pedidos" className="nav-link">Mis Pedidos</Link>
              <Link to="/mi-perfil" className="nav-link">Mi Perfil</Link>
              <span className="user-greeting">Hola, {user?.name || user?.username}</span>
              <button className="nav-btn-primary" onClick={onLogout}>
                Cerrar Sesión
              </button>
            </div>
          ) : (
            <button className="nav-btn-primary" onClick={onLoginClick}>
              Iniciar Sesión
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;

