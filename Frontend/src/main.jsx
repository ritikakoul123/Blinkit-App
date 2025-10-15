import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import "../public/css/index.css";
import App from "../../Frontend/src/App.jsx";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
