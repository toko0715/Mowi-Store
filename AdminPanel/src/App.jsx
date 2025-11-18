import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ToastProvider } from './context/ToastContext';
import Sidebar from './Sidebar';
import Dashboard from './Dashboard';
import Productos from './pages/Productos';
import ProductoForm from './pages/ProductoForm';
import Inventario from './pages/Inventario';
import Reportes from './pages/Reportes';
import Pedidos from './pages/Pedidos';
import Configuracion from './pages/Configuracion';
import './App.css';

function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </ToastProvider>
  );
}

function AppContent() {
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Verificar autenticación al cargar
  useEffect(() => {
    const checkAuth = () => {
      // Primero verificar si hay datos en la URL (redirección desde login)
      const urlParams = new URLSearchParams(window.location.search);
      const tokenFromUrl = urlParams.get('token');
      const refreshTokenFromUrl = urlParams.get('refresh_token');
      const userFromUrl = urlParams.get('user');
      
      // Si hay datos en la URL, guardarlos en localStorage
      if (tokenFromUrl && userFromUrl) {
        console.log('🔑 Token recibido desde URL. Guardando en localStorage...');
        localStorage.setItem('access_token', tokenFromUrl);
        if (refreshTokenFromUrl) {
          localStorage.setItem('refresh_token', refreshTokenFromUrl);
        }
        localStorage.setItem('user', userFromUrl);
        
        // Limpiar la URL sin recargar
        window.history.replaceState({}, '', window.location.pathname);
      }
      
      // Ahora verificar desde localStorage
      const token = localStorage.getItem('access_token');
      const user = localStorage.getItem('user');
      
      console.log('🔍 Verificando autenticación en AdminPanel...');
      console.log('   Token existe:', !!token);
      console.log('   User existe:', !!user);
      console.log('   Token valor:', token ? token.substring(0, 20) + '...' : 'null');
      console.log('   User valor:', user ? user.substring(0, 50) + '...' : 'null');
      
      if (!token || !user) {
        console.warn('⚠️ No hay sesión activa. Redirigiendo a login...');
        console.log('💡 Por favor, inicia sesión desde http://localhost:3000');
        setTimeout(() => {
          window.location.href = 'http://localhost:3000';
        }, 1000);
        return;
      }
      
      try {
        const userData = JSON.parse(user);
        console.log('📋 Datos del usuario:', userData);
        console.log('   is_admin:', userData.is_admin);
        console.log('   is_staff:', userData.is_staff);
        
        if (!userData.is_admin && !userData.is_staff) {
          console.warn('⚠️ Usuario no tiene permisos de administrador.');
          console.log('💡 Redirigiendo a página de cliente...');
          setTimeout(() => {
            window.location.href = 'http://localhost:3000';
          }, 1000);
          return;
        }
        console.log('✅ Usuario autenticado correctamente:', userData.email);
        console.log('✅ Permisos: Admin=' + userData.is_admin + ', Staff=' + userData.is_staff);
        setIsAuthenticated(true);
        setIsChecking(false);
      } catch (error) {
        console.error('❌ Error al verificar usuario:', error);
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        setTimeout(() => {
          window.location.href = 'http://localhost:3000';
        }, 1000);
      }
    };
    
    // Verificar inmediatamente
    checkAuth();
  }, []);
  
  // Mostrar loading mientras verifica
  if (isChecking) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f7fafc'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '18px', color: '#2d3748', marginBottom: '10px' }}>
            Verificando autenticación...
          </div>
          <div style={{ fontSize: '14px', color: '#718096' }}>
            Por favor espera
          </div>
        </div>
      </div>
    );
  }
  
  // Si no está autenticado, no mostrar nada (ya está redirigiendo)
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      backgroundColor: '#f7fafc'
    }}>
      <Sidebar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/productos" element={<Productos />} />
        <Route path="/productos/nuevo" element={<ProductoForm />} />
        <Route path="/productos/editar/:id" element={<ProductoForm />} />
        <Route path="/inventario" element={<Inventario />} />
        <Route path="/reportes" element={<Reportes />} />
        <Route path="/pedidos" element={<Pedidos />} />
        <Route path="/configuracion" element={<Configuracion />} />
      </Routes>
    </div>
  );
}



export default App;