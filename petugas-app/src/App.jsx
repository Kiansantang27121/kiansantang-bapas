import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Login from './pages/Login'
import PetugasLayananDashboard from './pages/PetugasLayananDashboardNew2'
import PKDashboard from './pages/PKDashboard'
import PKWorkflowDashboard from './pages/PKWorkflowDashboard'
import PKServiceProcess from './pages/PKServiceProcess'
import PKDailyReport from './pages/PKDailyReport'
import StrukturalDashboard from './pages/StrukturalDashboard'
import Layout from './components/Layout'

function PrivateRoute({ children }) {
  const { user, loading } = useAuth()
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-semibold">Loading...</p>
        </div>
      </div>
    )
  }
  
  if (!user) {
    return <Navigate to="/login" />
  }
  
  // Check if user has allowed role
  const allowedRoles = ['petugas_layanan', 'pk', 'struktural', 'admin']
  if (!allowedRoles.includes(user.role)) {
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
            Halaman ini hanya dapat diakses oleh Petugas Layanan, PK, dan Struktural.
          </p>
          <button
            onClick={() => window.location.href = '/login'}
            className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
          >
            Kembali ke Login
          </button>
        </div>
      </div>
    )
  }
  
  return children
}

function DashboardRouter() {
  const { user } = useAuth()
  
  // Route to appropriate dashboard based on role
  if (user?.role === 'petugas_layanan') {
    return <PetugasLayananDashboard />
  } else if (user?.role === 'pk') {
    return <PKWorkflowDashboard />
  } else if (user?.role === 'struktural' || user?.role === 'admin') {
    return <StrukturalDashboard />
  }
  
  return <Navigate to="/login" />
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={
        <PrivateRoute>
          <Layout />
        </PrivateRoute>
      }>
        <Route index element={<DashboardRouter />} />
        <Route path="service-process" element={<PKServiceProcess />} />
        <Route path="daily-report" element={<PKDailyReport />} />
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
