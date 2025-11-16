import React, { useState } from 'react';
import { useToast } from '../context/ToastContext';

function Configuracion() {
  const [settings, setSettings] = useState({
    nombreTienda: 'MOWI Store',
    email: 'admin@mowi.com',
    telefono: '+51 123 456 789',
    direccion: 'Lima, Perú',
    moneda: 'S/',
    idioma: 'Español',
    notificaciones: true
  });
  const [errors, setErrors] = useState({});
  const toast = useToast();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const validateSettings = () => {
    const newErrors = {};

    if (!settings.nombreTienda || settings.nombreTienda.trim().length < 2) {
      newErrors.nombreTienda = 'El nombre de la tienda debe tener al menos 2 caracteres';
    }

    if (!settings.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(settings.email)) {
      newErrors.email = 'Debe ingresar un email válido';
    }

    if (!settings.telefono || settings.telefono.trim().length < 8) {
      newErrors.telefono = 'Debe ingresar un teléfono válido';
    }

    if (!settings.direccion || settings.direccion.trim().length < 5) {
      newErrors.direccion = 'Debe ingresar una dirección válida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateSettings()) {
      toast.error('Por favor, corrija los errores en el formulario');
      return;
    }
    
    // Aquí se guardaría en el backend o localStorage
    // Por ahora solo mostramos el toast
    toast.success('Configuraciones guardadas exitosamente');
  };

  return (
    <main style={{
      marginLeft: '280px',
      padding: '2rem',
      backgroundColor: '#f7fafc'
    }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{
          fontSize: '2rem',
          fontWeight: '700',
          color: '#2d3748',
          marginBottom: '0.5rem'
        }}>
          Configuración
        </h1>
        <p style={{
          fontSize: '1rem',
          color: '#718096'
        }}>
          Administra las configuraciones del sistema
        </p>
      </div>

      {/* General Settings */}
      <div style={{
        background: 'white',
        borderRadius: '12px',
        padding: '1.5rem',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        marginBottom: '1.5rem'
      }}>
        <h3 style={{
          fontSize: '1.25rem',
          fontWeight: '600',
          color: '#2d3748',
          marginBottom: '1.5rem'
        }}>
          Configuración General
        </h3>
        
        <div style={{
          display: 'grid',
          gap: '1.5rem'
        }}>
          <div>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '600',
              color: '#2d3748',
              marginBottom: '0.5rem'
            }}>
              Nombre de la Tienda
            </label>
            <input
              type="text"
              name="nombreTienda"
              value={settings.nombreTienda}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                border: errors.nombreTienda ? '1px solid #f56565' : '1px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '1rem'
              }}
            />
            {errors.nombreTienda && (
              <p style={{ fontSize: '0.875rem', color: '#f56565', marginTop: '0.25rem' }}>
                {errors.nombreTienda}
              </p>
            )}
          </div>

          <div>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '600',
              color: '#2d3748',
              marginBottom: '0.5rem'
            }}>
              Email de Contacto
            </label>
            <input
              type="email"
              name="email"
              value={settings.email}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
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

          <div>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '600',
              color: '#2d3748',
              marginBottom: '0.5rem'
            }}>
              Teléfono
            </label>
            <input
              type="text"
              name="telefono"
              value={settings.telefono}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                border: errors.telefono ? '1px solid #f56565' : '1px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '1rem'
              }}
            />
            {errors.telefono && (
              <p style={{ fontSize: '0.875rem', color: '#f56565', marginTop: '0.25rem' }}>
                {errors.telefono}
              </p>
            )}
          </div>

          <div>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '600',
              color: '#2d3748',
              marginBottom: '0.5rem'
            }}>
              Dirección
            </label>
            <input
              type="text"
              name="direccion"
              value={settings.direccion}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                border: errors.direccion ? '1px solid #f56565' : '1px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '1rem'
              }}
            />
            {errors.direccion && (
              <p style={{ fontSize: '0.875rem', color: '#f56565', marginTop: '0.25rem' }}>
                {errors.direccion}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Preferences */}
      <div style={{
        background: 'white',
        borderRadius: '12px',
        padding: '1.5rem',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        marginBottom: '1.5rem'
      }}>
        <h3 style={{
          fontSize: '1.25rem',
          fontWeight: '600',
          color: '#2d3748',
          marginBottom: '1.5rem'
        }}>
          Preferencias
        </h3>
        
        <div style={{
          display: 'grid',
          gap: '1.5rem'
        }}>
          <div>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '600',
              color: '#2d3748',
              marginBottom: '0.5rem'
            }}>
              Moneda
            </label>
            <select
              name="moneda"
              value={settings.moneda}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '1rem'
              }}
            >
              <option value="S/">Soles (S/)</option>
              <option value="$">Dólares ($)</option>
              <option value="€">Euros (€)</option>
            </select>
          </div>

          <div>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '600',
              color: '#2d3748',
              marginBottom: '0.5rem'
            }}>
              Idioma
            </label>
            <select
              name="idioma"
              value={settings.idioma}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '1rem'
              }}
            >
              <option value="Español">Español</option>
              <option value="Inglés">Inglés</option>
              <option value="Francés">Francés</option>
            </select>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            padding: '1rem',
            background: '#f7fafc',
            borderRadius: '8px'
          }}>
            <input
              type="checkbox"
              name="notificaciones"
              checked={settings.notificaciones}
              onChange={handleChange}
              style={{
                width: '20px',
                height: '20px',
                cursor: 'pointer'
              }}
            />
            <label style={{
              fontSize: '0.875rem',
              fontWeight: '600',
              color: '#2d3748',
              cursor: 'pointer'
            }}>
              Activar notificaciones por email
            </label>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div style={{
        display: 'flex',
        gap: '1rem',
        justifyContent: 'flex-end'
      }}>
        <button
          onClick={() => setSettings({
            nombreTienda: 'MOWI Store',
            email: 'admin@mowi.com',
            telefono: '+51 123 456 789',
            direccion: 'Lima, Perú',
            moneda: 'S/',
            idioma: 'Español',
            notificaciones: true
          })}
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
          onClick={handleSave}
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
          Guardar Cambios
        </button>
      </div>
    </main>
  );
}

export default Configuracion;
