import React from 'react';

/**
 * Componente de gráfico de líneas (barras)
 */
function LineChart({ data = [] }) {
  if (data.length === 0) {
    return (
      <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#718096' }}>
        <p>No hay datos de usuarios disponibles</p>
      </div>
    );
  }

  const maxValue = Math.max(...data.map(d => d.cantidad), 1);

  return (
    <div style={{ height: '300px', display: 'flex', alignItems: 'end', justifyContent: 'space-between', gap: '1rem' }}>
      {data.map((item, index) => {
        const height = maxValue > 0 ? (item.cantidad / maxValue) * 100 : 0;
        return (
          <div key={index} style={{ 
            flex: 1, 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            justifyContent: 'flex-end',
            height: '100%'
          }}>
            <div style={{ 
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'flex-end'
            }}>
              <div style={{
                width: '40px',
                height: `${height}%`,
                background: item.cantidad > 0 ? 'linear-gradient(180deg, #4299e1 0%, #3182ce 100%)' : 'transparent',
                borderRadius: '4px 4px 0 0',
                minHeight: item.cantidad > 0 ? '8px' : '0',
                marginBottom: '0.5rem',
                transition: 'height 0.3s ease'
              }}></div>
              <div style={{
                fontSize: '0.875rem',
                fontWeight: '600',
                color: '#2d3748',
                marginBottom: '0.5rem'
              }}>
                {item.cantidad}
              </div>
              <div style={{
                fontSize: '0.75rem',
                color: '#718096',
                textAlign: 'center'
              }}>
                {item.dia}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default LineChart;

