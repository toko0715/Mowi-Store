import React, { useState } from 'react';
import './CatalogPage.css';

function CatalogPage() {
  const [selectedCategory, setSelectedCategory] = useState('Todas las categorías');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [minRating, setMinRating] = useState('Todas las valoraciones');
  const [sortBy, setSortBy] = useState('Relevancia');

  const brands = ['Apple', 'Samsung', 'Nike', 'Adidas', 'Sony', 'ASUS', 'IKEA', 'PetSafe', 'West Elm'];

  const handleBrandToggle = (brand) => {
    setSelectedBrands(prev =>
      prev.includes(brand)
        ? prev.filter(b => b !== brand)
        : [...prev, brand]
    );
  };

  // Datos de ejemplo para los productos
  const products = [
    {
      id: 1,
      name: 'iPhone 15 Pro Max',
      rating: 4.8,
      price: '4299.99',
      image: 'https://via.placeholder.com/300x300?text=iPhone+15+Pro+Max'
    },
    {
      id: 2,
      name: 'Laptop ASUS ROG',
      rating: 4.6,
      price: '2899.99',
      image: 'https://via.placeholder.com/300x300?text=Laptop+ASUS+ROG'
    },
    {
      id: 3,
      name: 'Chaqueta Nike Deportiva',
      rating: 4.5,
      price: '299.99',
      image: 'https://via.placeholder.com/300x300?text=Chaqueta+Nike'
    },
    {
      id: 4,
      name: 'Sofá IKEA Moderno',
      rating: 4.7,
      price: '1299.99',
      image: 'https://via.placeholder.com/300x300?text=Sofa+IKEA'
    },
    {
      id: 5,
      name: 'Samsung Galaxy S24',
      rating: 4.9,
      price: '3599.99',
      image: 'https://via.placeholder.com/300x300?text=Samsung+Galaxy'
    },
    {
      id: 6,
      name: 'Zapatillas Adidas',
      rating: 4.4,
      price: '199.99',
      image: 'https://via.placeholder.com/300x300?text=Zapatillas+Adidas'
    },
    {
      id: 7,
      name: 'PlayStation 5',
      rating: 4.8,
      price: '2499.99',
      image: 'https://via.placeholder.com/300x300?text=PlayStation+5'
    },
    {
      id: 8,
      name: 'Monitor ASUS Gaming',
      rating: 4.6,
      price: '899.99',
      image: 'https://via.placeholder.com/300x300?text=Monitor+ASUS'
    }
  ];

  const renderStars = (rating) => {
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

  return (
    <div className="catalog-page">
      <div className="catalog-header">
        <h1 className="catalog-title">Catálogo de Productos</h1>
        <div className="catalog-info">
          <span className="product-count">{products.length} productos disponibles</span>
          <div className="sort-container">
            <label htmlFor="sort-select">Ordenar por: </label>
            <select
              id="sort-select"
              className="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="Relevancia">Relevancia</option>
              <option value="Precio: Menor a Mayor">Precio: Menor a Mayor</option>
              <option value="Precio: Mayor a Menor">Precio: Mayor a Menor</option>
              <option value="Mejor Valorados">Mejor Valorados</option>
            </select>
          </div>
        </div>
      </div>

      <div className="catalog-content">
        {/* Sidebar de Filtros */}
        <aside className="filters-sidebar">
          <div className="filters-header">
            <span className="filter-icon">🔽</span>
            <h2 className="filters-title">Filtros</h2>
          </div>

          <div className="filter-section">
            <label className="filter-label">Categoría</label>
            <select
              className="filter-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option>Todas las categorías</option>
              <option>Tecnología</option>
              <option>Moda</option>
              <option>Hogar</option>
              <option>Mascotas</option>
              <option>Bebés</option>
              <option>Juguetes</option>
            </select>
          </div>

          <div className="filter-section">
            <label className="filter-label">Rango de Precio</label>
            <div className="price-inputs">
              <input
                type="number"
                placeholder="Precio mínimo"
                className="price-input"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
              />
              <input
                type="number"
                placeholder="Precio máximo"
                className="price-input"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />
            </div>
          </div>

          <div className="filter-section">
            <label className="filter-label">Marca</label>
            <div className="brands-list">
              {brands.map((brand) => (
                <label key={brand} className="brand-checkbox">
                  <input
                    type="checkbox"
                    checked={selectedBrands.includes(brand)}
                    onChange={() => handleBrandToggle(brand)}
                  />
                  <span>{brand}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="filter-section">
            <label className="filter-label">Valoración Mínima</label>
            <select
              className="filter-select"
              value={minRating}
              onChange={(e) => setMinRating(e.target.value)}
            >
              <option>Todas las valoraciones</option>
              <option>4 estrellas o más</option>
              <option>4.5 estrellas o más</option>
            </select>
          </div>
        </aside>

        {/* Grid de Productos */}
        <main className="products-grid">
          {products.map((product) => (
            <div key={product.id} className="product-card">
              <div className="product-image">
                <img src={product.image} alt={product.name} />
              </div>
              <h3 className="product-name">{product.name}</h3>
              <div className="product-rating">
                {renderStars(product.rating)}
                <span className="rating-value">{product.rating}</span>
              </div>
              <div className="product-price">S/ {product.price}</div>
              <button className="add-to-cart-btn">
                🛒 Agregar al carrito
              </button>
            </div>
          ))}
        </main>
      </div>
    </div>
  );
}

export default CatalogPage;

