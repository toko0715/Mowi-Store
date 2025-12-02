import React, { useState, useEffect } from 'react';
import { resenasAPI } from '../services/api';
import { useApp } from '../context/AppContext';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';
import SuccessMessage from './SuccessMessage';
import './ProductReviews.css';

function ProductReviews({ productoId }) {
  const { user, isAuthenticated } = useApp();
  const [reseñas, setReseñas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    calificacion: 5,
    comentario: '',
  });

  useEffect(() => {
    cargarReseñas();
  }, [productoId]);

  const cargarReseñas = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await resenasAPI.obtenerPorProducto(productoId);
      setReseñas(response.data);
    } catch (error) {
      console.error('Error al cargar reseñas:', error);
      setError('Error al cargar las reseñas');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      alert('Debes iniciar sesión para dejar una reseña');
      return;
    }

    try {
      const payload = {
        usuarioId: user.id,
        producto: { id: Number(productoId) },
        calificacion: Number(formData.calificacion),
        comentario: formData.comentario,
      };

      await resenasAPI.crear(payload);
      
      setSuccessMessage('Reseña publicada exitosamente');
      setFormData({ calificacion: 5, comentario: '' });
      setShowForm(false);
      await cargarReseñas();
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      console.error('Error al crear reseña:', error?.response || error);
      const backendMessage = error?.response?.data?.message || error?.response?.data?.error;
      alert(backendMessage || 'Error al publicar la reseña');
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={i <= rating ? 'star full' : 'star empty'}>
          ★
        </span>
      );
    }
    return stars;
  };

  const calcularPromedio = () => {
    if (reseñas.length === 0) return 0;
    const suma = reseñas.reduce((acc, r) => acc + (r.calificacion || 0), 0);
    return (suma / reseñas.length).toFixed(1);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="product-reviews">
      {successMessage && (
        <SuccessMessage 
          message={successMessage} 
          onClose={() => setSuccessMessage(null)}
        />
      )}

      <div className="reviews-header">
        <h3>Reseñas ({reseñas.length})</h3>
        {reseñas.length > 0 && (
          <div className="average-rating">
            <span className="average-value">{calcularPromedio()}</span>
            <div className="average-stars">{renderStars(Math.round(calcularPromedio()))}</div>
          </div>
        )}
      </div>

      {isAuthenticated && !showForm && (
        <button 
          className="btn-add-review"
          onClick={() => setShowForm(true)}
        >
          Escribir una Reseña
        </button>
      )}

      {showForm && (
        <form className="review-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Calificación:</label>
            <div className="rating-input">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  type="button"
                  className={`star-btn ${formData.calificacion >= rating ? 'active' : ''}`}
                  onClick={() => setFormData({ ...formData, calificacion: rating })}
                >
                  ★
                </button>
              ))}
            </div>
          </div>
          <div className="form-group">
            <label>Comentario:</label>
            <textarea
              value={formData.comentario}
              onChange={(e) => setFormData({ ...formData, comentario: e.target.value })}
              placeholder="Escribe tu reseña aquí..."
              rows="5"
              required
            />
          </div>
          <div className="form-actions">
            <button type="submit" className="btn-submit-review">
              Publicar Reseña
            </button>
            <button 
              type="button" 
              className="btn-cancel-review"
              onClick={() => {
                setShowForm(false);
                setFormData({ calificacion: 5, comentario: '' });
              }}
            >
              Cancelar
            </button>
          </div>
        </form>
      )}

      {error && <ErrorMessage message={error} onClose={() => setError(null)} />}

      <div className="reviews-list">
        {reseñas.length === 0 ? (
          <p className="no-reviews">Aún no hay reseñas para este producto.</p>
        ) : (
          reseñas.map((reseña) => (
            <div key={reseña.id} className="review-item">
              <div className="review-header">
                <div className="review-rating">{renderStars(reseña.calificacion)}</div>
                <span className="review-date">
                  {new Date(reseña.fechaCreacion).toLocaleDateString('es-PE')}
                </span>
              </div>
              {reseña.comentario && (
                <p className="review-comment">{reseña.comentario}</p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ProductReviews;

