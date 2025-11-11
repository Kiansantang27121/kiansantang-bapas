import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Login from './pages/Login'
import AdminDashboard from './pages/AdminDashboard'
import Dashboard from './pages/Dashboard'
import QueueManagement from './pages/QueueManagement'
import Services from './pages/Services'
import Users from './pages/Users'
import Settings from './pages/Settings'
import DisplaySettings from './pages/DisplaySettings'
import ThemeSettings from './pages/ThemeSettings'
import PKManagement from './pages/PKManagement'
import ClientManagement from './pages/ClientManagement'
import VoiceSettings from './pages/VoiceSettings'
import Layout from './components/Layout'

function PrivateRoute({ children, adminOnly = false }) {
  const { user, loading } = useAuth()
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-semibold">Loading...</p>
        </div>
      </div>
    )
  }
  
  if (!user) {
    return <Navigate to="/login" />
  }
  
  // Admin only check
  if (adminOnly && user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50">
        <div className="text-center bg-white p-8 rounded-xl shadow-2xl max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Akses Ditolak</h2>
          <p className="text-gray-600 mb-6">
            Halaman ini hanya dapat diakses oleh Administrator.
          </p>
          <button
            onClick={() => window.location.href = '/'}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
          >
            Kembali ke Beranda
          </button>
        </div>
      </div>
    )
  }
  
  return children
}

function AppRoutes() {
  const { user } = useAuth()
  
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={
        <PrivateRoute adminOnly={true}>
          <Layout />
        </PrivateRoute>
      }>
        <Route index element={<AdminDashboard />} />
        <Route path="queue" element={<QueueManagement />} />
        <Route path="services" element={<Services />} />
        <Route path="users" element={<Users />} />
        <Route path="pk" element={<PKManagement />} />
        <Route path="clients" element={<ClientManagement />} />
        <Route path="settings" element={<Settings />} />
        <Route path="display" element={<DisplaySettings />} />
        <Route path="theme" element={<ThemeSettings />} />
        <Route path="voice" element={<VoiceSettings />} />
      </Route>
    </Routes>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  )
}

export default App
