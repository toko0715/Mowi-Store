import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const categories = [
    { id: 1, name: 'Tecnología', icon: '📱', path: '/catalogo?categoria=tecnologia' },
    { id: 2, name: 'Moda', icon: '👕', path: '/catalogo?categoria=moda' },
    { id: 3, name: 'Hogar', icon: '🏠', path: '/catalogo?categoria=hogar' },
    { id: 4, name: 'Mascotas', icon: '🐾', path: '/catalogo?categoria=mascotas' },
    { id: 5, name: 'Bebés', icon: '👶', path: '/catalogo?categoria=bebes' },
    { id: 6, name: 'Juguetes', icon: '🎮', path: '/catalogo?categoria=juguetes' },
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % 3);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + 3) % 3);
  };

  return (
    <div className="homepage">
      {/* Hero Banner Section */}
      <section className="hero-banner">
        <button className="carousel-arrow carousel-arrow-left" onClick={prevSlide}>
          ‹
        </button>
        
        <div className="hero-content">
          <h1 className="hero-title">¡Grandes ofertas en MOWI!</h1>
          <p className="hero-subtitle">Descubre productos increíbles a precios únicos</p>
          <Link to="/catalogo" className="hero-btn">
            Explorar Productos
          </Link>
        </div>

        <button className="carousel-arrow carousel-arrow-right" onClick={nextSlide}>
          ›
        </button>

        <div className="carousel-dots">
          {[0, 1, 2].map((index) => (
            <span
              key={index}
              className={`dot ${index === currentSlide ? 'active' : ''}`}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories-section">
        <h2 className="categories-title">Categorías</h2>
        <div className="categories-grid">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={category.path}
              className="category-card"
            >
              <div className="category-icon-wrapper">
                <span className="category-icon">{category.icon}</span>
              </div>
              <h3 className="category-name">{category.name}</h3>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

export default HomePage;

