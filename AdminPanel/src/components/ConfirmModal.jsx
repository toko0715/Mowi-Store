import React from 'react';
import Modal from './Modal';

/**
 * Componente Modal de confirmación reutilizable
 */
function ConfirmModal({ isOpen, onClose, onConfirm, title = 'Confirmar Acción', message, confirmText = 'Confirmar', cancelText = 'Cancelar', variant = 'danger' }) {
  const variants = {
    danger: {
      confirmBg: '#f56565',
      confirmColor: 'white'
    },
    warning: {
      confirmBg: '#ed8936',
      confirmColor: 'white'
    },
    info: {
      confirmBg: '#4299e1',
      confirmColor: 'white'
    }
  };

  const variantStyle = variants[variant] || variants.danger;

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} width="400px">
      <div style={{ marginBottom: '2rem' }}>
        <p style={{ fontSize: '1rem', color: '#2d3748', lineHeight: '1.6' }}>
          {message}
        </p>
      </div>
      
      <div style={{
        display: 'flex',
        gap: '1rem',
        justifyContent: 'flex-end'
      }}>
        <button
          onClick={onClose}
          style={{
            padding: '0.75rem 1.5rem',
            background: 'white',
            color: '#4a5568',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          {cancelText}
        </button>
        <button
          onClick={handleConfirm}
          style={{
            padding: '0.75rem 1.5rem',
            background: variantStyle.confirmBg,
            color: variantStyle.confirmColor,
            border: 'none',
            borderRadius: '8px',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          {confirmText}
        </button>
      </div>
    </Modal>
  );
}

export default ConfirmModal;

