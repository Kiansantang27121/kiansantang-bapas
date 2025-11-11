import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { LayoutDashboard, ClipboardList, Briefcase, Users, Settings, Monitor, Palette, LogOut, UserCheck, UsersRound, Volume2 } from 'lucide-react'

export default function Layout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const menuItems = [
    { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/queue', icon: ClipboardList, label: 'Antrian' },
    ...(user?.role === 'admin' ? [
      { path: '/services', icon: Briefcase, label: 'Layanan' },
      { path: '/users', icon: Users, label: 'Pengguna' },
      { path: '/pk', icon: UserCheck, label: 'Management PK' },
      { path: '/clients', icon: UsersRound, label: 'Management Klien' },
      { path: '/voice', icon: Volume2, label: 'Pemanggilan Suara' },
      { path: '/display', icon: Monitor, label: 'Display' },
      { path: '/theme', icon: Palette, label: 'Theme' },
      { path: '/settings', icon: Settings, label: 'Pengaturan' }
    ] : [])
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <nav className="bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-700 shadow-2xl">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-lg rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">KIANSANTANG</h1>
                <p className="text-xs text-purple-200">Panel Administrator</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-semibold text-white">{user?.name}</p>
                <p className="text-xs text-purple-200">Administrator</p>
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

      <div className="flex">
        <aside className="w-72 bg-white shadow-2xl min-h-screen border-r border-gray-200">
          <div className="p-6 bg-gradient-to-br from-purple-50 to-indigo-50 border-b border-purple-100">
            <h2 className="text-lg font-bold text-gray-800 mb-1">Menu Pengaturan</h2>
            <p className="text-xs text-gray-600">Kelola sistem KIANSANTANG</p>
          </div>
          <nav className="mt-2">
            {menuItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.path
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center px-6 py-3.5 mx-2 my-1 rounded-lg transition-all ${
                    isActive 
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg' 
                      : 'text-gray-700 hover:bg-purple-50 hover:text-purple-700'
                  }`}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {item.label}
                </Link>
              )
            })}
          </nav>
        </aside>

        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
