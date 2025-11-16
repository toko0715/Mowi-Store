import React, { useState } from 'react';
import Modal from '../../components/Modal';

/**
 * Modal para crear/editar usuarios
 */
function UsuarioFormModal({ isOpen, onClose, usuario, formData, onFormChange, onSubmit }) {
  const isEditing = !!usuario;
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nombre || formData.nombre.trim().length < 2) {
      newErrors.nombre = 'El nombre debe tener al menos 2 caracteres';
    }

    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Debe ingresar un email válido';
    }

    if (!isEditing && (!formData.password || formData.password.length < 4)) {
      newErrors.password = 'La contraseña debe tener al menos 4 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmitClick = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(e);
    }
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={isEditing ? 'Editar Usuario' : 'Nuevo Usuario'}
      width="500px"
    >
      <form onSubmit={handleSubmitClick}>
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{
            display: 'block',
            fontSize: '0.875rem',
            fontWeight: '600',
            color: '#2d3748',
            marginBottom: '0.5rem'
          }}>
            Nombre
          </label>
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={(e) => {
              onFormChange({ ...formData, nombre: e.target.value });
              if (errors.nombre) setErrors({ ...errors, nombre: '' });
            }}
            required
            style={{
              width: '100%',
              padding: '0.75rem',
              border: errors.nombre ? '1px solid #f56565' : '1px solid #e2e8f0',
              borderRadius: '8px',
              fontSize: '1rem'
            }}
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
            fontSize: '0.875rem',
            fontWeight: '600',
            color: '#2d3748',
            marginBottom: '0.5rem'
          }}>
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={(e) => {
              onFormChange({ ...formData, email: e.target.value });
              if (errors.email) setErrors({ ...errors, email: '' });
            }}
            required
            style={{
              width: '100%',
              padding: '0.75rem',
              border: errors.email ? '1px solid #f56565' : '1px solid #e2e8f0',
              borderRadius: '8px',
              fontSize: '1rem'
            }}
          />
          {errors.email && (
            <p style={{ fontSize: '0.875rem', color: '#f56565', marginTop: '0.25rem' }}>
              {errors.email}
            </p>
          )}
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{
            display: 'block',
            fontSize: '0.875rem',
            fontWeight: '600',
            color: '#2d3748',
            marginBottom: '0.5rem'
          }}>
            Contraseña
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={(e) => {
              onFormChange({ ...formData, password: e.target.value });
              if (errors.password) setErrors({ ...errors, password: '' });
            }}
            required={!isEditing}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: errors.password ? '1px solid #f56565' : '1px solid #e2e8f0',
              borderRadius: '8px',
              fontSize: '1rem'
            }}
          />
          {errors.password && (
            <p style={{ fontSize: '0.875rem', color: '#f56565', marginTop: '0.25rem' }}>
              {errors.password}
            </p>
          )}
          {isEditing && !errors.password && (
            <p style={{ fontSize: '0.875rem', color: '#718096', marginTop: '0.25rem' }}>
              Dejar vacío para no cambiar
            </p>
          )}
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{
            display: 'block',
            fontSize: '0.875rem',
            fontWeight: '600',
            color: '#2d3748',
            marginBottom: '0.5rem'
          }}>
            Rol
          </label>
          <select
            name="rol"
            value={formData.rol}
            onChange={(e) => onFormChange({ ...formData, rol: e.target.value })}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              fontSize: '1rem'
            }}
          >
            <option value="cliente">Cliente</option>
            <option value="admin">Administrador</option>
          </select>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            cursor: 'pointer'
          }}>
            <input
              type="checkbox"
              name="activo"
              checked={formData.activo}
              onChange={(e) => onFormChange({ ...formData, activo: e.target.checked })}
              style={{
                width: '20px',
                height: '20px',
                cursor: 'pointer'
              }}
            />
            <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#2d3748' }}>
              Usuario Activo
            </span>
          </label>
        </div>

        <div style={{
          display: 'flex',
          gap: '1rem',
          justifyContent: 'flex-end'
        }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: '0.75rem 1.5rem',
              background: 'white',
              color: '#4a5568',
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
            style={{
              padding: '0.75rem 1.5rem',
              background: '#ff6b35',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            {isEditing ? 'Actualizar' : 'Crear'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default UsuarioFormModal;

