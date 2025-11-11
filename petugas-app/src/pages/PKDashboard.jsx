import { useState, useEffect } from 'react'
import axios from 'axios'
import { API_URL } from '../config'
import { 
  UserCheck, Users, Clock, CheckCircle, Star, 
  Phone, MapPin, Calendar, FileText, TrendingUp
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function PKDashboard() {
  const { user } = useAuth()
  const [myQueue, setMyQueue] = useState([])
  const [myClients, setMyClients] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 10000)
    return () => clearInterval(interval)
  }, [])

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token')
      const [queueRes, clientsRes, statsRes] = await Promise.all([
        axios.get(`${API_URL}/pk-queue/my-queue`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${API_URL}/clients/my-clients`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${API_URL}/pk-queue/my-stats`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ])
      setMyQueue(queueRes.data)
      setMyClients(clientsRes.data)
      setStats(statsRes.data)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching data:', error)
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-teal-600"></div>
      </div>
    )
  }

  const quickStats = [
    { 
      label: 'Klien Saya', 
      value: myClients.length || 0, 
      icon: Users, 
      color: 'from-teal-500 to-teal-600'
    },
    { 
      label: 'Antrian Hari Ini', 
      value: stats?.today || 0, 
      icon: Clock, 
      color: 'from-blue-500 to-blue-600'
    },
    { 
      label: 'Selesai Hari Ini', 
      value: stats?.completed || 0, 
      icon: CheckCircle, 
      color: 'from-green-500 to-green-600'
    },
    { 
      label: 'Rating Rata-rata', 
      value: stats?.rating || '4.8', 
      icon: Star, 
      color: 'from-amber-500 to-amber-600'
    }
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-600 via-teal-700 to-cyan-700 rounded-2xl shadow-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">
              Selamat Datang, {user?.name}! 👋
            </h1>
            <p className="text-teal-100 text-lg">
              Dashboard Pembimbing Kemasyarakatan (PK)
            </p>
            <p className="text-teal-200 text-sm mt-1">
              Kelola klien wajib lapor Anda dengan efektif
            </p>
          </div>
          <div className="hidden md:block">
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <UserCheck className="w-16 h-16 text-white mb-2" />
              <p className="text-sm font-semibold">PK</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickStats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div 
              key={index} 
              className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
            >
              <div className={`bg-gradient-to-br ${stat.color} p-6 text-white`}>
                <div className="flex items-center justify-between mb-4">
                  <Icon className="w-10 h-10 opacity-80" />
                </div>
                <p className="text-3xl font-bold mb-1">{stat.value}</p>
                <p className="text-sm opacity-90">{stat.label}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Antrian Saya */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Clock className="w-6 h-6 text-teal-600" />
            Antrian Saya Hari Ini
          </h2>
          {myQueue.length > 0 ? (
            <div className="space-y-3">
              {myQueue.map((queue, index) => (
                <div key={index} className="p-4 bg-gradient-to-r from-teal-50 to-cyan-50 rounded-lg border border-teal-200">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-teal-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold">{queue.queue_number}</span>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{queue.client_name}</p>
                        <p className="text-sm text-gray-600">{queue.service_name}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      queue.status === 'waiting' ? 'bg-amber-100 text-amber-700' :
                      queue.status === 'called' ? 'bg-blue-100 text-blue-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {queue.status === 'waiting' ? 'Menunggu' :
                       queue.status === 'called' ? 'Dipanggil' : 'Selesai'}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-all text-sm font-semibold">
                      Panggil
                    </button>
                    <button className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all text-sm font-semibold">
                      Selesai
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Tidak ada antrian saat ini</p>
            </div>
          )}
        </div>

        {/* Klien Saya */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Users className="w-6 h-6 text-teal-600" />
            Klien Wajib Lapor Saya
          </h2>
          {myClients.length > 0 ? (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {myClients.slice(0, 5).map((client, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg hover:bg-teal-50 transition-all cursor-pointer border border-gray-200 hover:border-teal-200">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800 mb-1">{client.name}</p>
                      {client.phone && (
                        <p className="text-sm text-gray-600 flex items-center gap-1 mb-1">
                          <Phone className="w-3 h-3" />
                          {client.phone}
                        </p>
                      )}
                      {client.address && (
                        <p className="text-sm text-gray-600 flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {client.address}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Belum ada klien terdaftar</p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Aksi Cepat</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: 'Lihat Semua Klien', icon: Users, color: 'from-teal-500 to-teal-600' },
            { label: 'Jadwal Penghadapan', icon: Calendar, color: 'from-blue-500 to-blue-600' },
            { label: 'Riwayat Bimbingan', icon: FileText, color: 'from-purple-500 to-purple-600' },
            { label: 'Laporan Bulanan', icon: TrendingUp, color: 'from-orange-500 to-orange-600' }
          ].map((action, index) => {
            const Icon = action.icon
            return (
              <button
                key={index}
                className={`bg-gradient-to-br ${action.color} text-white rounded-xl p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}
              >
                <Icon className="w-12 h-12 mb-3 mx-auto" />
                <p className="font-semibold text-sm">{action.label}</p>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
