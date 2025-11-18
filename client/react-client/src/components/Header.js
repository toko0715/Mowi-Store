import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

function Header({ isAuthenticated, user, onLogout, onLoginClick }) {
  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="header-logo">
          MOWI
        </Link>
        
        <div className="header-search">
          <input
            type="text"
            placeholder="Buscar productos o categorías"
            className="search-input"
          />
          <span className="search-icon">🔍</span>
        </div>

        <nav className="header-nav">
          <Link to="/catalogo" className="nav-link">Productos</Link>
          <Link to="/soporte" className="nav-link">Soporte</Link>
          <Link to="/carrito" className="cart-icon">🛒</Link>
          
          {isAuthenticated ? (
            <div className="user-menu">
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

