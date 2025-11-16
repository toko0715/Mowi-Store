import React from 'react';

/**
 * Componente de gráfico de pastel
 */
function PieChart({ data = [] }) {
  if (data.length === 0) {
    return (
      <div style={{ height: '250px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#718096' }}>
        <p>No hay productos vendidos</p>
      </div>
    );
  }

  return (
    <div style={{ height: '250px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '0.75rem' }}>
      {data.map((item, index) => (
        <div key={index} style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem'
        }}>
          <div style={{
            width: '24px',
            height: '24px',
            borderRadius: '4px',
            background: item.color || '#ff6b35'
          }}></div>
          <span style={{
            fontSize: '0.875rem',
            color: '#2d3748'
          }}>
            {item.nombre || item.categoria} {item.porcentaje}%
          </span>
        </div>
      ))}
    </div>
  );
}

export default PieChart;

