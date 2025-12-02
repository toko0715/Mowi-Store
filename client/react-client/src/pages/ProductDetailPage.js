import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productosAPI, carritoAPI, resenasAPI } from '../services/api';
import { wishlistAPI } from '../services/djangoApi';
import { useApp } from '../context/AppContext';
import { addToGuestCart } from '../utils/guestCart';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import SuccessMessage from '../components/SuccessMessage';
import ProductReviews from '../components/ProductReviews';
import './ProductDetailPage.css';

function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, refreshCart } = useApp();
  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cantidad, setCantidad] = useState(1);
  const [successMessage, setSuccessMessage] = useState(null);
  const [activeTab, setActiveTab] = useState('descripcion');
  const [enWishlist, setEnWishlist] = useState(false);
  const [loadingWishlist, setLoadingWishlist] = useState(false);
  const [ratingPromedio, setRatingPromedio] = useState(0);
  const [ratingCount, setRatingCount] = useState(0);

  useEffect(() => {
    const cargarProducto = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await productosAPI.obtenerPorId(id);
        setProducto(response.data);

        // Cargar rating real del producto
        try {
          const resenasResponse = await resenasAPI.obtenerPorProducto(id);
          const resenas = resenasResponse.data || [];
          if (resenas.length > 0) {
            const suma = resenas.reduce(
              (acc, r) => acc + (r.calificacion || 0),
              0
            );
            setRatingPromedio(suma / resenas.length);
            setRatingCount(resenas.length);
          } else {
            setRatingPromedio(0);
            setRatingCount(0);
          }
        } catch (ratingError) {
          console.error('Error al cargar reseñas del producto:', ratingError);
        }
      } catch (error) {
        console.error('Error al cargar producto:', error);
        setError('Error al cargar el producto. Por favor, intenta nuevamente.');
      } finally {
        setLoading(false);
      }
    };

    const verificarWishlist = async () => {
      try {
        const response = await wishlistAPI.verificar(id);
        setEnWishlist(response.data.en_wishlist);
      } catch (error) {
        console.error('Error al verificar wishlist:', error);
      }
    };

    cargarProducto();
    if (isAuthenticated) {
      verificarWishlist();
    }
  }, [id, isAuthenticated]);

  const handleToggleWishlist = async () => {
    if (!isAuthenticated) {
      alert('Debes iniciar sesión para agregar productos a tu wishlist');
      return;
    }

    setLoadingWishlist(true);
    try {
      if (enWishlist) {
        await wishlistAPI.eliminar(id);
        setEnWishlist(false);
        setSuccessMessage('Producto eliminado de wishlist');
      } else {
        await wishlistAPI.agregar(id);
        setEnWishlist(true);
        setSuccessMessage('Producto agregado a wishlist');
      }
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      console.error('Error al actualizar wishlist:', error);
      alert('Error al actualizar wishlist');
    } finally {
      setLoadingWishlist(false);
    }
  };

  const handleAgregarAlCarrito = async () => {
    if (!isAuthenticated) {
      // Usar carrito invitado
      addToGuestCart(producto.id, cantidad);
      setSuccessMessage('Producto agregado al carrito exitosamente');
      refreshCart();
      setTimeout(() => setSuccessMessage(null), 3000);
      return;
    }

    if (!user?.id) {
      alert('Error: No se pudo obtener el ID del usuario');
      return;
    }

    try {
      await carritoAPI.agregar(user.id, producto.id, cantidad);
      setSuccessMessage('Producto agregado al carrito exitosamente');
      refreshCart();
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      console.error('Error al agregar al carrito:', error);
      alert('Error al agregar el producto al carrito');
    }
  };

  const handleComprarAhora = async () => {
    if (!isAuthenticated) {
      // Agregar al carrito invitado y redirigir a login
      addToGuestCart(producto.id, cantidad);
      alert('Por favor, inicia sesión para continuar con la compra');
      // Aquí podrías abrir el modal de login
      return;
    }

    // Primero agregar al carrito
    await handleAgregarAlCarrito();
    // Luego ir al checkout
    navigate('/checkout');
  };

  const renderStars = (rating) => {
    if (!rating || rating === 0) return null;
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const stars = [];

    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={i} className="star full">★</span>);
    }
    if (hasHalfStar) {
      stars.push(<span key="half" className="star half">★</span>);
    }
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<span key={`empty-${i}`} className="star empty">★</span>);
    }

    return stars;
  };

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  if (error || !producto) {
    return (
      <div style={{ padding: '100px 60px', textAlign: 'center' }}>
        <ErrorMessage 
          message={error || 'Producto no encontrado'} 
          onRetry={() => navigate('/catalogo')}
        />
      </div>
    );
  }

  return (
    <div className="product-detail-page">
      {successMessage && (
        <SuccessMessage 
          message={successMessage} 
          onClose={() => setSuccessMessage(null)}
        />
      )}

      <div className="product-detail-container">
        <div className="product-images">
          <div className="main-image">
            <img 
              src={producto.imagen || 'https://via.placeholder.com/600x600?text=Sin+Imagen'} 
              alt={producto.nombre}
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/600x600?text=Sin+Imagen';
              }}
            />
          </div>
        </div>

        <div className="product-info">
          <h1 className="product-title">{producto.nombre}</h1>
          
          {producto.categoria && (
            <p className="product-category">Categoría: {producto.categoria.nombre}</p>
          )}

          <div className="product-rating">
            {ratingPromedio > 0 ? (
              <>
                {renderStars(ratingPromedio)}
                <span className="rating-value">{ratingPromedio.toFixed(1)}</span>
                <span className="rating-count">
                  ({ratingCount} reseña{ratingCount === 1 ? '' : 's'})
                </span>
              </>
            ) : (
              <span className="rating-count">Sin valoraciones</span>
            )}
          </div>

          <div className="product-price-section">
            <span className="product-price">S/ {parseFloat(producto.precio).toFixed(2)}</span>
          </div>

          <div className="product-stock-section">
            {producto.stock > 0 ? (
              <span className="stock-available">✓ En stock ({producto.stock} disponibles)</span>
            ) : (
              <span className="stock-unavailable">✗ Agotado</span>
            )}
          </div>

          <div className="product-quantity">
            <label>Cantidad:</label>
            <div className="quantity-controls">
              <button 
                onClick={() => setCantidad(Math.max(1, cantidad - 1))}
                disabled={cantidad <= 1}
              >
                -
              </button>
              <input 
                type="number" 
                value={cantidad} 
                onChange={(e) => {
                  const val = parseInt(e.target.value) || 1;
                  setCantidad(Math.max(1, Math.min(val, producto.stock || 1)));
                }}
                min="1"
                max={producto.stock || 1}
              />
              <button 
                onClick={() => setCantidad(Math.min(producto.stock || 1, cantidad + 1))}
                disabled={cantidad >= (producto.stock || 1)}
              >
                +
              </button>
            </div>
          </div>

          <div className="product-actions">
            <button 
              className="btn-add-cart" 
              onClick={handleAgregarAlCarrito}
              disabled={producto.stock === 0}
            >
              🛒 Agregar al Carrito
            </button>
            <button 
              className="btn-buy-now" 
              onClick={handleComprarAhora}
              disabled={producto.stock === 0}
            >
              Comprar Ahora
            </button>
            {isAuthenticated && (
              <button 
                className={`btn-wishlist ${enWishlist ? 'active' : ''}`}
                onClick={handleToggleWishlist}
                disabled={loadingWishlist}
                title={enWishlist ? 'Eliminar de wishlist' : 'Agregar a wishlist'}
              >
                {enWishlist ? '❤️ En Wishlist' : '🤍 Agregar a Wishlist'}
              </button>
            )}
          </div>

          <div className="product-tabs">
            <button 
              className={`tab ${activeTab === 'descripcion' ? 'active' : ''}`}
              onClick={() => setActiveTab('descripcion')}
            >
              Descripción
            </button>
            <button 
              className={`tab ${activeTab === 'reseñas' ? 'active' : ''}`}
              onClick={() => setActiveTab('reseñas')}
            >
              Reseñas
            </button>
          </div>

          <div className="product-tab-content">
            {activeTab === 'descripcion' && (
              <div className="product-description">
                <p>{producto.descripcion || 'No hay descripción disponible para este producto.'}</p>
              </div>
            )}
            {activeTab === 'reseñas' && (
              <ProductReviews productoId={producto.id} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetailPage;

