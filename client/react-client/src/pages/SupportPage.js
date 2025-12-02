import React, { useState } from 'react';
import './SupportPage.css';

function SupportPage() {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    asunto: '',
    mensaje: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Gracias por contactarnos. Te responderemos pronto.');
    setFormData({
      nombre: '',
      email: '',
      asunto: '',
      mensaje: '',
    });
  };

  return (
    <div className="support-page">
      <div className="support-container">
        <h1 className="support-title">Centro de Soporte</h1>
        <p className="support-subtitle">
          Estamos aquí para ayudarte. Contáctanos y te responderemos lo antes posible.
        </p>

        <div className="support-content">
          <div className="support-info">
            <div className="info-card">
              <div className="info-icon">📧</div>
              <h3>Email</h3>
              <p>soporte@mowi.com</p>
            </div>
            <div className="info-card">
              <div className="info-icon">📞</div>
              <h3>Teléfono</h3>
              <p>+51 999 999 999</p>
            </div>
            <div className="info-card">
              <div className="info-icon">🕐</div>
              <h3>Horario</h3>
              <p>Lun - Vie: 9:00 AM - 6:00 PM</p>
            </div>
          </div>

          <form className="support-form" onSubmit={handleSubmit}>
            <h2>Envíanos un Mensaje</h2>
            <div className="form-group">
              <label htmlFor="nombre">Nombre Completo</label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Correo Electrónico</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="asunto">Asunto</label>
              <input
                type="text"
                id="asunto"
                name="asunto"
                value={formData.asunto}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="mensaje">Mensaje</label>
              <textarea
                id="mensaje"
                name="mensaje"
                value={formData.mensaje}
                onChange={handleChange}
                rows="6"
                required
              />
            </div>
            <button type="submit" className="btn-submit">
              Enviar Mensaje
            </button>
          </form>
        </div>

        <div className="faq-section">
          <h2>Preguntas Frecuentes</h2>
          <div className="faq-list">
            <div className="faq-item">
              <h3>¿Cómo puedo realizar un pedido?</h3>
              <p>
                Simplemente navega por nuestro catálogo, agrega productos al carrito y procede al checkout.
                Completa la información de pago y confirma tu pedido.
              </p>
            </div>
            <div className="faq-item">
              <h3>¿Cuáles son los métodos de pago disponibles?</h3>
              <p>
                Aceptamos pagos con tarjeta de crédito/débito a través de Stripe. 
                También puedes pagar con otros métodos que estén disponibles en el checkout.
              </p>
            </div>
            <div className="faq-item">
              <h3>¿Cuánto tiempo tarda el envío?</h3>
              <p>
                El tiempo de envío varía según tu ubicación. Generalmente, los pedidos se procesan 
                en 1-2 días hábiles y el envío tarda entre 3-7 días hábiles.
              </p>
            </div>
            <div className="faq-item">
              <h3>¿Puedo cancelar o modificar mi pedido?</h3>
              <p>
                Puedes cancelar tu pedido antes de que sea procesado. Una vez procesado, 
                contacta con nuestro equipo de soporte para asistencia.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SupportPage;

