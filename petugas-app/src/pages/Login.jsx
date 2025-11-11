import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { LogIn, Users, UserCheck, Shield, ArrowLeft } from 'lucide-react'

export default function Login() {
  const [selectedRole, setSelectedRole] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const roles = [
    {
      id: 'petugas_layanan',
      name: 'Petugas Layanan',
      icon: Users,
      color: 'emerald',
      gradient: 'from-emerald-500 to-emerald-600',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200',
      textColor: 'text-emerald-700'
    },
    {
      id: 'pk',
      name: 'PK',
      icon: UserCheck,
      color: 'teal',
      gradient: 'from-teal-500 to-teal-600',
      bgColor: 'bg-teal-50',
      borderColor: 'border-teal-200',
      textColor: 'text-teal-700'
    },
    {
      id: 'struktural',
      name: 'Struktural',
      icon: Shield,
      color: 'cyan',
      gradient: 'from-cyan-500 to-cyan-600',
      bgColor: 'bg-cyan-50',
      borderColor: 'border-cyan-200',
      textColor: 'text-cyan-700'
    }
  ]

  const handleRoleSelect = (role) => {
    setSelectedRole(role)
    setError('')
  }

  const handleBack = () => {
    setSelectedRole(null)
    setUsername('')
    setPassword('')
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const user = await login(username, password)
      
      // Check if user has allowed role
      const allowedRoles = ['petugas_layanan', 'pk', 'struktural']
      if (!allowedRoles.includes(user.role) && user.role !== 'admin') {
        setError('Akses ditolak. Hanya Petugas Layanan, PK, dan Struktural yang dapat mengakses aplikasi ini.')
        setLoading(false)
        return
      }
      
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.error || 'Login gagal')
    } finally {
      setLoading(false)
    }
  }

  // Role Selection Screen
  if (!selectedRole) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-600 via-teal-700 to-cyan-700 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Users className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">KIANSANTANG</h1>
            <p className="text-gray-600 font-semibold">Aplikasi Petugas</p>
            <p className="text-sm text-gray-500 mt-1">BAPAS Kelas I Bandung</p>
          </div>

          <div className="space-y-4">
            <p className="text-center text-gray-700 font-semibold mb-6">
              Pilih Role Anda:
            </p>
            
            {roles.map((role) => {
              const Icon = role.icon
              return (
                <button
                  key={role.id}
                  onClick={() => handleRoleSelect(role)}
                  className={`w-full ${role.bgColor} border-2 ${role.borderColor} rounded-xl p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-16 h-16 bg-gradient-to-br ${role.gradient} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-left flex-1">
                      <p className={`text-xl font-bold ${role.textColor}`}>{role.name}</p>
                      <p className="text-sm text-gray-600 mt-1">
                        {role.id === 'petugas_layanan' && 'Kelola antrian dan layanan'}
                        {role.id === 'pk' && 'Kelola klien wajib lapor'}
                        {role.id === 'struktural' && 'Monitor dan evaluasi'}
                      </p>
                    </div>
                    <div className={`${role.textColor}`}>
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  // Login Form Screen
  const RoleIcon = selectedRole.icon
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-600 via-teal-700 to-cyan-700 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
        {/* Back Button */}
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-semibold">Kembali</span>
        </button>

        <div className="text-center mb-8">
          <div className={`w-20 h-20 bg-gradient-to-br ${selectedRole.gradient} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg`}>
            <RoleIcon className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">KIANSANTANG</h1>
          <p className="text-gray-600 font-semibold">Login sebagai {selectedRole.name}</p>
          <p className="text-sm text-gray-500 mt-1">BAPAS Kelas I Bandung</p>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-${selectedRole.color}-500 focus:border-transparent outline-none`}
              placeholder="Masukkan username"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-${selectedRole.color}-500 focus:border-transparent outline-none`}
              placeholder="Masukkan password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-gradient-to-r ${selectedRole.gradient} text-white py-3 rounded-lg font-semibold hover:shadow-xl disabled:opacity-50 flex items-center justify-center shadow-lg transition-all`}
          >
            <LogIn className="w-5 h-5 mr-2" />
            {loading ? 'Loading...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  )
}
