import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { productosAPI, categoriasAPI, resenasAPI, busquedaAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import ProductCard from '../components/ProductCard';
import './CatalogPage.css';

// Lista de marcas comunes para extraer de nombres de productos
const MARCAS_COMUNES = [
  'Apple', 'Samsung', 'Nike', 'Adidas', 'Sony', 'ASUS', 'IKEA', 
  'PetSafe', 'West Elm', 'LG', 'HP', 'Dell', 'Lenovo', 'Microsoft',
  'Canon', 'Nikon', 'Bose', 'JBL', 'Philips', 'Panasonic'
];

// Función para extraer marca del nombre del producto
const extraerMarca = (nombreProducto) => {
  if (!nombreProducto) return null;
  const nombreUpper = nombreProducto.toUpperCase();
  for (const marca of MARCAS_COMUNES) {
    if (nombreUpper.includes(marca.toUpperCase())) {
      return marca;
    }
  }
  return null;
};

function CatalogPage() {
  const [searchParams] = useSearchParams();
  const [productos, setProductos] = useState([]);
  const [productosOriginales, setProductosOriginales] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [minRating, setMinRating] = useState('');
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [sortBy, setSortBy] = useState('Relevancia');
  const [productosConRating, setProductosConRating] = useState({});
  const busquedaQuery = searchParams.get('busqueda');

  // Extraer marcas únicas de los productos
  const marcasDisponibles = useMemo(() => {
    const marcasSet = new Set();
    productosOriginales.forEach(producto => {
      const marca = extraerMarca(producto.nombre);
      if (marca) {
        marcasSet.add(marca);
      }
    });
    return Array.from(marcasSet).sort();
  }, [productosOriginales]);

  const cargarCategorias = useCallback(async () => {
    try {
      const response = await categoriasAPI.listar();
      setCategorias(response.data);
    } catch (error) {
      console.error('Error al cargar categorías:', error);
    }
  }, []);

  const cargarRatingsProductos = useCallback(async (productosData) => {
    try {
      const ratingsPromises = productosData.map(async (producto) => {
        try {
          const resenasResponse = await resenasAPI.obtenerPorProducto(producto.id);
          const resenas = resenasResponse.data;
          
          if (resenas.length === 0) {
            return { productoId: producto.id, rating: 0, count: 0 };
          }
          
          const suma = resenas.reduce((acc, r) => acc + (r.calificacion || 0), 0);
          const promedio = suma / resenas.length;
          
          return { productoId: producto.id, rating: promedio, count: resenas.length };
        } catch (error) {
          return { productoId: producto.id, rating: 0, count: 0 };
        }
      });

      const ratings = await Promise.all(ratingsPromises);
      const ratingsMap = {};
      ratings.forEach(r => {
        ratingsMap[r.productoId] = r.rating;
      });
      setProductosConRating(ratingsMap);
    } catch (error) {
      console.error('Error al cargar ratings:', error);
    }
  }, []);

  const cargarProductos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let productosData;
      if (busquedaQuery) {
        try {
          const aiResp = await busquedaAPI.buscarConGemini(busquedaQuery);
          const aiData = aiResp.data;
          if (aiData?.resultados?.length > 0) {
            productosData = aiData.resultados;
          } else {
            const fallbackResp = await productosAPI.buscar(busquedaQuery);
            productosData = fallbackResp.data;
          }
        } catch (e) {
          const fallbackResp = await productosAPI.buscar(busquedaQuery);
          productosData = fallbackResp.data;
        }
      } else if (selectedCategory) {
        const catResp = await productosAPI.porCategoria(selectedCategory);
        productosData = catResp.data;
      } else {
        const listResp = await productosAPI.listar();
        productosData = listResp.data;
      }
      
      // Filtrar solo productos activos
      productosData = productosData.filter(p => p.activo !== false);
      
      setProductosOriginales(productosData);
      
      // Cargar ratings de productos
      await cargarRatingsProductos(productosData);
    } catch (error) {
      console.error('Error al cargar productos:', error);
      setError('Error al cargar los productos. Por favor, intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  }, [busquedaQuery, selectedCategory, cargarRatingsProductos]);

  const ordenarProductos = useCallback((productos, orden) => {
    const productosOrdenados = [...productos];
    switch (orden) {
      case 'Precio: Menor a Mayor':
        return productosOrdenados.sort((a, b) => 
          parseFloat(a.precio) - parseFloat(b.precio)
        );
      case 'Precio: Mayor a Menor':
        return productosOrdenados.sort((a, b) => 
          parseFloat(b.precio) - parseFloat(a.precio)
        );
      case 'Mejor Valorados':
        return productosOrdenados.sort((a, b) => {
          const ratingA = productosConRating[a.id] || 0;
          const ratingB = productosConRating[b.id] || 0;
          return ratingB - ratingA;
        });
      default:
        return productosOrdenados;
    }
  }, [productosConRating]);

  const aplicarFiltros = useCallback(() => {
    let productosFiltrados = [...productosOriginales];

    // Filtro por precio mínimo
    if (minPrice && minPrice !== '') {
      productosFiltrados = productosFiltrados.filter(p => 
        parseFloat(p.precio) >= parseFloat(minPrice)
      );
    }

    // Filtro por precio máximo
    if (maxPrice && maxPrice !== '') {
      productosFiltrados = productosFiltrados.filter(p => 
        parseFloat(p.precio) <= parseFloat(maxPrice)
      );
    }

    // Filtro por valoración mínima
    if (minRating && minRating !== '') {
      const ratingMin = parseFloat(minRating);
      productosFiltrados = productosFiltrados.filter(p => {
        const rating = productosConRating[p.id] || 0;
        return rating >= ratingMin;
      });
    }

    // Filtro por marca
    if (selectedBrands.length > 0) {
      productosFiltrados = productosFiltrados.filter(p => {
        const marca = extraerMarca(p.nombre);
        return marca && selectedBrands.includes(marca);
      });
    }

    // Ordenar productos
    productosFiltrados = ordenarProductos(productosFiltrados, sortBy);

    setProductos(productosFiltrados);
  }, [productosOriginales, minPrice, maxPrice, minRating, selectedBrands, sortBy, productosConRating, ordenarProductos]);

  useEffect(() => {
    cargarCategorias();
  }, [cargarCategorias]);

  useEffect(() => {
    cargarProductos();
  }, [cargarProductos]);

  useEffect(() => {
    aplicarFiltros();
  }, [aplicarFiltros]);

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  const handleRatingFilterChange = (e) => {
    setMinRating(e.target.value);
  };

  const handleBrandToggle = (marca) => {
    setSelectedBrands(prev => {
      if (prev.includes(marca)) {
        return prev.filter(b => b !== marca);
      } else {
        return [...prev, marca];
      }
    });
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

  const getProductRating = (productoId) => {
    return productosConRating[productoId] || 0;
  };

  const limpiarFiltros = () => {
    setMinPrice('');
    setMaxPrice('');
    setMinRating('');
    setSelectedBrands([]);
  };

  const tieneFiltrosActivos = minPrice || maxPrice || minRating || selectedBrands.length > 0;

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div className="catalog-page">
      <div className="catalog-header">
        <h1 className="catalog-title">
          {busquedaQuery ? `Resultados de búsqueda: "${busquedaQuery}"` : 'Catálogo de Productos'}
        </h1>
        <div className="catalog-info">
          <span className="product-count">{productos.length} productos disponibles</span>
          <div className="sort-container">
            <label htmlFor="sort-select">Ordenar por: </label>
            <select
              id="sort-select"
              className="sort-select"
              value={sortBy}
              onChange={handleSortChange}
            >
              <option value="Relevancia">Relevancia</option>
              <option value="Precio: Menor a Mayor">Precio: Menor a Mayor</option>
              <option value="Precio: Mayor a Menor">Precio: Mayor a Menor</option>
              <option value="Mejor Valorados">Mejor Valorados</option>
            </select>
          </div>
        </div>
      </div>

      {error && <ErrorMessage message={error} onClose={() => setError(null)} />}

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
              onChange={handleCategoryChange}
            >
              <option value="">Todas las categorías</option>
              {categorias.map((categoria) => (
                <option key={categoria.id} value={categoria.id}>
                  {categoria.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-section">
            <label className="filter-label">Rango de Precio</label>
            <div className="price-inputs">
              <input
                type="number"
                placeholder="mínimo"
                className="price-input"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                min="0"
                step="0.01"
              />
              <input
                type="number"
                placeholder="máximo"
                className="price-input"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                min="0"
                step="0.01"
              />
            </div>
          </div>

          {marcasDisponibles.length > 0 && (
            <div className="filter-section">
              <label className="filter-label">Marca</label>
              <div className="brands-list">
                {marcasDisponibles.map((marca) => (
                  <label key={marca} className="brand-checkbox">
                    <input
                      type="checkbox"
                      checked={selectedBrands.includes(marca)}
                      onChange={() => handleBrandToggle(marca)}
                    />
                    <span>{marca}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          <div className="filter-section">
            <label className="filter-label">Valoración Mínima</label>
            <select
              className="filter-select"
              value={minRating}
              onChange={handleRatingFilterChange}
            >
              <option value="">Todas las valoraciones</option>
              <option value="4">4 estrellas o más</option>
              <option value="4.5">4.5 estrellas o más</option>
            </select>
          </div>

          {tieneFiltrosActivos && (
            <div className="filter-section">
              <button
                className="btn-clear-filters"
                onClick={limpiarFiltros}
              >
                Limpiar Filtros
              </button>
            </div>
          )}
        </aside>

        {/* Grid de Productos */}
        <main className="products-grid">
          {productos.length === 0 ? (
            <div className="no-products">
              <p>No se encontraron productos con los filtros seleccionados.</p>
            </div>
          ) : (
            productos.map((producto) => {
              const rating = getProductRating(producto.id);
              return (
                <ProductCard
                  key={producto.id}
                  producto={producto}
                  rating={rating}
                />
              );
            })
          )}
        </main>
      </div>
    </div>
  );
}

export default CatalogPage;
