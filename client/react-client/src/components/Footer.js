import React from 'react';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-column">
          <h3 className="footer-logo">MOWI</h3>
          <p className="footer-description">
            Tu marketplace confiable para compras en línea. Encuentra los mejores productos a los mejores precios.
          </p>
        </div>

        <div className="footer-column">
          <h4 className="footer-title">Enlaces Rápidos</h4>
          <ul className="footer-links">
            <li><a href="#terminos">Términos y condiciones</a></li>
            <li><a href="#privacidad">Política de privacidad</a></li>
            <li><a href="#contacto">Contacto</a></li>
            <li><a href="#faq">Preguntas frecuentes</a></li>
          </ul>
        </div>

        <div className="footer-column">
          <h4 className="footer-title">Atención al Cliente</h4>
          <div className="footer-contact">
            <div className="contact-item">
              <span className="contact-icon contact-phone">📞</span>
              <span>+51 999 123 456</span>
            </div>
            <div className="contact-item">
              <span className="contact-icon contact-email">✉️</span>
              <span>soporte@mowi.pe</span>
            </div>
            <div className="contact-item">
              <span className="contact-icon contact-time">🕐</span>
              <span>Lunes a Viernes: 9AM - 6PM</span>
            </div>
            <div className="contact-item">
              <span className="contact-icon contact-time">🕐</span>
              <span>Sábados: 9AM - 2PM</span>
            </div>
          </div>
        </div>
      </div>
      <div className="footer-divider"></div>
      <div className="footer-copyright">
        <p>© 2024 MOWI. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}

export default Footer;

