import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import AuthModal from './components/AuthModal';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './components/HomePage';
import CatalogPage from './pages/CatalogPage';

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
    console.log('✅ Login exitoso. Datos del usuario:', userData);
    setUser(userData);
    setIsAuthenticated(true);
    setIsModalOpen(false);

    // Redirigir según el rol
    if (userData.is_staff || userData.is_admin) {
      console.log('🔄 Usuario es admin/staff. Redirigiendo al AdminPanel...');
      console.log('   is_admin:', userData.is_admin);
      console.log('   is_staff:', userData.is_staff);
      
      // Obtener token y refresh token para pasarlos en la URL
      const token = localStorage.getItem('access_token');
      const refreshToken = localStorage.getItem('refresh_token');
      
      // Pasar los datos por URL ya que localStorage no se comparte entre puertos
      const params = new URLSearchParams({
        token: token || '',
        refresh_token: refreshToken || '',
        user: JSON.stringify(userData)
      });
      
      // Esperar un momento para asegurar que los datos se guarden
      setTimeout(() => {
        window.location.href = `http://localhost:5173?${params.toString()}`;
      }, 100);
    } else {
      console.log('ℹ️ Usuario es cliente. Permaneciendo en la página de cliente.');
    }
  };

  return (
    <Router>
      <div className="App">
        <Header
          isAuthenticated={isAuthenticated}
          user={user}
          onLogout={handleLogout}
          onLoginClick={() => openModal('login')}
        />

        <main style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/catalogo" element={<CatalogPage />} />
            <Route path="/soporte" element={
              <div style={{ padding: '100px 60px', textAlign: 'center', minHeight: '60vh' }}>
                <h1 style={{ fontSize: '42px', marginBottom: '20px' }}>Soporte</h1>
                <p style={{ fontSize: '18px', color: '#666' }}>Página de soporte en construcción</p>
              </div>
            } />
            <Route path="/carrito" element={
              <div style={{ padding: '100px 60px', textAlign: 'center', minHeight: '60vh' }}>
                <h1 style={{ fontSize: '42px', marginBottom: '20px' }}>Carrito de Compras</h1>
                <p style={{ fontSize: '18px', color: '#666' }}>Tu carrito está vacío</p>
              </div>
            } />
          </Routes>
        </main>

        <Footer />

        {/* Modal de autenticación */}
        <AuthModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          initialTab={initialTab}
          onLoginSuccess={handleLoginSuccess}
        />
      </div>
    </Router>
  );
}

export default App;
