import React, { useEffect, useState } from 'react';
import './SuccessMessage.css';

function SuccessMessage({ message, onClose, autoClose = 3000 }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (autoClose > 0) {
      const timer = setTimeout(() => {
        setVisible(false);
        if (onClose) onClose();
      }, autoClose);
      return () => clearTimeout(timer);
    }
  }, [autoClose, onClose]);

  if (!visible) return null;

  return (
    <div className="success-message">
      <div className="success-icon">✅</div>
      <div className="success-content">
        <p className="success-text">{message}</p>
      </div>
      {onClose && (
        <button className="success-close" onClick={() => {
          setVisible(false);
          onClose();
        }}>
          ×
        </button>
      )}
    </div>
  );
}

export default SuccessMessage;

