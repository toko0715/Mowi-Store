import React, { useState } from 'react';
import './Register.css';

function Register() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: ''
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

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
    if (password.length < 8) {
      return 'La contraseña debe tener al menos 8 caracteres';
    }
    if (!/(?=.*[a-z])/.test(password)) {
      return 'Debe contener al menos una letra minúscula';
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      return 'Debe contener al menos una letra mayúscula';
    }
    if (!/(?=.*\d)/.test(password)) {
      return 'Debe contener al menos un número';
    }
    if (!/(?=.*[@$!%*?&])/.test(password)) {
      return 'Debe contener al menos un carácter especial (@$!%*?&)';
    }
    return '';
  };

  // Validación de confirmación de contraseña
  const validateConfirmPassword = (confirmPassword, password) => {
    if (!confirmPassword) {
      return 'Debes confirmar tu contraseña';
    }
    if (confirmPassword !== password) {
      return 'Las contraseñas no coinciden';
    }
    return '';
  };

  // Validación de nombre
  const validateName = (name) => {
    if (!name) {
      return 'El nombre es requerido';
    }
    if (name.length < 2) {
      return 'El nombre debe tener al menos 2 caracteres';
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

    // Validar en tiempo real si el campo ya fue tocado
    if (touched[name]) {
      validateField(name, value);
    }
  };

  // Validar campo individual
  const validateField = (fieldName, value) => {
    let error = '';

    switch (fieldName) {
      case 'email':
        error = validateEmail(value);
        break;
      case 'password':
        error = validatePassword(value);
        // Re-validar confirmPassword si ya tiene valor
        if (formData.confirmPassword) {
          setErrors(prev => ({
            ...prev,
            confirmPassword: validateConfirmPassword(formData.confirmPassword, value)
          }));
        }
        break;
      case 'confirmPassword':
        error = validateConfirmPassword(value, formData.password);
        break;
      case 'name':
        error = validateName(value);
        break;
      default:
        break;
    }

    setErrors({
      ...errors,
      [fieldName]: error
    });
  };

  // Manejar cuando el usuario sale del campo
  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched({
      ...touched,
      [name]: true
    });
    validateField(name, formData[name]);
  };

  // Manejar envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();

    // Marcar todos los campos como tocados
    const allTouched = {
      email: true,
      password: true,
      confirmPassword: true,
      name: true
    };
    setTouched(allTouched);

    // Validar todos los campos
    const newErrors = {
      email: validateEmail(formData.email),
      password: validatePassword(formData.password),
      confirmPassword: validateConfirmPassword(formData.confirmPassword, formData.password),
      name: validateName(formData.name)
    };

    setErrors(newErrors);

    // Verificar si hay errores
    const hasErrors = Object.values(newErrors).some(error => error !== '');

    if (!hasErrors) {
      // Aquí iría la lógica para enviar los datos al backend
      console.log('Formulario válido, datos:', formData);
      alert('¡Registro exitoso! (Conectar con Django backend)');

      // Limpiar formulario
      setFormData({
        email: '',
        password: '',
        confirmPassword: '',
        name: ''
      });
      setTouched({});
      setErrors({});
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h2>Crear Cuenta</h2>
        <p className="subtitle">Únete a Mowi Market</p>

        <form onSubmit={handleSubmit} noValidate>
          {/* Campo Nombre */}
          <div className="form-group">
            <label htmlFor="name">Nombre Completo</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              onBlur={handleBlur}
              className={touched.name && errors.name ? 'error' : ''}
              placeholder="Juan Pérez"
            />
            {touched.name && errors.name && (
              <span className="error-message">{errors.name}</span>
            )}
          </div>

          {/* Campo Email */}
          <div className="form-group">
            <label htmlFor="email">Correo Electrónico</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              className={touched.email && errors.email ? 'error' : ''}
              placeholder="ejemplo@correo.com"
            />
            {touched.email && errors.email && (
              <span className="error-message">{errors.email}</span>
            )}
          </div>

          {/* Campo Contraseña */}
          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              onBlur={handleBlur}
              className={touched.password && errors.password ? 'error' : ''}
              placeholder="••••••••"
            />
            {touched.password && errors.password && (
              <span className="error-message">{errors.password}</span>
            )}
            {!errors.password && formData.password && (
              <span className="success-message">✓ Contraseña segura</span>
            )}
          </div>

          {/* Campo Confirmar Contraseña */}
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirmar Contraseña</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              className={touched.confirmPassword && errors.confirmPassword ? 'error' : ''}
              placeholder="••••••••"
            />
            {touched.confirmPassword && errors.confirmPassword && (
              <span className="error-message">{errors.confirmPassword}</span>
            )}
            {!errors.confirmPassword && formData.confirmPassword && formData.password && (
              <span className="success-message">✓ Las contraseñas coinciden</span>
            )}
          </div>

          {/* Requisitos de contraseña */}
          {formData.password && (
            <div className="password-requirements">
              <p>La contraseña debe contener:</p>
              <ul>
                <li className={formData.password.length >= 8 ? 'valid' : ''}>
                  Mínimo 8 caracteres
                </li>
                <li className={/(?=.*[a-z])/.test(formData.password) ? 'valid' : ''}>
                  Una letra minúscula
                </li>
                <li className={/(?=.*[A-Z])/.test(formData.password) ? 'valid' : ''}>
                  Una letra mayúscula
                </li>
                <li className={/(?=.*\d)/.test(formData.password) ? 'valid' : ''}>
                  Un número
                </li>
                <li className={/(?=.*[@$!%*?&])/.test(formData.password) ? 'valid' : ''}>
                  Un carácter especial (@$!%*?&)
                </li>
              </ul>
            </div>
          )}

          <button type="submit" className="submit-btn">
            Crear Cuenta
          </button>
        </form>

        <p className="login-link">
          ¿Ya tienes cuenta? <a href="/login">Inicia sesión</a>
        </p>
      </div>
    </div>
  );
}

export default Register;
