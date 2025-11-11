import { Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { LogOut, Users, UserCheck, Shield } from 'lucide-react'

export default function Layout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const getRoleInfo = () => {
    switch(user?.role) {
      case 'petugas_layanan':
        return { name: 'Petugas Layanan', icon: Users, color: 'from-emerald-600 to-emerald-700' }
      case 'pk':
        return { name: 'Pembimbing Kemasyarakatan', icon: UserCheck, color: 'from-teal-600 to-teal-700' }
      case 'struktural':
        return { name: 'Struktural', icon: Shield, color: 'from-cyan-600 to-cyan-700' }
      default:
        return { name: 'Petugas', icon: Users, color: 'from-gray-600 to-gray-700' }
    }
  }

  const roleInfo = getRoleInfo()
  const RoleIcon = roleInfo.icon

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <nav className={`bg-gradient-to-r ${roleInfo.color} shadow-2xl`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-lg rounded-lg flex items-center justify-center">
                <RoleIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">KIANSANTANG</h1>
                <p className="text-xs text-white/80">{roleInfo.name}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-semibold text-white">{user?.name}</p>
                <p className="text-xs text-white/80">{roleInfo.name}</p>
              </div>
              <button 
                onClick={handleLogout} 
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all backdrop-blur-lg border border-white/20"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm font-semibold">Keluar</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <Outlet />
      </main>
    </div>
  )
}
