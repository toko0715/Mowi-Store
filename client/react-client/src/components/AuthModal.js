import React, { useState } from 'react';
import Login from './Login';
import RegisterForm from './RegisterForm';
import './AuthModal.css';

function AuthModal({ isOpen, onClose, initialTab = 'login', onLoginSuccess }) {
  const [activeTab, setActiveTab] = useState(initialTab);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          ×
        </button>

        <h2 className="modal-title">
          Bienvenido a <span className="brand-name">MOWI</span>
        </h2>

        <div className="tabs">
          <button
            className={`tab ${activeTab === 'login' ? 'active' : ''}`}
            onClick={() => setActiveTab('login')}
          >
            Iniciar Sesión
          </button>
          <button
            className={`tab ${activeTab === 'register' ? 'active' : ''}`}
            onClick={() => setActiveTab('register')}
          >
            Crear Cuenta
          </button>
        </div>

        <div className="tab-content">
          {activeTab === 'login' ? (
            <Login
              onSwitchToRegister={() => setActiveTab('register')}
              onLoginSuccess={onLoginSuccess}
            />
          ) : (
            <RegisterForm />
          )}
        </div>
      </div>
    </div>
  );
}

export default AuthModal;
