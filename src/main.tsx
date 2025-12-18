import { createRoot } from 'react-dom/client'
// Thêm dấu ngoặc nhọn {} để import đúng
import { App } from './App'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <App />
)
