import React from 'react';
import { Link } from 'react-router-dom';

function ProductCard({ producto, rating = 0 }) {
  const precio = parseFloat(producto.precio || 0);
  const stock = producto.stock || 0;

  const renderStars = (value) => {
    if (!value || value === 0) {
      return <span className="rating-value no-rating">Sin valoraciones</span>;
    }

    const fullStars = Math.floor(value);
    const hasHalfStar = value % 1 >= 0.5;
    const stars = [];

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <span key={i} className="star full">
          ★
        </span>
      );
    }
    if (hasHalfStar) {
      stars.push(
        <span key="half" className="star half">
          ★
        </span>
      );
    }
    const emptyStars = 5 - Math.ceil(value);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <span key={`empty-${i}`} className="star empty">
          ★
        </span>
      );
    }

    return (
      <>
        {stars}
        <span className="rating-value">{value.toFixed(1)}</span>
      </>
    );
  };

  return (
    <Link to={`/producto/${producto.id}`} className="product-card-link">
      <div className="product-card">
        <div className="product-image">
          <img
            src={
              producto.imagen ||
              'https://via.placeholder.com/600x600?text=Sin+Imagen'
            }
            alt={producto.nombre}
            onError={(e) => {
              e.target.src =
                'https://via.placeholder.com/600x600?text=Sin+Imagen';
            }}
          />
        </div>

        <div className="product-card-body">
          <h3 className="product-name" title={producto.nombre}>
            {producto.nombre}
          </h3>

          {producto.categoria && (
            <p className="product-category">
              {producto.categoria.nombre || producto.categoria}
            </p>
          )}

          <div className="product-rating">
            {renderStars(rating)}
          </div>

          <div className="product-price-row">
            <div className="product-price">
              S/ {precio.toFixed(2)}
            </div>
            {stock > 0 ? (
              <div className="product-stock">En stock ({stock} disponibles)</div>
            ) : (
              <div className="product-stock out-of-stock">Agotado</div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

export default ProductCard;


