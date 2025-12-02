import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { AppProvider, useApp } from './context/AppContext';
import AuthModal from './components/AuthModal';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './components/HomePage';
import CatalogPage from './pages/CatalogPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import MyOrdersPage from './pages/MyOrdersPage';
import OrderDetailPage from './pages/OrderDetailPage';
import SupportPage from './pages/SupportPage';
import ProfileDashboard from './pages/ProfileDashboard';

function AppContent() {
  const { user, isAuthenticated, setAuthenticatedUser, clearAuth } = useApp();
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
      clearAuth();
      window.history.replaceState({}, '', '/');
    }
  }, [clearAuth]);

  const openModal = (tab) => {
    setInitialTab(tab);
    setIsModalOpen(true);
  };

  const handleLogout = () => {
    clearAuth();
  };

  const handleLoginSuccess = (userData) => {
    console.log('✅ Login exitoso. Datos del usuario:', userData);
    setAuthenticatedUser(userData);
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
          onLogout={handleLogout}
          onLoginClick={() => openModal('login')}
        />

        <main style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/catalogo" element={<CatalogPage />} />
            <Route path="/producto/:id" element={<ProductDetailPage />} />
            <Route path="/carrito" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/mis-pedidos" element={<MyOrdersPage />} />
            <Route path="/pedido/:id" element={<OrderDetailPage />} />
            <Route path="/mi-perfil" element={<ProfileDashboard />} />
            <Route path="/soporte" element={<SupportPage />} />
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

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
