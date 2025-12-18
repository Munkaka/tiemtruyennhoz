import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'

// Bỏ React.StrictMode để tránh lỗi ReferenceError
createRoot(document.getElementById('root')!).render(
  <App />
)
