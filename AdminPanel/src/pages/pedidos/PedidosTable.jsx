import React from 'react';
import Badge from '../../components/Badge';
import useSort from '../../hooks/useSort';

/**
 * Componente de tabla de pedidos
 */
function PedidosTable({ pedidos, onViewDetails, onUpdateEstado }) {
  const { sortField, sortDirection, handleSort, sortData } = useSort();

  const getStatusBadge = (estado) => {
    const statusMap = {
      'pendiente': 'warning',
      'en_proceso': 'success',
      'enviado': 'info',
      'entregado': 'success',
      'cancelado': 'danger'
    };
    
    const statusText = estado?.charAt(0).toUpperCase() + estado?.slice(1);
    return <Badge variant={statusMap[estado] || 'default'}>{statusText}</Badge>;
  };

  const getSortValue = (row, field) => {
    switch (field) {
      case 'id':
        return row.id;
      case 'total':
        return parseFloat(row.total || 0);
      case 'fecha':
        return new Date(row.fecha_pedido);
      case 'cliente':
        return (row.usuario_nombre || '').toLowerCase();
      default:
        return row[field];
    }
  };

  const sortedPedidos = sortData(pedidos, getSortValue);

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
            <th 
              style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', color: '#718096', fontWeight: '600', cursor: 'pointer' }}
              onClick={() => handleSort('id')}
            >
              ID {sortField === 'id' && (sortDirection === 'asc' ? '↑' : '↓')}
            </th>
            <th 
              style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', color: '#718096', fontWeight: '600', cursor: 'pointer' }}
              onClick={() => handleSort('cliente')}
            >
              Cliente {sortField === 'cliente' && (sortDirection === 'asc' ? '↑' : '↓')}
            </th>
            <th 
              style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', color: '#718096', fontWeight: '600', cursor: 'pointer' }}
              onClick={() => handleSort('total')}
            >
              Total {sortField === 'total' && (sortDirection === 'asc' ? '↑' : '↓')}
            </th>
            <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', color: '#718096', fontWeight: '600' }}>
              Estado
            </th>
            <th 
              style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', color: '#718096', fontWeight: '600', cursor: 'pointer' }}
              onClick={() => handleSort('fecha')}
            >
              Fecha {sortField === 'fecha' && (sortDirection === 'asc' ? '↑' : '↓')}
            </th>
            <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', color: '#718096', fontWeight: '600' }}>
              Pago
            </th>
            <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', color: '#718096', fontWeight: '600' }}>
              Acciones
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedPedidos.length === 0 ? (
            <tr>
              <td colSpan="7" style={{ padding: '2rem', textAlign: 'center', color: '#718096' }}>
                No se encontraron pedidos con los filtros aplicados
              </td>
            </tr>
          ) : (
            sortedPedidos.map(pedido => (
              <tr key={pedido.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                <td style={{ padding: '1rem', fontWeight: '600', color: '#2d3748' }}>#{pedido.id}</td>
                <td style={{ padding: '1rem' }}>
                  <div>{pedido.usuario_nombre || 'N/A'}</div>
                  <div style={{ fontSize: '0.875rem', color: '#718096' }}>{pedido.usuario_email || ''}</div>
                </td>
                <td style={{ padding: '1rem', fontWeight: '600', color: '#2d3748' }}>
                  S/ {parseFloat(pedido.total).toFixed(2)}
                </td>
                <td style={{ padding: '1rem' }}>
                  <select
                    value={pedido.estado}
                    onChange={(e) => onUpdateEstado(pedido.id, e.target.value)}
                    style={{
                      padding: '0.25rem 0.5rem',
                      border: '1px solid #e2e8f0',
                      borderRadius: '6px',
                      fontSize: '0.75rem',
                      fontWeight: '500',
                      cursor: 'pointer',
                      background: 'white'
                    }}
                  >
                    <option value="pendiente">Pendiente</option>
                    <option value="en_proceso">En Proceso</option>
                    <option value="enviado">Enviado</option>
                    <option value="entregado">Entregado</option>
                    <option value="cancelado">Cancelado</option>
                  </select>
                </td>
                <td style={{ padding: '1rem', color: '#718096', fontSize: '0.875rem' }}>
                  {new Date(pedido.fecha_pedido).toLocaleDateString('es-PE')}
                </td>
                <td style={{ padding: '1rem', color: '#718096', fontSize: '0.875rem' }}>
                  {pedido.metodo_pago}
                </td>
                <td style={{ padding: '1rem' }}>
                  <button
                    onClick={() => onViewDetails(pedido)}
                    style={{
                      padding: '0.5rem 1rem',
                      background: '#ff6b35',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '0.875rem',
                      cursor: 'pointer'
                    }}
                  >
                    Ver Detalles
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default PedidosTable;

