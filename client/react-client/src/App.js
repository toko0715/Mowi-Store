import React, { useState, useEffect } from 'react';
import './App.css';
import AuthModal from './components/AuthModal';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [initialTab, setInitialTab] = useState('login');

  // Verificar si el usuario está autenticado al cargar
  useEffect(() => {
    // Verificar si viene de un logout (desde AdminPanel)
    const urlParams = new URLSearchParams(window.location.search);
    const isLogout = urlParams.get('logout');

    if (isLogout === 'true') {
      // Forzar logout y limpiar URL
      console.log('Logout detectado desde AdminPanel');
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
      setIsAuthenticated(false);
      setUser(null);

      // Limpiar el parámetro de la URL sin recargar
      window.history.replaceState({}, '', '/');
      return;
    }

    // Verificar autenticación normal
    const token = localStorage.getItem('access_token');
    const userData = localStorage.getItem('user');

    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setIsAuthenticated(true);

        // NO redirigir automáticamente al cargar la página
        // Solo los clientes deben permanecer aquí
        // Los admins solo serán redirigidos cuando hagan LOGIN, no al cargar
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        setIsAuthenticated(false);
        setUser(null);
      }
    } else {
      // No hay sesión activa
      setIsAuthenticated(false);
      setUser(null);
    }
  }, []);

  const openModal = (tab) => {
    setInitialTab(tab);
    setIsModalOpen(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
  };

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    setIsModalOpen(false);

    // Redirigir según el rol
    if (userData.is_staff || userData.is_admin) {
      // Es administrador, redirigir al panel de admin (puerto 5173)
      window.location.href = 'http://localhost:5173';
    }
    // Si es cliente normal, se queda en esta vista
  };

  return (
    <div className="App">
      {/* Navbar */}
      <nav className="navbar">
        <div className="nav-brand">MOWI</div>
        <div className="nav-buttons">
          {isAuthenticated ? (
            <>
              <span style={{ marginRight: '15px', fontSize: '16px', color: '#333' }}>
                Hola, {user?.name || user?.username}
              </span>
              <button
                className="nav-btn-secondary"
                onClick={handleLogout}
              >
                Cerrar Sesión
              </button>
            </>
          ) : (
            <>
              <button
                className="nav-btn-primary"
                onClick={() => openModal('login')}
              >
                Iniciar Sesión
              </button>
              <button
                className="nav-btn-secondary"
                onClick={() => openModal('register')}
              >
                Registrarse
              </button>
            </>
          )}
        </div>
      </nav>

      {/* Hero section */}
      <div className="hero-section">
        <h1>¡Grandes ofertas en MOWI!</h1>
        <p>Descubre productos increíbles a precios únicos</p>
        <button className="hero-btn">Explorar Productos</button>
      </div>

      {/* Modal de autenticación */}
      <AuthModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialTab={initialTab}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
}

export default App;
