import React from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import './index.css'; // Dòng này cực kỳ quan trọng để nhận diện giao diện

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
