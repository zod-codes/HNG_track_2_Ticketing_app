import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { useAuth } from './hooks/useAuth'
import { TicketsProvider } from './contexts/TicketsContext'
import { ToastProvider } from './contexts/ToastContext'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import Tickets from './pages/Tickets'
import './App.css'

function Protected({ children }) {
  const { isAuthenticated } = useAuth()
  if (!isAuthenticated) return <Navigate to="/auth/login" replace />
  console.log(isAuthenticated);  
  return children
}

function App() {
  const router = createBrowserRouter([
    { path: '/', element: <Landing /> },
    { path: '/auth/login', element: <Login /> },
    { path: '/auth/signup', element: <Signup /> },
    {
      path: '/dashboard', element: (
        <Protected>
          <Dashboard />
        </Protected>
      )
    },
    {
      path: '/tickets', element: (
        <Protected>
          <Tickets />
        </Protected>
      )
    },
    { path: '*', element: <Navigate to="/" replace /> }
  ])

  return (
    <ToastProvider>
      <AuthProvider>
        <TicketsProvider>
          <RouterProvider router={router} />
        </TicketsProvider>
      </AuthProvider>
    </ToastProvider>
  )
}

export default App
