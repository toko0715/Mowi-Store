import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'

const container = document.getElementById('root');

if (!container) {
  throw new Error("El elemento con id 'root' no fue encontrado en el DOM. Revisa index.html.");
}

createRoot(container).render(
  <StrictMode>
    <App />
  </StrictMode>,
);