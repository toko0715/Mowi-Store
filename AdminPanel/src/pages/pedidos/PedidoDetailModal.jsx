import React from 'react';
import Modal from '../../components/Modal';
import Badge from '../../components/Badge';

/**
 * Modal para mostrar detalles de un pedido
 */
function PedidoDetailModal({ isOpen, onClose, pedido, detalles, loading }) {
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

  if (!pedido) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Detalles del Pedido #${pedido.id}`} width="700px">
      {/* Información del Pedido */}
      <div style={{
        background: '#f7fafc',
        borderRadius: '8px',
        padding: '1.5rem',
        marginBottom: '1.5rem'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '1rem'
        }}>
          <div>
            <p style={{ fontSize: '0.875rem', color: '#718096', marginBottom: '0.25rem' }}>Cliente</p>
            <p style={{ fontSize: '1rem', fontWeight: '600', color: '#2d3748' }}>
              {pedido.usuario_nombre || 'N/A'}
            </p>
            <p style={{ fontSize: '0.875rem', color: '#718096' }}>
              {pedido.usuario_email || ''}
            </p>
          </div>
          <div>
            <p style={{ fontSize: '0.875rem', color: '#718096', marginBottom: '0.25rem' }}>Estado</p>
            {getStatusBadge(pedido.estado)}
          </div>
          <div>
            <p style={{ fontSize: '0.875rem', color: '#718096', marginBottom: '0.25rem' }}>Fecha</p>
            <p style={{ fontSize: '1rem', fontWeight: '600', color: '#2d3748' }}>
              {new Date(pedido.fecha_pedido).toLocaleDateString('es-PE', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
          <div>
            <p style={{ fontSize: '0.875rem', color: '#718096', marginBottom: '0.25rem' }}>Método de Pago</p>
            <p style={{ fontSize: '1rem', fontWeight: '600', color: '#2d3748' }}>
              {pedido.metodo_pago}
            </p>
          </div>
        </div>
      </div>

      {/* Productos del Pedido */}
      <div>
        <h3 style={{
          fontSize: '1.125rem',
          fontWeight: '600',
          color: '#2d3748',
          marginBottom: '1rem'
        }}>
          Productos
        </h3>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <p>Cargando detalles...</p>
          </div>
        ) : detalles.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#718096' }}>
            <p>No hay detalles disponibles</p>
          </div>
        ) : (
          <div style={{
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            overflow: 'hidden'
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ background: '#f7fafc' }}>
                <tr>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.875rem', color: '#718096', fontWeight: '600' }}>
                    Producto
                  </th>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'center', fontSize: '0.875rem', color: '#718096', fontWeight: '600' }}>
                    Cantidad
                  </th>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'right', fontSize: '0.875rem', color: '#718096', fontWeight: '600' }}>
                    Precio Unit.
                  </th>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'right', fontSize: '0.875rem', color: '#718096', fontWeight: '600' }}>
                    Subtotal
                  </th>
                </tr>
              </thead>
              <tbody>
                {detalles.map(detalle => {
                  const subtotal = parseFloat(detalle.precio_unitario) * detalle.cantidad;
                  return (
                    <tr key={detalle.id} style={{ borderTop: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '1rem' }}>
                        <span style={{ fontWeight: '600', color: '#2d3748' }}>
                          {detalle.producto_nombre || `Producto #${detalle.producto}`}
                        </span>
                      </td>
                      <td style={{ padding: '1rem', textAlign: 'center', color: '#2d3748' }}>
                        {detalle.cantidad}
                      </td>
                      <td style={{ padding: '1rem', textAlign: 'right', color: '#2d3748' }}>
                        S/ {parseFloat(detalle.precio_unitario).toFixed(2)}
                      </td>
                      <td style={{ padding: '1rem', textAlign: 'right', fontWeight: '600', color: '#2d3748' }}>
                        S/ {subtotal.toFixed(2)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot style={{ background: '#f7fafc', borderTop: '2px solid #e2e8f0' }}>
                <tr>
                  <td colSpan="3" style={{ padding: '1rem', textAlign: 'right', fontWeight: '700', color: '#2d3748' }}>
                    Total:
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'right', fontSize: '1.25rem', fontWeight: '700', color: '#ff6b35' }}>
                    S/ {parseFloat(pedido.total).toFixed(2)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>

      {/* Botón Cerrar */}
      <div style={{
        display: 'flex',
        justifyContent: 'flex-end',
        marginTop: '2rem'
      }}>
        <button
          onClick={onClose}
          style={{
            padding: '0.75rem 1.5rem',
            background: '#ff6b35',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          Cerrar
        </button>
      </div>
    </Modal>
  );
}

export default PedidoDetailModal;

