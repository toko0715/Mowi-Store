import { BrowserRouter, Routes, Route } from 'react-router-dom';
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