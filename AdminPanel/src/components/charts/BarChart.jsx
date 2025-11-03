import React from 'react';

/**
 * Componente de gráfico de barras
 */
function BarChart({ data = [] }) {
  const maxValue = data.length > 0 ? Math.max(...data.map(d => d.total)) : 1;

  if (data.length === 0) {
    return (
      <div style={{ height: '250px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#718096' }}>
        <p>No hay datos de ventas disponibles</p>
      </div>
    );
  }

  return (
    <div style={{ height: '250px', display: 'flex', alignItems: 'end', gap: '0.75rem' }}>
      {data.slice(0, 6).map((item, index) => (
        <div key={index} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{
            width: '100%',
            height: `${(item.total / maxValue) * 100}%`,
            background: '#ff6b35',
            borderRadius: '4px 4px 0 0',
            minHeight: '20px'
          }}></div>
          <span style={{
            fontSize: '0.75rem',
            color: '#718096',
            marginTop: '0.5rem'
          }}>
            {item.categoria}
          </span>
        </div>
      ))}
    </div>
  );
}

export default BarChart;

