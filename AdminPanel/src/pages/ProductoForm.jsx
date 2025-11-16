import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';
import { useToast } from '../context/ToastContext';

function ProductoForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    categoria: '',
    precio: '',
    stock: '',
    imagen: '',
    activo: true
  });

  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [errors, setErrors] = useState({});
  const toast = useToast();

  useEffect(() => {
    loadCategorias();
    if (isEditing) {
      loadProducto();
    }
  }, [id]);

  const loadCategorias = async () => {
    try {
      const categoriasData = await api.getCategorias();
      setCategorias(categoriasData);
    } catch (error) {
      console.error('Error loading categorias:', error);
    }
  };

  const loadProducto = async () => {
    try {
      const producto = await api.getProducto(id);
      setFormData({
        nombre: producto.nombre,
        descripcion: producto.descripcion || '',
        categoria: producto.categoria?.id || producto.categoria || '',
        precio: producto.precio?.toString() || '',
        stock: producto.stock?.toString() || '',
        imagen: producto.imagen || '',
        activo: producto.activo
      });
      setPreviewImage(producto.imagen || '');
    } catch (error) {
      console.error('Error loading producto:', error);
      toast.error('Error al cargar el producto');
      navigate('/productos');
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Validación de formulario
  const validateForm = () => {
    const newErrors = {};

    if (!formData.nombre || formData.nombre.trim().length < 2) {
      newErrors.nombre = 'El nombre debe tener al menos 2 caracteres';
    }

    if (!formData.categoria) {
      newErrors.categoria = 'Debe seleccionar una categoría';
    }

    const precio = parseFloat(formData.precio);
    if (!formData.precio || isNaN(precio) || precio <= 0) {
      newErrors.precio = 'El precio debe ser mayor a 0';
    }

    const stock = parseInt(formData.stock);
    if (formData.stock === '' || isNaN(stock) || stock < 0) {
      newErrors.stock = 'El stock debe ser un número entero mayor o igual a 0';
    }

    // Validar URL de imagen si se proporciona
    if (formData.imagen && formData.imagen.trim() !== '') {
      try {
        new URL(formData.imagen);
      } catch {
        newErrors.imagen = 'La URL de la imagen no es válida';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Por favor, corrija los errores en el formulario');
      return;
    }

    setLoading(true);

    try {
      const dataToSubmit = {
        ...formData,
        precio: parseFloat(formData.precio),
        stock: parseInt(formData.stock),
        categoria: parseInt(formData.categoria)
      };

      if (isEditing) {
        await api.updateProducto(id, dataToSubmit);
        toast.success('Producto actualizado exitosamente');
      } else {
        await api.createProducto(dataToSubmit);
        toast.success('Producto creado exitosamente');
      }

      navigate('/productos');
    } catch (error) {
      console.error('Error saving producto:', error);
      toast.error('Error al guardar el producto');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{
      marginLeft: '280px',
      padding: '2rem',
      backgroundColor: '#f7fafc',
      minHeight: '100vh'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <button
          onClick={() => navigate('/productos')}
          style={{
            padding: '0.5rem',
            background: 'white',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '1.5rem'
          }}
        >
          ←
        </button>
        <div>
          <h1 style={{
            fontSize: '2rem',
            fontWeight: '700',
            color: '#2d3748',
            margin: 0
          }}>
            {isEditing ? 'Editar Producto' : 'Nuevo Producto'}
          </h1>
          <p style={{
            fontSize: '1rem',
            color: '#718096',
            margin: 0
          }}>
            {isEditing ? 'Modifica los datos del producto' : 'Completa los datos para agregar un nuevo producto'}
          </p>
        </div>
      </div>

      <div style={{
        background: 'white',
        borderRadius: '12px',
        padding: '2rem',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        maxWidth: '800px'
      }}>
        <form onSubmit={handleSubmit}>
          <div style={{
            marginBottom: '2rem',
            textAlign: 'center'
          }}>
            <div style={{
              width: '200px',
              height: '200px',
              margin: '0 auto 1rem',
              background: '#e2e8f0',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '4rem',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {previewImage ? (
                <img 
                  src={previewImage} 
                  alt="Preview"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
              ) : formData.imagen ? (
                <img 
                  src={formData.imagen} 
                  alt="Product"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
              ) : (
                <span>📦</span>
              )}
            </div>
            <div>
              <input
                type="text"
                name="imagen"
                placeholder="URL de imagen o link"
                value={formData.imagen}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: errors.imagen ? '1px solid #f56565' : '1px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '1rem'
                }}
              />
              {errors.imagen && (
                <p style={{ fontSize: '0.875rem', color: '#f56565', marginTop: '0.25rem' }}>
                  {errors.imagen}
                </p>
              )}
              <p style={{ fontSize: '0.75rem', color: '#718096', marginTop: '0.5rem' }}>
                Opcional: Ingrese una URL válida de imagen
              </p>
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontWeight: '600',
              color: '#2d3748'
            }}>
              Nombre del Producto *
            </label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleInputChange}
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                border: errors.nombre ? '1px solid #f56565' : '1px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '1rem'
              }}
              placeholder="Ej: iPhone 15 Pro Max"
            />
            {errors.nombre && (
              <p style={{ fontSize: '0.875rem', color: '#f56565', marginTop: '0.25rem' }}>
                {errors.nombre}
              </p>
            )}
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontWeight: '600',
              color: '#2d3748'
            }}>
              Descripción
            </label>
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleInputChange}
              rows="4"
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '1rem',
                fontFamily: 'inherit',
                resize: 'vertical'
              }}
              placeholder="Describe las características del producto..."
            />
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '1rem',
            marginBottom: '1.5rem'
          }}>
            <div>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontWeight: '600',
                color: '#2d3748'
              }}>
                Categoría *
              </label>
              <select
                name="categoria"
                value={formData.categoria}
                onChange={handleInputChange}
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: errors.categoria ? '1px solid #f56565' : '1px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  background: 'white'
                }}
              >
                  <option value="">Seleccionar categoría</option>
                  {categorias.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                  ))}
                </select>
                {errors.categoria && (
                  <p style={{ fontSize: '0.875rem', color: '#f56565', marginTop: '0.25rem' }}>
                    {errors.categoria}
                  </p>
                )}
              </div>

            <div>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontWeight: '600',
                color: '#2d3748'
              }}>
                Precio (S/) *
              </label>
              <input
                type="number"
                name="precio"
                value={formData.precio}
                onChange={handleInputChange}
                required
                min="0"
                step="0.01"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: errors.precio ? '1px solid #f56565' : '1px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '1rem'
                }}
                placeholder="0.00"
              />
              {errors.precio && (
                <p style={{ fontSize: '0.875rem', color: '#f56565', marginTop: '0.25rem' }}>
                  {errors.precio}
                </p>
              )}
            </div>
          </div>

          {/* Stock and Active Row */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '1rem',
            marginBottom: '1.5rem'
          }}>
            <div>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontWeight: '600',
                color: '#2d3748'
              }}>
                Stock *
              </label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleInputChange}
                required
                min="0"
                step="1"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: errors.stock ? '1px solid #f56565' : '1px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '1rem'
                }}
                placeholder="0"
              />
              {errors.stock && (
                <p style={{ fontSize: '0.875rem', color: '#f56565', marginTop: '0.25rem' }}>
                  {errors.stock}
                </p>
              )}
            </div>

            <div>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontWeight: '600',
                color: '#2d3748'
              }}>
                Estado
              </label>
              <div style={{
                padding: '0.75rem',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                background: '#f7fafc',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <input
                  type="checkbox"
                  name="activo"
                  checked={formData.activo}
                  onChange={handleInputChange}
                  style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                />
                <span style={{ color: '#2d3748' }}>Producto activo</span>
              </div>
            </div>
          </div>

          <div style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'flex-end',
            marginTop: '2rem',
            paddingTop: '2rem',
            borderTop: '1px solid #e2e8f0'
          }}>
            <button
              type="button"
              onClick={() => navigate('/productos')}
              style={{
                padding: '0.75rem 1.5rem',
                background: 'white',
                color: '#718096',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '0.75rem 1.5rem',
                background: '#ff6b35',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.6 : 1
              }}
            >
              {loading ? 'Guardando...' : isEditing ? 'Actualizar Producto' : 'Crear Producto'}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

export default ProductoForm;
