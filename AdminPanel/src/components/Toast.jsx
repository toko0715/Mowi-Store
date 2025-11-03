import React, { useEffect } from 'react';

/**
 * Componente Toast individual
 */
function Toast({ message, type = 'info', onClose, duration = 3000 }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const types = {
    success: {
      bg: '#d4edda',
      color: '#155724',
      icon: '✅'
    },
    error: {
      bg: '#f8d7da',
      color: '#721c24',
      icon: '❌'
    },
    warning: {
      bg: '#fff3cd',
      color: '#856404',
      icon: '⚠️'
    },
    info: {
      bg: '#d1ecf1',
      color: '#0c5460',
      icon: 'ℹ️'
    }
  };

  const style = types[type] || types.info;

  return (
    <div style={{
      background: style.bg,
      color: style.color,
      padding: '1rem 1.25rem',
      borderRadius: '8px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      marginBottom: '0.75rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      minWidth: '300px',
      maxWidth: '500px',
      animation: 'slideIn 0.3s ease-out'
    }}>
      <span style={{ fontSize: '1.25rem' }}>{style.icon}</span>
      <span style={{ flex: 1, fontSize: '0.875rem', fontWeight: '500' }}>{message}</span>
      <button
        onClick={onClose}
        style={{
          background: 'transparent',
          border: 'none',
          color: style.color,
          cursor: 'pointer',
          fontSize: '1.25rem',
          padding: '0',
          lineHeight: 1,
          opacity: 0.7
        }}
      >
        ×
      </button>
      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}

export default Toast;

