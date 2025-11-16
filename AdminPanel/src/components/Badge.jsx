import React from 'react';

/**
 * Componente Badge reutilizable para mostrar estados
 */
function Badge({ children, variant = 'default', style = {} }) {
  const variants = {
    default: {
      bg: '#e2e8f0',
      color: '#4a5568'
    },
    success: {
      bg: '#d4edda',
      color: '#155724'
    },
    warning: {
      bg: '#fff4cd',
      color: '#856404'
    },
    danger: {
      bg: '#f8d7da',
      color: '#721c24'
    },
    info: {
      bg: '#d1ecf1',
      color: '#0c5460'
    },
    orange: {
      bg: '#fbd38d',
      color: '#744210'
    }
  };

  const variantStyle = variants[variant] || variants.default;

  return (
    <span style={{
      padding: '0.25rem 0.75rem',
      borderRadius: '9999px',
      fontSize: '0.75rem',
      fontWeight: '500',
      background: variantStyle.bg,
      color: variantStyle.color,
      ...style
    }}>
      {children}
    </span>
  );
}

export default Badge;

