import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import { UserCheck, LogOut, Users } from 'lucide-react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

export default function PKSelection() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [pkList, setPkList] = useState([])
  const [loading, setLoading] = useState(true)
  const [selecting, setSelecting] = useState(false)
  const [selectedPK, setSelectedPK] = useState(null)

  useEffect(() => {
    // Check if user already has active session
    checkCurrentSession()
  }, [])

  const checkCurrentSession = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get(`${API_URL}/pk-auth/current-session`, {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (response.data.success && response.data.has_session) {
        // Already has session, redirect to dashboard
        navigate('/')
      } else {
        // No session, fetch PK list
        fetchPKList()
      }
    } catch (error) {
      console.error('Error checking session:', error)
      fetchPKList()
    }
  }

  const fetchPKList = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get(`${API_URL}/pk-auth/available-pk`, {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (response.data.success) {
        setPkList(response.data.pk_list)
      }
    } catch (error) {
      console.error('Error fetching PK list:', error)
      alert('Gagal memuat daftar PK')
    } finally {
      setLoading(false)
    }
  }

  const handleSelectPK = async (pk) => {
    if (selecting) return

    setSelecting(true)
    setSelectedPK(pk.id)

    try {
      const token = localStorage.getItem('token')
      const response = await axios.post(
        `${API_URL}/pk-auth/select-pk`,
        { pk_id: pk.id },
        { headers: { Authorization: `Bearer ${token}` } }
      )

      if (response.data.success) {
        // Store session info
        localStorage.setItem('pk_session', JSON.stringify(response.data.session))
        
        // Redirect to dashboard
        navigate('/')
      } else {
        alert(response.data.message || 'Gagal memilih PK')
      }
    } catch (error) {
      console.error('Error selecting PK:', error)
      alert(error.response?.data?.message || 'Gagal memilih PK')
    } finally {
      setSelecting(false)
      setSelectedPK(null)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-teal-50 to-cyan-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-teal-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Pilih PK yang Bertugas
              </h1>
              <p className="text-gray-600">
                Login sebagai: <span className="font-semibold">{user?.name}</span>
              </p>
              <p className="text-sm text-gray-500">
                Jenjang: <span className="font-semibold uppercase">{user?.jenjang}</span>
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5" />
              Keluar
            </button>
          </div>
        </div>

        {/* PK List */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-center gap-3 mb-6">
            <Users className="w-8 h-8 text-teal-600" />
            <h2 className="text-2xl font-bold text-gray-800">
              Daftar PK {user?.jenjang?.toUpperCase()}
            </h2>
            <span className="ml-auto bg-teal-100 text-teal-800 px-4 py-1 rounded-full font-semibold">
              {pkList.length} PK
            </span>
          </div>

          {pkList.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-20 h-20 mx-auto text-gray-300 mb-4" />
              <p className="text-xl text-gray-500">Tidak ada PK tersedia</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pkList.map((pk) => (
                <button
                  key={pk.id}
                  onClick={() => handleSelectPK(pk)}
                  disabled={selecting}
                  className={`p-6 border-2 rounded-xl text-left transition-all ${
                    selectedPK === pk.id
                      ? 'border-teal-600 bg-teal-50'
                      : 'border-gray-200 hover:border-teal-400 hover:bg-teal-50'
                  } ${selecting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <div className="flex items-start gap-4">
                    <div className="bg-teal-100 p-3 rounded-lg">
                      <UserCheck className="w-8 h-8 text-teal-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-800 mb-1">
                        {pk.name}
                      </h3>
                      {pk.nip && (
                        <p className="text-sm text-gray-600 mb-1">
                          NIP: {pk.nip}
                        </p>
                      )}
                      {pk.position && (
                        <p className="text-sm text-gray-600">
                          {pk.position}
                        </p>
                      )}
                      <div className="mt-2">
                        <span className="inline-block bg-teal-100 text-teal-800 text-xs px-2 py-1 rounded-full font-semibold uppercase">
                          {pk.jenjang}
                        </span>
                      </div>
                    </div>
                  </div>
                  {selectedPK === pk.id && (
                    <div className="mt-4 flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-teal-600"></div>
                      <span className="ml-2 text-teal-600 font-semibold">Memilih...</span>
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>ℹ️ Informasi:</strong> Pilih PK yang sedang bertugas hari ini. 
            Semua aktivitas akan tercatat atas nama PK yang Anda pilih.
          </p>
        </div>
      </div>
    </div>
  )
}
