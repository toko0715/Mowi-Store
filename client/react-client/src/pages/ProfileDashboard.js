import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { direccionesAPI, wishlistAPI } from '../services/djangoApi';
import { productosAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import SuccessMessage from '../components/SuccessMessage';
import './ProfileDashboard.css';

function ProfileDashboard() {
  const { user, isAuthenticated } = useApp();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('perfil');
  const [direcciones, setDirecciones] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [productosWishlist, setProductosWishlist] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [showDireccionForm, setShowDireccionForm] = useState(false);
  const [editingDireccion, setEditingDireccion] = useState(null);
  const [direccionForm, setDireccionForm] = useState({
    nombre_completo: '',
    telefono: '',
    direccion: '',
    ciudad: '',
    departamento: '',
    codigo_postal: '',
    referencia: '',
    es_principal: false,
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
      return;
    }
    
    // Manejar parámetro de URL para abrir tab específico
    const urlParams = new URLSearchParams(window.location.search);
    const tab = urlParams.get('tab');
    if (tab && ['perfil', 'direcciones', 'wishlist'].includes(tab)) {
      setActiveTab(tab);
    }
    
    cargarDatos();
  }, [isAuthenticated, activeTab]);

  const cargarDatos = async () => {
    if (activeTab === 'direcciones') {
      await cargarDirecciones();
    } else if (activeTab === 'wishlist') {
      await cargarWishlist();
    }
  };

  const cargarDirecciones = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await direccionesAPI.listar();
      setDirecciones(response.data);
    } catch (error) {
      console.error('Error al cargar direcciones:', error);
      setError('Error al cargar las direcciones');
    } finally {
      setLoading(false);
    }
  };

  const cargarWishlist = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await wishlistAPI.listar();
      setWishlist(response.data);
      
      // Cargar información de productos
      const productosPromises = response.data.map(item =>
        productosAPI.obtenerPorId(item.producto_id).catch(() => null)
      );
      const productosResponses = await Promise.all(productosPromises);
      setProductosWishlist(productosResponses.filter(r => r !== null).map(r => r.data));
    } catch (error) {
      console.error('Error al cargar wishlist:', error);
      setError('Error al cargar la wishlist');
    } finally {
      setLoading(false);
    }
  };

  const handleDireccionSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (editingDireccion) {
        await direccionesAPI.actualizar(editingDireccion.id, direccionForm);
        setSuccessMessage('Dirección actualizada exitosamente');
      } else {
        await direccionesAPI.crear(direccionForm);
        setSuccessMessage('Dirección creada exitosamente');
      }
      
      setShowDireccionForm(false);
      setEditingDireccion(null);
      setDireccionForm({
        nombre_completo: '',
        telefono: '',
        direccion: '',
        ciudad: '',
        departamento: '',
        codigo_postal: '',
        referencia: '',
        es_principal: false,
      });
      await cargarDirecciones();
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      console.error('Error al guardar dirección:', error);
      setError('Error al guardar la dirección');
    } finally {
      setLoading(false);
    }
  };

  const handleEditarDireccion = (direccion) => {
    setEditingDireccion(direccion);
    setDireccionForm({
      nombre_completo: direccion.nombre_completo,
      telefono: direccion.telefono,
      direccion: direccion.direccion,
      ciudad: direccion.ciudad,
      departamento: direccion.departamento,
      codigo_postal: direccion.codigo_postal || '',
      referencia: direccion.referencia || '',
      es_principal: direccion.es_principal,
    });
    setShowDireccionForm(true);
  };

  const handleEliminarDireccion = async (id) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar esta dirección?')) {
      return;
    }

    setLoading(true);
    try {
      await direccionesAPI.eliminar(id);
      setSuccessMessage('Dirección eliminada exitosamente');
      await cargarDirecciones();
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      console.error('Error al eliminar dirección:', error);
      setError('Error al eliminar la dirección');
    } finally {
      setLoading(false);
    }
  };

  const handleEliminarWishlist = async (productoId) => {
    setLoading(true);
    try {
      await wishlistAPI.eliminar(productoId);
      setSuccessMessage('Producto eliminado de wishlist');
      await cargarWishlist();
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      console.error('Error al eliminar de wishlist:', error);
      setError('Error al eliminar el producto');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="profile-dashboard">
      <div className="profile-container">
        <h1 className="profile-title">Mi Perfil</h1>

        {successMessage && (
          <SuccessMessage 
            message={successMessage} 
            onClose={() => setSuccessMessage(null)}
          />
        )}

        {error && (
          <ErrorMessage 
            message={error} 
            onClose={() => setError(null)}
          />
        )}

        <div className="profile-tabs">
          <button
            className={`tab ${activeTab === 'perfil' ? 'active' : ''}`}
            onClick={() => setActiveTab('perfil')}
          >
            Perfil
          </button>
          <button
            className={`tab ${activeTab === 'direcciones' ? 'active' : ''}`}
            onClick={() => setActiveTab('direcciones')}
          >
            Direcciones
          </button>
          <button
            className={`tab ${activeTab === 'wishlist' ? 'active' : ''}`}
            onClick={() => setActiveTab('wishlist')}
          >
            Wishlist
          </button>
        </div>

        <div className="profile-content">
          {activeTab === 'perfil' && (
            <div className="profile-section">
              <h2>Información Personal</h2>
              <div className="profile-info">
                <div className="info-row">
                  <label>Nombre:</label>
                  <span>{user?.name || 'N/A'}</span>
                </div>
                <div className="info-row">
                  <label>Email:</label>
                  <span>{user?.email || 'N/A'}</span>
                </div>
                <div className="info-row">
                  <label>Miembro desde:</label>
                  <span>
                    {user?.date_joined 
                      ? new Date(user.date_joined).toLocaleDateString('es-PE')
                      : 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'direcciones' && (
            <div className="profile-section">
              <div className="section-header">
                <h2>Mis Direcciones</h2>
                <button
                  className="btn-add"
                  onClick={() => {
                    setShowDireccionForm(true);
                    setEditingDireccion(null);
                    setDireccionForm({
                      nombre_completo: '',
                      telefono: '',
                      direccion: '',
                      ciudad: '',
                      departamento: '',
                      codigo_postal: '',
                      referencia: '',
                      es_principal: false,
                    });
                  }}
                >
                  + Agregar Dirección
                </button>
              </div>

              {showDireccionForm && (
                <form className="direccion-form" onSubmit={handleDireccionSubmit}>
                  <h3>{editingDireccion ? 'Editar Dirección' : 'Nueva Dirección'}</h3>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Nombre Completo *</label>
                      <input
                        type="text"
                        value={direccionForm.nombre_completo}
                        onChange={(e) => setDireccionForm({ ...direccionForm, nombre_completo: e.target.value })}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Teléfono *</label>
                      <input
                        type="text"
                        value={direccionForm.telefono}
                        onChange={(e) => setDireccionForm({ ...direccionForm, telefono: e.target.value })}
                        required
                      />
                    </div>
                    <div className="form-group full-width">
                      <label>Dirección *</label>
                      <input
                        type="text"
                        value={direccionForm.direccion}
                        onChange={(e) => setDireccionForm({ ...direccionForm, direccion: e.target.value })}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Ciudad *</label>
                      <input
                        type="text"
                        value={direccionForm.ciudad}
                        onChange={(e) => setDireccionForm({ ...direccionForm, ciudad: e.target.value })}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Departamento *</label>
                      <input
                        type="text"
                        value={direccionForm.departamento}
                        onChange={(e) => setDireccionForm({ ...direccionForm, departamento: e.target.value })}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Código Postal</label>
                      <input
                        type="text"
                        value={direccionForm.codigo_postal}
                        onChange={(e) => setDireccionForm({ ...direccionForm, codigo_postal: e.target.value })}
                      />
                    </div>
                    <div className="form-group full-width">
                      <label>Referencia</label>
                      <textarea
                        value={direccionForm.referencia}
                        onChange={(e) => setDireccionForm({ ...direccionForm, referencia: e.target.value })}
                        rows="3"
                      />
                    </div>
                    <div className="form-group full-width">
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={direccionForm.es_principal}
                          onChange={(e) => setDireccionForm({ ...direccionForm, es_principal: e.target.checked })}
                        />
                        Marcar como dirección principal
                      </label>
                    </div>
                  </div>
                  <div className="form-actions">
                    <button type="submit" className="btn-save" disabled={loading}>
                      {loading ? 'Guardando...' : 'Guardar'}
                    </button>
                    <button
                      type="button"
                      className="btn-cancel"
                      onClick={() => {
                        setShowDireccionForm(false);
                        setEditingDireccion(null);
                      }}
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              )}

              {loading && !showDireccionForm ? (
                <LoadingSpinner />
              ) : (
                <div className="direcciones-list">
                  {direcciones.length === 0 ? (
                    <p className="empty-message">No tienes direcciones guardadas</p>
                  ) : (
                    direcciones.map((direccion) => (
                      <div key={direccion.id} className="direccion-card">
                        {direccion.es_principal && (
                          <span className="badge-principal">Principal</span>
                        )}
                        <div className="direccion-info">
                          <h4>{direccion.nombre_completo}</h4>
                          <p>{direccion.direccion}</p>
                          <p>{direccion.ciudad}, {direccion.departamento}</p>
                          {direccion.telefono && <p>Tel: {direccion.telefono}</p>}
                        </div>
                        <div className="direccion-actions">
                          <button
                            className="btn-edit"
                            onClick={() => handleEditarDireccion(direccion)}
                          >
                            Editar
                          </button>
                          <button
                            className="btn-delete"
                            onClick={() => handleEliminarDireccion(direccion.id)}
                          >
                            Eliminar
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === 'wishlist' && (
            <div className="profile-section">
              <h2>Mi Wishlist</h2>
              {loading ? (
                <LoadingSpinner />
              ) : (
                <div className="wishlist-grid">
                  {productosWishlist.length === 0 ? (
                    <p className="empty-message">Tu wishlist está vacía</p>
                  ) : (
                    productosWishlist.map((producto) => (
                      <div key={producto.id} className="wishlist-item">
                        <img
                          src={producto.imagen || 'https://via.placeholder.com/200x200?text=Sin+Imagen'}
                          alt={producto.nombre}
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/200x200?text=Sin+Imagen';
                          }}
                        />
                        <h4>{producto.nombre}</h4>
                        <p className="price">S/ {parseFloat(producto.precio).toFixed(2)}</p>
                        <div className="wishlist-actions">
                          <button
                            className="btn-view"
                            onClick={() => navigate(`/producto/${producto.id}`)}
                          >
                            Ver Producto
                          </button>
                          <button
                            className="btn-remove"
                            onClick={() => handleEliminarWishlist(producto.id)}
                          >
                            Eliminar
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProfileDashboard;

