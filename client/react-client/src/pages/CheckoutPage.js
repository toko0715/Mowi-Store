import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { carritoAPI, pedidosAPI, pagosAPI } from '../services/api';
import { direccionesAPI } from '../services/djangoApi';
import { useApp } from '../context/AppContext';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import SuccessMessage from '../components/SuccessMessage';
import './CheckoutPage.css';

// Nota: Debes configurar tu clave pública de Stripe
const stripePromise = loadStripe('pk_test_51SZKM861zpE2ojyR6pFUVl5vguOlO2dDeW8nxOkvzGdyWqKYf9zDb2b0CxIc1XHnDh9nYujMoiIKB2WGP7eIp6nM003a3Mm6Y2'); // Reemplazar con tu clave pública

function CheckoutForm({ carrito, total, direccionId, onSuccess }) {
  const stripe = useStripe();
  const elements = useElements();
  const { user } = useApp();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 1. Crear pedido desde el carrito
      const pedidoResponse = await pedidosAPI.crearDesdeCarrito(
        user.id, 
        'STRIPE'
      );
      const pedido = pedidoResponse.data;
      const totalFinal = total;

      // 2. Crear Payment Intent
      const paymentResponse = await pagosAPI.crearPaymentIntent(pedido.id, totalFinal);
      const { clientSecret } = paymentResponse.data;

      // 3. Confirmar el pago con Stripe
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      if (stripeError) {
        setError(stripeError.message);
        setLoading(false);
        return;
      }

      // 4. Confirmar el pago en el backend
      await pagosAPI.confirmar(paymentIntent.id);
      
      onSuccess(pedido.id);
    } catch (error) {
      console.error('Error en el proceso de pago:', error);
      setError('Error al procesar el pago. Por favor, intenta nuevamente.');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="checkout-form">
      <div className="payment-section">
        <h3>Información de Pago</h3>
        <div className="card-element-container">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
                invalid: {
                  color: '#9e2146',
                },
              },
            }}
          />
        </div>
      </div>

      {error && <ErrorMessage message={error} />}

      <button
        type="submit"
        disabled={!stripe || loading}
        className="btn-pay"
      >
        {loading ? 'Procesando...' : `Pagar S/ ${total.toFixed(2)}`}
      </button>
    </form>
  );
}

function CheckoutPage() {
  const { user, isAuthenticated, refreshCart } = useApp();
  const navigate = useNavigate();
  const [carrito, setCarrito] = useState(null);
  const [direcciones, setDirecciones] = useState([]);
  const [direccionSeleccionada, setDireccionSeleccionada] = useState(null);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [pedidoId, setPedidoId] = useState(null);

  const cargarCarrito = useCallback(async () => {
    if (!user?.id) return;
    
    setLoading(true);
    setError(null);
    try {
      const response = await carritoAPI.obtener(user.id);
      const carritoData = response.data;
      
      if (!carritoData?.items || carritoData.items.length === 0) {
        navigate('/carrito');
        return;
      }
      
      setCarrito(carritoData);
    } catch (error) {
      console.error('Error al cargar carrito:', error);
      setError('Error al cargar el carrito. Por favor, intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  }, [user, navigate]);

  const cargarDirecciones = useCallback(async () => {
    try {
      const response = await direccionesAPI.listar();
      const direccionesData = response.data;
      setDirecciones(direccionesData);
      
      // Seleccionar dirección principal por defecto
      const principal = direccionesData.find(d => d.es_principal);
      if (principal) {
        setDireccionSeleccionada(principal.id);
      } else if (direccionesData.length > 0) {
        setDireccionSeleccionada(direccionesData[0].id);
      }
    } catch (error) {
      console.error('Error al cargar direcciones:', error);
    }
  }, []);

  const cargarDatos = useCallback(async () => {
    await Promise.all([cargarCarrito(), cargarDirecciones()]);
  }, [cargarCarrito, cargarDirecciones]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
      return;
    }
    cargarDatos();
  }, [isAuthenticated, navigate, cargarDatos]);

  

  const calcularTotal = () => {
    if (!carrito?.items) return 0;
    return carrito.items.reduce((total, item) => {
      return total + parseFloat(item.subtotal || 0);
    }, 0);
  };

  const handleSuccess = (id) => {
    setPedidoId(id);
    setSuccess(true);
    refreshCart();
    setTimeout(() => {
      navigate(`/mis-pedidos`);
    }, 3000);
  };

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  if (!isAuthenticated || !carrito) {
    return null;
  }

  if (success) {
    return (
      <div className="checkout-page">
        <div className="checkout-success">
          <div className="success-icon">✅</div>
          <h1>¡Pago Exitoso!</h1>
          <p>Tu pedido ha sido procesado correctamente.</p>
          <p>Número de pedido: #{pedidoId}</p>
          <p>Serás redirigido a tus pedidos en unos segundos...</p>
        </div>
      </div>
    );
  }

  const total = calcularTotal();

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <h1 className="checkout-title">Checkout</h1>

        {error && (
          <ErrorMessage 
            message={error} 
            onRetry={cargarCarrito}
            onClose={() => setError(null)}
          />
        )}

        <div className="checkout-content">
          <div className="checkout-summary">
            <h2>Resumen del Pedido</h2>
            
            

            {/* Sección de Dirección */}
            {direcciones.length > 0 && (
              <div className="direccion-section">
                <h3>Dirección de Envío</h3>
                <select
                  value={direccionSeleccionada || ''}
                  onChange={(e) => setDireccionSeleccionada(parseInt(e.target.value))}
                  className="direccion-select"
                >
                  {direcciones.map((dir) => (
                    <option key={dir.id} value={dir.id}>
                      {dir.nombre_completo} - {dir.direccion}, {dir.ciudad}
                      {dir.es_principal && ' (Principal)'}
                    </option>
                  ))}
                </select>
                <Link to="/mi-perfil?tab=direcciones" className="link-agregar-direccion">
                  + Agregar nueva dirección
                </Link>
              </div>
            )}

            <div className="summary-items">
              {carrito.items.map((item) => (
                <div key={item.id} className="summary-item">
                  <div className="summary-item-info">
                    <span className="summary-item-name">{item.producto?.nombre}</span>
                    <span className="summary-item-qty">x{item.cantidad}</span>
                  </div>
                  <span className="summary-item-price">
                    S/ {parseFloat(item.subtotal || 0).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
            
            <div className="summary-total">
              <span>Total:</span>
              <span>S/ {total.toFixed(2)}</span>
            </div>
          </div>

          <div className="checkout-payment">
            <Elements stripe={stripePromise}>
              <CheckoutForm 
                carrito={carrito} 
                total={total}
                direccionId={direccionSeleccionada}
                onSuccess={handleSuccess}
              />
            </Elements>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;

