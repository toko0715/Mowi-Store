import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { categoriasAPI, productosAPI } from '../services/api';
import LoadingSpinner from './LoadingSpinner';
import ProductCard from './ProductCard';
import './HomePage.css';

function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [categorias, setCategorias] = useState([]);
  const [productosDestacados, setProductosDestacados] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const [categoriasResponse, productosResponse] = await Promise.all([
        categoriasAPI.listar(),
        productosAPI.topVendidos(),
      ]);
      
      setCategorias(categoriasResponse.data);
      
      // Obtener solo productos activos y limitar a 6
      const productosActivos = productosResponse.data
        .filter(p => p.activo !== false)
        .slice(0, 6);
      setProductosDestacados(productosActivos);
    } catch (error) {
      console.error('Error al cargar datos:', error);
    } finally {
      setLoading(false);
    }
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % 3);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + 3) % 3);
  };

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

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
      {categorias.length > 0 && (
        <section className="categories-section">
          <h2 className="categories-title">Categorías</h2>
          <div className="categories-grid">
            {categorias.map((categoria) => (
              <Link
                key={categoria.id}
                to={`/catalogo?categoriaId=${categoria.id}`}
                className="category-card"
              >
                <div className="category-icon-wrapper">
                  <span className="category-icon">📦</span>
                </div>
                <h3 className="category-name">{categoria.nombre}</h3>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Featured Products Section */}
      {productosDestacados.length > 0 && (
        <section className="featured-section">
          <h2 className="featured-title">Productos Destacados</h2>
          <div className="featured-grid">
            {productosDestacados.map((producto) => (
              <ProductCard
                key={producto.id}
                producto={producto}
                rating={producto.rating_promedio || 0}
              />
            ))}
          </div>
          <Link to="/catalogo" className="btn-view-all">
            Ver Todos los Productos
          </Link>
        </section>
      )}
    </div>
  );
}

export default HomePage;
