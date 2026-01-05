import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './auth/AuthContext.jsx'
import TokenExpiryWarning from './components/TokenExpiryWarning.jsx'
import { ToastContainer } from 'react-toastify'

createRoot(document.getElementById('root')).render(
  <StrictMode>
      <AuthProvider >
   <TokenExpiryWarning />  {/* Add this line */}
         <ToastContainer />


    <App />
    </AuthProvider>
  </StrictMode>,
)
