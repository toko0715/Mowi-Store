import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { pedidosAPI } from '../services/api';
import { useApp } from '../context/AppContext';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import './MyOrdersPage.css';

function MyOrdersPage() {
  const { user, isAuthenticated } = useApp();
  const navigate = useNavigate();
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
      return;
    }
    cargarPedidos();
  }, [isAuthenticated, user]);

  const cargarPedidos = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    setError(null);
    try {
      const response = await pedidosAPI.listar(user.id);
      setPedidos(response.data);
    } catch (error) {
      console.error('Error al cargar pedidos:', error);
      setError('Error al cargar los pedidos. Por favor, intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const getEstadoColor = (estado) => {
    switch (estado?.toUpperCase()) {
      case 'PENDIENTE':
        return '#f39c12';
      case 'PROCESANDO':
        return '#3498db';
      case 'ENVIADO':
        return '#9b59b6';
      case 'ENTREGADO':
        return '#27ae60';
      case 'CANCELADO':
        return '#e74c3c';
      default:
        return '#95a5a6';
    }
  };

  const formatearFecha = (fecha) => {
    if (!fecha) return 'N/A';
    const date = new Date(fecha);
    return date.toLocaleDateString('es-PE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="orders-page">
      <div className="orders-container">
        <h1 className="orders-title">Mis Pedidos</h1>

        {error && (
          <ErrorMessage 
            message={error} 
            onRetry={cargarPedidos}
            onClose={() => setError(null)}
          />
        )}

        {pedidos.length === 0 ? (
          <div className="no-orders">
            <div className="empty-icon">📦</div>
            <h2>No tienes pedidos aún</h2>
            <p>Cuando realices una compra, aparecerá aquí</p>
            <Link to="/catalogo" className="btn-shop-now">
              Comenzar a Comprar
            </Link>
          </div>
        ) : (
          <div className="orders-list">
            {pedidos.map((pedido) => (
              <div key={pedido.id} className="order-card">
                <div className="order-header">
                  <div className="order-info">
                    <h3>Pedido #{pedido.id}</h3>
                    <p className="order-date">{formatearFecha(pedido.fechaPedido)}</p>
                  </div>
                  <div className="order-status">
                    <span 
                      className="status-badge"
                      style={{ backgroundColor: getEstadoColor(pedido.estado) }}
                    >
                      {pedido.estado}
                    </span>
                  </div>
                </div>

                <div className="order-details">
                  <div className="order-detail-row">
                    <span>Total:</span>
                    <span className="order-total">S/ {parseFloat(pedido.total || 0).toFixed(2)}</span>
                  </div>
                  <div className="order-detail-row">
                    <span>Método de pago:</span>
                    <span>{pedido.metodoPago || 'N/A'}</span>
                  </div>
                </div>

                <div className="order-actions">
                  <Link to={`/pedido/${pedido.id}`} className="btn-view-details">
                    Ver Detalles
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyOrdersPage;

