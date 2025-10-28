import React, { useState } from 'react';

function Login({ onSwitchToRegister }) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState({});

  // Validación de email
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      return 'El correo es requerido';
    }
    if (!emailRegex.test(email)) {
      return 'Ingresa un correo válido';
    }
    return '';
  };

  // Validación de contraseña
  const validatePassword = (password) => {
    if (!password) {
      return 'La contraseña es requerida';
    }
    return '';
  };

  // Manejar cambios en los inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // Limpiar error al escribir
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar todos los campos
    const newErrors = {
      email: validateEmail(formData.email),
      password: validatePassword(formData.password)
    };

    setErrors(newErrors);

    // Verificar si hay errores
    const hasErrors = Object.values(newErrors).some(error => error !== '');

    if (!hasErrors) {
      try {
        // Llamada al backend de Django
        const response = await fetch('http://localhost:8000/api/login/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData)
        });

        const data = await response.json();

        if (response.ok) {
          // Guardar tokens en localStorage
          localStorage.setItem('access_token', data.access);
          localStorage.setItem('refresh_token', data.refresh);
          localStorage.setItem('user', JSON.stringify(data.user));

          alert(`¡Bienvenido ${data.user.name}!`);
          console.log('Usuario:', data.user);

          // Aquí podrías redirigir a la página principal o dashboard
          // window.location.href = '/dashboard';
        } else {
          setErrors({
            ...errors,
            password: data.error || 'Credenciales inválidas'
          });
        }
      } catch (error) {
        console.error('Error al iniciar sesión:', error);
        setErrors({
          ...errors,
          password: 'Error de conexión con el servidor'
        });
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      <div className="form-group">
        <label>Correo Electrónico</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="tu@email.com"
          className={errors.email ? 'input-error' : ''}
        />
        {errors.email && <span className="error-text">{errors.email}</span>}
      </div>

      <div className="form-group">
        <label>Contraseña</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Tu contraseña"
          className={errors.password ? 'input-error' : ''}
        />
        {errors.password && <span className="error-text">{errors.password}</span>}
      </div>

      <button type="submit" className="submit-button">
        Iniciar Sesión
      </button>

      <a href="#" className="forgot-password">
        ¿Olvidaste tu contraseña?
      </a>
    </form>
  );
}

export default Login;
