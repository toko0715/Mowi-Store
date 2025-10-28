import React, { useState } from 'react';
import './App.css';
import AuthModal from './components/AuthModal';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [initialTab, setInitialTab] = useState('login');

  const openModal = (tab) => {
    setInitialTab(tab);
    setIsModalOpen(true);
  };

  return (
    <div className="App">
      {/* Simulación de navbar como en el Figma */}
      <nav className="navbar">
        <div className="nav-brand">MOWI</div>
        <div className="nav-buttons">
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
        </div>
      </nav>

      {/* Hero section simulando el Figma */}
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
      />
    </div>
  );
}

export default App;
