import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// Initialize error monitoring
window.__jsErrors = [];

window.addEventListener('error', (event) => {
  window.__jsErrors.push({
    message: event.message,
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno,
    error: event.error,
    timestamp: new Date().toISOString()
  });
});

window.addEventListener('unhandledrejection', (event) => {
  window.__jsErrors.push({
    type: 'unhandledrejection',
    reason: event.reason,
    timestamp: new Date().toISOString()
  });
});

// Error checking function
window.checkJSErrors = async function() {
  try {
    console.error("Checking for JavaScript errors on page load.");
    const data = {
      jsErrors: window.__jsErrors || []
    };
    return (typeof data !== "undefined") ? data : undefined;
  } catch (error) {
    return error;
  }
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);