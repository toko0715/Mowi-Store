import React from 'react';

/**
 * Componente KPICard reutilizable para métricas
 */
function KPICard({ title, value, change, icon, color, iconBg, isWarning = false }) {
  return (
    <div style={{
      background: 'white',
      borderRadius: '12px',
      padding: '1.5rem',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
      border: '1px solid #e2e8f0'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'start',
        marginBottom: '1rem'
      }}>
        <div style={{ flex: 1 }}>
          <p style={{
            fontSize: '0.875rem',
            color: '#718096',
            marginBottom: '0.5rem',
            fontWeight: '600'
          }}>
            {title}
          </p>
          <h3 style={{
            fontSize: '2rem',
            fontWeight: '700',
            color: color,
            marginBottom: '0.5rem'
          }}>
            {value}
          </h3>
        </div>
        <div style={{
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          background: iconBg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.5rem'
        }}>
          {icon}
        </div>
      </div>
      <p style={{
        fontSize: '0.875rem',
        color: color,
        display: 'flex',
        alignItems: 'center',
        gap: '0.25rem'
      }}>
        {!isWarning && '↗'} {change}
      </p>
    </div>
  );
}

export default KPICard;

