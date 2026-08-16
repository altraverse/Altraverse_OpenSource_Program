import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from "./context/AuthContext.jsx";
import { Analytics } from "@vercel/analytics/react";
import './styles/globals.css';

const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <StrictMode>
      <AuthProvider>
        <App />
        {!isLocalhost && <Analytics />}
      </AuthProvider>
    </StrictMode>
  </BrowserRouter>
);
