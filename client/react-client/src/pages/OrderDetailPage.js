import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { pedidosAPI, pagosAPI } from '../services/api';
import { useApp } from '../context/AppContext';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe('pk_test_51SZKM861zpE2ojyR6pFUVl5vguOlO2dDeW8nxOkvzGdyWqKYf9zDb2b0CxIc1XHnDh9nYujMoiIKB2WGP7eIp6nM003a3Mm6Y2');

function OrderDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useApp();
  const [pedido, setPedido] = useState(null);
  const [detalles, setDetalles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const cargarDetalle = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await pedidosAPI.obtenerDetalle(id);
      const data = response.data || {};
      setPedido(data.pedido || null);
      setDetalles(Array.isArray(data.detalles) ? data.detalles : []);
    } catch (error) {
      setError('Error al cargar el detalle del pedido.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
      return;
    }
    cargarDetalle();
  }, [isAuthenticated, navigate, cargarDetalle]);

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

  if (error || !pedido) {
    return (
      <div style={{ padding: '100px 60px', textAlign: 'center' }}>
        <ErrorMessage 
          message={error || 'Pedido no encontrado'} 
          onRetry={cargarDetalle}
          onClose={() => setError(null)}
        />
      </div>
    );
  }

  const calcularSubtotal = (detalle) => {
    const precio = parseFloat(detalle.precioUnitario || 0);
    const cantidad = parseInt(detalle.cantidad || 0, 10);
    return precio * cantidad;
  };

  function OrderPaymentForm({ pedido, onPaid }) {
    const stripe = useStripe();
    const elements = useElements();
    const [payLoading, setPayLoading] = useState(false);
    const [payError, setPayError] = useState(null);

    const handlePay = async (e) => {
      e.preventDefault();
      if (!stripe || !elements) return;

      setPayLoading(true);
      setPayError(null);
      try {
        const monto = parseFloat(pedido.total || 0);
        const paymentResponse = await pagosAPI.crearPaymentIntent(pedido.id, monto);
        const { clientSecret } = paymentResponse.data;

        const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
          payment_method: { card: elements.getElement(CardElement) },
        });

        if (stripeError) {
          setPayError(stripeError.message);
          setPayLoading(false);
          return;
        }

        await pagosAPI.confirmar(paymentIntent.id);

        try {
          await pedidosAPI.actualizarEstado(pedido.id, 'PROCESANDO');
        } catch (_) {}

        onPaid();
      } catch (err) {
        setPayError('Error al procesar el pago. Intenta nuevamente.');
      } finally {
        setPayLoading(false);
      }
    };

    return (
      <form onSubmit={handlePay} style={{ marginTop: 12 }}>
        <div style={{ border: '1px solid #e0e0e0', borderRadius: 8, padding: 12, marginBottom: 12 }}>
          <CardElement
            options={{
              style: {
                base: { fontSize: '16px', color: '#424770' },
                invalid: { color: '#9e2146' },
              },
            }}
          />
        </div>
        {payError && (
          <div style={{ color: '#e74c3c', fontSize: 14, marginBottom: 8 }}>{payError}</div>
        )}
        <button
          type="submit"
          disabled={!stripe || payLoading}
          style={{
            padding: '10px 16px',
            background: '#FF8C00',
            color: 'white',
            border: 'none',
            borderRadius: 6,
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          {payLoading ? 'Procesando...' : `Pagar S/ ${parseFloat(pedido.total || 0).toFixed(2)}`}
        </button>
      </form>
    );
  }

  return (
    <div style={{ minHeight: '100vh', padding: '40px 60px', background: 'linear-gradient(180deg, #f9f9f9 0%, #ffffff 100%)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ marginBottom: 20 }}>
          <Link to="/mis-pedidos" style={{ textDecoration: 'none', color: '#3498db' }}>
            ← Volver a Mis Pedidos
          </Link>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20, paddingBottom: 15, borderBottom: '2px solid #e0e0e0' }}>
          <div>
            <h1 style={{ fontSize: 28, margin: 0 }}>Pedido #{pedido.id}</h1>
            <p style={{ fontSize: 14, color: '#999', margin: '6px 0 0 0' }}>{formatearFecha(pedido.fechaPedido)}</p>
          </div>
          <span 
            style={{
              display: 'inline-block',
              padding: '6px 16px',
              borderRadius: 20,
              color: 'white',
              fontSize: 14,
              fontWeight: 600,
              textTransform: 'uppercase',
              backgroundColor: getEstadoColor(pedido.estado)
            }}
          >
            {pedido.estado}
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 20 }}>
          <div style={{ background: 'white', borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
            <div style={{ padding: 24, borderBottom: '2px solid #e0e0e0' }}>
              <h2 style={{ fontSize: 20, margin: 0 }}>Productos</h2>
            </div>
            <div style={{ padding: 24 }}>
              {detalles.length === 0 ? (
                <p style={{ color: '#666' }}>No hay productos en este pedido.</p>
              ) : (
                detalles.map((detalle) => (
                  <div key={detalle.id} style={{ display: 'flex', alignItems: 'center', padding: '16px 0', borderBottom: '1px solid #f0f0f0' }}>
                    <div style={{ width: 72, height: 72, borderRadius: 8, background: '#fafafa', overflow: 'hidden', marginRight: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {detalle.producto?.imagen ? (
                        <img 
                          src={detalle.producto.imagen}
                          alt={detalle.producto?.nombre || 'Producto'}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          onError={(e) => { e.target.style.display = 'none'; }}
                        />
                      ) : (
                        <span style={{ fontSize: 12, color: '#999' }}>Sin imagen</span>
                      )}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 16, fontWeight: 600, color: '#333' }}>{detalle.producto?.nombre || 'Producto'}</div>
                      <div style={{ fontSize: 14, color: '#666', marginTop: 4 }}>x{detalle.cantidad}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 14, color: '#666' }}>Precio</div>
                      <div style={{ fontSize: 16, fontWeight: 600 }}>S/ {parseFloat(detalle.precioUnitario || 0).toFixed(2)}</div>
                      <div style={{ fontSize: 12, color: '#999', marginTop: 6 }}>Subtotal: S/ {calcularSubtotal(detalle).toFixed(2)}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div style={{ background: 'white', borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.08)', padding: 24, height: 'fit-content' }}>
            <h2 style={{ fontSize: 20, marginTop: 0 }}>Resumen</h2>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', fontSize: 16, color: '#666' }}>
              <span>Método de pago</span>
              <span>{pedido.metodoPago || 'N/A'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', fontSize: 16, color: '#666' }}>
              <span>Total</span>
              <span style={{ fontSize: 20, fontWeight: 700, color: '#FF8C00' }}>S/ {parseFloat(pedido.total || 0).toFixed(2)}</span>
            </div>
            {String(pedido.estado).toUpperCase() === 'PENDIENTE' && (
              <div style={{ marginTop: 12 }}>
                <div style={{ fontSize: 14, color: '#666', marginBottom: 8 }}>Pagar ahora</div>
                <Elements stripe={stripePromise}>
                  <OrderPaymentForm pedido={pedido} onPaid={async () => {
                    await cargarDetalle();
                  }} />
                </Elements>
                <div style={{ marginTop: 16 }}>
                  <button
                    onClick={async () => {
                      const ok = window.confirm('¿Deseas cancelar este pedido? Esta acción liberará el stock.');
                      if (!ok) return;
                      try {
                        await pedidosAPI.actualizarEstado(pedido.id, 'CANCELADO');
                        await cargarDetalle();
                      } catch (_) {}
                    }}
                    style={{
                      padding: '10px 16px',
                      background: '#e74c3c',
                      color: 'white',
                      border: 'none',
                      borderRadius: 6,
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    Cancelar pedido
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderDetailPage;
