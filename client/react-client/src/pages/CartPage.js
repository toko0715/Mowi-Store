import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { carritoAPI, productosAPI } from '../services/api';
import { useApp } from '../context/AppContext';
import { 
    getGuestCart, 
    updateGuestCartItem, 
    removeFromGuestCart, 
    clearGuestCart
} from '../utils/guestCart';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import SuccessMessage from '../components/SuccessMessage';
import './CartPage.css';

function CartPage() {
    const { user, isAuthenticated, refreshCart } = useApp();
    const navigate = useNavigate(); // Añadido para corrección de eslint
    const [carrito, setCarrito] = useState(null);
    const [guestCartItems, setGuestCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [updatingItems, setUpdatingItems] = useState(new Set());

    // FUNCIÓN DE CARGA PARA USUARIO LOGUEADO (USANDO useCallback)
    const cargarCarrito = useCallback(async () => {
        if (!user?.id) return;
        
        setLoading(true);
        setError(null);
        try {
            const response = await carritoAPI.obtener(user.id);
            setCarrito(response.data);
        } catch (error) {
            console.error('Error al cargar carrito:', error);
            setError('Error al cargar el carrito. Por favor, intenta nuevamente.');
        } finally {
            setLoading(false);
        }
    }, [user?.id]); // Dependencia clave: user.id

    // FUNCIÓN DE CARGA PARA INVITADO (USANDO useCallback)
    const cargarCarritoInvitado = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const guestCart = getGuestCart();
            
            // Cargar información de productos
            const productosPromises = guestCart.map(async (item) => {
                try {
                    const productoResponse = await productosAPI.obtenerPorId(item.productoId);
                    return {
                        id: item.productoId,
                        producto: productoResponse.data,
                        cantidad: item.cantidad,
                        subtotal: parseFloat(productoResponse.data.precio) * item.cantidad,
                    };
                } catch (error) {
                    console.error(`Error al cargar producto ${item.productoId}:`, error);
                    return null;
                }
            });

            const items = (await Promise.all(productosPromises)).filter(item => item !== null);
            setGuestCartItems(items);
        } catch (error) {
            console.error('Error al cargar carrito invitado:', error);
            setError('Error al cargar el carrito. Por favor, intenta nuevamente.');
        } finally {
            setLoading(false);
        }
    }, []); // Sin dependencias, solo usa datos locales/APIs

    // EFECTO PRINCIPAL (Ahora usa las funciones estables como dependencias)
    useEffect(() => {
        if (isAuthenticated) {
            cargarCarrito();
        } else {
            // Mostrar carrito invitado
            cargarCarritoInvitado();
        }
    }, [isAuthenticated, user?.id, cargarCarrito, cargarCarritoInvitado]);

    const handleActualizarCantidad = async (productoId, nuevaCantidad) => {
        if (nuevaCantidad < 1) return;

        if (isAuthenticated && user?.id) {
            setUpdatingItems(prev => new Set(prev).add(productoId));
            try {
                await carritoAPI.actualizar(user.id, productoId, nuevaCantidad);
                await cargarCarrito();
                refreshCart();
            } catch (error) {
                console.error('Error al actualizar cantidad:', error);
                alert('Error al actualizar la cantidad');
            } finally {
                setUpdatingItems(prev => {
                    const newSet = new Set(prev);
                    newSet.delete(productoId);
                    return newSet;
                });
            }
        } else {
            // Actualizar carrito invitado
            updateGuestCartItem(productoId, nuevaCantidad);
            await cargarCarritoInvitado();
            refreshCart();
        }
    };

    // FUNCIÓN DE ELIMINACIÓN CORREGIDA (Garantiza recarga después del DELETE)
    const handleEliminar = async (itemId, productoId) => {
        if (!window.confirm('¿Estás seguro de que deseas eliminar este producto del carrito?')) {
            return;
        }

        if (isAuthenticated && user?.id) {
            try {
                await carritoAPI.eliminar(user.id, itemId);
                setSuccessMessage('Producto eliminado del carrito');
                await cargarCarrito(); // <-- Vuelve a pedir la lista actualizada al backend
                refreshCart();         // <-- Actualiza el contador global
                setTimeout(() => setSuccessMessage(null), 3000);
            } catch (error) {
                console.error('Error al eliminar producto:', error);
                alert('Error al eliminar el producto');
            }
        } else {
            // Lógica de Invitado (ya estaba correcta)
            removeFromGuestCart(productoId);
            setSuccessMessage('Producto eliminado del carrito');
            await cargarCarritoInvitado();
            refreshCart();
            setTimeout(() => setSuccessMessage(null), 3000);
        }
    };

    const handleLimpiarCarrito = async () => {
        if (!window.confirm('¿Estás seguro de que deseas vaciar el carrito?')) {
            return;
        }

        if (isAuthenticated && user?.id) {
            try {
                await carritoAPI.limpiar(user.id);
                setSuccessMessage('Carrito vaciado');
                await cargarCarrito();
                refreshCart();
                setTimeout(() => setSuccessMessage(null), 3000);
            } catch (error) {
                console.error('Error al limpiar carrito:', error);
                alert('Error al limpiar el carrito');
            }
        } else {
            // Limpiar carrito invitado
            clearGuestCart();
            setSuccessMessage('Carrito vaciado');
            await cargarCarritoInvitado();
            refreshCart();
            setTimeout(() => setSuccessMessage(null), 3000);
        }
    };

    const calcularTotal = useMemo(() => {
        if (isAuthenticated && carrito?.items) {
            return carrito.items.reduce((total, item) => {
                return total + parseFloat(item.subtotal || 0);
            }, 0);
        } else if (!isAuthenticated && guestCartItems.length > 0) {
            return guestCartItems.reduce((total, item) => {
                return total + parseFloat(item.subtotal || 0);
            }, 0);
        }
        return 0;
    }, [isAuthenticated, carrito?.items, guestCartItems]);

    const getItems = () => {
        if (isAuthenticated && carrito?.items) {
            return carrito.items;
        } else if (!isAuthenticated) {
            return guestCartItems;
        }
        return [];
    };

    if (loading) {
        return <LoadingSpinner fullScreen />;
    }

    return (
        <div className="cart-page">
            {successMessage && (
                <SuccessMessage 
                    message={successMessage} 
                    onClose={() => setSuccessMessage(null)}
                />
            )}

            <div className="cart-container">
                <h1 className="cart-title">Carrito de Compras</h1>

                {error && (
                    <ErrorMessage 
                        message={error} 
                        onRetry={() => {
                            if (isAuthenticated) {
                                cargarCarrito();
                            } else {
                                cargarCarritoInvitado();
                            }
                        }}
                        onClose={() => setError(null)}
                    />
                )}

                {getItems().length === 0 ? (
                    <div className="cart-empty">
                        <div className="empty-icon">🛒</div>
                        <h2>Tu carrito está vacío</h2>
                        <p>Agrega productos al carrito para continuar comprando</p>
                        {!isAuthenticated && (
                            <p style={{ color: '#666', fontSize: '14px', marginTop: '10px' }}>
                                Inicia sesión para guardar tu carrito y continuar comprando
                            </p>
                        )}
                        <Link to="/catalogo" className="btn-continue-shopping">
                            Continuar Comprando
                        </Link>
                    </div>
                ) : (
                    <div className="cart-content">
                        <div className="cart-items">
                            <div className="cart-header">
                                <h2>Productos ({getItems().length})</h2>
                                <button 
                                    className="btn-clear-cart"
                                    onClick={handleLimpiarCarrito}
                                >
                                    Vaciar Carrito
                                </button>
                            </div>

                            {getItems().map((item) => (
                                <div key={item.id} className="cart-item">
                                    <div className="item-image">
                                        <img 
                                            src={item.producto?.imagen || 'https://via.placeholder.com/150x150?text=Sin+Imagen'} 
                                            alt={item.producto?.nombre}
                                            onError={(e) => {
                                                e.target.src = 'https://via.placeholder.com/150x150?text=Sin+Imagen';
                                            }}
                                        />
                                    </div>

                                    <div className="item-info">
                                        <Link to={`/producto/${item.producto?.id}`} className="item-name">
                                            {item.producto?.nombre}
                                        </Link>
                                        {item.producto?.categoria && (
                                            <p className="item-category">{item.producto.categoria.nombre}</p>
                                        )}
                                        <p className="item-price-unit">S/ {parseFloat(item.producto?.precio || 0).toFixed(2)} c/u</p>
                                    </div>

                                    <div className="item-quantity">
                                        <label>Cantidad:</label>
                                        <div className="quantity-controls">
                                            <button 
                                                onClick={() => handleActualizarCantidad(item.producto.id, item.cantidad - 1)}
                                                disabled={item.cantidad <= 1 || updatingItems.has(item.producto.id)}
                                            >
                                                -
                                            </button>
                                            <span className="quantity-value">{item.cantidad}</span>
                                            <button 
                                                onClick={() => handleActualizarCantidad(item.producto.id, item.cantidad + 1)}
                                                disabled={updatingItems.has(item.producto.id)}
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>

                                    <div className="item-subtotal">
                                        <p className="subtotal-label">Subtotal</p>
                                        <p className="subtotal-value">S/ {parseFloat(item.subtotal || 0).toFixed(2)}</p>
                                    </div>

                                    <button 
                                        className="item-remove"
                                        onClick={() => handleEliminar(item.id, item.producto.id)}
                                        title="Eliminar producto"
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div className="cart-summary">
                            <h2>Resumen del Pedido</h2>
                            <div className="summary-row">
                                <span>Subtotal:</span>
                                <span>S/ {calcularTotal.toFixed(2)}</span>
                            </div>
                            <div className="summary-row">
                                <span>Envío:</span>
                                <span>Gratis</span>
                            </div>
                            <div className="summary-row total">
                                <span>Total:</span>
                                <span>S/ {calcularTotal.toFixed(2)}</span>
                            </div>
                            {isAuthenticated ? (
                                <Link to="/checkout" className="btn-checkout">
                                    Proceder al Checkout
                                </Link>
                            ) : (
                                <button 
                                    className="btn-checkout"
                                    onClick={() => {
                                        alert('Por favor, inicia sesión para continuar con la compra');
                                        // Aquí podrías abrir el modal de login
                                    }}
                                >
                                    Iniciar Sesión para Comprar
                                </button>
                            )}
                            <Link to="/catalogo" className="btn-continue-shopping-secondary">
                                Continuar Comprando
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default CartPage;