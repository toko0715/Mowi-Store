import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './Sidebar';
import Dashboard from './Dashboard';
import Productos from './pages/Productos';
import ProductoForm from './pages/ProductoForm';
import Inventario from './pages/Inventario';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
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

function Reportes() {
  return (
    <main style={{ marginLeft: '280px', padding: '2rem', backgroundColor: '#f7fafc' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: '700', color: '#2d3748', marginBottom: '1rem' }}>Reportes</h1>
      <p style={{ color: '#718096' }}>Página de reportes en desarrollo</p>
    </main>
  );
}

function Pedidos() {
  return (
    <main style={{ marginLeft: '280px', padding: '2rem', backgroundColor: '#f7fafc' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: '700', color: '#2d3748', marginBottom: '1rem' }}>Pedidos / Usuarios</h1>
      <p style={{ color: '#718096' }}>Gestión de pedidos y usuarios</p>
    </main>
  );
}

function Configuracion() {
  return (
    <main style={{ marginLeft: '280px', padding: '2rem', backgroundColor: '#f7fafc' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: '700', color: '#2d3748', marginBottom: '1rem' }}>Configuración</h1>
      <p style={{ color: '#718096' }}>Opciones de configuración del sistema</p>
    </main>
  );
}

export default App;