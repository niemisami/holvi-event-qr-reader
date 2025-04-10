import { GoogleOAuthProvider } from '@react-oauth/google'
import './App.css'
import Authenticate from './Authenticate.tsx'
import { Authorized } from './Authorized.tsx'
import PWABadge from './PWABadge.tsx'

function App() {
  return (
    <GoogleOAuthProvider
      clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}
    >
      <Authenticate>
        <Authorized />
      </Authenticate>
      <PWABadge />
    </GoogleOAuthProvider>
  )
}

export default App
