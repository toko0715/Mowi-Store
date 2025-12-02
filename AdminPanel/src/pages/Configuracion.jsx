import React, { useState, useEffect, useCallback } from 'react';
import { useToast } from '../context/ToastContext';

function Configuracion() {
  const DEFAULT_SETTINGS = {
    nombreTienda: 'MOWI Store',
    email: 'admin@mowi.com',
    telefono: '+51 123 456 789',
    direccion: 'Lima, Perú',
    moneda: 'S/',
    idioma: 'Español',
    notificaciones: true,
  };

  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [errors, setErrors] = useState({});
  const toast = useToast();

  const loadSavedSettings = useCallback(() => {
    try {
      const saved = localStorage.getItem('admin_config');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...DEFAULT_SETTINGS,
          ...parsed,
        };
      }
    } catch (error) {
      console.error('Error cargando configuraciones guardadas:', error);
    }
    return DEFAULT_SETTINGS;
  }, []);

  // Cargar configuraciones guardadas (excepto nombre de la tienda)
  useEffect(() => {
    setSettings(loadSavedSettings());
  }, [loadSavedSettings]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    // El nombre de la tienda es solo informativo, no se permite cambiarlo
    if (name === 'nombreTienda') {
      return;
    }

    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const validateSettings = () => {
    const newErrors = {};

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

    try {
      // Guardar en localStorage todo excepto el nombre de la tienda
      const { nombreTienda, ...rest } = settings;
      localStorage.setItem('admin_config', JSON.stringify(rest));
      // Sincronizar estado con lo realmente guardado
      setSettings({
        ...DEFAULT_SETTINGS,
        ...rest,
      });
    } catch (error) {
      console.error('Error guardando configuraciones:', error);
      toast.error('No se pudieron guardar las configuraciones');
      return;
    }

    toast.success('Configuraciones guardadas exitosamente');
  };

  return (
    <main style={{
      marginLeft: '280px',
      padding: '2.5rem',
      backgroundColor: '#f7fafc',
      minHeight: '100vh',
      boxSizing: 'border-box'
    }}>
      <div style={{
        maxWidth: '1100px',
        margin: '0 auto'
      }}>
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{
            fontSize: '2.2rem',
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

        {/* Layout de tarjetas */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1.4fr)',
          gap: '1.5rem',
          alignItems: 'flex-start',
          marginBottom: '2rem'
        }}>
          {/* General Settings */}
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '1.75rem',
            boxShadow: '0 10px 30px rgba(15, 23, 42, 0.06)'
          }}>
        <h3 style={{
          fontSize: '1.25rem',
          fontWeight: '600',
          color: '#2d3748',
          marginBottom: '1.25rem'
        }}>
          Configuración General
        </h3>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
          gap: '1.25rem 1.5rem'
        }}>
          <div style={{ gridColumn: '1 / -1' }}>
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
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '1rem',
                backgroundColor: '#edf2f7',
                color: '#4a5568',
                cursor: 'not-allowed'
              }}
              disabled
            />
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

          <div style={{ gridColumn: '1 / -1' }}>
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
            borderRadius: '16px',
            padding: '1.75rem',
            boxShadow: '0 10px 30px rgba(15, 23, 42, 0.06)'
          }}>
        <h3 style={{
          fontSize: '1.25rem',
          fontWeight: '600',
          color: '#2d3748',
          marginBottom: '1.25rem'
        }}>
          Preferencias
        </h3>
        
        <div style={{
          display: 'grid',
          gap: '1.25rem'
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
        </div>

        {/* Actions */}
        <div style={{
          display: 'flex',
          gap: '1rem',
          justifyContent: 'flex-end'
        }}>
          <button
            onClick={() => setSettings(loadSavedSettings())}
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
      </div>
    </main>
  );
}

export default Configuracion;
