import React from 'react';
import './ErrorMessage.css';

function ErrorMessage({ message, onRetry, onClose }) {
  return (
    <div className="error-message">
      <div className="error-icon">⚠️</div>
      <div className="error-content">
        <h3 className="error-title">Error</h3>
        <p className="error-text">{message || 'Ha ocurrido un error inesperado'}</p>
        <div className="error-actions">
          {onRetry && (
            <button className="error-btn error-btn-retry" onClick={onRetry}>
              Reintentar
            </button>
          )}
          {onClose && (
            <button className="error-btn error-btn-close" onClick={onClose}>
              Cerrar
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ErrorMessage;

