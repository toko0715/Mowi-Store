import React from 'react';
import './LoadingSpinner.css';

function LoadingSpinner({ size = 'medium', fullScreen = false }) {
  const sizeClass = `spinner-${size}`;
  const containerClass = fullScreen ? 'loading-fullscreen' : 'loading-container';

  return (
    <div className={containerClass}>
      <div className={`spinner ${sizeClass}`}></div>
      <p className="loading-text">Cargando...</p>
    </div>
  );
}

export default LoadingSpinner;

